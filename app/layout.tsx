import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "construction.live — The Integrated AI Office for Construction",
	description:
		"AI-powered document analysis, engineering calculations, bid levelling, and project intelligence for construction professionals.",
	keywords: [
		"construction AI",
		"construction management",
		"bid levelling",
		"document analysis",
		"engineering calculations",
		"construction technology",
	],
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>{children}</body>
		</html>
	);
}
