import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "About | construction.live: Built for Small & Mid-Size Commercial Contractors",
	description:
		"Unified field intelligence for the $2-50M commercial GC and sub contractors. Built by people who understand why daily logs only matter if they protect payment.",
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
