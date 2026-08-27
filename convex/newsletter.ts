import { ConvexError, v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./functions";
import { internal } from "./_generated/api";
import { attributionValidator } from "./schema";

/* The newsletter register: the list we mail, and the two ways it changes.

   Subscribing is idempotent on the normalised address. The form is meant to be
   pasted into LinkedIn messages, so the same person filling it twice — or
   coming back a year later — is the expected case, not an error. A repeat fill
   updates what they told us and flips them back to subscribed; it never writes
   a second row, because a duplicate row is a duplicate send.

   Adding a field means touching this file, the newsletterSubscribers table in
   convex/schema.ts, the validator in app/api/newsletter/route.ts, the form in
   components/NewsletterSignup.tsx and the welcome mail in convex/emails.ts, or
   the answer is collected and then silently dropped. */

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

export const subscribe = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    company: v.optional(v.string()),
    interest: v.optional(v.string()),
    /* Minted by the API route, and only used when a row is actually created.
       An existing subscriber keeps the token already printed in every email we
       have sent them, or their old unsubscribe links stop working. */
    unsubscribeToken: v.string(),
    /* See the note on quotes.submitQuote: sanitised in the route, never here. */
    attribution: v.optional(attributionValidator),
  },
  handler: async (ctx, args) => {
    const email = args.email.trim();
    if (!email) {
      throw new ConvexError("An email address is required.");
    }

    const normalizedEmail = normalizeEmail(email);
    const name = args.name?.trim() || undefined;
    const company = args.company?.trim() || undefined;
    const interest = args.interest?.trim() || undefined;
    const now = Date.now();

    const existing = await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_normalizedEmail", (q) => q.eq("normalizedEmail", normalizedEmail))
      .unique();

    if (existing) {
      const returning = existing.status === "unsubscribed";

      await ctx.db.patch(existing._id, {
        email,
        /* Only overwrite an answer they gave again. Someone re-subscribing
           from the footer strip, which asks for nothing but an address, should
           not have the name they typed on /newsletter blanked out. */
        ...(name && { name }),
        ...(company && { company }),
        ...(interest && { interest }),
        status: "subscribed" as const,
        ...(returning && { resubscribedAt: now, unsubscribedAt: undefined }),
        ...(args.attribution && { attribution: args.attribution }),
      });

      /* Welcome mail on the way back in, but not for someone who was already
         on the list: they get the newsletter itself soon enough, and a
         "welcome" for every accidental resubmit reads as a broken form. */
      if (returning) {
        await ctx.scheduler.runAfter(0, internal.emails.sendNewsletterWelcomeEmail, {
          email,
          name,
          unsubscribeToken: existing.unsubscribeToken,
        });
      }

      return { status: returning ? ("resubscribed" as const) : ("already" as const) };
    }

    await ctx.db.insert("newsletterSubscribers", {
      email,
      normalizedEmail,
      name,
      company,
      interest,
      status: "subscribed",
      unsubscribeToken: args.unsubscribeToken,
      attribution: args.attribution,
      createdAt: now,
    });

    /* Scheduled rather than awaited: a Resend outage should not cost us the
       subscriber we just wrote down. */
    await ctx.scheduler.runAfter(0, internal.emails.sendNewsletterWelcomeEmail, {
      email,
      name,
      unsubscribeToken: args.unsubscribeToken,
    });

    return { status: "created" as const };
  },
});

/* Unsubscribing is by token only. Taking an email address here would make this
   an endpoint for removing anyone from the list who you can guess the address
   of.

   An unknown token answers "unknown" rather than throwing: by the time someone
   clicks this link they want to be off the list, and an error page is a worse
   answer than a quiet one. Same for an address that is already unsubscribed —
   clicking the link in an older email a second time should not look broken. */
export const unsubscribe = mutation({
  args: {
    unsubscribeToken: v.string(),
  },
  handler: async (ctx, args) => {
    const subscriber = await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_unsubscribeToken", (q) => q.eq("unsubscribeToken", args.unsubscribeToken))
      .unique();

    if (!subscriber) {
      return { status: "unknown" as const };
    }

    if (subscriber.status === "unsubscribed") {
      return { status: "already" as const, email: subscriber.email };
    }

    await ctx.db.patch(subscriber._id, {
      status: "unsubscribed",
      unsubscribedAt: Date.now(),
    });

    return { status: "unsubscribed" as const, email: subscriber.email };
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
    const subscribers = await ctx.db.query("newsletterSubscribers").order("desc").take(limit);

    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    let subscribed = 0;
    let unsubscribed = 0;
    let last24Hours = 0;
    let last7Days = 0;
    for (const subscriber of subscribers) {
      if (subscriber.status === "subscribed") subscribed += 1;
      else unsubscribed += 1;
      if (subscriber.createdAt >= oneDayAgo) last24Hours += 1;
      if (subscriber.createdAt >= sevenDaysAgo) last7Days += 1;
    }

    /* The unsubscribe token never leaves the server. It is a bearer secret,
       and an admin table is not a reason to put it in a browser. */
    return {
      subscribers: subscribers.map((subscriber) => ({
        _id: subscriber._id,
        email: subscriber.email,
        name: subscriber.name,
        company: subscriber.company,
        interest: subscriber.interest,
        status: subscriber.status,
        createdAt: subscriber.createdAt,
      })),
      stats: {
        totalLoaded: subscribers.length,
        subscribed,
        unsubscribed,
        last24Hours,
        last7Days,
      },
    };
  },
});
