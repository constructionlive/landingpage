"use client";

import { useEffect, useRef } from "react";
import { EVENTS, track } from "@/lib/analytics";

/* Renders nothing. Records one view of an agent-authored landing page.

   PostHog already captures a $pageview here, so this is not a replacement for
   it — it's the same visit tagged with the slug, so "how are the persona pages
   doing" is a breakdown on one event instead of a URL regex maintained by hand
   in every saved insight.

   The ref guard matters in development: React's strict mode mounts effects
   twice, and without it every local page view is counted as two. */
export default function LandingPageAnalytics({ slug }: { slug: string }) {
	const recorded = useRef(false);

	useEffect(() => {
		if (recorded.current) return;
		recorded.current = true;
		track(EVENTS.LANDING_PAGE_VIEWED, { slug });
	}, [slug]);

	return null;
}
