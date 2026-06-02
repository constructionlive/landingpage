"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { VapiClient, type Vapi } from "@vapi-ai/server-sdk";

const MAX_CALL_DURATION_SECONDS = 600;

/**
 * Trigger an outbound Vapi call for a queued callbackRequests row.
 *
 * Mirrors the canonical voiceCall.ts pattern in the in-app product so the
 * landing-page call experience matches the rest of construction.live.
 *
 * Required env vars (set in the Convex deployment, NOT in client code):
 *   - VAPI_API_KEY            : private Vapi server SDK token
 *   - VAPI_PHONE_NUMBER_ID    : UUID of the outbound number to call from
 *   - CONVEX_SITE_URL         : auto-set by Convex; used to build webhook URL
 */
export const triggerVapiCall = internalAction({
  args: { callbackId: v.id("callbackRequests") },
  handler: async (ctx, args) => {
    const row = await ctx.runQuery(internal.callbacks.getCallback, {
      callbackId: args.callbackId,
    });
    if (!row) return;

    const apiKey = process.env.VAPI_API_KEY;
    const phoneNumberId = process.env.VAPI_PHONE_NUMBER_ID;
    const siteUrl = process.env.CONVEX_SITE_URL;

    if (!apiKey || !phoneNumberId || !siteUrl) {
      // Don't crash; flag the row so support can see why no call happened.
      await ctx.runMutation(internal.callbacks.markNotConfigured, {
        callbackId: args.callbackId,
      });
      return;
    }

    const vapi = new VapiClient({ token: apiKey });

    const contactName = row.name?.trim() || null;
    const greetingLine = contactName
      ? `You are calling ${contactName} because they requested a call from the construction.live website.`
      : `You are calling because the visitor requested a call from the construction.live website.`;

    const contextLines = [
      row.company ? `Company: ${row.company}` : null,
      row.projectName ? `Project / site: ${row.projectName}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    const systemPrompt =
      `You are a friendly daily-report assistant for construction.live, a unified field-intelligence platform for small and mid-size commercial contractors. ` +
      `${greetingLine}\n\n` +
      (contextLines ? `Context:\n${contextLines}\n\n` : "") +
      `Goal: collect a clean end-of-day report from the field. Ask one question at a time, briefly, and wait for the answer:\n` +
      `1. What work was completed today?\n` +
      `2. How many crew members were on site?\n` +
      `3. Any extras, change-order moments, or unforeseen conditions?\n` +
      `4. Any weather delays, subcontractor no-shows, or coordination issues?\n` +
      `5. Material deliveries — received, missing, or expected?\n` +
      `6. Any blockers for tomorrow?\n\n` +
      `Hints (not strict rules — let the conversation flow naturally):\n` +
      `- Be concise and respectful of their time (target under 5 minutes).\n` +
      `- Ask one question at a time and wait for the response.\n` +
      `- If they are busy, offer to call back later and end the call politely.\n` +
      `- Before goodbye, read back a brief summary so they can confirm.\n` +
      `- Construction-trained: understand terms like RFI, change order, T&M, pay app, unforeseen condition.`;

    const analysisPrompt =
      "Summarize the end-of-day report as a structured record: " +
      "work completed, crew count, extras/change-order moments, unforeseen conditions, " +
      "weather/delays, subcontractor issues, material deliveries, blockers for tomorrow. " +
      "Use clear labeled sections. If a field was not answered, write 'not provided'.";

    const assistant: Vapi.CreateAssistantDto = {
      name: "construction.live Daily Report Assistant",
      backgroundSound: "off",
      firstMessageMode: "assistant-speaks-first-with-model-generated-message",
      model: {
        provider: "groq",
        model: "openai/gpt-oss-120b",
        messages: [{ role: "system", content: systemPrompt }],
      },
      voice: {
        provider: "deepgram",
        voiceId: "asteria",
        fallbackPlan: {
          voices: [
            { provider: "11labs", voiceId: "burt" },
            { provider: "playht", voiceId: "jennifer" },
          ],
        },
      },
      maxDurationSeconds: MAX_CALL_DURATION_SECONDS,
      endCallMessage: "Thanks for the report. Have a good evening!",
      analysisPlan: {
        summaryPlan: {
          messages: [
            { role: "system", content: analysisPrompt },
            {
              role: "user",
              content:
                "Here is the transcript:\n\n{{transcript}}\n\nHere is the ended reason of the call:\n\n{{endedReason}}\n",
            },
          ],
        },
      },
      server: {
        url: `${siteUrl}/vapi/webhook`,
      },
    };

    try {
      const call = await vapi.calls.create({
        phoneNumberId,
        customer: { number: row.phone },
        assistant,
      });

      const vapiCallId = "id" in call ? call.id : call.results?.[0]?.id;
      if (!vapiCallId) {
        await ctx.runMutation(internal.callbacks.markFailed, {
          callbackId: args.callbackId,
          reason: "Vapi did not return a call ID",
        });
        return;
      }

      await ctx.runMutation(internal.callbacks.setVapiCallId, {
        callbackId: args.callbackId,
        vapiCallId,
      });
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      await ctx.runMutation(internal.callbacks.markFailed, {
        callbackId: args.callbackId,
        reason,
      });
    }
  },
});
