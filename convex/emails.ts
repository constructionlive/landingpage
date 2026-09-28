"use node";

import { v } from "convex/values";
import { Resend } from "resend";
import { action, internalAction } from "./functions";

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

/* Same bundle-boundary reasoning as CALENDAR_URL above: Convex functions bundle
   separately from the Next app, so this mirrors SITE_URL in lib/site.ts rather
   than importing it. Change one, change both. Emails carry absolute links or
   they carry broken ones. */
const SITE_ORIGIN = "https://www.construction.live";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ── Auto-reply template ────────────────────────────────────────────────
   Email clients are stuck around 2003: Outlook renders with Word, and
   several clients strip <style> blocks. So this is table layout with
   every style inlined, 600px wide, no flexbox and no external CSS.
   Brand values are the light-theme tokens from app/globals.css.

   One shell, filled in per form: the quote auto-reply and the contact
   auto-reply differ only in their copy. */

const FONT = "-apple-system,'Segoe UI',Arial,Helvetica,sans-serif";
const ORANGE = "#f97316";
const INK = "#0f172a";
const BODY_TEXT = "#475569";
const MUTED = "#94a3b8";
const BORDER = "#e2e8f0";
const SURFACE = "#f8fafc";
/* Mirrors the <h1> in components/Hero.tsx, so the email sign-off makes the
   same promise as the site. Plain enough to drop into both the HTML and the
   text part: no apostrophes, so it needs no entity escaping. Keep it that way,
   or the two parts have to diverge again. */
const HERO_LINE =
  "Drowned in project paperwork? Let our AI manage it!";

/* Source lines for the internal notification.

   Deliberately not in the customer auto-reply: the lead does not need to see
   how we tagged them, and "you came from paid_social · linkedin" reads as
   surveillance rather than service.

   Whoever picks up the reply sees the channel in the same glance as the phone
   number, which is the entire point of putting it here rather than only in a
   dashboard nobody opens before answering an email.

   "First touch" is omitted rather than guessed when the visitor never accepted
   the attribution cookie. An absent first touch is not the same fact as
   "first touch equals last touch", and printing the latter would invent data. */
function sourceRows(args: { sourceFirst?: string; sourceLast?: string }): [string, string][] {
  const rows: [string, string][] = [];
  if (args.sourceLast) rows.push(["Source (last touch)", args.sourceLast]);
  if (args.sourceFirst && args.sourceFirst !== args.sourceLast) {
    rows.push(["Source (first touch)", args.sourceFirst]);
  }
  if (rows.length === 0) rows.push(["Source", "unknown"]);
  return rows;
}

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

type ReplyEmail = {
  /* Shown in the browser tab when a client opens the mail in a window. */
  documentTitle: string;
  /* The hidden line the inbox shows next to the subject. */
  preheader: string;
  /* Small uppercase label in the top-right of the header rule. */
  eyebrow: string;
  heading: string;
  /* Body copy above the button. Already-escaped HTML fragments. */
  paragraphs: string[];
  cta?: { label: string; href: string };
  recapLabel: string;
  /* What they sent us, echoed back. An empty list drops the block entirely. */
  rows: [string, string][];
  closingNote: string;
  footerReason: string;
};

function brandedReplyHtml(email: ReplyEmail) {
  /* Padded preheader: the hidden line shown next to the subject in the inbox.
     The zero-width joiners stop clients from spilling body copy in after it. */
  const preheaderPad = "&#8202;&#847; ".repeat(25);

  const ctaBlock = email.cta
    ? `<tr>
          <td style="padding:0 36px 34px 36px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="center" bgcolor="${ORANGE}" style="border-radius:8px;">
                  <a href="${email.cta.href}" style="display:inline-block; padding:14px 28px; font-family:${FONT}; font-size:15px; font-weight:600; line-height:20px; color:#ffffff; text-decoration:none; border-radius:8px;">${email.cta.label}</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>`
    : "";

  const recapBlock = email.rows.length
    ? `<tr>
          <td style="padding:0 36px 6px 36px;">
            <p style="margin:0 0 14px 0; font-family:${FONT}; font-size:11px; font-weight:700; letter-spacing:1.1px; text-transform:uppercase; color:${MUTED};">${email.recapLabel}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:0 36px 8px 36px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:${SURFACE}; border:1px solid ${BORDER}; border-radius:10px;">${recapRows(email.rows)}</table>
          </td>
        </tr>`
    : "";

  /* The last paragraph runs into the button, so it carries the gap. Without a
     button the recap block's own padding is enough. */
  const bodyCopy = email.paragraphs
    .map((paragraph, index) => {
      const last = index === email.paragraphs.length - 1;
      const gap = last ? (email.cta ? 28 : 8) : 16;
      return `<p style="margin:0 0 ${gap}px 0; font-family:${FONT}; font-size:15px; line-height:25px; color:${BODY_TEXT};">${paragraph}</p>`;
    })
    .join("\n            ");

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="light" />
<meta name="supported-color-schemes" content="light" />
<title>${escapeHtml(email.documentTitle)}</title>
<!--[if mso]>
<style type="text/css">
  body, table, td, a { font-family: Arial, Helvetica, sans-serif !important; }
</style>
<![endif]-->
</head>
<body style="margin:0; padding:0; width:100%; background-color:#f1f5f9; -webkit-font-smoothing:antialiased;">
<div style="display:none; font-size:1px; color:#f1f5f9; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden;">${email.preheader} ${preheaderPad}</div>
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
                <td align="right" style="font-family:${FONT}; font-size:11px; font-weight:600; letter-spacing:1.1px; text-transform:uppercase; color:${MUTED};">${escapeHtml(email.eyebrow)}</td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 36px 8px 36px;">
            <p style="margin:0 0 18px 0; font-family:${FONT}; font-size:24px; line-height:32px; font-weight:700; letter-spacing:-0.4px; color:${INK};">${email.heading}</p>
            ${bodyCopy}
          </td>
        </tr>
        ${ctaBlock}
        ${recapBlock}
        <tr>
          <td style="padding:16px 36px 36px 36px;">
            <p style="margin:0; font-family:${FONT}; font-size:13px; line-height:21px; color:${MUTED};">${email.closingNote}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px 36px 28px 36px; background-color:${SURFACE}; border-top:1px solid ${BORDER};">
            <p style="margin:0 0 6px 0; font-family:${FONT}; font-size:13px; font-weight:700; color:${INK};">construction<span style="color:${ORANGE};">.live</span></p>
            <p style="margin:0 0 12px 0; font-family:${FONT}; font-size:12px; line-height:19px; color:${MUTED};">${HERO_LINE}</p>
            <p style="margin:0; font-family:${FONT}; font-size:11px; line-height:18px; color:#cbd5e1;">${email.footerReason}</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

function quoteReplyHtml(args: { firstName: string; rows: [string, string][] }) {
  return brandedReplyHtml({
    documentTitle: "We got your quote request",
    preheader:
      "We&rsquo;ll get back to you within one business day with a quote shaped around your projects and team size.",
    eyebrow: "Quote request",
    heading: `We&rsquo;ve got it, ${escapeHtml(args.firstName)}.`,
    paragraphs: [
      `Thanks for the details. We&rsquo;ll get back to you <strong style="color:${INK}; font-weight:600;">within one business day</strong> with a quote shaped around your projects and team size, not a generic price list.`,
      "If you&rsquo;d rather not wait, grab a slot now:",
    ],
    cta: { label: "Book a 15-minute call &rarr;", href: CALENDAR_URL },
    recapLabel: "What you sent us",
    rows: args.rows,
    closingNote: "Something look wrong? Just reply to this email.",
    footerReason: "You&rsquo;re getting this because you requested a quote at construction.live.",
  });
}

function contactReplyHtml(args: { firstName: string; rows: [string, string][] }) {
  return brandedReplyHtml({
    documentTitle: "We got your message",
    preheader: "Your message is with the team. We reply within one business day.",
    eyebrow: "Message received",
    heading: `Thanks, ${escapeHtml(args.firstName)}.`,
    paragraphs: [
      `Your message went straight to the team, not a ticket queue. Someone will read it and reply <strong style="color:${INK}; font-weight:600;">within one business day</strong>.`,
      "If it&rsquo;s quicker to talk it through, grab a slot now:",
    ],
    cta: { label: "Book a 15-minute call &rarr;", href: CALENDAR_URL },
    recapLabel: "What you sent us",
    rows: args.rows,
    closingNote: "Forgot something? Just reply to this email and it lands in the same thread.",
    footerReason: "You&rsquo;re getting this because you sent us a message at construction.live.",
  });
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
    /* Marketing source, already formatted by describeAttribution() in
       lib/attribution.ts. Internal notification only — see sourceRows(). */
    sourceFirst: v.optional(v.string()),
    sourceLast: v.optional(v.string()),
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
      ...sourceRows(args),
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
          .join("\n")}\n\nSomething look wrong? Just reply to this email.\n\nconstruction.live\n${HERO_LINE}`,
        html: quoteReplyHtml({ firstName, rows: recap }),
      });
    } catch (error) {
      console.error("Failed to send quote auto-reply", { email: args.email, error });
      return { sent: true as const, autoReply: false as const };
    }

    return { sent: true as const, autoReply: true as const };
  },
});

/* Internal: only convex/contact.ts schedules this, so the endpoint can't be
   used from outside to make us send mail. */
export const sendContactMessageEmails = internalAction({
  args: {
    name: v.string(),
    email: v.string(),
    company: v.optional(v.string()),
    topic: v.optional(v.string()),
    message: v.string(),
    /* See the note on sendQuoteRequestEmails. */
    sourceFirst: v.optional(v.string()),
    sourceLast: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.warn("RESEND_API_KEY is missing; skipping contact message emails.");
      return { sent: false as const, reason: "missing_api_key" as const };
    }

    const resend = new Resend(resendApiKey);
    const notifyTo = process.env.CONTACT_NOTIFICATION_EMAIL ?? "rahul@construction.live";
    const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "hello@ai.construction.live";

    /* Mirrors the form in app/contact/page.tsx. */
    const rows: [string, string][] = [
      ["Name", args.name],
      ["Email", args.email],
      ["Company", args.company || "not given"],
      ["About", args.topic || "not given"],
      ["Message", args.message],
      ...sourceRows(args),
    ];

    try {
      await resend.emails.send({
        from: `construction.live <${CONTACT_EMAIL}>`,
        to: [notifyTo],
        replyTo: args.email,
        subject: `Contact form: ${args.topic || "General"} — ${args.company || args.name}`,
        text: rows.map(([label, value]) => `${label}: ${value}`).join("\n"),
        html: `<h2>New contact message</h2><table cellpadding="6" style="border-collapse:collapse">${rows
          .map(
            ([label, value]) =>
              `<tr><td style="border:1px solid #ddd"><strong>${escapeHtml(label)}</strong></td><td style="border:1px solid #ddd">${escapeHtml(value).replace(/\n/g, "<br>")}</td></tr>`,
          )
          .join("")}</table>`,
      });
    } catch (error) {
      console.error("Failed to send contact notification", { email: args.email, error });
      return { sent: false as const, reason: "send_failed" as const };
    }

    /* Auto-reply. Keep the promise here identical to the one on the success
       screen, and echo back only what they actually filled in. */
    const firstName = args.name.split(/\s+/)[0] || args.name;
    const recap: [string, string][] = (
      [
        ["Company", args.company ?? ""],
        ["About", args.topic ?? ""],
        ["Your message", args.message],
      ] as [string, string][]
    ).filter(([, value]) => value.trim() !== "");

    try {
      await resend.emails.send({
        from: `construction.live <${CONTACT_EMAIL}>`,
        to: [args.email],
        replyTo: notifyTo,
        subject: "We got your message",
        text: `Hi ${firstName},\n\nYour message went straight to the team, not a ticket queue. Someone will read it and reply within one business day.\n\nIf it's quicker to talk it through, book a 15-minute call here: ${CALENDAR_URL}\n\nWhat you sent us\n${recap
          .map(([label, value]) => `${label}: ${value}`)
          .join("\n")}\n\nForgot something? Just reply to this email and it lands in the same thread.\n\nconstruction.live\n${HERO_LINE}`,
        html: contactReplyHtml({ firstName, rows: recap }),
      });
    } catch (error) {
      console.error("Failed to send contact auto-reply", { email: args.email, error });
      return { sent: true as const, autoReply: false as const };
    }

    return { sent: true as const, autoReply: true as const };
  },
});

/* ── Newsletter ─────────────────────────────────────────────────────────── */

/* Two opt-out URLs for the same token, and they are not interchangeable.

   The page is what a person clicks: it names the address and asks once, because
   inbox security scanners fetch every link in a message and a GET that
   unsubscribes on sight would opt people out who never clicked anything.

   The API route is what the mail provider calls. RFC 8058 one-click POSTs the
   header URL directly, so it has to be an endpoint rather than a page. */
function unsubscribePageUrl(token: string) {
  return `${SITE_ORIGIN}/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
}

function unsubscribeOneClickUrl(token: string) {
  return `${SITE_ORIGIN}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
}

function newsletterWelcomeHtml(args: { firstName?: string; unsubscribeUrl: string }) {
  const greeting = args.firstName
    ? `You&rsquo;re on the list, ${escapeHtml(args.firstName)}.`
    : "You&rsquo;re on the list.";

  return brandedReplyHtml({
    documentTitle: "You're subscribed to the construction.live newsletter",
    preheader: "One email a week on what AI actually does with project paperwork. No pitch.",
    eyebrow: "Newsletter",
    heading: greeting,
    paragraphs: [
      `About <strong style="color:${INK}; font-weight:600;">once a week</strong> you&rsquo;ll get one email: what we&rsquo;re seeing on real jobs, what AI is genuinely good at in construction paperwork, and what it still gets wrong.`,
      "No drip sequence, no sales cadence. Reply to any of them and it reaches a person.",
    ],
    cta: { label: "Read what we&rsquo;ve written &rarr;", href: `${SITE_ORIGIN}/blog` },
    recapLabel: "",
    rows: [],
    closingNote: "Wrong address, or changed your mind? Just reply and tell us.",
    /* The opt-out has to be in the mail itself, not only in a header. CASL
       wants it plainly visible and working for 60 days after the send; the
       token in the link is what makes it work without a login. */
    footerReason: `You&rsquo;re getting this because you subscribed at construction.live. <a href="${args.unsubscribeUrl}" style="color:${MUTED}; text-decoration:underline;">Unsubscribe</a> any time.`,
  });
}

/* Internal: only convex/newsletter.ts schedules this, so the endpoint can't be
   used from outside to make us send mail. */
export const sendNewsletterWelcomeEmail = internalAction({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    unsubscribeToken: v.string(),
  },
  handler: async (_ctx, args) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.warn("RESEND_API_KEY is missing; skipping newsletter welcome email.");
      return { sent: false as const, reason: "missing_api_key" as const };
    }

    const resend = new Resend(resendApiKey);
    const NEWSLETTER_EMAIL = process.env.NEWSLETTER_EMAIL ?? "newsletter@ai.construction.live";
    const replyTo = process.env.NEWSLETTER_REPLY_TO ?? "rahul@construction.live";
    const optOutUrl = unsubscribePageUrl(args.unsubscribeToken);
    const oneClickUrl = unsubscribeOneClickUrl(args.unsubscribeToken);
    const firstName = args.name?.trim().split(/\s+/)[0] || undefined;
    const greeting = firstName ? `Hi ${firstName},` : "Hi,";

    try {
      await resend.emails.send({
        from: `construction.live <${NEWSLETTER_EMAIL}>`,
        to: [args.email],
        replyTo,
        subject: "You're subscribed",
        /* One-click unsubscribe. Gmail and Yahoo require this on bulk mail, and
           without it their "unsubscribe" button reports us as spam instead. */
        headers: {
          "List-Unsubscribe": `<${oneClickUrl}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
        text: `${greeting}\n\nYou're on the list. About once a week you'll get one email: what we're seeing on real jobs, what AI is genuinely good at in construction paperwork, and what it still gets wrong.\n\nNo drip sequence, no sales cadence. Reply to any of them and it reaches a person.\n\nRead what we've written: ${SITE_ORIGIN}/blog\n\nUnsubscribe any time: ${optOutUrl}\n\nconstruction.live\n${HERO_LINE}`,
        html: newsletterWelcomeHtml({ firstName, unsubscribeUrl: optOutUrl }),
      });

      return { sent: true as const };
    } catch (error) {
      console.error("Failed to send newsletter welcome email", { email: args.email, error });
      return { sent: false as const, reason: "send_failed" as const };
    }
  },
});

/* ── Try now: the /try onboarding ───────────────────────────────────────── */

/* Four mails, and the order matters: nothing reaches the founder until the
   address has proved it can receive the first one.

   1. sendTrialVerificationEmail  — the link, plus a thin "someone started"
                                    heads-up to the founder on the first send.
   2. sendTrialAlreadyAppliedEmail — for a repeat signup we already have.
   3. sendTrialCompletionEmails   — the full founder notification and the reply.

   The verification link is the whole anti-bot argument, so its mail is kept
   plain: one sentence, one button, no marketing. A message that looks like a
   campaign is a message that lands in Promotions, and a verification link
   nobody sees is a signup we never hear about. */

function trialVerifyUrl(token: string) {
  return `${SITE_ORIGIN}/try/verify?token=${encodeURIComponent(token)}`;
}

function trialVerificationHtml(args: { firstName: string; verifyUrl: string; hours: number }) {
  return brandedReplyHtml({
    documentTitle: "Confirm your email",
    preheader: "One click and we'll ask you three quick questions. The link expires soon.",
    eyebrow: "Confirm your email",
    heading: `One click and you&rsquo;re in, ${escapeHtml(args.firstName)}.`,
    paragraphs: [
      `Confirm this address and we&rsquo;ll ask you <strong style="color:${INK}; font-weight:600;">three quick questions</strong> — about a minute — so the founder knows what to bring to the call.`,
      `This link works for the next ${args.hours} hours and can only be used by whoever opens this inbox.`,
    ],
    cta: { label: "Confirm my email &rarr;", href: args.verifyUrl },
    recapLabel: "",
    rows: [],
    closingNote:
      "Didn&rsquo;t ask for this? Ignore it — nothing happens until someone presses the button, and the link expires on its own.",
    footerReason:
      "You&rsquo;re getting this because someone entered this address at construction.live/try.",
  });
}

/* Internal: only convex/trial.ts schedules this, so the endpoint can't be used
   from outside to make us send mail. */
export const sendTrialVerificationEmail = internalAction({
  args: {
    email: v.string(),
    name: v.string(),
    token: v.string(),
    /* How long the link lasts, in hours. Passed in rather than repeated here,
       so the mail can't promise a window the mutation doesn't honour. */
    expiresInHours: v.number(),
    /* Whether to tell the founder someone has started. True on the first link
       to an address only: a "send it again" must not produce a second
       heads-up, and a repeat signup from a verified row is not news. */
    notifyFounder: v.optional(v.boolean()),
    company: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.warn("RESEND_API_KEY is missing; skipping trial verification email.");
      return { sent: false as const, reason: "missing_api_key" as const };
    }

    const resend = new Resend(resendApiKey);
    const TRIAL_EMAIL = process.env.TRIAL_EMAIL ?? "hello@ai.construction.live";
    const notifyTo = process.env.TRIAL_NOTIFICATION_EMAIL ?? "rahul@construction.live";
    const replyTo = notifyTo;
    const firstName = args.name.trim().split(/\s+/)[0] || args.name;
    const verifyUrl = trialVerifyUrl(args.token);

    /* The early heads-up. Sent first and independently of the link, so a
       bounce on the applicant's side never costs the founder the signal.

       Deliberately thin: the full picture arrives with the completion mail
       once the address is confirmed. This one exists so the founder can see a
       profile beginning in real time — and, because it goes out before any
       verification, so bot traffic is visible the moment it starts rather
       than as an empty column on the dashboard. "Not yet verified" is in the
       subject so the two kinds of mail never get confused. */
    if (args.notifyFounder) {
      const rows: [string, string][] = [
        ["Company", args.company || "not given"],
        ["Name", args.name],
        ["Email", args.email],
        ["Status", "verification link sent — not yet verified"],
      ];
      try {
        await resend.emails.send({
          from: `construction.live <${TRIAL_EMAIL}>`,
          to: [notifyTo],
          replyTo: args.email,
          subject: `Try now started: ${args.company || args.email} (not yet verified)`,
          text: `${args.name} is beginning to create a profile on construction.live.\n\n${rows
            .map(([label, value]) => `${label}: ${value}`)
            .join("\n")}\n\nYou'll get the full details once the email is confirmed and the questions are answered.`,
          html: `<h2>Someone is beginning to create a profile</h2><table cellpadding="6" style="border-collapse:collapse">${rows
            .map(
              ([label, value]) =>
                `<tr><td style="border:1px solid #ddd"><strong>${escapeHtml(label)}</strong></td><td style="border:1px solid #ddd">${escapeHtml(value)}</td></tr>`,
            )
            .join("")}</table><p style="color:#64748b">You'll get the full details once the email is confirmed and the questions are answered.</p>`,
        });
      } catch (error) {
        /* Logged and carried on: the applicant's link matters more than the
           heads-up, and the row is on the dashboard regardless. */
        console.error("Failed to send trial started notification", { email: args.email, error });
      }
    }

    try {
      await resend.emails.send({
        from: `construction.live <${TRIAL_EMAIL}>`,
        to: [args.email],
        replyTo,
        subject: "Confirm your email to finish",
        text: `Hi ${firstName},\n\nConfirm this address and we'll ask you three quick questions, about a minute, so the founder knows what to bring to the call.\n\nConfirm your email: ${verifyUrl}\n\nThis link works for the next ${args.expiresInHours} hours.\n\nDidn't ask for this? Ignore it — nothing happens until someone presses the button.\n\nconstruction.live\n${HERO_LINE}`,
        html: trialVerificationHtml({
          firstName,
          verifyUrl,
          hours: args.expiresInHours,
        }),
      });

      return { sent: true as const };
    } catch (error) {
      console.error("Failed to send trial verification email", { email: args.email, error });
      return { sent: false as const, reason: "send_failed" as const };
    }
  },
});

/* Someone who already finished, filling the form again.

   They get this instead of a second verification link, and the /try page shows
   the same "check your inbox" screen either way. That is deliberate: if the
   page said "you've already applied", the form would answer the question "is
   this address registered with you?" for anyone who typed one in. The answer
   goes to the inbox that owns the address, which is the only place it belongs. */
export const sendTrialAlreadyAppliedEmail = internalAction({
  args: {
    email: v.string(),
    name: v.string(),
  },
  handler: async (_ctx, args) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.warn("RESEND_API_KEY is missing; skipping trial repeat-signup email.");
      return { sent: false as const, reason: "missing_api_key" as const };
    }

    const resend = new Resend(resendApiKey);
    const TRIAL_EMAIL = process.env.TRIAL_EMAIL ?? "hello@ai.construction.live";
    const replyTo = process.env.TRIAL_NOTIFICATION_EMAIL ?? "rahul@construction.live";
    const firstName = args.name.trim().split(/\s+/)[0] || args.name;

    try {
      await resend.emails.send({
        from: `construction.live <${TRIAL_EMAIL}>`,
        to: [args.email],
        replyTo,
        subject: "You're already on the list",
        text: `Hi ${firstName},\n\nYou've already answered the questions and your details are with the founder. Nothing more to do — you'll hear from him directly.\n\nIf you'd rather not wait, book a 15-minute call here: ${CALENDAR_URL}\n\nReply to this email if anything has changed.\n\nconstruction.live\n${HERO_LINE}`,
        html: brandedReplyHtml({
          documentTitle: "You're already on the list",
          preheader: "Your details are already with the founder. Nothing more to do.",
          eyebrow: "Already on the list",
          heading: `You&rsquo;re already in, ${escapeHtml(firstName)}.`,
          paragraphs: [
            "You&rsquo;ve already answered the questions and your details are with the founder. Nothing more to do — you&rsquo;ll hear from him directly.",
            "If you&rsquo;d rather not wait, grab a slot now:",
          ],
          cta: { label: "Book a 15-minute call &rarr;", href: CALENDAR_URL },
          recapLabel: "",
          rows: [],
          closingNote: "Something changed since you signed up? Just reply to this email.",
          footerReason:
            "You&rsquo;re getting this because someone entered this address at construction.live/try.",
        }),
      });

      return { sent: true as const };
    } catch (error) {
      console.error("Failed to send trial repeat-signup email", { email: args.email, error });
      return { sent: false as const, reason: "send_failed" as const };
    }
  },
});

function trialCompletionReplyHtml(args: { firstName: string; rows: [string, string][] }) {
  return brandedReplyHtml({
    documentTitle: "Thanks — the founder will reach out",
    preheader:
      "Your answers are in. The founder reviews each one himself and reaches out after that.",
    eyebrow: "All done",
    heading: `That&rsquo;s everything, ${escapeHtml(args.firstName)}.`,
    paragraphs: [
      `Your answers went straight to the founder. He reads every one himself, and <strong style="color:${INK}; font-weight:600;">reaches out personally once he&rsquo;s reviewed your details</strong> — usually within one business day.`,
      "We set accounts up by hand rather than handing out logins automatically. It is slower, and it is why the people who get in get a system already pointed at the problem they told us about.",
      "If you&rsquo;d rather not wait for the email, grab a slot directly:",
    ],
    cta: { label: "Book a 15-minute call &rarr;", href: CALENDAR_URL },
    recapLabel: "What you told us",
    rows: args.rows,
    closingNote: "Got something wrong? Just reply to this email — it reaches a person.",
    footerReason: "You&rsquo;re getting this because you signed up at construction.live/try.",
  });
}

/* Internal: only convex/trial.ts schedules this, and only for a row that has
   already been verified. The founder may have had the thin heads-up at signup;
   this is the one with the answers in it, and the only one that gets a reply. */
export const sendTrialCompletionEmails = internalAction({
  args: {
    company: v.string(),
    name: v.string(),
    email: v.string(),
    biggestProblem: v.string(),
    workType: v.string(),
    teamSize: v.string(),
    notes: v.optional(v.string()),
    verifiedAt: v.optional(v.number()),
    /* See the note on sendQuoteRequestEmails. */
    sourceFirst: v.optional(v.string()),
    sourceLast: v.optional(v.string()),
  },
  handler: async (_ctx, args) => {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.warn("RESEND_API_KEY is missing; skipping trial completion emails.");
      return { sent: false as const, reason: "missing_api_key" as const };
    }

    const resend = new Resend(resendApiKey);
    const notifyTo = process.env.TRIAL_NOTIFICATION_EMAIL ?? "rahul@construction.live";
    const TRIAL_EMAIL = process.env.TRIAL_EMAIL ?? "hello@ai.construction.live";

    /* Mirrors the form in app/try/. "Email verified" is on the notification
       rather than implied, because it is the fact that separates this from
       every other lead in the inbox: the address answered a challenge. */
    const rows: [string, string][] = [
      ["Company", args.company],
      ["Name", args.name],
      ["Email", args.email],
      [
        "Email verified",
        args.verifiedAt ? `yes — ${new Date(args.verifiedAt).toISOString()}` : "yes",
      ],
      ["Biggest problem", args.biggestProblem],
      ["Kind of work", args.workType],
      ["Field team size", args.teamSize],
      ["Anything else", args.notes || "not given"],
      ...sourceRows(args),
    ];

    try {
      await resend.emails.send({
        from: `construction.live <${TRIAL_EMAIL}>`,
        to: [notifyTo],
        replyTo: args.email,
        subject: `Try now: ${args.company} — ${args.biggestProblem}`,
        text: rows.map(([label, value]) => `${label}: ${value}`).join("\n"),
        html: `<h2>New verified signup from /try</h2><table cellpadding="6" style="border-collapse:collapse">${rows
          .map(
            ([label, value]) =>
              `<tr><td style="border:1px solid #ddd"><strong>${escapeHtml(label)}</strong></td><td style="border:1px solid #ddd">${escapeHtml(value).replace(/\n/g, "<br>")}</td></tr>`,
          )
          .join("")}</table>`,
      });
    } catch (error) {
      console.error("Failed to send trial notification", { email: args.email, error });
      return { sent: false as const, reason: "send_failed" as const };
    }

    /* The reply. Keep the promise here identical to the one on the final screen
       in app/try/verify/page.tsx: the founder reaches out after reviewing. */
    const firstName = args.name.trim().split(/\s+/)[0] || args.name;
    const recap: [string, string][] = (
      [
        ["Company", args.company],
        ["Biggest problem", args.biggestProblem],
        ["Kind of work", args.workType],
        ["Field team size", args.teamSize],
        ["Anything else", args.notes ?? ""],
      ] as [string, string][]
    ).filter(([, value]) => value.trim() !== "");

    try {
      await resend.emails.send({
        from: `construction.live <${TRIAL_EMAIL}>`,
        to: [args.email],
        replyTo: notifyTo,
        subject: "Thanks — the founder will reach out",
        text: `Hi ${firstName},\n\nYour answers went straight to the founder. He reads every one himself and reaches out personally once he's reviewed your details, usually within one business day.\n\nWe set accounts up by hand rather than handing out logins automatically. It is slower, and it is why the people who get in get a system already pointed at the problem they told us about.\n\nIf you'd rather not wait, book a 15-minute call here: ${CALENDAR_URL}\n\nWhat you told us\n${recap
          .map(([label, value]) => `${label}: ${value}`)
          .join("\n")}\n\nGot something wrong? Just reply to this email.\n\nconstruction.live\n${HERO_LINE}`,
        html: trialCompletionReplyHtml({ firstName, rows: recap }),
      });
    } catch (error) {
      console.error("Failed to send trial auto-reply", { email: args.email, error });
      return { sent: true as const, autoReply: false as const };
    }

    return { sent: true as const, autoReply: true as const };
  },
});
