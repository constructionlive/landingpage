import { ConvexError, v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { action, internalMutation, query } from "./functions";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

/* The /contact form. It runs the same shape as a quote request — write the row,
   then mail both sides — with two differences: the message is free text rather
   than a set of answers, and the sender can attach one photo.

   The entry point is an action rather than a mutation because storing a file
   needs `ctx.storage.store`, which only actions have. The row insert and the
   emails are internal, so the only publicly callable function here is
   `submitContact` itself. Adding a field means touching this file, the
   contactMessages table in convex/schema.ts, the validator in
   app/api/contact/route.ts, the form in app/contact/page.tsx and BOTH emails in
   convex/emails.ts, or the answer is collected and then silently dropped. */

/* Deliberately looser than the 4MB the route enforces: this is the backstop for
   anything calling the action directly, not the limit the form is designed to. */
const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function requireAdmin(ctx: any) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new ConvexError("Not authenticated.");
  }

  const profile = await ctx.db
    .query("userProfiles")
    .withIndex("by_userId", (q: any) => q.eq("userId", userId))
    .unique();

  if (profile?.role !== "admin") {
    throw new ConvexError("Admin access required.");
  }
}

export const submitContact = action({
  args: {
    name: v.string(),
    email: v.string(),
    company: v.optional(v.string()),
    topic: v.optional(v.string()),
    message: v.string(),
    attachment: v.optional(
      v.object({
        name: v.string(),
        type: v.string(),
        bytes: v.bytes(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const name = args.name.trim();
    const email = args.email.trim();
    const message = args.message.trim();
    const company = args.company?.trim() || undefined;
    const topic = args.topic?.trim() || undefined;

    if (!name || !email || !message) {
      throw new ConvexError("Name, email and message are required.");
    }

    let attachmentStorageId: Id<"_storage"> | undefined;
    let attachmentName: string | undefined;
    let attachmentType: string | undefined;

    if (args.attachment) {
      if (!args.attachment.type.startsWith("image/")) {
        throw new ConvexError("Only image attachments are accepted.");
      }
      if (args.attachment.bytes.byteLength > MAX_ATTACHMENT_BYTES) {
        throw new ConvexError("That photo is too large.");
      }

      const blob = new Blob([args.attachment.bytes], { type: args.attachment.type });
      attachmentStorageId = await ctx.storage.store(blob);
      attachmentName = args.attachment.name.trim() || "attachment";
      attachmentType = args.attachment.type;
    }

    await ctx.runMutation(internal.contact.record, {
      name,
      email,
      normalizedEmail: normalizeEmail(email),
      company,
      topic,
      message,
      attachmentStorageId,
      attachmentName,
      attachmentType,
    });

    /* Scheduled rather than awaited: a Resend outage should not cost us the
       message we just wrote down. */
    await ctx.scheduler.runAfter(0, internal.emails.sendContactMessageEmails, {
      name,
      email,
      company,
      topic,
      message,
      attachmentStorageId,
      attachmentName,
    });

    return { status: "created" as const };
  },
});

export const record = internalMutation({
  args: {
    name: v.string(),
    email: v.string(),
    normalizedEmail: v.string(),
    company: v.optional(v.string()),
    topic: v.optional(v.string()),
    message: v.string(),
    attachmentStorageId: v.optional(v.id("_storage")),
    attachmentName: v.optional(v.string()),
    attachmentType: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contactMessages", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const dashboard = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const requestedLimit = args.limit ?? 100;
    const limit = Math.max(1, Math.min(requestedLimit, 500));
    const messages = await ctx.db.query("contactMessages").order("desc").take(limit);

    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    let last24Hours = 0;
    let last7Days = 0;
    for (const message of messages) {
      if (message.createdAt >= oneDayAgo) last24Hours += 1;
      if (message.createdAt >= sevenDaysAgo) last7Days += 1;
    }

    return {
      messages,
      stats: {
        totalLoaded: messages.length,
        last24Hours,
        last7Days,
      },
    };
  },
});
