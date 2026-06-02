import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { auth } from "./auth";

const http = httpRouter();

auth.addHttpRoutes(http);

/* ─── Vapi voice-call webhook ───────────────────────────────────────
 *
 * Vapi POSTs status updates and the final end-of-call report here.
 * We always return 200 (even on parse errors) so Vapi doesn't retry-loop.
 * Persistence happens via internal mutations keyed on vapiCallId.
 *
 * Webhook URL:  ${CONVEX_SITE_URL}/vapi/webhook
 * ─────────────────────────────────────────────────────────────────── */
http.route({
  path: "/vapi/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const message = body?.message;
      const messageType = message?.type;

      if (messageType === "end-of-call-report") {
        const call = message?.call || {};
        const vapiCallId: string | undefined = call.id || body?.call?.id;
        if (!vapiCallId) {
          return new Response(null, { status: 200 });
        }

        const transcript: string =
          message.artifact?.transcript || message.transcript || "";
        const summary: string =
          message.analysis?.summary || call.analysis?.summary || "";
        const recordingUrl: string | undefined =
          message.artifact?.recordingUrl || call.artifact?.recordingUrl;

        let durationSeconds: number | undefined;
        if (call.startedAt && call.endedAt) {
          const start = new Date(call.startedAt).getTime();
          const end = new Date(call.endedAt).getTime();
          if (!isNaN(start) && !isNaN(end)) {
            durationSeconds = Math.round((end - start) / 1000);
          }
        }

        let costCents: number | undefined;
        const costVal = call.cost ?? call.costBreakdown?.total;
        if (typeof costVal === "number" && costVal > 0) {
          costCents = Math.round(costVal * 100);
        }

        await ctx.runMutation(internal.callbacks.completeCallByVapiCallId, {
          vapiCallId,
          status: call.status || "ended",
          transcript: transcript || undefined,
          summary: summary || undefined,
          durationSeconds,
          recordingUrl: recordingUrl || undefined,
          costCents,
        });
      } else if (messageType === "status-update") {
        const call = message?.call || {};
        const vapiCallId: string | undefined = call.id;
        const status: string | undefined = call.status;
        if (vapiCallId && status) {
          await ctx.runMutation(internal.callbacks.updateStatusByVapiCallId, {
            vapiCallId,
            status,
          });
        }
      }
    } catch (err) {
      console.error("Vapi webhook parse error:", err);
    }

    return new Response(null, { status: 200 });
  }),
});

export default http;
