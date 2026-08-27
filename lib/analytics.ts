"use client";

import posthog from "posthog-js";

/* Every event name in one place.

   Not ceremony: the alternative is string literals typed by hand at each call
   site, which is reliably how one conversion ends up recorded as
   `quote_submitted`, `quoteSubmitted` and `submit_quote` in the same project,
   splitting a single funnel across three charts that each look like a failure.

   Adding an event means adding it here first. The union type below then makes
   an unlisted name a compile error rather than a silently-dropped event that
   nobody notices until someone asks for a report. */
export const EVENTS = {
	/* Any primary call-to-action. Always carries a `location`, because the same
	   label appears in the hero, the nav and the footer, and "CTA clicked: 400"
	   with no location is a number nobody can act on. */
	CTA_CLICKED: "cta_clicked",

	/* The two-step quote form in app/pricing/page.tsx. The step boundary is the
	   interesting part: step 0 asks what you run, step 1 asks who you are, and
	   those fail for completely different reasons. */
	QUOTE_STARTED: "quote_started",
	QUOTE_STEP_COMPLETED: "quote_step_completed",
	QUOTE_SUBMITTED: "quote_submitted",
	QUOTE_FAILED: "quote_failed",

	CONTACT_SUBMITTED: "contact_submitted",
	CONTACT_FAILED: "contact_failed",

	/* The newsletter register. Always carries a `location`, for the same reason
	   CTA_CLICKED does: the form appears in the footer of every page and again
	   on /newsletter, and one number covering both can't tell you whether the
	   LinkedIn link is working.

	   `already` is reported as its own event rather than as a subscribe. Someone
	   re-submitting an address that is already on the list is not a new
	   subscriber, and counting it as one inflates the only number here that
	   anyone makes decisions on. */
	NEWSLETTER_SUBSCRIBED: "newsletter_subscribed",
	NEWSLETTER_ALREADY_SUBSCRIBED: "newsletter_already_subscribed",
	NEWSLETTER_FAILED: "newsletter_failed",
	NEWSLETTER_UNSUBSCRIBED: "newsletter_unsubscribed",

	/* Named for what it is. The booking itself happens on Google Calendar,
	   which never calls back, so this is the click and not the booking. Calling
	   it `demo_booked` would put a number in a dashboard that quietly means
	   something else. */
	BOOKING_LINK_CLICKED: "booking_link_clicked",

	BLOG_POST_VIEWED: "blog_post_viewed",
	BLOG_SCROLL_DEPTH: "blog_scroll_depth",

	OUTBOUND_LINK_CLICKED: "outbound_link_clicked",
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

type Props = Record<string, unknown>;

/** Sends an event, or does nothing at all if it can't.

    Never throws. These calls live inside click handlers and submit handlers, so
    a missing PostHog token must not be able to take a button down with it —
    the same `__loaded` guard components/CookieConsent.tsx already relies on.

    No consent check here on purpose: posthog-js is initialised opted-out for
    EEA/UK visitors (see instrumentation-client.ts), so capture() is already a
    no-op for anyone who hasn't accepted. Re-checking here would be a second
    source of truth that could drift from the first. */
export function track(event: EventName, props?: Props) {
	if (typeof window === "undefined") return;
	try {
		if (!posthog.__loaded) return;
		posthog.capture(event, props);
	} catch (error) {
		/* Analytics is never worth a broken form. */
		console.warn("analytics: capture failed", { event, error });
	}
}

/** Convenience for the CTA case, so `location` can't be forgotten. */
export function trackCta(location: string, label: string, destination?: string) {
	track(EVENTS.CTA_CLICKED, { location, label, destination });
}
