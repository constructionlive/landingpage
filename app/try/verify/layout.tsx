import type { Metadata } from "next";

/* page.tsx is a client component, so this layout carries the metadata.

   noindex, and robots.ts disallows the path too. The page does nothing without
   a token, and an indexed "confirm your email" result is a link people click
   by mistake. */
export const metadata: Metadata = {
	title: "Confirm your email | construction.live",
	robots: { index: false, follow: false },
};

export default function TryVerifyLayout({ children }: { children: React.ReactNode }) {
	return children;
}
