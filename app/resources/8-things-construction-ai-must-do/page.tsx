import type { Metadata } from "next";
import ArticleShell from "@/components/ArticleShell";
import { demoHref } from "@components/home/nav-data";
import { absoluteUrl } from "@/lib/site";
import { ARTICLE_BODY } from "./content";

const SLUG = "/resources/8-things-construction-ai-must-do";

const TITLE = "8 things construction AI must do";

const DESCRIPTION =
	"Drawings, the field, authorization, support, extensibility, model choice, company knowledge and adoption — the eight things that separate construction AI from a chat box.";

const HERO = "/images/resources/why-hero-field-coordination.webp";

export const metadata: Metadata = {
	title: `${TITLE} | construction.live`,
	description: DESCRIPTION,
	alternates: { canonical: absoluteUrl(SLUG) },
	openGraph: {
		title: TITLE,
		description: DESCRIPTION,
		type: "article",
		url: absoluteUrl(SLUG),
		images: [{ url: absoluteUrl(HERO), alt: TITLE }],
	},
	twitter: {
		card: "summary_large_image",
		title: TITLE,
		description: DESCRIPTION,
		images: [absoluteUrl(HERO)],
	},
};

export default function EightThingsPage() {
	return (
		<ArticleShell
			slug={SLUG}
			eyebrow="Why construction.live"
			section={{ label: "Resources", href: "/resources" }}
			title={TITLE}
			standfirst="From drawings to fieldwork to approvals — what separates real construction AI from a chat box."
			intro="Construction teams need more than a chat box. They need AI that can work with drawings, field reports, project systems and company knowledge — and that supports the people doing the work on site."
			description={DESCRIPTION}
			hero={{
				src: HERO,
				alt: "Construction team coordinating from drawings on an active jobsite",
				caption:
					"Construction intelligence begins where the work happens: crews coordinating from current drawings and field conditions.",
				width: 1680,
				height: 945,
			}}
			body={ARTICLE_BODY}
			cta={{
				heading: "Choose the platform that is built around your work",
				body: "Copilot and Claude can be useful tools. construction.live is the stronger choice when you want AI to understand construction, connect the field and the office, adapt to your company, and improve with your people.",
				label: "See it on one of your real workflows",
				href: demoHref,
			}}
			related={{
				eyebrow: "Compare with other tools",
				title: "Microsoft Copilot vs Claude for construction teams",
				blurb:
					"Two capable general assistants, measured against eleven everyday construction tasks — and what neither of them does once the draft exists.",
				href: "/compare/copilot-vs-claude",
			}}
			datePublished="2026-09-04"
			dateModified="2026-09-04"
		/>
	);
}
