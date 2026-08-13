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
    const invitationEmail = process.env.INVITATION_EMAIL ?? "invitation@ai.construction.live";

    try {
      await resend.emails.send({
        from: `construction.live <${invitationEmail}>`,
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

/* ── Quote auto-reply template ──────────────────────────────────────────
   Email clients are stuck around 2003: Outlook renders with Word, and
   several clients strip <style> blocks. So this is table layout with
   every style inlined, 600px wide, no flexbox and no external CSS.
   Brand values are the light-theme tokens from app/globals.css. */

const FONT = "-apple-system,'Segoe UI',Arial,Helvetica,sans-serif";
const ORANGE = "#f97316";
const INK = "#0f172a";
const BODY_TEXT = "#475569";
const MUTED = "#94a3b8";
const BORDER = "#e2e8f0";
const SURFACE = "#f8fafc";
const HERO_LINE =
  "Failing to get on top of a project&rsquo;s paper work? Save yourself with our AI project management!";

function recapRows(rows: [string, string][]) {
  return rows
    .map(([label, value], index) => {
      const edge = index === rows.length - 1 ? "" : `border-bottom:1px solid ${BORDER};`;
      /* Free-text answers can be multi-line, and a table cell collapses \n. */
      const body = escapeHtml(value).replace(/\n/g, "<br />");
      return `<tr><td style="padding:16px 20px; font-family:${FONT}; font-size:13px; line-height:20px; color:#64748b; width:170px; ${edge}">${escapeHtml(label)}</td><td style="padding:16px 20px; font-family:${FONT}; font-size:14px; line-height:20px; font-weight:600; color:${INK}; ${edge}">${body}</td></tr>`;
    })
    .join("");
}

function quoteReplyHtml(args: {
  firstName: string;
  rows: [string, string][];
}) {
  /* Padded preheader: the hidden line shown next to the subject in the inbox.
     The zero-width joiners stop clients from spilling body copy in after it. */
  const preheaderPad = "&#8202;&#847; ".repeat(25);

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>We got your quote request</title>
<!--[if mso]>
<style type="text/css">
  body, table, td, a { font-family: Arial, Helvetica, sans-serif !important; }
</style>
<![endif]-->
</head>
<body style="margin:0; padding:0; width:100%; background-color:#f1f5f9; -webkit-font-smoothing:antialiased;">
<div style="display:none; font-size:1px; color:#f1f5f9; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden;">We&rsquo;ll get back to you within one business day with a quote shaped around your projects and team size. ${preheaderPad}</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#f1f5f9;">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="width:600px; max-width:600px; background-color:#ffffff; border:1px solid ${BORDER}; border-radius:14px; overflow:hidden;">
        <tr><td style="height:4px; line-height:4px; font-size:0; background-color:${ORANGE};">&nbsp;</td></tr>
        <tr>
          <td style="padding:26px 36px 22px 36px; border-bottom:1px solid ${BORDER};">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td align="left" style="font-family:${FONT}; font-size:17px; font-weight:700; letter-spacing:-0.3px; color:${INK};">construction<span style="color:${ORANGE};">.live</span></td>
                <td align="right" style="font-family:${FONT}; font-size:11px; font-weight:600; letter-spacing:1.1px; text-transform:uppercase; color:${MUTED};">Quote request</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 36px 8px 36px;">
            <p style="margin:0 0 18px 0; font-family:${FONT}; font-size:24px; line-height:32px; font-weight:700; letter-spacing:-0.4px; color:${INK};">We&rsquo;ve got it, ${escapeHtml(args.firstName)}.</p>
            <p style="margin:0 0 16px 0; font-family:${FONT}; font-size:15px; line-height:25px; color:${BODY_TEXT};">Thanks for the details. We&rsquo;ll get back to you <strong style="color:${INK}; font-weight:600;">within one business day</strong> with a quote shaped around your projects and team size, not a generic price list.</p>
            <p style="margin:0 0 28px 0; font-family:${FONT}; font-size:15px; line-height:25px; color:${BODY_TEXT};">If you&rsquo;d rather not wait, grab a slot now:</p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 36px 34px 36px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" bgcolor="${ORANGE}" style="border-radius:8px;">
                  <a href="${CALENDAR_URL}" style="display:inline-block; padding:14px 28px; font-family:${FONT}; font-size:15px; font-weight:600; line-height:20px; color:#ffffff; text-decoration:none; border-radius:8px;">Book a 15-minute call &rarr;</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:0 36px 6px 36px;">
            <p style="margin:0 0 14px 0; font-family:${FONT}; font-size:11px; font-weight:700; letter-spacing:1.1px; text-transform:uppercase; color:${MUTED};">What you sent us</p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 36px 8px 36px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${SURFACE}; border:1px solid ${BORDER}; border-radius:10px;">${recapRows(args.rows)}</table>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 36px 36px 36px;">
            <p style="margin:0; font-family:${FONT}; font-size:13px; line-height:21px; color:${MUTED};">Something look wrong? Just reply to this email.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 36px 28px 36px; background-color:${SURFACE}; border-top:1px solid ${BORDER};">
            <p style="margin:0 0 6px 0; font-family:${FONT}; font-size:13px; font-weight:700; color:${INK};">construction<span style="color:${ORANGE};">.live</span></p>
            <p style="margin:0 0 12px 0; font-family:${FONT}; font-size:12px; line-height:19px; color:${MUTED};">${HERO_LINE}</p>
            <p style="margin:0; font-family:${FONT}; font-size:11px; line-height:18px; color:#cbd5e1;">You&rsquo;re getting this because you requested a quote at construction.live.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

export const sendQuoteRequestEmails = action({
  args: {
    role: v.string(),
    trade: v.string(),
    teamSize: v.string(),
    website: v.string(),
    painPoint: v.optional(v.string()),
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

    /* Mirrors the pricing form in app/pricing/page.tsx. Add a question there
       and it has to be added here too, in both this table and the `recap`
       below, or the answer never reaches anyone. */
    const rows: [string, string][] = [
      ["Name", args.name],
      ["Company", args.company],
      ["Email", args.email],
      ["Phone", args.phone || "not given"],
      ["Role", args.role],
      ["Kind of work", args.trade],
      ["Field team size", args.teamSize],
      ["Website", args.website],
      ["What they want to fix", args.painPoint || "not given"],
      ["Heard about us", args.heardAbout || "not given"],
    ];
    const QUOTE_EMAIL = process.env.QUOTE_EMAIL ?? "quotes@ai.construction.live";

    try {
      await resend.emails.send({
        from: `construction.live <${QUOTE_EMAIL}>`,
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

    /* Auto-reply. Keep the promise here identical to the one on the success screen.
       The recap only shows what they actually filled in, so a blank website or
       trade never renders as an empty row. */
    const firstName = args.name.split(/\s+/)[0] || args.name;
    const recap: [string, string][] = (
      [
        ["Company", args.company],
        ["Role", args.role],
        ["Kind of work", args.trade],
        ["Field team size", args.teamSize],
        ["Website", args.website],
        ["What you want to fix", args.painPoint ?? ""],
      ] as [string, string][]
    ).filter(([, value]) => value.trim() !== "");

    try {
      await resend.emails.send({
        from: `construction.live <${QUOTE_EMAIL}>`,
        to: [args.email],
        replyTo: notifyTo,
        subject: "We got your quote request",
        text: `Hi ${firstName},\n\nThanks for the details. We'll get back to you within one business day with a quote shaped around your projects and team size, not a generic price list.\n\nIf you'd rather not wait, book a 15-minute call here: ${CALENDAR_URL}\n\nWhat you sent us\n${recap
          .map(([label, value]) => `${label}: ${value}`)
          .join("\n")}\n\nSomething look wrong? Just reply to this email.\n\nconstruction.live\nFailing to get on top of a project's paper work? Save yourself with our AI project management!`,
        html: quoteReplyHtml({ firstName, rows: recap }),
      });
    } catch (error) {
      console.error("Failed to send quote auto-reply", { email: args.email, error });
      return { sent: true as const, autoReply: false as const };
    }

    return { sent: true as const, autoReply: true as const };
  },
});
