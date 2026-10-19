import type { Metadata } from "next";
import HaloContent from "./halo-content";
import { absoluteUrl } from "@/lib/site";

/* Halo: a side project that turns coding agents into a racing team. It keeps
   its own dark, display-type look rather than the site's, so the page brings
   its own fonts and stylesheet (see halo-content.tsx and halo.css). */

const DESCRIPTION =
	"Halo turns Claude Code, Codex and OpenCode into a racing team. Launch agents like roadsters, drive your terminal, and race every repo on its own circuit. Free and open source.";

export const metadata: Metadata = {
	title: "Halo · Make coding fun again",
	description: DESCRIPTION,
	alternates: { canonical: absoluteUrl("/halo") },
	openGraph: {
		title: "Halo · What if your AI agents were fun?",
		description: "Claude Code, Codex and OpenCode as a racing team. Open source, for Mac.",
		url: absoluteUrl("/halo"),
		type: "website",
		images: [{ url: absoluteUrl("/halo/poster.jpg") }],
	},
	twitter: {
		card: "summary_large_image",
		images: [absoluteUrl("/halo/poster.jpg")],
	},
};

export default function HaloPage() {
	return <HaloContent />;
}
