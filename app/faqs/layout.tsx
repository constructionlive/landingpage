import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { faqs } from "@/components/home/faq-data";
import { absoluteUrl } from "@/lib/site";
import { breadcrumbSchema, faqPageSchema, graph } from "@/lib/schema";

export const metadata: Metadata = {
	title: "FAQs | construction.live",
	description:
		"Answers to what contractors ask on demo calls: whether crews have to learn new software, keeping your existing email workflow, Procore and Autodesk integrations, offline capture, setup time, data ownership, and who the platform is built for.",
	alternates: {
		canonical: absoluteUrl("/faqs"),
	},
};

export default function FaqsLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			{/* All eleven questions, because /faqs renders all eleven. The
			    homepage deliberately carries no FAQPage schema: it shows only
			    the first five, and Google honours this markup on one URL
			    anyway, so concentrating it here is the stronger signal. */}
			<JsonLd
				schema={graph(
					faqPageSchema(faqs),
					breadcrumbSchema([
						{ name: "Home", url: absoluteUrl("/") },
						{ name: "FAQs", url: absoluteUrl("/faqs") },
					]),
				)}
			/>
			{children}
		</>
	);
}
