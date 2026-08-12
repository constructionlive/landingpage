"use node";

import { v } from "convex/values";
import { Resend } from "resend";
import { action } from "./functions";

export const sendInvitationAddedEmail = action({
  args: {
    email: v.string(),
  },
  handler: async (_ctx, args) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.warn("RESEND_API_KEY is missing; skipping invitation email.");
      return { sent: false as const, reason: "missing_api_key" as const };
    }

    const resend = new Resend(resendApiKey);

    try {
      await resend.emails.send({
        from: "construction.live <invitation@construction.live>",
        to: [args.email],
        subject: "You have been added to the waitlist",
        text: "You have been added to the construction.live waitlist.",
        html: "<p>You have been added to the construction.live waitlist.</p>",
      });

      return { sent: true as const };
    } catch (error) {
      console.error("Failed to send invitation email", { email: args.email, error });
      return { sent: false as const, reason: "send_failed" as const };
    }
  },
});

const CALENDAR_URL = "https://calendar.app.google/Eb7GFYUJNLDof5oz6";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export const sendQuoteRequestEmails = action({
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
  handler: async (_ctx, args) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.warn("RESEND_API_KEY is missing; skipping quote request emails.");
      return { sent: false as const, reason: "missing_api_key" as const };
    }

    const resend = new Resend(resendApiKey);
    const notifyTo = process.env.QUOTE_NOTIFICATION_EMAIL ?? "rahul@construction.live";

    const rows: [string, string][] = [
      ["Name", args.name],
      ["Company", args.company],
      ["Email", args.email],
      ["Phone", args.phone || "not given"],
      ["Role", args.role],
      ["Kind of contractor", args.trade],
      ["Team size", args.teamSize],
      ["Website", args.website],
      ["Heard about us", args.heardAbout || "not given"],
    ];

    try {
      await resend.emails.send({
        from: "construction.live <quotes@construction.live>",
        to: [notifyTo],
        replyTo: args.email,
        subject: `Quote request: ${args.company} (${args.role})`,
        text: rows.map(([label, value]) => `${label}: ${value}`).join("\n"),
        html: `<h2>New quote request</h2><table cellpadding="6" style="border-collapse:collapse">${rows
          .map(
            ([label, value]) =>
              `<tr><td style="border:1px solid #ddd"><strong>${escapeHtml(label)}</strong></td><td style="border:1px solid #ddd">${escapeHtml(value).replace(/\n/g, "<br>")}</td></tr>`,
          )
          .join("")}</table>`,
      });
    } catch (error) {
      console.error("Failed to send quote notification", { email: args.email, error });
      return { sent: false as const, reason: "send_failed" as const };
    }

    /* Auto-reply. Keep the promise here identical to the one on the success screen. */
    try {
      await resend.emails.send({
        from: "construction.live <quotes@construction.live>",
        to: [args.email],
        replyTo: notifyTo,
        subject: "We got your quote request",
        text: `Hi ${args.name},\n\nThanks for the details. Rahul will get back to you within one business day with a quote shaped around your projects and team size.\n\nIf you would rather not wait, you can book a 15-minute call here: ${CALENDAR_URL}\n\nconstruction.live`,
        html: `<p>Hi ${escapeHtml(args.name)},</p><p>Thanks for the details. Rahul will get back to you within one business day with a quote shaped around your projects and team size.</p><p>If you would rather not wait, you can <a href="${CALENDAR_URL}">book a 15-minute call here</a>.</p><p>construction.live</p>`,
      });
    } catch (error) {
      console.error("Failed to send quote auto-reply", { email: args.email, error });
      return { sent: true as const, autoReply: false as const };
    }

    return { sent: true as const, autoReply: true as const };
  },
});
