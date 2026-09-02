/* The post fields the editorial agent may set. Shared HTTP plumbing lives in
   lib/agentApi.ts. */

/* The post fields the agent may set on create. `title` and `content` are
   required and checked by the route before this runs; the rest are optional. */
export const CREATE_FIELDS = [
	"title",
	"content",
	"slug",
	"excerpt",
	"coverImageUrl",
	"featured",
	"featuredOrder",
	"authorEmail",
	"publishedAt",
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

/* Update takes the same fields, minus `slug` (the URL locates the post) plus
   `newSlug` to rename. All are optional — a partial patch. */
export const UPDATE_FIELDS = [
	"newSlug",
	"title",
	"content",
	"excerpt",
	"coverImageUrl",
	"featured",
	"featuredOrder",
	"authorEmail",
	"publishedAt",
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
