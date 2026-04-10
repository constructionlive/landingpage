import type { Metadata } from "next";
import HomeContent from "./page-content";

export const metadata: Metadata = {
	title: "construction.live — The Integrated AI Office for Construction",
	description:
		"AI-powered document analysis, engineering calculations, bid leveling, and project intelligence for construction professionals.",
	alternates: {
		canonical: "https://www.construction.live",
	},
};

export default function Home() {
	return <HomeContent />;
}
