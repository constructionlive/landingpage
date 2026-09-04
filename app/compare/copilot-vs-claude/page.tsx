import type { Metadata } from "next";
import ArticleShell from "@/components/ArticleShell";
import { demoHref } from "@components/home/nav-data";
import { absoluteUrl } from "@/lib/site";
import { ARTICLE_BODY } from "./content";

const SLUG = "/compare/copilot-vs-claude";

const TITLE = "Microsoft Copilot vs Claude: which AI assistant fits your construction team?";

const DESCRIPTION =
	"A buyer's comparison of Microsoft 365 Copilot and Claude for Work across eleven construction tasks — field capture, drawings, approvals, integrations, governance and total rollout cost.";

const HERO = "/images/resources/copilot-vs-claude-construction-hero-field.webp";

export const metadata: Metadata = {
	/* Kept close to the query someone actually types. The h1 runs longer. */
	title: "Microsoft Copilot vs Claude for construction teams | construction.live",
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

export default function CopilotVsClaudePage() {
	return (
		<ArticleShell
			slug={SLUG}
			eyebrow="Copilot vs Claude"
			section={{ label: "Compare", href: "/compare" }}
			title={TITLE}
			intro="Microsoft 365 Copilot and Anthropic Claude are both capable general AI assistants, and they solve different problems well. The right choice depends less on benchmark scores than on where your project information lives, how your team works, and what has to happen after the AI produces an answer."
			verdict="The short answer: choose Copilot for deep Microsoft 365 continuity. Choose Claude for focused reasoning, document analysis and flexible workspaces. Choose a construction platform when field workers must capture daily reality through a mobile app, turn it into shared project knowledge, and carry the workflow into drawings, authorization and project controls."
			description={DESCRIPTION}
			hero={{
				src: HERO,
				alt: "Two workers in hard hats reading a plan set spread across a plywood bench on an active jobsite",
				caption:
					"Copilot and Claude can both help construction teams. Their strengths begin in different places — and neither of them begins here.",
				width: 1680,
				height: 945,
			}}
			body={ARTICLE_BODY}
			cta={{
				heading: "General AI can assist the work. Construction AI should carry the workflow.",
				body: "construction.live connects a mobile field app for daily reporting and inspections with a shared project wiki, drawings, specialist workbenches, project integrations and layered authorization.",
				label: "Compare the tools on one of your workflows",
				href: demoHref,
			}}
			related={{
				eyebrow: "Why construction.live",
				title: "8 things construction AI must do",
				blurb:
					"The checklist behind this comparison: drawings, the field, authorization, support, extensibility, model choice, company knowledge and adoption.",
				href: "/resources/8-things-construction-ai-must-do",
			}}
			datePublished="2026-09-04"
			dateModified="2026-09-04"
		/>
	);
}
