import { ConvexError, v } from "convex/values";
import { mutation, query } from "./functions";
import { requireAgentKey } from "./agentAuth";

/* Landing pages at /for/<slug>, written entirely by the agent — there is no
   editor UI for these, so unlike convex/posts.ts every function here is
   agent-authenticated. Same shared secret, checked inside each function rather
   than only at the HTTP edge; see convex/agentAuth.ts.

   The two read queries are deliberately NOT agent-authed: the Next route
   renders them into public HTML at build/revalidate time, so gating them would
   only mean handing the site a secret to read its own pages. */

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/* Slugs become URL segments under /for/, so they may not contain a slash or
   any of the characters that would need escaping to survive one. */
function assertUsableSlug(slug: string) {
  if (!slug) {
    throw new ConvexError("A valid slug could not be generated.");
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new ConvexError(
      "slug may only contain lowercase letters, numbers and hyphens.",
    );
  }
}

async function bySlug(ctx: any, slug: string) {
  return await ctx.db
    .query("landingPages")
    .withIndex("by_slug", (q: any) => q.eq("slug", slug))
    .unique();
}

/** Every page, for the sitemap. Newest first. */
export const listAll = query({
  args: {},
  handler: async (ctx) => await ctx.db.query("landingPages").order("desc").collect(),
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => await bySlug(ctx, args.slug),
});

/* ── Agent API ──────────────────────────────────────────────────────────── */

const CONTENT_ARGS = {
  eyebrow: v.optional(v.string()),
  subheadline: v.optional(v.string()),
  ctaLabel: v.optional(v.string()),
  ctaHref: v.optional(v.string()),
  secondaryCtaLabel: v.optional(v.string()),
  secondaryCtaHref: v.optional(v.string()),
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
};

const OPTIONAL_STRING_KEYS = [
  "eyebrow",
  "subheadline",
  "ctaLabel",
  "ctaHref",
  "secondaryCtaLabel",
  "secondaryCtaHref",
  "metaTitle",
  "metaDescription",
  "metaKeywords",
  "canonicalUrl",
  "ogTitle",
  "ogDescription",
  "ogImageUrl",
  "twitterTitle",
  "twitterDescription",
  "twitterImageUrl",
] as const;

export const agentCreate = mutation({
  args: {
    apiKey: v.string(),
    slug: v.string(),
    headline: v.string(),
    content: v.string(),
    ...CONTENT_ARGS,
  },
  handler: async (ctx, args) => {
    requireAgentKey(args.apiKey);

    const slug = toSlug(args.slug);
    assertUsableSlug(slug);
    if (!args.headline.trim()) {
      throw new ConvexError("headline cannot be empty.");
    }
    if (!args.content.trim()) {
      throw new ConvexError("content cannot be empty.");
    }
    if (await bySlug(ctx, slug)) {
      throw new ConvexError("A landing page with this slug already exists.");
    }

    const optStr = (s?: string) => (s?.trim() ? s.trim() : undefined);
    const now = Date.now();

    const doc: any = {
      slug,
      headline: args.headline.trim(),
      content: args.content,
      createdAt: now,
      updatedAt: now,
      noIndex: args.noIndex ?? undefined,
      twitterCard: args.twitterCard ?? undefined,
    };
    for (const key of OPTIONAL_STRING_KEYS) {
      doc[key] = optStr(args[key as keyof typeof args] as string | undefined);
    }

    const id = await ctx.db.insert("landingPages", doc);
    return { id, slug };
  },
});

/* Partial update, same contract as agentUpdate in convex/posts.ts: only the
   keys present are written, an empty string clears an optional field, and the
   URL only moves when `newSlug` is passed explicitly. */
export const agentUpdate = mutation({
  args: {
    apiKey: v.string(),
    slug: v.string(),
    newSlug: v.optional(v.string()),
    headline: v.optional(v.string()),
    content: v.optional(v.string()),
    ...CONTENT_ARGS,
  },
  handler: async (ctx, args) => {
    requireAgentKey(args.apiKey);

    const page = await bySlug(ctx, args.slug);
    if (!page) {
      throw new ConvexError("Landing page not found.");
    }

    const patch: any = { updatedAt: Date.now() };

    if (args.newSlug !== undefined) {
      const next = toSlug(args.newSlug);
      assertUsableSlug(next);
      if (next !== page.slug) {
        if (await bySlug(ctx, next)) {
          throw new ConvexError("A landing page with this slug already exists.");
        }
        patch.slug = next;
      }
    }
    if (args.headline !== undefined) {
      if (!args.headline.trim()) {
        throw new ConvexError("headline cannot be empty.");
      }
      patch.headline = args.headline.trim();
    }
    if (args.content !== undefined) {
      if (!args.content.trim()) {
        throw new ConvexError("content cannot be empty.");
      }
      patch.content = args.content;
    }
    for (const key of OPTIONAL_STRING_KEYS) {
      const value = args[key as keyof typeof args] as string | undefined;
      if (value !== undefined) patch[key] = value.trim() ? value.trim() : undefined;
    }
    if (args.noIndex !== undefined) patch.noIndex = args.noIndex;
    if (args.twitterCard !== undefined) patch.twitterCard = args.twitterCard;

    await ctx.db.patch(page._id, patch);
    /* Both slugs go back to the route handler: the new one to build, the old
       one to purge from the cache when the URL moved. */
    return { id: page._id, slug: patch.slug ?? page.slug, previousSlug: page.slug };
  },
});

export const agentDelete = mutation({
  args: { apiKey: v.string(), slug: v.string() },
  handler: async (ctx, args) => {
    requireAgentKey(args.apiKey);
    const page = await bySlug(ctx, args.slug);
    if (!page) {
      throw new ConvexError("Landing page not found.");
    }
    await ctx.db.delete(page._id);
    return { deleted: true, slug: page.slug };
  },
});

export const agentList = query({
  args: { apiKey: v.string() },
  handler: async (ctx, args) => {
    requireAgentKey(args.apiKey);
    const pages = await ctx.db.query("landingPages").order("desc").collect();
    return pages.map((page) => ({
      id: page._id,
      slug: page.slug,
      headline: page.headline,
      subheadline: page.subheadline ?? null,
      noIndex: page.noIndex ?? false,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
    }));
  },
});

export const agentGet = query({
  args: { apiKey: v.string(), slug: v.string() },
  handler: async (ctx, args) => {
    requireAgentKey(args.apiKey);
    return await bySlug(ctx, args.slug);
  },
});
