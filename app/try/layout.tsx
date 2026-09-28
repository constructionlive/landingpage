import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
	title: "Try construction.live | Start with your company and email",
	description:
		"Start with construction.live. Tell us your company, confirm your email, answer three quick questions, and the founder sets up your account by hand.",
	alternates: {
		canonical: absoluteUrl("/try"),
	},
};

export default function TryLayout({ children }: { children: React.ReactNode }) {
	return children;
}
