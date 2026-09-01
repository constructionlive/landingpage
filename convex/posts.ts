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

/* ── Agent authoring API ─────────────────────────────────────────────────
   Programmatic create/update/delete for a non-interactive caller — the
   editorial agent — which has no user to sign in as. Authenticated with a
   bearer secret (BLOG_AGENT_API_KEY on the Convex deployment) shared with the
   caller, exactly like the newsletter sending API. The secret is verified here
   inside every function, not only at the HTTP edge, so a public Convex function
   URL is not itself a write path. Posts land in the same `posts` table the
   authenticated editor writes to, so they share the /blog list, URLs and SEO. */

function secretMatches(provided: string, expected: string) {
  /* Length-first, then a constant-time compare that does not short-circuit on
     the first differing byte — the same shape as the newsletter check. */
  if (provided.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < provided.length; i++) {
    diff |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

function requireAgentKey(apiKey: string) {
  const expected = process.env.BLOG_AGENT_API_KEY;
  if (!expected) {
    /* An unset secret must refuse, never fall open — otherwise a missing env
       var quietly turns this into an unauthenticated write endpoint. */
    throw new ConvexError("Blog agent API is not configured.");
  }
  if (!secretMatches(apiKey, expected)) {
    throw new ConvexError("Invalid API key.");
  }
}

/* Who an agent-written post is attributed to, since the caller is not a signed-in
   user. In order of preference: an explicit author email, then a configured
   BLOG_AGENT_AUTHOR_ID, then the first admin, then the first writer. Throws if
   none resolves, so a post is never inserted with a dangling authorId. */
async function resolveAgentAuthor(ctx: any, authorEmail?: string) {
  const wanted = authorEmail?.trim().toLowerCase();
  if (wanted) {
    const users = await ctx.db.query("users").collect();
    const user = users.find((u: any) => (u.email ?? "").trim().toLowerCase() === wanted);
    if (!user) {
      throw new ConvexError(`No user found with email ${authorEmail}.`);
    }
    return user._id;
  }

  const configured = process.env.BLOG_AGENT_AUTHOR_ID;
  if (configured) {
    const user = await ctx.db.get(configured as any);
    if (!user) {
      throw new ConvexError("BLOG_AGENT_AUTHOR_ID is set but matches no user.");
    }
    return user._id;
  }

  const profiles = await ctx.db.query("userProfiles").collect();
  const chosen =
    profiles.find((p: any) => p.role === "admin") ??
    profiles.find((p: any) => p.role === "writer");
  if (!chosen) {
    throw new ConvexError(
      "No author available. Pass authorEmail, set BLOG_AGENT_AUTHOR_ID, or create an admin/writer user.",
    );
  }
  return chosen.userId;
}

/* Find a post by id (preferred) or by its current slug. Throws if neither
   locator is given; returns null when nothing matches. */
async function locatePost(ctx: any, id?: any, slug?: string) {
  if (id) return await ctx.db.get(id);
  const s = slug?.trim();
  if (s) {
    return await ctx.db
      .query("posts")
      .withIndex("by_slug", (q: any) => q.eq("slug", s))
      .unique();
  }
  throw new ConvexError("Provide an id or slug to locate the post.");
}

export const agentCreate = mutation({
  args: {
    apiKey: v.string(),
    authorEmail: v.optional(v.string()),
    publishedAt: v.optional(v.number()),
    title: v.string(),
    content: v.string(),
    slug: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    coverImageUrl: v.optional(v.string()),
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
    requireAgentKey(args.apiKey);
    const authorId = await resolveAgentAuthor(ctx, args.authorEmail);
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

    const id = await ctx.db.insert("posts", {
      title: args.title,
      slug,
      excerpt: optStr(args.excerpt),
      coverImageUrl: optStr(args.coverImageUrl),
      content: args.content,
      authorId,
      publishedAt: args.publishedAt ?? now,
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

    return { id, slug };
  },
});

/* Partial update: every content field is optional and only the ones supplied
   are written, so the agent can fix a single typo without resending the whole
   post. An empty string clears an optional field; omitting the key leaves it
   untouched. The slug is NOT recomputed from a changed title — a live URL only
   moves when `newSlug` is passed explicitly. */
export const agentUpdate = mutation({
  args: {
    apiKey: v.string(),
    id: v.optional(v.id("posts")),
    slug: v.optional(v.string()),
    newSlug: v.optional(v.string()),
    authorEmail: v.optional(v.string()),
    publishedAt: v.optional(v.number()),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    coverImageUrl: v.optional(v.string()),
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
    requireAgentKey(args.apiKey);
    const post = await locatePost(ctx, args.id, args.slug);
    if (!post) {
      throw new ConvexError("Post not found.");
    }

    const patch: any = { updatedAt: Date.now() };

    if (args.newSlug !== undefined) {
      const next = args.newSlug.trim();
      if (!next) {
        throw new ConvexError("newSlug cannot be empty.");
      }
      if (next !== post.slug) {
        const clash = await ctx.db
          .query("posts")
          .withIndex("by_slug", (q) => q.eq("slug", next))
          .unique();
        if (clash) {
          throw new ConvexError("A post with this slug already exists.");
        }
        patch.slug = next;
      }
    }

    if (args.title !== undefined) {
      if (!args.title.trim()) {
        throw new ConvexError("title cannot be empty.");
      }
      patch.title = args.title;
    }
    if (args.content !== undefined) {
      if (!args.content.trim()) {
        throw new ConvexError("content cannot be empty.");
      }
      patch.content = args.content;
    }

    /* For optional string fields, a provided empty string means "clear it"; an
       omitted key means "leave it". */
    const setStr = (key: string, val?: string) => {
      if (val !== undefined) patch[key] = val.trim() ? val.trim() : undefined;
    };
    setStr("excerpt", args.excerpt);
    setStr("coverImageUrl", args.coverImageUrl);
    setStr("metaTitle", args.metaTitle);
    setStr("metaDescription", args.metaDescription);
    setStr("metaKeywords", args.metaKeywords);
    setStr("canonicalUrl", args.canonicalUrl);
    setStr("ogTitle", args.ogTitle);
    setStr("ogDescription", args.ogDescription);
    setStr("ogImageUrl", args.ogImageUrl);
    setStr("twitterTitle", args.twitterTitle);
    setStr("twitterDescription", args.twitterDescription);
    setStr("twitterImageUrl", args.twitterImageUrl);

    if (args.noIndex !== undefined) patch.noIndex = args.noIndex;
    if (args.twitterCard !== undefined) patch.twitterCard = args.twitterCard;
    if (args.publishedAt !== undefined) patch.publishedAt = args.publishedAt;
    if (args.authorEmail !== undefined) {
      patch.authorId = await resolveAgentAuthor(ctx, args.authorEmail);
    }

    await ctx.db.patch(post._id, patch);
    return { id: post._id, slug: patch.slug ?? post.slug };
  },
});

export const agentDelete = mutation({
  args: {
    apiKey: v.string(),
    id: v.optional(v.id("posts")),
    slug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    requireAgentKey(args.apiKey);
    const post = await locatePost(ctx, args.id, args.slug);
    if (!post) {
      throw new ConvexError("Post not found.");
    }
    await ctx.db.delete(post._id);
    return { deleted: true, slug: post.slug };
  },
});

export const agentList = query({
  args: { apiKey: v.string() },
  handler: async (ctx, args) => {
    requireAgentKey(args.apiKey);
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_publishedAt")
      .order("desc")
      .collect();
    return posts.map((p) => ({
      id: p._id,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt ?? null,
      coverImageUrl: p.coverImageUrl ?? null,
      publishedAt: p.publishedAt,
      updatedAt: p.updatedAt,
    }));
  },
});

export const agentGet = query({
  args: { apiKey: v.string(), slug: v.string() },
  handler: async (ctx, args) => {
    requireAgentKey(args.apiKey);
    const post = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!post) return null;
    return await withAuthor(ctx, post);
  },
});

/* Image hosting for agent posts, so a picture lives in Convex file storage on
   the same *.convex.cloud host the editor's uploads use (already allowlisted in
   next.config.ts). The HTTP route gets an upload URL, PUTs the bytes, then
   resolves the stored id back to a public URL to embed in the post HTML. */
export const agentGenerateUploadUrl = mutation({
  args: { apiKey: v.string() },
  handler: async (ctx, args) => {
    requireAgentKey(args.apiKey);
    return await ctx.storage.generateUploadUrl();
  },
});

export const agentResolveImageUrl = query({
  args: { apiKey: v.string(), storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    requireAgentKey(args.apiKey);
    return await ctx.storage.getUrl(args.storageId);
  },
});
