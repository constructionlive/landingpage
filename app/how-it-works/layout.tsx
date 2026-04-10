import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "How It Works | construction.live — The Integrated AI Office for Construction",
	description:
		"See how construction.live works: upload documents, ask questions, get calculations, and generate reports. No setup required.",
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
