import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "How It Works | construction.live: Voice to Payment in 4 Steps",
	description:
		"From 30-second field voice notes to approved pay applications: how unified field intelligence turns every signal from your jobsite into payment protection.",
	alternates: {
		canonical: "https://www.construction.live/how-it-works",
	},
};

export default function HowItWorksLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
