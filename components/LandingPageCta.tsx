"use client";

import Link from "next/link";
import { EVENTS, track } from "@/lib/analytics";

/* The call-to-action on a landing page, wrapped so the click is recorded.

   A landing page whose conversions aren't measured is a page nobody can tell
   you to keep or kill, and these are written by an agent that can produce them
   faster than anyone will read them — so the click has to be instrumented by
   the template, not left to whoever writes the copy.

   `location` is `landing_<slug>` and carries which of the two buttons it was,
   because "the CTA converts at 4%" is a different decision from "the primary
   converts at 4% and nobody touches the secondary".

   External hrefs get a real <a> with the usual rel; internal ones go through
   next/link so the click doesn't cost a full page load. */
export default function LandingPageCta({
	slug,
	href,
	variant,
	className,
	children,
}: {
	slug: string;
	href: string;
	variant: "primary" | "secondary";
	className?: string;
	children: React.ReactNode;
}) {
	const record = () =>
		track(EVENTS.CTA_CLICKED, { location: `landing_${slug}`, variant, href });

	const external = /^https?:\/\//i.test(href);
	if (external) {
		return (
			<a
				href={href}
				target="_blank"
				rel="noopener noreferrer"
				onClick={record}
				className={className}
			>
				{children}
			</a>
		);
	}

	return (
		<Link href={href} onClick={record} className={className}>
			{children}
		</Link>
	);
}
