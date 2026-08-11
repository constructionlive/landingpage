import type { Metadata } from "next";
import LegacyHomeContent from "./page-content";

export const metadata: Metadata = {
	title: "construction.live: Get Paid for Every Extra. Defend Every Change Order.",
	description:
		"Unified field intelligence for contractors. Catch change orders the day they happen. Voice notes, photos, AI calls, and integrations, unified into bulletproof pay-app and change-order documentation.",
	alternates: {
		canonical: "https://www.construction.live/home",
	},
	/* Reference copy of the previous homepage, kept out of search so it doesn't
	   compete with / for the same terms. */
	robots: {
		index: false,
		follow: true,
	},
};

export default function LegacyHome() {
	return <LegacyHomeContent />;
}
