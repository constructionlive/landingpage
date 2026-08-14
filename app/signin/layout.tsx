import type { Metadata } from "next";

/* Internal route. robots.ts disallows it too, but a disallowed URL can still
   be indexed as a bare link, and only a noindex actually keeps it out. */
export const metadata: Metadata = {
	title: "Sign In | construction.live",
	robots: { index: false, follow: false },
};

export default function SigninLayout({ children }: { children: React.ReactNode }) {
	return children;
}
