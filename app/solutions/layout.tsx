import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Solutions | construction.live",
	description:
		"Field capture, preconstruction and bidding, drawings and revisions, controls and finance, and the integrations that tie them to the systems you already run.",
	alternates: {
		canonical: "https://www.construction.live/solutions",
	},
};

export default function SolutionsLayout({ children }: { children: React.ReactNode }) {
	return children;
}
