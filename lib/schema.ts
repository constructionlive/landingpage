import { SITE_NAME, SITE_URL, absoluteUrl } from "./site";

/* Every node is given an @id so they can reference each other instead of
   repeating themselves. Google follows those references across the page. */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/* Google's Article guidance asks for a raster logo, so this is the PNG export
   of cl_logo.svg rather than the SVG itself. */
export const LOGO_URL = absoluteUrl("/logo.png");

/* construction.live is the brand; Neuratwin Inc. is the registered company.
   `legalName` is exactly that distinction, and it keeps the entity Google
   builds around the name people actually search for. */
export const organizationSchema = {
	"@type": "Organization",
	"@id": ORGANIZATION_ID,
	name: SITE_NAME,
	legalName: "Neuratwin Inc.",
	url: SITE_URL,
	logo: {
		"@type": "ImageObject",
		url: LOGO_URL,
		width: 512,
		height: 512,
	},
	description:
		"Agentic AI for construction. Unified field intelligence that turns emails, voice notes, photos and drawing revisions into change-order and pay-app documentation.",
	address: {
		"@type": "PostalAddress",
		addressLocality: "Toronto",
		addressCountry: "CA",
	},
	sameAs: ["https://x.com/constructionlive"],
};

export const websiteSchema = {
	"@type": "WebSite",
	"@id": WEBSITE_ID,
	name: SITE_NAME,
	url: SITE_URL,
	publisher: { "@id": ORGANIZATION_ID },
};

/* No `offers` and no `aggregateRating` on purpose. Pricing is quoted on a call
   rather than published, and there are no customers to aggregate a rating
   from. Inventing either is a structured-data manual action waiting to
   happen. Add them when there is something real to point at. */
export const softwareApplicationSchema = {
	"@type": "SoftwareApplication",
	name: SITE_NAME,
	url: SITE_URL,
	applicationCategory: "BusinessApplication",
	applicationSubCategory: "Construction Management Software",
	operatingSystem: "Web, iOS, Android",
	publisher: { "@id": ORGANIZATION_ID },
	description:
		"Captures field records from voice notes, photos, email and AI calls, files them against the right job, links them to the drawing revision and schedule behind them, and flags the mismatches.",
};

/** Wraps nodes in the single @graph Google prefers over several loose scripts. */
export function graph(...nodes: object[]) {
	return { "@context": "https://schema.org", "@graph": nodes };
}

/** Google requires these answers to match what the page visibly renders. */
export function faqPageSchema(faqs: { q: string; a: string }[]) {
	return {
		"@type": "FAQPage",
		mainEntity: faqs.map((faq) => ({
			"@type": "Question",
			name: faq.q,
			acceptedAnswer: { "@type": "Answer", text: faq.a },
		})),
	};
}

export function breadcrumbSchema(trail: { name: string; url: string }[]) {
	return {
		"@type": "BreadcrumbList",
		itemListElement: trail.map((crumb, i) => ({
			"@type": "ListItem",
			position: i + 1,
			name: crumb.name,
			item: crumb.url,
		})),
	};
}
