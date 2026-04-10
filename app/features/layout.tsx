import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Features | construction.live — The Integrated AI Office for Construction",
	description:
		"Explore construction.live features: AI document analysis, bid leveling, engineering calculations, scope gap detection, and project intelligence.",
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
