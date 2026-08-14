import type { Metadata } from "next";
import HomeContent from "./page-content";
import { SERP_TITLE, SITE_DESCRIPTION, SITE_URL } from "@/lib/site";

/* Title and description are the site-wide ones from lib/site.ts rather than a
   second copy. This page used to override the title with a different headline
   than the one the root layout put on og:title, so the search result and the
   social card sold two different products. */
export const metadata: Metadata = {
	title: SERP_TITLE,
	description: SITE_DESCRIPTION,
	alternates: {
		canonical: SITE_URL,
	},
};

export default function Home() {
	return <HomeContent />;
}
