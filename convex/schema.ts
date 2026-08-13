import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

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
    createdAt: v.number(),
  })
    .index("by_normalizedEmail", ["normalizedEmail"])
    .index("by_createdAt", ["createdAt"]),
});
