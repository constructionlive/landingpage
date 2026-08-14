import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
	title: "Contact Us | construction.live",
	description:
		"Send the construction.live team a message. Questions about the product, pricing, partnerships or an account, attach a screenshot if it helps, and get a reply within one business day.",
	alternates: {
		canonical: absoluteUrl("/contact"),
	},
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
	return children;
}
