import type { Metadata } from "next";
import ConvexClientProvider from "./convex-client-provider";
import CookieConsent from "@/components/CookieConsent";
import NewsletterPrompt from "@/components/NewsletterPrompt";
import AttributionTracker from "@/components/AttributionTracker";
import JsonLd from "@/components/JsonLd";
import {
	SERP_TITLE,
	SITE_DESCRIPTION,
	SITE_NAME,
	SITE_URL,
	SOCIAL_TITLE,
} from "@/lib/site";
import {
	graph,
	organizationSchema,
	softwareApplicationSchema,
	websiteSchema,
} from "@/lib/schema";
import "./globals.css";

/* Deliberately no `alternates.canonical` here. Next inherits metadata down the
   tree, so a canonical on the root layout made every page that didn't set its
   own declare itself a duplicate of the homepage. Each page owns its canonical
   now; a page with none emits none, which is safe. Don't add one back. */
export const metadata: Metadata = {
	/* Resolves the relative og:image that app/opengraph-image.tsx produces. */
	metadataBase: new URL(SITE_URL),
	/* Search results truncate around 60 characters, so the SERP title is the
	   short form. The full headline still runs on the social card, where the
	   length isn't penalised. One headline everywhere: the title, og:title and
	   twitter:title used to disagree with each other. */
	title: SERP_TITLE,
	description: SITE_DESCRIPTION,
	/* No `keywords`. Google has ignored the meta keywords tag for years, and
	   the list here had drifted to terms the live copy no longer uses. Target
	   terms belong in the visible headings and body copy. */
	openGraph: {
		title: SOCIAL_TITLE,
		description: SITE_DESCRIPTION,
		type: "website",
		url: SITE_URL,
		siteName: SITE_NAME,
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
				{/* Site-wide entity graph. Page-level schema (FAQPage, Article,
				    BreadcrumbList) is emitted by the pages themselves and
				    references these nodes by @id. */}
				<JsonLd
					schema={graph(
						organizationSchema,
						websiteSchema,
						softwareApplicationSchema,
					)}
				/>
				{/* Renders nothing. Records the marketing source of each visit,
				    for visitors who have allowed it. */}
				<AttributionTracker />
				<ConvexClientProvider>{children}</ConvexClientProvider>
				{/* Renders nothing unless the visitor is in the EEA/UK and hasn't
				    answered yet, or reopens it from the footer. */}
				<CookieConsent />
				{/* Renders nothing for 90 seconds, and then only if they have
				    scrolled, haven't subscribed, haven't dismissed it in the last
				    month, and aren't looking at the consent banner. */}
				<NewsletterPrompt />
			</body>
		</html>
	);
}
