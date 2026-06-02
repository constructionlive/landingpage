import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Use Cases | construction.live — Unified Field Intelligence",
	description:
		"How contractors use construction.live: voice daily logs, change-order capture, T&M tracking, weather delays, subcontractor no-shows, AI outbound calls, and bulletproof pay-app backup.",
	alternates: {
		canonical: "https://www.construction.live/use-cases",
	},
};

export default function UseCasesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
