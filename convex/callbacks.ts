import { v } from "convex/values";
import { mutation, internalMutation, internalQuery } from "./_generated/server";
import { internal } from "./_generated/api";

const E164_RE = /^\+[1-9]\d{6,14}$/;
const RATE_LIMIT_MS = 5 * 60 * 1000;

function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}

/**
 * Public mutation: visitor requests a callback. Validates input, inserts a
 * queued callbackRequests row, and schedules the Vapi trigger action.
 * Returns the row id so the client can subscribe to status updates.
 */
export const requestCallback = mutation({
  args: {
    phone: v.string(),
    name: v.optional(v.string()),
    company: v.optional(v.string()),
    projectName: v.optional(v.string()),
    source: v.optional(v.string()),
    consent: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    if (args.consent !== true) {
      return { status: "consent-required" as const };
    }

    const phone = args.phone.trim();
    const normalizedPhone = normalizePhone(phone);

    if (!E164_RE.test(normalizedPhone)) {
      return { status: "invalid" as const };
    }

    // 5-minute rate limit per phone — prevents abuse / accidental double-clicks.
    const cutoff = Date.now() - RATE_LIMIT_MS;
    const recent = await ctx.db
      .query("callbackRequests")
      .withIndex("by_normalizedPhone", (q) =>
        q.eq("normalizedPhone", normalizedPhone),
      )
      .order("desc")
      .first();

    if (recent && recent.createdAt > cutoff) {
      return {
        status: "rate-limited" as const,
        retryInSeconds: Math.ceil((recent.createdAt + RATE_LIMIT_MS - Date.now()) / 1000),
      };
    }

    const callbackId = await ctx.db.insert("callbackRequests", {
      name: args.name?.trim() || undefined,
      company: args.company?.trim() || undefined,
      projectName: args.projectName?.trim() || undefined,
      phone,
      normalizedPhone,
      source: args.source?.trim() || undefined,
      consent: true,
      status: "queued",
      createdAt: Date.now(),
    });

    await ctx.scheduler.runAfter(0, internal.callbacksActions.triggerVapiCall, {
      callbackId,
    });

    return { status: "queued" as const, callbackId };
  },
});

/**
 * Public query: client subscribes for live status of a callback request.
 * Returns lightweight status info — never the transcript or PII beyond what
 * the visitor already submitted.
 */
export const getCallbackStatus = internalQuery({
  args: { callbackId: v.id("callbackRequests") },
  handler: async (ctx, args) => {
    const row = await ctx.db.get(args.callbackId);
    if (!row) return null;
    return {
      status: row.status ?? "queued",
      failureReason: row.failureReason,
      durationSeconds: row.durationSeconds,
      endedAt: row.endedAt,
    };
  },
});

/* ── Internal mutations called from the trigger action + webhook ─── */

export const setVapiCallId = internalMutation({
  args: {
    callbackId: v.id("callbackRequests"),
    vapiCallId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.callbackId, {
      vapiCallId: args.vapiCallId,
      status: "queued",
    });
  },
});

export const markFailed = internalMutation({
  args: {
    callbackId: v.id("callbackRequests"),
    reason: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.callbackId, {
      status: "failed",
      failureReason: args.reason.slice(0, 500),
    });
  },
});

export const markNotConfigured = internalMutation({
  args: { callbackId: v.id("callbackRequests") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.callbackId, { status: "not-configured" });
  },
});

export const updateStatusByVapiCallId = internalMutation({
  args: {
    vapiCallId: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const row = await ctx.db
      .query("callbackRequests")
      .withIndex("by_vapiCallId", (q) => q.eq("vapiCallId", args.vapiCallId))
      .first();
    if (!row) return;
    await ctx.db.patch(row._id, { status: args.status });
  },
});

export const completeCallByVapiCallId = internalMutation({
  args: {
    vapiCallId: v.string(),
    status: v.string(),
    transcript: v.optional(v.string()),
    summary: v.optional(v.string()),
    durationSeconds: v.optional(v.number()),
    recordingUrl: v.optional(v.string()),
    costCents: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const row = await ctx.db
      .query("callbackRequests")
      .withIndex("by_vapiCallId", (q) => q.eq("vapiCallId", args.vapiCallId))
      .first();
    if (!row) return;

    await ctx.db.patch(row._id, {
      status: args.status,
      transcript: args.transcript,
      summary: args.summary,
      durationSeconds: args.durationSeconds,
      recordingUrl: args.recordingUrl,
      costCents: args.costCents,
      endedAt: Date.now(),
    });
  },
});

/**
 * Internal: fetch the row by callbackId. Used by the trigger action so it
 * can read the validated row data without re-validating client input.
 */
export const getCallback = internalQuery({
  args: { callbackId: v.id("callbackRequests") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.callbackId);
  },
});
