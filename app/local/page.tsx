import type { Metadata } from "next";
import LocalContent from "./local-content";
import { getRelease } from "./release";
import { absoluteUrl } from "@/lib/site";

/* Server component so the release manifest is read on the server and the
   version, size and date ship in the HTML — a download page whose version line
   arrives after hydration looks broken for the first second, and it is the one
   line a cautious buyer reads before clicking a 600 MB file.

   The interactive half (the FAQ accordion, the scroll animations) lives in
   local-content.tsx, the same split the homepage uses. */

export const metadata: Metadata = {
	title: "Local AI for construction | Free Mac app | construction.live",
	description:
		"A free Mac app that runs a construction AI model on your own machine. Read drawings, contracts and specs offline, with nothing sent to a model vendor. Apple Silicon, macOS 12+.",
	alternates: { canonical: absoluteUrl("/local") },
	openGraph: {
		title: "Construction AI that runs on your machine",
		description:
			"A free Mac app with the model already on the disk. Read a drawing set, work an estimate, ask about a contract — offline, with nothing sent to a model vendor.",
		url: absoluteUrl("/local"),
		type: "website",
	},
};

/* Ten minutes. Matches the fetch in release.ts, so a new .dmg appears on the
   site within the window without anyone deploying. */
export const revalidate = 600;

export default async function LocalPage() {
	const release = await getRelease();
	return <LocalContent release={release} />;
}
