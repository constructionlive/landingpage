import { ConvexError, v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./functions";
import { internal } from "./_generated/api";
import { attributionValidator } from "./schema";

/* The "Try now" onboarding at /try. Three steps, and the middle one is the
   reason the flow exists.

     1. startTrial       — company, name, email. Writes a pending row, mails a link.
     2. verifyTrial      — the link is opened. The address has now proved it exists.
     3. submitTrialAnswers — the three questions. Only now does the founder hear.

   Every other form on this site mails us the moment it is submitted. This one
   can't: it is the door to a hand-built account, so a scripted signup costs
   real model spend rather than one ignored email. Splitting "someone typed an
   address" from "that address received something" is what makes the difference,
   and it is why the founder notification is scheduled from step 3 and nowhere
   else.

   Adding a field means touching this file, the trialSignups table in
   convex/schema.ts, the matching route under app/api/try/, the form in app/try/
   and the emails in convex/emails.ts, or the answer is collected and then
   silently dropped. */

/* How long a verification link lasts. A day is long enough for someone who
   signs up at 5pm and reads their mail the next morning, short enough that a
   link harvested from a leaked inbox is usually already dead. */
const VERIFY_TTL_MS = 24 * 60 * 60 * 1000;

/* Once verified, the same token is what carries them through the questions, so
   the clock is extended rather than left to run out mid-form. A week covers the
   person who confirms on their phone on site and finishes at a desk on Monday. */
const ANSWER_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export const VERIFY_TTL_HOURS = VERIFY_TTL_MS / (60 * 60 * 1000);

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

/* ── Rate limiting ──────────────────────────────────────────────────────── */

/* A fixed window rather than a sliding one or a token bucket.

   A fixed window lets through up to 2x the limit across a window boundary —
   five at 10:59 and five more at 11:00. That is the textbook objection, and it
   does not matter here: the limits below are set to stop a script running
   thousands of signups, not to meter an API, and ten in two minutes is still a
   stopped script. What a fixed window buys in exchange is that the window id is
   part of the key, so expiry needs no cron and no sorted set — a new window is
   simply a row that doesn't exist yet.

   Returns false when the caller is over the limit. The counter is incremented
   either way, so hammering a blocked key keeps it blocked rather than letting
   the count decay while someone retries. */
async function consume(ctx: any, subject: string, limit: number, windowMs: number) {
  const now = Date.now();
  const windowId = Math.floor(now / windowMs);
  const key = `${subject}:${windowMs}:${windowId}`;

  const existing = await ctx.db
    .query("trialRateLimits")
    .withIndex("by_key", (q: any) => q.eq("key", key))
    .unique();

  if (!existing) {
    /* expiresAt is the end of the window plus the window again: a row is
       useless the moment its window closes, and the grace makes the sweep
       below safe to run late without ever deleting a live counter. */
    await ctx.db.insert("trialRateLimits", {
      key,
      count: 1,
      expiresAt: (windowId + 2) * windowMs,
    });
    return true;
  }

  await ctx.db.patch(existing._id, { count: existing.count + 1 });
  return existing.count < limit;
}

/* Opportunistic cleanup, a few rows at a time, on the same write that created
   one. A cron would be tidier; this costs nothing and means the table can't
   grow without bound if one is never set up. The cap keeps a burst of traffic
   from turning every signup into a long scan. */
async function sweepExpired(ctx: any) {
  const stale = await ctx.db
    .query("trialRateLimits")
    .withIndex("by_expiresAt", (q: any) => q.lt("expiresAt", Date.now()))
    .take(20);
  for (const row of stale) {
    await ctx.db.delete(row._id);
  }
}

/* The three budgets, and what each one is actually stopping.

   IP is the blunt one: one script, one address, many signups. It is set high
   enough that a site office behind a single NAT can put a few people through.

   Email is the one that matters more, because it caps how many messages a
   single address can be made to receive. Without it, anyone could type a
   stranger's address into the form repeatedly and use us to mail-bomb them —
   which is a thing double opt-in flows get abused for, and the reason the
   resend allowance is small. */
const LIMITS = {
  ipHourly: { limit: 5, windowMs: 60 * 60 * 1000 },
  ipDaily: { limit: 20, windowMs: 24 * 60 * 60 * 1000 },
  emailHourly: { limit: 3, windowMs: 60 * 60 * 1000 },
  emailDaily: { limit: 6, windowMs: 24 * 60 * 60 * 1000 },
} as const;

/* ── Step 1: the signup ─────────────────────────────────────────────────── */

export const startTrial = mutation({
  args: {
    company: v.string(),
    name: v.string(),
    email: v.string(),
    /* SHA-256 of the token in the link. Hashed in the route, so the raw token
       exists only in the outgoing mail — see lib/trialToken.ts. */
    tokenHash: v.string(),
    /* Passed through to the mail action, which is the only place it is allowed
       to appear. Never written to the row. */
    token: v.string(),
    ipHash: v.optional(v.string()),
    /* See the note on quotes.submitQuote: sanitised in the route, never here. */
    attribution: v.optional(attributionValidator),
  },
  handler: async (ctx, args) => {
    const company = args.company.trim();
    const name = args.name.trim();
    const email = args.email.trim();

    if (!company || !name || !email) {
      throw new ConvexError("Company, name and email are required.");
    }

    const normalizedEmail = normalizeEmail(email);
    const now = Date.now();

    /* Both budgets are consumed before anything is written or mailed. The email
       key is the normalised address, so changing the capitalisation doesn't buy
       a fresh allowance. */
    const allowed = [
      args.ipHash
        ? await consume(ctx, `ip:${args.ipHash}`, LIMITS.ipHourly.limit, LIMITS.ipHourly.windowMs)
        : true,
      args.ipHash
        ? await consume(ctx, `ip:${args.ipHash}`, LIMITS.ipDaily.limit, LIMITS.ipDaily.windowMs)
        : true,
      await consume(
        ctx,
        `email:${normalizedEmail}`,
        LIMITS.emailHourly.limit,
        LIMITS.emailHourly.windowMs,
      ),
      await consume(
        ctx,
        `email:${normalizedEmail}`,
        LIMITS.emailDaily.limit,
        LIMITS.emailDaily.windowMs,
      ),
    ];
    await sweepExpired(ctx);

    /* Every budget is consumed before this check rather than short-circuiting
       on the first failure, so one blocked limit doesn't leave the others
       un-incremented and reusable. */
    if (allowed.some((ok) => !ok)) {
      return { status: "rate_limited" as const };
    }

    const existing = await ctx.db
      .query("trialSignups")
      .withIndex("by_normalizedEmail", (q) => q.eq("normalizedEmail", normalizedEmail))
      .unique();

    /* Someone who has already finished. They get a note saying so instead of a
       second link, and the caller is told "pending" like everyone else — see
       sendTrialAlreadyAppliedEmail for why the page must not say "you already
       signed up". */
    if (existing?.status === "completed") {
      await ctx.scheduler.runAfter(0, internal.emails.sendTrialAlreadyAppliedEmail, {
        email: existing.email,
        name: existing.name,
      });
      return { status: "pending" as const };
    }

    if (existing) {
      /* A fresh token on every send, which invalidates the previous link. If
         old links kept working, "I didn't get it, send it again" would quietly
         leave a trail of live links in an inbox's spam folder. */
      await ctx.db.patch(existing._id, {
        company,
        name,
        email,
        tokenHash: args.tokenHash,
        /* A re-send restarts the clock on an unverified row. An already
           verified one keeps its longer answering window rather than being cut
           back to the verification TTL. */
        tokenExpiresAt: now + (existing.status === "verified" ? ANSWER_TTL_MS : VERIFY_TTL_MS),
        verificationsSent: existing.verificationsSent + 1,
        ...(args.attribution && { attribution: args.attribution }),
        ...(args.ipHash && { ipHash: args.ipHash }),
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("trialSignups", {
        company,
        name,
        email,
        normalizedEmail,
        status: "pending",
        tokenHash: args.tokenHash,
        tokenExpiresAt: now + VERIFY_TTL_MS,
        verificationsSent: 1,
        attribution: args.attribution,
        ipHash: args.ipHash,
        createdAt: now,
        updatedAt: now,
      });
    }

    /* Scheduled rather than awaited: a Resend outage should not cost us the
       signup we just wrote down. They can ask for the link again. */
    await ctx.scheduler.runAfter(0, internal.emails.sendTrialVerificationEmail, {
      email,
      name,
      token: args.token,
      expiresInHours: VERIFY_TTL_HOURS,
    });

    return { status: "pending" as const };
  },
});

/* ── Step 2: the link is opened ─────────────────────────────────────────── */

export const verifyTrial = mutation({
  args: {
    tokenHash: v.string(),
  },
  handler: async (ctx, args) => {
    const row = await ctx.db
      .query("trialSignups")
      .withIndex("by_tokenHash", (q) => q.eq("tokenHash", args.tokenHash))
      .unique();

    /* An unknown token and an expired one are reported separately on purpose.
       The token is 256 bits of randomness, so neither answer helps an attacker
       — there is nothing to enumerate — and the difference is the only thing
       that tells a real person whether to ask for a new link or check they
       copied the whole URL. */
    if (!row) {
      return { status: "unknown" as const };
    }

    /* Already answered. Idempotent because people reload confirmation pages and
       mail clients pre-fetch links; the second visit must not look like a
       failure or invite a duplicate submission. */
    if (row.status === "completed") {
      return { status: "completed" as const, name: row.name, company: row.company };
    }

    if (row.tokenExpiresAt < Date.now()) {
      return { status: "expired" as const };
    }

    const now = Date.now();
    if (row.status === "pending") {
      await ctx.db.patch(row._id, {
        status: "verified",
        verifiedAt: now,
        /* The window is extended, not restarted from the original signup: the
           questions come after this click, and a link that verified with ten
           minutes left would strand someone halfway through them. */
        tokenExpiresAt: now + ANSWER_TTL_MS,
        updatedAt: now,
      });
    }

    return {
      status: "verified" as const,
      name: row.name,
      company: row.company,
      email: row.email,
    };
  },
});

/* ── Step 3: the three questions ────────────────────────────────────────── */

export const submitTrialAnswers = mutation({
  args: {
    tokenHash: v.string(),
    biggestProblem: v.string(),
    workType: v.string(),
    teamSize: v.string(),
    notes: v.optional(v.string()),
    /* Formatted by describeAttribution() in the route. Internal mail only. */
    sourceFirst: v.optional(v.string()),
    sourceLast: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const row = await ctx.db
      .query("trialSignups")
      .withIndex("by_tokenHash", (q) => q.eq("tokenHash", args.tokenHash))
      .unique();

    if (!row) {
      return { status: "unknown" as const };
    }
    if (row.status === "completed") {
      /* A double submit — a second tab, a retried request. Answered as success
         without mailing the founder twice about the same person. */
      return { status: "already" as const };
    }
    /* The guard the whole flow is built around: answers are only accepted from
       a row whose address has been proved. Posting straight to this endpoint
       with a made-up token lands on the `unknown` branch above, and a pending
       row has no valid token to post with, so there is no path to the founder's
       inbox that skips the mail. */
    if (row.status !== "verified") {
      return { status: "unverified" as const };
    }
    if (row.tokenExpiresAt < Date.now()) {
      return { status: "expired" as const };
    }

    const now = Date.now();
    const notes = args.notes?.trim() || undefined;

    await ctx.db.patch(row._id, {
      status: "completed",
      biggestProblem: args.biggestProblem,
      workType: args.workType,
      teamSize: args.teamSize,
      notes,
      completedAt: now,
      updatedAt: now,
    });

    /* Scheduled rather than awaited: a Resend outage should not cost us the
       answers we just wrote down. The row is in the admin list either way. */
    await ctx.scheduler.runAfter(0, internal.emails.sendTrialCompletionEmails, {
      company: row.company,
      name: row.name,
      email: row.email,
      biggestProblem: args.biggestProblem,
      workType: args.workType,
      teamSize: args.teamSize,
      notes,
      verifiedAt: row.verifiedAt,
      sourceFirst: args.sourceFirst,
      sourceLast: args.sourceLast,
    });

    return { status: "completed" as const, name: row.name };
  },
});

/* ── Admin ──────────────────────────────────────────────────────────────── */

export const dashboard = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const requestedLimit = args.limit ?? 100;
    const limit = Math.max(1, Math.min(requestedLimit, 500));
    const signups = await ctx.db.query("trialSignups").order("desc").take(limit);

    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    let completed = 0;
    let pending = 0;
    let last24Hours = 0;
    let last7Days = 0;
    for (const signup of signups) {
      if (signup.status === "completed") completed += 1;
      if (signup.status === "pending") pending += 1;
      if (signup.createdAt >= oneDayAgo) last24Hours += 1;
      if (signup.createdAt >= sevenDaysAgo) last7Days += 1;
    }

    /* The token hash is stripped rather than shipped to a browser. It is not a
       secret on its own — the link carries the pre-image — but an admin page
       has no use for it, and the safest place for a credential-adjacent value
       is not in a dashboard someone screen-shares. */
    return {
      signups: signups.map(({ tokenHash: _tokenHash, ipHash: _ipHash, ...rest }) => rest),
      stats: {
        totalLoaded: signups.length,
        /* The number that matters: signups that never proved their address.
           A jump here with no matching rise in `completed` is bot traffic
           hitting the form, and it is visible before it costs anything. */
        pending,
        completed,
        last24Hours,
        last7Days,
      },
    };
  },
});
