import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
	title: "Request Data Deletion | construction.live",
	description:
		"Ask construction.live to delete the data associated with your account, or your account and everything with it. We confirm by email and complete the deletion within 30 days.",
	alternates: {
		canonical: absoluteUrl("/data-deletion-request"),
	},
};

export default function DataDeletionRequestLayout({ children }: { children: React.ReactNode }) {
	return children;
}
