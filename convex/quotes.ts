import { ConvexError, v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./functions";
import { api } from "./_generated/api";

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

export const submitQuote = mutation({
  args: {
    role: v.string(),
    trade: v.string(),
    teamSize: v.string(),
    website: v.string(),
    name: v.string(),
    email: v.string(),
    company: v.string(),
    phone: v.optional(v.string()),
    heardAbout: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const name = args.name.trim();
    const email = args.email.trim();
    const company = args.company.trim();
    const phone = args.phone?.trim() || undefined;

    if (!name || !email || !company) {
      throw new ConvexError("Name, email and company are required.");
    }

    await ctx.db.insert("quoteRequests", {
      role: args.role,
      trade: args.trade,
      teamSize: args.teamSize,
      website: args.website,
      name,
      email,
      normalizedEmail: normalizeEmail(email),
      company,
      phone,
      heardAbout: args.heardAbout,
      createdAt: Date.now(),
    });

    await ctx.scheduler.runAfter(0, api.emails.sendQuoteRequestEmails, {
      role: args.role,
      trade: args.trade,
      teamSize: args.teamSize,
      website: args.website,
      name,
      email,
      company,
      phone,
      heardAbout: args.heardAbout,
    });

    return { status: "created" as const };
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
    const requests = await ctx.db.query("quoteRequests").order("desc").take(limit);

    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    let last24Hours = 0;
    let last7Days = 0;
    for (const request of requests) {
      if (request.createdAt >= oneDayAgo) last24Hours += 1;
      if (request.createdAt >= sevenDaysAgo) last7Days += 1;
    }

    return {
      requests,
      stats: {
        totalLoaded: requests.length,
        last24Hours,
        last7Days,
      },
    };
  },
});
