import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Features | construction.live — Unified Field Intelligence for Contractors",
	description:
		"Voice notes, photo logs, AI outbound calls, integrations, and same-day money alerts — unified into bulletproof pay-app and change-order documentation.",
	alternates: {
		canonical: "https://www.construction.live/features",
	},
};

export default function FeaturesLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
