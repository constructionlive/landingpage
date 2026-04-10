import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Use Cases | construction.live — The Integrated AI Office for Construction",
	description:
		"See how construction teams use construction.live: document analysis, calculations, bid leveling, troubleshooting, and more.",
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
