import type { Metadata } from "next";
import ConvexClientProvider from "./convex-client-provider";
import "./globals.css";

export const metadata: Metadata = {
	title: "construction.live: Get Paid for Every Extra. Defend Every Change Order.",
	description:
		"Unified field intelligence for contractors. Catch change orders the day they happen. Voice notes, photos, AI calls, and integrations, unified into bulletproof pay-app and change-order documentation.",
	keywords: [
		"unified field intelligence",
		"change order documentation",
		"pay application backup",
		"daily field reports",
		"construction T&M tracking",
		"jobsite documentation",
		"construction payment protection",
	],
	alternates: {
		canonical: "https://www.construction.live",
	},
	openGraph: {
		title: "construction.live: Get Paid for Every Extra. Defend Every Change Order.",
		description:
			"Unified field intelligence for contractors. Catch change orders the day they happen. Voice notes, photos, AI calls, and integrations - unified into bulletproof pay-app and change-order documentation.",
		type: "website",
		url: "https://construction.live",
		siteName: "construction.live",
	},
	twitter: {
		card: "summary_large_image",
		title: "construction.live: Get Paid for Every Extra. Defend Every Change Order.",
		description:
			"Unified field intelligence for contractors. Catch change orders the day they happen. Voice notes, photos, AI calls, and integrations - unified into bulletproof pay-app and change-order documentation.",
		site: "@constructionlive",
	},
	robots: {
		index: true,
		follow: true,
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ConvexClientProvider>{children}</ConvexClientProvider>
			</body>
		</html>
	);
}
