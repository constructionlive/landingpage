"use client";

import { EVENTS, track } from "@/lib/analytics";
import { CALENDAR_URL } from "@/lib/site";

/* The one tracked way to link to the booking calendar.

   Exists because the URL was pasted into five separate files, each with its own
   `target="_blank" rel="noopener noreferrer"` — so a sixth copy was the natural
   way to add tracking, and changing the calendar meant finding all of them.

   Every booking link on the site must go through this. Instrumenting only the
   /book one would report a fraction of booking intent as the whole of it, and
   an undercount is worse than no number: it looks authoritative.

   What this measures is the CLICK, not the booking. Google Calendar's
   appointment scheduling never calls back, so a completed booking is invisible
   to us. Reconcile against the calendar itself, or move to a scheduler with
   webhooks (Cal.com, Calendly) if bookings ever need to be a real conversion —
   which they will, the moment paid campaigns need something to optimise for. */
export default function BookingLink({
	location,
	className,
	children,
}: {
	/** Where on the site this link sits — "hero", "pricing_success", etc. The
	    same label appears on several pages, so without this the event can't
	    tell us which placement earns its space. */
	location: string;
	className?: string;
	children: React.ReactNode;
}) {
	return (
		<a
			href={CALENDAR_URL}
			target="_blank"
			rel="noopener noreferrer"
			onClick={() => track(EVENTS.BOOKING_LINK_CLICKED, { location })}
			className={className}
		>
			{children}
		</a>
	);
}
