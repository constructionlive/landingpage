import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

/* page.tsx is a client component, so it can't export metadata. This layout
   exists only to carry it. Without it the page inherited the root layout's
   metadata, which used to include a canonical pointing at the homepage, so
   the highest-intent page on the site was telling Google it was a duplicate. */
export const metadata: Metadata = {
	title: "Pricing | construction.live",
	description:
		"Pricing for small and mid-size commercial contractors, scoped by project and team size. Tell us your role, trade and where documentation is costing you, and we'll quote the parts of the platform you'd actually use.",
	alternates: {
		canonical: absoluteUrl("/pricing"),
	},
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
	return children;
}
