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

export const joinWaitlist = mutation({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const normalizedEmail = normalizeEmail(args.email);

    const existing = await ctx.db
      .query("earlyAccessEmails")
      .withIndex("by_normalizedEmail", (q) => q.eq("normalizedEmail", normalizedEmail))
      .unique();

    if (existing) {
      return { status: "duplicate" as const };
    }

    await ctx.db.insert("earlyAccessEmails", {
      email: args.email.trim(),
      normalizedEmail,
      createdAt: Date.now(),
    });

    await ctx.scheduler.runAfter(0, api.emails.sendInvitationAddedEmail, {
      email: args.email.trim(),
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
    const signups = await ctx.db.query("earlyAccessEmails").order("desc").take(limit);

    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const domainCounts = new Map<string, number>();

    let last24Hours = 0;
    let last7Days = 0;
    for (const signup of signups) {
      if (signup.createdAt >= oneDayAgo) last24Hours += 1;
      if (signup.createdAt >= sevenDaysAgo) last7Days += 1;

      const domain = signup.normalizedEmail.split("@")[1] ?? "unknown";
      domainCounts.set(domain, (domainCounts.get(domain) ?? 0) + 1);
    }

    const topDomains = Array.from(domainCounts.entries())
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    return {
      signups,
      stats: {
        totalLoaded: signups.length,
        last24Hours,
        last7Days,
        topDomains,
      },
    };
  },
});
