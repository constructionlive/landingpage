import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

/* Marketing attribution, mirrored from lib/attribution.ts.

   Every field is optional and `channel` is a plain string rather than a union
   of the eight known values. That is deliberate: Convex validates mutation args
   before they run, so a stricter validator would reject the whole submission
   over an unrecognised reporting label — losing a real lead to protect a tidy
   enum. Normalisation happens in sanitizeAttributionPayload() before the write.

   Optional-everywhere also matters for the migration: rows written before this
   field existed carry no attribution, and Convex validates the entire table on
   deploy. A required field here would refuse to deploy at all. */
const attributionTouch = v.object({
  utmSource: v.optional(v.string()),
  utmMedium: v.optional(v.string()),
  utmCampaign: v.optional(v.string()),
  utmContent: v.optional(v.string()),
  utmTerm: v.optional(v.string()),
  gclid: v.optional(v.string()),
  fbclid: v.optional(v.string()),
  liFatId: v.optional(v.string()),
  ttclid: v.optional(v.string()),
  msclkid: v.optional(v.string()),
  channel: v.string(),
  landingPath: v.optional(v.string()),
  referrer: v.optional(v.string()),
  referrerHost: v.optional(v.string()),
  at: v.number(),
});

/* `first` is absent for visitors who never consented to the attribution cookie
   — we know what closed them, not what found them. See the two-tier note in
   lib/attribution.ts. Reports must treat a missing first-touch as unknown
   rather than assuming it equals last-touch. */
export const attributionValidator = v.object({
  first: v.optional(attributionTouch),
  last: v.optional(attributionTouch),
});

export default defineSchema({
  ...authTables,
  userProfiles: defineTable({
    userId: v.id("users"),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    profileImageStorageId: v.optional(v.id("_storage")),
    bio: v.optional(v.string()),
    role: v.union(v.literal("reader"), v.literal("writer"), v.literal("admin")),
  }).index("by_userId", ["userId"]),
  posts: defineTable({
    title: v.string(),
    slug: v.string(),
    excerpt: v.optional(v.string()),
    coverImageUrl: v.optional(v.string()),
    content: v.string(),
    authorId: v.id("users"),
    publishedAt: v.number(),
    updatedAt: v.number(),
    /* Pins a post to the top of /blog instead of letting recency decide. Both
       are absent on everything written before this existed, which reads as
       "not featured" — no backfill needed. `featuredOrder` only breaks ties
       between featured posts (lower first); without it they fall back to
       newest-first, so nothing has to pick a number to be featured. */
    featured: v.optional(v.boolean()),
    featuredOrder: v.optional(v.number()),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    metaKeywords: v.optional(v.string()),
    canonicalUrl: v.optional(v.string()),
    noIndex: v.optional(v.boolean()),
    ogTitle: v.optional(v.string()),
    ogDescription: v.optional(v.string()),
    ogImageUrl: v.optional(v.string()),
    twitterCard: v.optional(v.union(v.literal("summary"), v.literal("summary_large_image"))),
    twitterTitle: v.optional(v.string()),
    twitterDescription: v.optional(v.string()),
    twitterImageUrl: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_authorId", ["authorId"])
    .index("by_publishedAt", ["publishedAt"]),
  /* Agent-authored landing pages served at /for/<slug>. Separate from `posts`
     because they answer a different question: a post is dated editorial that
     belongs in a reverse-chronological list, a landing page is undated, stands
     alone, and exists to convert one audience. Sharing a table would mean every
     blog query filtering out pages and every page query filtering out posts.

     The hero is structured rather than part of `content` so every page is
     guaranteed the h1 and the call-to-action that decide whether it ranks and
     whether it converts — the two things free-form HTML most often forgets. */
  landingPages: defineTable({
    slug: v.string(),
    eyebrow: v.optional(v.string()),
    headline: v.string(),
    subheadline: v.optional(v.string()),
    ctaLabel: v.optional(v.string()),
    ctaHref: v.optional(v.string()),
    secondaryCtaLabel: v.optional(v.string()),
    secondaryCtaHref: v.optional(v.string()),
    /* The middle of the page, as HTML, in the same dialect as post bodies. */
    content: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
    metaTitle: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    metaKeywords: v.optional(v.string()),
    canonicalUrl: v.optional(v.string()),
    noIndex: v.optional(v.boolean()),
    ogTitle: v.optional(v.string()),
    ogDescription: v.optional(v.string()),
    ogImageUrl: v.optional(v.string()),
    twitterCard: v.optional(v.union(v.literal("summary"), v.literal("summary_large_image"))),
    twitterTitle: v.optional(v.string()),
    twitterDescription: v.optional(v.string()),
    twitterImageUrl: v.optional(v.string()),
  }).index("by_slug", ["slug"]),
  earlyAccessEmails: defineTable({
    email: v.string(),
    normalizedEmail: v.string(),
    createdAt: v.number(),
  }).index("by_normalizedEmail", ["normalizedEmail"]),
  /* The newsletter register. This is the list we actually mail, so it is kept
     separate from earlyAccessEmails: that table is "wants the product", this
     one is "agreed to hear from us", and the two are not the same consent.

     A row is never deleted on unsubscribe, only flagged. Deleting it would let
     the same address be re-added by the next form fill and silently start
     mailing someone who already opted out — CASL calls that a fresh violation.
     `status` is the single source of truth for who gets a send. */
  newsletterSubscribers: defineTable({
    email: v.string(),
    normalizedEmail: v.string(),
    name: v.optional(v.string()),
    company: v.optional(v.string()),
    /* What they said they build. Free text from a chip list, so it stays a
       plain string rather than a union — same reasoning as `channel` above. */
    interest: v.optional(v.string()),
    status: v.union(v.literal("subscribed"), v.literal("unsubscribed")),
    /* The secret in every unsubscribe link. Generated in the API route rather
       than here, so opting out never needs a login or a lookup by email — an
       unsubscribe endpoint that takes a raw address is an endpoint anyone can
       use to unsubscribe anyone. */
    unsubscribeToken: v.string(),
    attribution: v.optional(attributionValidator),
    /* Where the consent came from, for rows we did not collect ourselves.
       Absent on anyone who used the form — the attribution above already says
       how they arrived. Set on imports, because "we have their address" and
       "we can prove they agreed" are different claims, and the second is the
       one that matters if a complaint ever lands. */
    consentSource: v.optional(v.string()),
    createdAt: v.number(),
    /* Set on the most recent (re)subscribe, so a returning address shows when
       it came back rather than when it first arrived. */
    resubscribedAt: v.optional(v.number()),
    unsubscribedAt: v.optional(v.number()),
    /* Touched on EVERY write to this row, whatever changed.

       This is what makes the register syncable: an external sender asks for
       everything that changed since its last pull, rather than re-reading the
       whole list and diffing it. createdAt can't do that job — an address that
       subscribed in January and opted out today still has a January createdAt,
       so a sender syncing on createdAt would never learn it has to stop mailing
       them. That is the one update that must never be missed.

       Required, not optional. An optional field would sort as `undefined` in
       the index below, ahead of every real timestamp, so rows missing it would
       fall outside every `since` range and sync as though they didn't exist. */
    updatedAt: v.number(),
  })
    .index("by_normalizedEmail", ["normalizedEmail"])
    .index("by_unsubscribeToken", ["unsubscribeToken"])
    .index("by_createdAt", ["createdAt"])
    /* Ascending scan from a caller's watermark. Any write moves a row to the
       end of this order, so a sync that walks it forward can't skip one. */
    .index("by_updatedAt", ["updatedAt"]),
  quoteRequests: defineTable({
    // Step 1: who they are and what we're quoting
    role: v.string(),
    trade: v.string(),
    teamSize: v.string(),
    website: v.string(),
    painPoint: v.optional(v.string()),
    // Step 2: who to reply to
    name: v.string(),
    email: v.string(),
    normalizedEmail: v.string(),
    company: v.string(),
    phone: v.optional(v.string()),
    heardAbout: v.optional(v.string()),
    attribution: v.optional(attributionValidator),
    createdAt: v.number(),
  })
    .index("by_normalizedEmail", ["normalizedEmail"])
    .index("by_createdAt", ["createdAt"]),
  /* The "Try now" onboarding at /try, and the one table on this site whose
     main job is to keep bots out.

     Everything else here writes a row and mails someone. This flow gates a
     founder conversation and, eventually, product access — so a scripted signup
     costs us model spend rather than an unread email. The defence is that a row
     is worthless until an address proves it can receive mail: `status` starts
     "pending", and only the person holding the link in that inbox can move it
     to "verified" and answer the three questions.

     Adding a field means touching this table, convex/trial.ts, the validator in
     the matching route under app/api/try/, the form in app/try/ and the emails
     in convex/emails.ts, or the answer is collected and then silently dropped. */
  trialSignups: defineTable({
    company: v.string(),
    name: v.string(),
    email: v.string(),
    normalizedEmail: v.string(),
    /* "pending" until the link is clicked, "verified" after, "completed" once
       the three questions are answered. Only a completed row is a lead: the
       other two are an address that has not proved anything yet. */
    status: v.union(v.literal("pending"), v.literal("verified"), v.literal("completed")),
    /* SHA-256 of the token mailed out, never the token itself. The link lives
       in an inbox we don't control and in browser history; storing only the
       digest means a leaked database row can't be replayed as a valid link.
       Minted and hashed in app/api/try/start/route.ts — see lib/trialToken.ts. */
    tokenHash: v.string(),
    /* Verification links expire; see TOKEN_TTL_MS in convex/trial.ts. A link
       that works forever is a link a scraper can sit on. */
    tokenExpiresAt: v.number(),
    verifiedAt: v.optional(v.number()),
    /* How many verification mails this row has been sent. A repeat signup for
       the same address re-mails rather than writing a second row, and this is
       what stops that from becoming a way to use us as a mail cannon. */
    verificationsSent: v.number(),
    /* The three answers, absent until the questions are submitted. Free-text
       strings rather than unions for the same reason as `channel` above: a
       reworded option must not be able to reject a real lead. */
    biggestProblem: v.optional(v.string()),
    workType: v.optional(v.string()),
    teamSize: v.optional(v.string()),
    notes: v.optional(v.string()),
    completedAt: v.optional(v.number()),
    attribution: v.optional(attributionValidator),
    /* Salted hash of the submitting IP, never the address. Enough to recognise
       one script filling the form forty times, not enough to be a location log
       on everyone who filled it in once. See hashIp() in lib/trialToken.ts. */
    ipHash: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_normalizedEmail", ["normalizedEmail"])
    .index("by_tokenHash", ["tokenHash"])
    .index("by_createdAt", ["createdAt"]),
  /* Fixed-window counters for the /try flow. Durable rather than in-process
     because the site runs on serverless instances that don't share memory, so
     a counter held in a module variable resets whenever a new instance spins
     up — which is to say, exactly when a burst of traffic arrives.

     `key` encodes both the subject and the window ("ip:<hash>:h:483291"), so a
     new window is a new row and there is nothing to reset on a schedule.
     `expiresAt` is what the sweep in convex/trial.ts deletes by. */
  trialRateLimits: defineTable({
    key: v.string(),
    count: v.number(),
    expiresAt: v.number(),
  })
    .index("by_key", ["key"])
    .index("by_expiresAt", ["expiresAt"]),
  /* The contact form on /contact. Unlike a quote request this is open-ended:
     one message, everything else optional. */
  contactMessages: defineTable({
    name: v.string(),
    email: v.string(),
    normalizedEmail: v.string(),
    company: v.optional(v.string()),
    topic: v.optional(v.string()),
    message: v.string(),
    attribution: v.optional(attributionValidator),
    createdAt: v.number(),
  })
    .index("by_normalizedEmail", ["normalizedEmail"])
    .index("by_createdAt", ["createdAt"]),
});
