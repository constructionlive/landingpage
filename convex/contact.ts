import { ConvexError, v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./functions";
import { internal } from "./_generated/api";

/* The /contact form. It runs the same shape as a quote request, write the row
   then mail both sides, with one difference: the message is free text rather
   than a set of answers.

   Adding a field means touching this file, the contactMessages table in
   convex/schema.ts, the validator in app/api/contact/route.ts, the form in
   app/contact/page.tsx and BOTH emails in convex/emails.ts, or the answer is
   collected and then silently dropped. */

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

/* A plain mutation now that there is no file to store: it writes the row and
   schedules the mail itself, the same shape as quotes.submitQuote. */
export const submitContact = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    company: v.optional(v.string()),
    topic: v.optional(v.string()),
    message: v.string(),
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

    await ctx.db.insert("contactMessages", {
      name,
      email,
      normalizedEmail: normalizeEmail(email),
      company,
      topic,
      message,
      createdAt: Date.now(),
    });

    /* Scheduled rather than awaited: a Resend outage should not cost us the
       message we just wrote down. */
    await ctx.scheduler.runAfter(0, internal.emails.sendContactMessageEmails, {
      name,
      email,
      company,
      topic,
      message,
    });

    return { status: "created" as const };
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
