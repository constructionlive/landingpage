import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
	title: "Solutions | construction.live",
	description:
		"Field capture, preconstruction and bidding, drawings and revisions, controls and finance, and the integrations that tie them to the systems you already run.",
	alternates: {
		canonical: absoluteUrl("/solutions"),
	},
};

export default function SolutionsLayout({ children }: { children: React.ReactNode }) {
	return children;
}
