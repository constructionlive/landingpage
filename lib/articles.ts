/* The long-form articles, in one place.

   Four things render this list — the /resources index, the /compare index, the
   "Compare with other tools" band on the homepage, and the sitemap — and when
   each of them carried its own copy of the titles they drifted within a week.
   Adding an article means adding an entry here plus the page directory; every
   listing and the sitemap pick it up.

   The pages themselves still own their metadata, because a card blurb and a
   meta description are written for different readers and should be allowed to
   differ. What must not differ is the title, the URL and the image. */

export interface ArticleCard {
	/** Site-relative, and the sitemap entry. */
	href: string;
	eyebrow: string;
	title: string;
	blurb: string;
	image: string;
	imageAlt: string;
	readingTime: string;
	/** ISO date, for the sitemap's lastModified. */
	updated: string;
}

export const RESOURCE_ARTICLES: ArticleCard[] = [
	{
		href: "/resources/8-things-construction-ai-must-do",
		eyebrow: "Why construction.live",
		title: "8 things construction AI must do",
		blurb:
			"Drawings, the field, authorization, support, extensibility, model choice, company knowledge and adoption. The eight tests a construction AI has to pass before it is worth a rollout — and what fails each one.",
		image: "/images/resources/why-hero-field-coordination.webp",
		imageAlt: "Construction team coordinating from drawings on an active jobsite",
		readingTime: "8 min read",
		updated: "2026-09-04",
	},
];

/* Comparisons get their own namespace rather than sitting in with the
   articles: each one targets a different "X vs" search, and the index is the
   page that should rank for the category. Procore, Autodesk and Bluebeam are
   the obvious next three — they go here when they are written, not before. */
export const COMPARISONS: ArticleCard[] = [
	{
		href: "/compare/copilot-vs-claude",
		eyebrow: "Copilot vs Claude",
		title: "Microsoft Copilot vs Claude for construction teams",
		blurb:
			"Two capable general assistants, measured against eleven everyday construction tasks — field capture, drawings, approvals, integrations, governance and the rollout cost nobody quotes. Including where each one genuinely wins.",
		image: "/images/resources/copilot-vs-claude-construction-hero-field.webp",
		imageAlt:
			"Two workers in hard hats reading a plan set spread across a plywood bench on an active jobsite",
		readingTime: "10 min read",
		updated: "2026-09-04",
	},
];

export const ALL_ARTICLES: ArticleCard[] = [...RESOURCE_ARTICLES, ...COMPARISONS];
