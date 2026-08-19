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
  earlyAccessEmails: defineTable({
    email: v.string(),
    normalizedEmail: v.string(),
    createdAt: v.number(),
  }).index("by_normalizedEmail", ["normalizedEmail"]),
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
