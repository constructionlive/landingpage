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
        updatedAt: now,
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
      updatedAt: now,
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

    const now = Date.now();
    await ctx.db.patch(subscriber._id, {
      status: "unsubscribed",
      unsubscribedAt: now,
      updatedAt: now,
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
    /* The caller's watermark: return every row changed at or after this, in the
       order it changed. Absent means a full sync from the beginning.

       Inclusive (gte), not exclusive. A row landing on the boundary is handed
       over twice rather than risking a row that changed in the same
       millisecond as the last sync being handed over never. The caller keys on
       the address, so a repeat is a no-op write and a miss is a person who
       keeps getting mail after opting out. */
    since: v.optional(v.number()),
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
    const since = args.since ?? 0;

    /* Ascending, so the walk goes forward through time and a cursor can be
       resumed. Any write moves a row to the end of this order, which is what
       makes the scan complete: a row updated mid-sync is ahead of the walk,
       not behind it. */
    const results = await ctx.db
      .query("newsletterSubscribers")
      .withIndex("by_updatedAt", (q) => q.gte("updatedAt", since))
      .order("asc")
      .paginate({ cursor: args.cursor ?? null, numItems });

    /* Unsubscribed rows are returned too, and that is the point of the feed
       rather than an oversight. A sender that only ever hears about
       subscriptions can add people but never remove them, and keeps mailing
       everyone who ever opted out. `status` is what the caller acts on. */
    const subscribers = results.page.map((subscriber: any) => ({
      email: subscriber.email,
      name: subscriber.name,
      company: subscriber.company,
      interest: subscriber.interest,
      status: subscriber.status,
      unsubscribeToken: subscriber.unsubscribeToken,
      createdAt: subscriber.createdAt,
      resubscribedAt: subscriber.resubscribedAt,
      unsubscribedAt: subscriber.unsubscribedAt,
      updatedAt: subscriber.updatedAt,
    }));

    /* The next watermark is the newest row actually handed over, never the
       server's clock. Using "now" would silently skip anything written between
       the last page being read and the caller storing the value. An empty page
       changes nothing, so the caller keeps the watermark it came in with. */
    const latest = subscribers.reduce(
      (newest: number, subscriber: { updatedAt: number }) =>
        subscriber.updatedAt > newest ? subscriber.updatedAt : newest,
      since,
    );

    return {
      subscribers,
      isDone: results.isDone,
      cursor: results.continueCursor,
      nextSince: latest,
    };
  },
});

/* Bulk import, for a list collected before this register existed.

   Two rules make this different from subscribe() above, and both exist because
   an import is the easiest way to mail someone who told you not to.

   It never sends the welcome email. These people did not just sign up; they
   subscribed somewhere else, possibly years ago, and "welcome, you're
   subscribed!" reads as either a mistake or a list purchase.

   It never resurrects an address that is unsubscribed HERE. Re-importing an
   old export is the normal way somebody who opted out last month quietly
   reappears on the list, and under CASL mailing them again is a fresh
   violation rather than a tidy-up. Their row wins over the file, always.

   The reverse does apply: a row marked unsubscribed in the import suppresses
   someone we still think is subscribed, so bringing over an old suppression
   list works and is the safe direction to be wrong in.

   `subscribedAt` is preserved rather than stamped with the import time. It is
   the date of consent, and overwriting it throws away the answer to the only
   question that matters if the consent is ever challenged. */
export const importSubscribers = mutation({
  args: {
    apiKey: v.string(),
    /* Marks this as a person opting in right now, not a file being restored.

       It changes two things, and only these two. An address that unsubscribed
       here is allowed back on the list, because an explicit tick is fresh
       consent and refusing it means somebody who deliberately re-subscribed
       silently never hears from us. And a welcome email goes out, because they
       just agreed to something and should see what it was.

       Never set this for a bulk restore. A file is not consent, the addresses
       in it did not agree to anything this morning, and the two rules above
       are exactly the ones that stop an old export re-mailing people who left. */
    expressOptIn: v.optional(v.boolean()),
    /* Whether the welcome email goes out. Only consulted on an express opt-in;
       a restore never greets anybody regardless.

       Defaults to true, because a fresh subscriber who hears nothing has no
       confirmation of what they agreed to. The product sets it false: it sends
       its own signup email, and two arriving together is noise that makes both
       look automated. Skipping it costs nothing legally — a message we never
       send needs no unsubscribe link, and their first issue carries one. */
    sendWelcome: v.optional(v.boolean()),
    subscribers: v.array(
      v.object({
        email: v.string(),
        normalizedEmail: v.string(),
        name: v.optional(v.string()),
        company: v.optional(v.string()),
        interest: v.optional(v.string()),
        status: v.union(v.literal("subscribed"), v.literal("unsubscribed")),
        /* When they originally agreed, in epoch ms. */
        subscribedAt: v.optional(v.number()),
        consentSource: v.optional(v.string()),
        /* Minted per row in the route, used only if a row is created. */
        unsubscribeToken: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const expected = process.env.NEWSLETTER_API_KEY;
    if (!expected) {
      throw new ConvexError("Newsletter sending API is not configured.");
    }
    if (!secretMatches(args.apiKey, expected)) {
      throw new ConvexError("Invalid API key.");
    }

    const now = Date.now();
    const results: { email: string; result: string }[] = [];
    /* Absent means yes; only an explicit false suppresses it. */
    const welcome = args.expressOptIn === true && args.sendWelcome !== false;

    for (const row of args.subscribers) {
      const existing = await ctx.db
        .query("newsletterSubscribers")
        .withIndex("by_normalizedEmail", (q) => q.eq("normalizedEmail", row.normalizedEmail))
        .unique();

      if (!existing) {
        await ctx.db.insert("newsletterSubscribers", {
          email: row.email,
          normalizedEmail: row.normalizedEmail,
          name: row.name,
          company: row.company,
          interest: row.interest,
          status: row.status,
          unsubscribeToken: row.unsubscribeToken,
          consentSource: row.consentSource,
          /* Their consent date, not this import's date. */
          createdAt: row.subscribedAt ?? now,
          ...(row.status === "unsubscribed" && { unsubscribedAt: row.subscribedAt ?? now }),
          updatedAt: now,
        });
        /* Only on an express opt-in, and only if the caller wants it. A
           restored file greeting five hundred people with "welcome!" is how a
           migration turns into a spam report. */
        if (welcome && row.status === "subscribed") {
          await ctx.scheduler.runAfter(0, internal.emails.sendNewsletterWelcomeEmail, {
            email: row.email,
            name: row.name,
            unsubscribeToken: row.unsubscribeToken,
          });
        }

        results.push({ email: row.email, result: "created" });
        continue;
      }

      if (existing.status === "unsubscribed" && row.status === "subscribed") {
        /* They left, and have now deliberately asked to come back. Honour it,
           and send the welcome so the first thing they get carries a fresh
           unsubscribe link. */
        if (args.expressOptIn) {
          await ctx.db.patch(existing._id, {
            status: "subscribed",
            resubscribedAt: now,
            unsubscribedAt: undefined,
            ...(row.name && !existing.name && { name: row.name }),
            ...(row.company && !existing.company && { company: row.company }),
            ...(row.consentSource && { consentSource: row.consentSource }),
            updatedAt: now,
          });

          if (welcome) {
            await ctx.scheduler.runAfter(0, internal.emails.sendNewsletterWelcomeEmail, {
              email: existing.email,
              name: row.name ?? existing.name,
              /* Their original token: it is already printed in every email we
                 ever sent them, and those links have to keep working. */
              unsubscribeToken: existing.unsubscribeToken,
            });
          }

          results.push({ email: row.email, result: "resubscribed" });
          continue;
        }

        /* A file does not get to overrule an opt-out. */
        results.push({ email: row.email, result: "suppressed" });
        continue;
      }

      /* Opted out in the file but not here: honour it. */
      if (existing.status === "subscribed" && row.status === "unsubscribed") {
        await ctx.db.patch(existing._id, {
          status: "unsubscribed",
          unsubscribedAt: now,
          updatedAt: now,
        });
        results.push({ email: row.email, result: "unsubscribed" });
        continue;
      }

      /* Same status on both sides. Fill in anything we are missing, but never
         blank a detail they gave us with an empty column from a spreadsheet. */
      await ctx.db.patch(existing._id, {
        ...(row.name && !existing.name && { name: row.name }),
        ...(row.company && !existing.company && { company: row.company }),
        ...(row.interest && !existing.interest && { interest: row.interest }),
        ...(row.consentSource && !existing.consentSource && {
          consentSource: row.consentSource,
        }),
        updatedAt: now,
      });
      results.push({ email: row.email, result: "updated" });
    }

    const counts = results.reduce<Record<string, number>>((tally, row) => {
      tally[row.result] = (tally[row.result] ?? 0) + 1;
      return tally;
    }, {});

    return { results, counts };
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

    const now = Date.now();
    await ctx.db.patch(subscriber._id, {
      status: "unsubscribed",
      unsubscribedAt: now,
      updatedAt: now,
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
