import { ConvexError, v } from "convex/values";
import { mutation } from "./functions";
import { internal } from "./_generated/api";

/* The /data-deletion-request form. Same shape as contact.submitContact: write
   the row, then schedule the mail so a Resend outage cannot lose the request.

   Adding a field means touching this file, the dataDeletionRequests table in
   convex/schema.ts, the validator in app/api/data-deletion-request/route.ts,
   the form in app/data-deletion-request/page.tsx and BOTH emails in
   convex/emails.ts, or the answer is collected and then silently dropped. */

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export const submitDataDeletionRequest = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    company: v.optional(v.string()),
    scope: v.union(v.literal("associated"), v.literal("all")),
    details: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const name = args.name.trim();
    const email = args.email.trim();
    const company = args.company?.trim() || undefined;
    const details = args.details?.trim() || undefined;

    if (!name || !email) {
      throw new ConvexError("Name and email are required.");
    }

    await ctx.db.insert("dataDeletionRequests", {
      name,
      email,
      normalizedEmail: normalizeEmail(email),
      company,
      scope: args.scope,
      details,
      createdAt: Date.now(),
    });

    await ctx.scheduler.runAfter(0, internal.emails.sendDataDeletionRequestEmails, {
      name,
      email,
      company,
      scope: args.scope,
      details,
    });

    return { status: "created" as const };
  },
});
