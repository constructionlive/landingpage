import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
	title: "Book a 15-Minute Demo | construction.live",
	description:
		"Book a 15-minute call with the construction.live team. We'll ask about your current pain points, disputed pay apps, lost change orders, T&M pushback and show you exactly how we'd protect those margins.",
	alternates: {
		canonical: absoluteUrl("/book"),
	},
};

export default function BookLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return children;
}
