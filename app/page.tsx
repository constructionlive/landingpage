import type { Metadata } from "next";
import HomeContent from "./page-content";

export const metadata: Metadata = {
	title: "construction.live — Get Paid for Every Extra. Defend Every Change Order.",
	description:
		"Unified field intelligence for contractors. Catch change orders the day they happen. Voice notes, photos, AI calls, and integrations — unified into bulletproof pay-app and change-order documentation.",
	alternates: {
		canonical: "https://www.construction.live",
	},
};

export default function Home() {
	return <HomeContent />;
}
