import type { Metadata } from "next";
import OpenContent from "./open-content";
import { getReleases } from "./releases";
import { absoluteUrl } from "@/lib/site";

/* Server component so the versions and sizes ship in the HTML. Same reasoning
   as /local: a download page whose version line arrives after hydration
   looks broken for the first second. */

export const metadata: Metadata = {
	title: "Open Construction: free, local desktop apps for contractors | construction.live",
	description:
		"Free Windows and Mac apps for takeoff, drawing checking, contract review, scheduling and documents. 100% local, on par with the commercial tools, from construction.live.",
	alternates: { canonical: absoluteUrl("/open") },
	openGraph: {
		title: "Open Construction: free desktop apps that run entirely on your machine",
		description:
			"Takeoff, drawing checking, contract review, scheduling and documents. Native apps for Windows and Mac, nothing sent anywhere, built to stand in for the commercial tools.",
		url: absoluteUrl("/open"),
		type: "website",
	},
};

/* Ten minutes, matching the manifest fetches, so a new installer appears on
   the site without a deploy. */
export const revalidate = 600;

export default async function OpenPage() {
	const releases = await getReleases();
	return <OpenContent releases={releases} />;
}
