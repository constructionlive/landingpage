import { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { getPublishedPosts, getLandingPages } from "@/lib/convexServer";

/* Static routes. Deliberately excludes /signin, /admin, /blog/new and the post
   editors: those are internal, and robots.ts disallows them.

   `lastModified` is omitted on purpose. It used to be `new Date()` on every
   entry, which told Google all nine pages changed today on every single crawl.
   A freshness signal that is always true is one Google learns to ignore, and
   no signal is better than a false one. Blog posts below carry a real date. */
const staticRoutes: MetadataRoute.Sitemap = [
	{ url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
	{ url: absoluteUrl("/solutions"), changeFrequency: "weekly", priority: 0.9 },
	{ url: absoluteUrl("/hardware"), changeFrequency: "monthly", priority: 0.9 },
	{ url: absoluteUrl("/pricing"), changeFrequency: "monthly", priority: 0.9 },
	{ url: absoluteUrl("/book"), changeFrequency: "monthly", priority: 0.9 },
	{ url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.8 },
	{ url: absoluteUrl("/faqs"), changeFrequency: "monthly", priority: 0.8 },
	{ url: absoluteUrl("/security"), changeFrequency: "monthly", priority: 0.7 },
	{ url: absoluteUrl("/blog"), changeFrequency: "weekly", priority: 0.7 },
	{ url: absoluteUrl("/newsletter"), changeFrequency: "monthly", priority: 0.7 },
	{ url: absoluteUrl("/contact"), changeFrequency: "monthly", priority: 0.7 },
	{ url: absoluteUrl("/privacy"), changeFrequency: "yearly", priority: 0.4 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	let postRoutes: MetadataRoute.Sitemap = [];

	/* A Convex outage shouldn't take the whole sitemap down with it. Serving
	   the static routes alone beats serving a 500 that Google retries. */
	try {
		const posts = await getPublishedPosts();
		postRoutes = posts
			.filter((post) => !post.noIndex)
			/* A post that sets its own canonical is pointing somewhere else, so
			   listing our URL would contradict it. */
			.filter((post) => !post.canonicalUrl)
			.map((post) => ({
				url: absoluteUrl(`/blog/${post.slug}`),
				lastModified: new Date(post.updatedAt),
				changeFrequency: "monthly" as const,
				priority: 0.6,
			}));
	} catch (error) {
		console.error("sitemap: could not load blog posts", error);
	}

	/* Agent-authored landing pages, so a page created through the API is
	   discoverable without anyone remembering to edit this file. Same two
	   exclusions as posts: a page that opted out of indexing, and one pointing
	   its canonical elsewhere. */
	let landingRoutes: MetadataRoute.Sitemap = [];
	try {
		const pages = await getLandingPages();
		landingRoutes = pages
			.filter((page) => !page.noIndex)
			.filter((page) => !page.canonicalUrl)
			.map((page) => ({
				url: absoluteUrl(`/for/${page.slug}`),
				lastModified: new Date(page.updatedAt),
				changeFrequency: "monthly" as const,
				priority: 0.8,
			}));
	} catch (error) {
		console.error("sitemap: could not load landing pages", error);
	}

	return [...staticRoutes, ...postRoutes, ...landingRoutes];
}
