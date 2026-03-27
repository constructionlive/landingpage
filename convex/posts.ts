import { ConvexError, v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./functions";

function toSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

async function requireWriter(ctx: any) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new ConvexError("Not authenticated.");
  }

  const profile = await ctx.db
    .query("userProfiles")
    .withIndex("by_userId", (q: any) => q.eq("userId", userId))
    .unique();

  const role = profile?.role ?? "reader";
  if (role !== "writer" && role !== "admin") {
    throw new ConvexError("Writer access required.");
  }
  return userId;
}

async function withAuthor(ctx: any, post: any) {
  const [author, profile] = await Promise.all([
    ctx.db.get(post.authorId),
    ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q: any) => q.eq("userId", post.authorId))
      .unique(),
  ]);
  const uploadedProfileImageUrl = profile?.profileImageStorageId
    ? await ctx.storage.getUrl(profile.profileImageStorageId)
    : null;
  const externalProfileImageUrl = profile?.image?.trim()
    ? profile.image.trim()
    : author?.image?.trim()
      ? author.image.trim()
      : null;

  return {
    ...post,
    authorName: profile?.name ?? author?.name ?? author?.email ?? "Unknown author",
    authorImageUrl: uploadedProfileImageUrl ?? externalProfileImageUrl,
    authorBio: profile?.bio ?? null,
  };
}

export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_publishedAt")
      .order("desc")
      .collect();
    return await Promise.all(posts.map((post) => withAuthor(ctx, post)));
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!post) return null;
    return await withAuthor(ctx, post);
  },
});

export const generateImageUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireWriter(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const getImageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    await requireWriter(ctx);
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    excerpt: v.optional(v.string()),
    coverImageUrl: v.optional(v.string()),
    content: v.string(),
    slug: v.optional(v.string()),
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
  },
  handler: async (ctx, args) => {
    const authorId = await requireWriter(ctx);
    const now = Date.now();
    const slug = (args.slug && args.slug.trim().length > 0 ? args.slug : toSlug(args.title)).trim();
    if (!slug) {
      throw new ConvexError("A valid slug could not be generated.");
    }

    const existing = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (existing) {
      throw new ConvexError("A post with this slug already exists.");
    }

    const optStr = (s?: string) => (s?.trim() ? s.trim() : undefined);

    return await ctx.db.insert("posts", {
      title: args.title,
      slug,
      excerpt: optStr(args.excerpt),
      coverImageUrl: optStr(args.coverImageUrl),
      content: args.content,
      authorId,
      publishedAt: now,
      updatedAt: now,
      metaTitle: optStr(args.metaTitle),
      metaDescription: optStr(args.metaDescription),
      metaKeywords: optStr(args.metaKeywords),
      canonicalUrl: optStr(args.canonicalUrl),
      noIndex: args.noIndex ?? undefined,
      ogTitle: optStr(args.ogTitle),
      ogDescription: optStr(args.ogDescription),
      ogImageUrl: optStr(args.ogImageUrl),
      twitterCard: args.twitterCard ?? undefined,
      twitterTitle: optStr(args.twitterTitle),
      twitterDescription: optStr(args.twitterDescription),
      twitterImageUrl: optStr(args.twitterImageUrl),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("posts"),
    title: v.string(),
    excerpt: v.optional(v.string()),
    coverImageUrl: v.optional(v.string()),
    content: v.string(),
    slug: v.optional(v.string()),
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
  },
  handler: async (ctx, args) => {
    const userId = await requireWriter(ctx);
    const post = await ctx.db.get(args.id);
    if (!post) {
      throw new ConvexError("Post not found.");
    }

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q: any) => q.eq("userId", userId))
      .unique();
    const role = profile?.role ?? "reader";
    if (post.authorId !== userId && role !== "admin") {
      throw new ConvexError("You can only edit your own posts.");
    }

    const slug = (args.slug && args.slug.trim().length > 0 ? args.slug : toSlug(args.title)).trim();
    if (!slug) {
      throw new ConvexError("A valid slug could not be generated.");
    }

    if (slug !== post.slug) {
      const existing = await ctx.db
        .query("posts")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();
      if (existing) {
        throw new ConvexError("A post with this slug already exists.");
      }
    }

    const optStr = (s?: string) => (s?.trim() ? s.trim() : undefined);

    await ctx.db.patch(args.id, {
      title: args.title,
      slug,
      excerpt: optStr(args.excerpt),
      coverImageUrl: optStr(args.coverImageUrl),
      content: args.content,
      updatedAt: Date.now(),
      metaTitle: optStr(args.metaTitle),
      metaDescription: optStr(args.metaDescription),
      metaKeywords: optStr(args.metaKeywords),
      canonicalUrl: optStr(args.canonicalUrl),
      noIndex: args.noIndex ?? undefined,
      ogTitle: optStr(args.ogTitle),
      ogDescription: optStr(args.ogDescription),
      ogImageUrl: optStr(args.ogImageUrl),
      twitterCard: args.twitterCard ?? undefined,
      twitterTitle: optStr(args.twitterTitle),
      twitterDescription: optStr(args.twitterDescription),
      twitterImageUrl: optStr(args.twitterImageUrl),
    });

    return args.id;
  },
});
