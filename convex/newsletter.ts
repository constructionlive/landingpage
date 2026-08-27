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

/* ── The sending integration ────────────────────────────────────────────
   What an external sender — the Resend app — reads to build an issue.

   Two things separate this from dashboard() above. It returns the unsubscribe
   token, because a per-recipient opt-out link is the whole point and a Bcc
   blast cannot carry one. And it authenticates with a shared secret rather than
   an admin session, because the caller is a program with no user to sign in as.

   The secret is checked HERE and not only in the Next route in front of it.
   Convex queries are addressable by URL: anything public is callable by anyone
   who knows the deployment address, so a check that lives only in the route is
   a check that can be walked around. */

/* Compares in time that doesn't depend on where the first difference is. A
   plain === returns as soon as two characters differ, and the difference is
   measurable across enough requests — which is enough to recover a secret one
   character at a time. */
function secretMatches(provided: string, expected: string) {
  if (provided.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < provided.length; i++) {
    diff |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

export const subscribersForSending = query({
  args: {
    apiKey: v.string(),
    /* Convex's own cursor, passed straight back from the previous page. Real
       pagination rather than a "first 1000" cap: a silent ceiling on a mailing
       list reads as "that's everyone" right up until it isn't, and the people
       past it never get the issue. */
    cursor: v.optional(v.union(v.string(), v.null())),
    numItems: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const expected = process.env.NEWSLETTER_API_KEY;
    if (!expected) {
      /* Refuse rather than fall open. An unset secret must not mean "no secret
         required" — that turns a missing env var into a public subscriber list. */
      throw new ConvexError("Newsletter sending API is not configured.");
    }
    if (!secretMatches(args.apiKey, expected)) {
      throw new ConvexError("Invalid API key.");
    }

    const numItems = Math.max(1, Math.min(args.numItems ?? 200, 500));

    const results = await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_createdAt")
      .order("desc")
      .paginate({ cursor: args.cursor ?? null, numItems });

    /* Filtered after the page is taken, so `isDone` and the cursor still
       describe the whole table. Pages therefore vary in size — the caller
       follows the cursor until isDone rather than counting rows. */
    return {
      subscribers: results.page
        .filter((subscriber: any) => subscriber.status === "subscribed")
        .map((subscriber: any) => ({
          email: subscriber.email,
          name: subscriber.name,
          company: subscriber.company,
          interest: subscriber.interest,
          unsubscribeToken: subscriber.unsubscribeToken,
          createdAt: subscriber.createdAt,
        })),
      isDone: results.isDone,
      cursor: results.continueCursor,
    };
  },
});

/* Opting out by address, for a link the sending app signed itself.

   The signature is verified in app/api/newsletter/unsubscribe/route.ts, which
   runs on Node and can do HMAC. By the time it calls this, the caller has
   proved they hold the shared secret — so this takes the address directly, and
   guards itself with that same secret for the reason given on
   subscribersForSending: a public Convex function is callable by anyone who
   knows the deployment URL, and an unsubscribe-by-address endpoint without a
   guard is an endpoint for removing anyone whose address you can guess.

   Answers rather than throws for an address we don't hold. Someone clicking an
   opt-out link wants to be off the list; whether we ever had them is our
   bookkeeping, not their problem. */
export const unsubscribeByEmail = mutation({
  args: {
    email: v.string(),
    apiKey: v.string(),
  },
  handler: async (ctx, args) => {
    const expected = process.env.NEWSLETTER_API_KEY;
    if (!expected) {
      throw new ConvexError("Newsletter sending API is not configured.");
    }
    if (!secretMatches(args.apiKey, expected)) {
      throw new ConvexError("Invalid API key.");
    }

    const normalizedEmail = normalizeEmail(args.email);

    const subscriber = await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_normalizedEmail", (q) => q.eq("normalizedEmail", normalizedEmail))
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
