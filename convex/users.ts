import { ConvexError, v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./functions";

async function requireAuthenticatedUserId(ctx: any) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new ConvexError("Not authenticated.");
  }
  return userId;
}

export const me = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db.get(userId);
    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    return {
      id: userId,
      email: user?.email ?? null,
      authImage: user?.image ?? null,
      profile,
    };
  },
});

export const upsertMyProfile = mutation({
  args: {
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    profileImageStorageId: v.optional(v.id("_storage")),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireAuthenticatedUserId(ctx);

    const existing = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (!existing) {
      await ctx.db.insert("userProfiles", {
        userId,
        name: args.name,
        image: args.image,
        profileImageStorageId: args.profileImageStorageId,
        bio: args.bio,
        role: "reader",
      });
      return;
    }

    await ctx.db.patch(existing._id, {
      name: args.name ?? existing.name,
      image: args.image ?? existing.image,
      profileImageStorageId: args.profileImageStorageId ?? existing.profileImageStorageId,
      bio: args.bio ?? existing.bio,
    });
  },
});

export const generateProfileImageUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAuthenticatedUserId(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const getProfileImageUrl = query({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    await requireAuthenticatedUserId(ctx);
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const setUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("reader"), v.literal("writer"), v.literal("admin")),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      throw new ConvexError("Not authenticated.");
    }

    const currentProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", currentUserId))
      .unique();

    if (currentProfile?.role !== "admin") {
      throw new ConvexError("Only admins can manage writer access.");
    }

    const targetProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!targetProfile) {
      await ctx.db.insert("userProfiles", {
        userId: args.userId,
        role: args.role,
      });
      return;
    }

    await ctx.db.patch(targetProfile._id, { role: args.role });
  },
});
