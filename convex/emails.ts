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
