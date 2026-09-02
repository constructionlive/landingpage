/* The landing-page fields the agent may set. Shared HTTP plumbing lives in
   lib/agentApi.ts. */

/* `slug`, `headline` and `content` are required and checked by the route before
   this runs; the rest are optional. */
export const PAGE_CREATE_FIELDS = [
	"slug",
	"headline",
	"content",
	"eyebrow",
	"subheadline",
	"ctaLabel",
	"ctaHref",
	"secondaryCtaLabel",
	"secondaryCtaHref",
	"metaTitle",
	"metaDescription",
	"metaKeywords",
	"canonicalUrl",
	"noIndex",
	"ogTitle",
	"ogDescription",
	"ogImageUrl",
	"twitterCard",
	"twitterTitle",
	"twitterDescription",
	"twitterImageUrl",
] as const;

/* Update takes the same fields minus `slug` (the URL locates the page), plus
   `newSlug` to move it. All optional — a partial patch. */
export const PAGE_UPDATE_FIELDS = [
	"newSlug",
	"headline",
	"content",
	"eyebrow",
	"subheadline",
	"ctaLabel",
	"ctaHref",
	"secondaryCtaLabel",
	"secondaryCtaHref",
	"metaTitle",
	"metaDescription",
	"metaKeywords",
	"canonicalUrl",
	"noIndex",
	"ogTitle",
	"ogDescription",
	"ogImageUrl",
	"twitterCard",
	"twitterTitle",
	"twitterDescription",
	"twitterImageUrl",
] as const;
