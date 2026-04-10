import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "About | construction.live — The Integrated AI Office for Construction",
	description:
		"Learn about construction.live, built by people who understand construction. AI-powered document analysis, calculations, and project intelligence.",
	alternates: {
		canonical: "https://www.construction.live/about",
	},
};

export default function AboutLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
