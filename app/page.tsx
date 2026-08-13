import type { Metadata } from "next";
import HomeContent from "./page-content";

export const metadata: Metadata = {
	title: "construction.live: Get Paid for What You Did. Get Covered for What You Couldn't.",
	description:
		"Agentic AI for construction. It reads every email, voice note, document revision and photo off your project, files it against the right job, links it to the drawing revision and schedule behind it, and flags the mismatches.",
	alternates: {
		canonical: "https://www.construction.live",
	},
};

export default function Home() {
	return <HomeContent />;
}
