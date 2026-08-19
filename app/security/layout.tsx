import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

/* page.tsx is a client component, so it can't export metadata. This layout
   carries it, the same way /pricing and /hardware do. */
export const metadata: Metadata = {
	title: "Security & Trust | construction.live",
	description:
		"Our security posture with a status on every claim: what is architecturally verifiable on self-hosted deployments, what we self-attest for the hosted platform, and which certifications are in progress.",
	alternates: {
		canonical: absoluteUrl("/security"),
	},
};

export default function SecurityLayout({ children }: { children: React.ReactNode }) {
	return children;
}
