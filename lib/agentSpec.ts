import { absoluteUrl } from "@/lib/site";
import { CREATE_FIELDS, UPDATE_FIELDS } from "@/lib/agentBlog";
import { PAGE_CREATE_FIELDS, PAGE_UPDATE_FIELDS } from "@/lib/agentPages";

/* The machine-readable answer to "what can I do with this key?".

   Built from the same field whitelists the routes pass to pickFields, so it
   cannot describe a field the API doesn't accept, or miss one it does. That is
   the whole point: a hand-written manifest is a second copy of the contract,
   and the copy is what goes stale. Adding a field to CREATE_FIELDS puts it in
   this spec on the next request, with no second edit to remember.

   Kept as a pure function so it can be checked without standing up a server. */

const SPEC_PATH = "/api/blog/spec";

/* Fields the route itself rejects before Convex sees them. Everything else in
   the whitelist is optional, which is what `optionalFrom` below relies on. */
const POST_REQUIRED = ["title", "content"] as const;
const PAGE_REQUIRED = ["slug", "headline", "content"] as const;

function optionalFrom(all: readonly string[], required: readonly string[]) {
	return all.filter((field) => !required.includes(field));
}

export type AgentSpec = ReturnType<typeof agentSpec>;

export function agentSpec() {
	return {
		service: "construction.live agent API",
		description:
			"Everything the BLOG_AGENT_API_KEY bearer can do: write and maintain blog posts, write and maintain audience landing pages, and host images for either.",
		auth: {
			scheme: "bearer",
			header: "Authorization: Bearer <BLOG_AGENT_API_KEY>",
			note: "The same key for every endpoint listed here. It is verified inside Convex, not just at the HTTP edge, so a missing or wrong key fails at the source.",
			errors: {
				"401": "unauthorized — missing or wrong key",
				"503": "not_configured — the deployment has no key set; this is our misconfiguration, not yours",
			},
		},
		/* The prose versions, served by this same endpoint. The JSON says what
		   the fields are; the markdown says how to write a good post or page. */
		docs: {
			blog: `${absoluteUrl(SPEC_PATH)}?doc=blog`,
			landingPages: `${absoluteUrl(SPEC_PATH)}?doc=pages`,
		},
		conventions: {
			partialUpdate:
				"PUT writes only the keys present in the body. An empty string clears an optional field; omitting a key leaves it untouched.",
			slugs:
				"A live URL only moves when newSlug is passed explicitly. It is never recomputed from an edited title or headline.",
			content:
				"HTML, in the dialect the editor produces: p, h2, h3, ul/ol with li, blockquote, strong, em, a, img, hr. Start bodies at h2 — the h1 is the title or headline field.",
			errors: {
				"400": "invalid_request / missing_fields",
				"404": "not_found",
				"409": "slug_conflict — that slug is taken",
			},
		},
		resources: [
			{
				name: "blog_posts",
				summary: "Dated editorial, listed newest-first at /blog. Can be pinned to the top with `featured`.",
				publicUrl: "/blog/<slug>",
				endpoints: [
					{
						method: "GET",
						path: "/api/blog",
						purpose: "List every post: id, slug, title, excerpt, featured state, timestamps. Call this before writing, to see what exists and avoid a slug clash.",
					},
					{
						method: "POST",
						path: "/api/blog",
						purpose: "Create a post.",
						required: [...POST_REQUIRED],
						optional: optionalFrom(CREATE_FIELDS, POST_REQUIRED),
					},
					{
						method: "GET",
						path: "/api/blog/<slug>",
						purpose: "Read one post back, including its full HTML content, so an edit starts from what is actually stored.",
					},
					{
						method: "PUT",
						path: "/api/blog/<slug>",
						purpose: "Partial update. Send only what changes.",
						optional: [...UPDATE_FIELDS],
					},
					{ method: "DELETE", path: "/api/blog/<slug>", purpose: "Delete the post." },
				],
			},
			{
				name: "landing_pages",
				summary:
					"Undated audience pages at /for/<slug>, statically rendered. The hero and call-to-action are structured fields; the body is HTML.",
				publicUrl: "/for/<slug>",
				endpoints: [
					{
						method: "GET",
						path: "/api/pages",
						purpose: "List every landing page: slug, headline, noIndex, timestamps.",
					},
					{
						method: "POST",
						path: "/api/pages",
						purpose: "Create a landing page. Always set ctaLabel and ctaHref — a landing page without a call-to-action is a blog post with a bigger headline.",
						required: [...PAGE_REQUIRED],
						optional: optionalFrom(PAGE_CREATE_FIELDS, PAGE_REQUIRED),
					},
					{
						method: "GET",
						path: "/api/pages/<slug>",
						purpose: "Read one landing page back, including its HTML content.",
					},
					{
						method: "PUT",
						path: "/api/pages/<slug>",
						purpose: "Partial update. Renaming via newSlug purges the old URL as well as the new one.",
						optional: [...PAGE_UPDATE_FIELDS],
					},
					{ method: "DELETE", path: "/api/pages/<slug>", purpose: "Delete the landing page." },
				],
			},
			{
				name: "images",
				summary:
					"Hosts an image on the same Convex storage host the site already allows, and returns a URL usable in any post or page.",
				endpoints: [
					{
						method: "POST",
						path: "/api/blog/images",
						purpose:
							"Upload raw bytes, or pass a source URL to pull from. Returns { url, storageId }. Use the returned url as coverImageUrl, ogImageUrl, or in an <img> inside content.",
					},
				],
			},
			{
				name: "spec",
				summary: "This document.",
				endpoints: [
					{
						method: "GET",
						path: SPEC_PATH,
						purpose:
							"This JSON. Add ?doc=blog or ?doc=pages for the prose guide, including how to write a good post or page.",
					},
				],
			},
		],
	};
}
