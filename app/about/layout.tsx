import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
	title: "About | construction.live: Built for Small & Mid-Size Commercial Contractors",
	description:
		"Unified field intelligence for the $2M-50M commercial GCs and sub contractors. Built by people who understand why daily logs only matter if they protect payment.",
	alternates: {
		canonical: absoluteUrl("/about"),
	},
};

export default function AboutLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
