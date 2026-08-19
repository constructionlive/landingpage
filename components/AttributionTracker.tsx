"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { recordVisit } from "@/lib/attribution";

/* Records each page as a marketing touch, for visitors who allow it.

   Mounted once in the root layout. Renders nothing.

   `has_opted_in_capturing()` is the right gate and not an approximation of one:
   posthog-js resolves it to "not opted out", which is true for an undecided
   visitor outside the EEA (who we may track) and false for an undecided one
   inside it (who we may not). Tier B storage therefore rides on exactly the
   same permission as PostHog capture itself, which is also the same legal
   basis — so the two can't drift apart into a state where we're storing a
   marketing cookie for someone we aren't allowed to track.

   Deliberately does not use useSearchParams(): reading it opts the whole tree
   out of static rendering in Next 15, which this SEO-driven site can't afford
   (lib/consent.ts carries the same warning about reading headers in a layout).
   window.location is read inside the effect instead, where it costs nothing. */
export default function AttributionTracker() {
	const pathname = usePathname();

	useEffect(() => {
		if (!posthog.__loaded) return;
		recordVisit(posthog.has_opted_in_capturing());
	}, [pathname]);

	return null;
}
