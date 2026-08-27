import type { Metadata } from "next";

/* page.tsx is a client component, so this layout carries the metadata.

   noindex, and robots.ts disallows the path too. There is nothing here for a
   searcher: the page does nothing without a token, and an indexed "unsubscribe"
   result under our own name is a link people click by mistake. */
export const metadata: Metadata = {
	title: "Unsubscribe | construction.live",
	robots: { index: false, follow: false },
};

export default function UnsubscribeLayout({ children }: { children: React.ReactNode }) {
	return children;
}
