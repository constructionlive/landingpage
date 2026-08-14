/* One host, one place. Canonicals, og:url, the sitemap and robots.txt all read
   from here. They used to disagree: canonicals said www while og:url and both
   blog files said apex, which pointed every blog canonical at a different host
   than the rest of the site. Changing domains is now a one-line edit.

   No trailing slash. Everything downstream builds `${SITE_URL}/path`. */
export const SITE_URL = "https://www.construction.live";

export const SITE_NAME = "construction.live";

/* The X handle, used for twitter:site. */
// export const TWITTER_HANDLE = "@constructionlive";

/* One headline, three places. The title tag, og:title and twitter:title used
   to carry two different taglines, so the search result and the LinkedIn
   preview advertised different products.

   SERP_TITLE is kept under ~60 characters because Google truncates there.
   SOCIAL_TITLE runs the full line, where length costs nothing. */
export const SERP_TITLE = "Get Paid for What You Did | construction.live";

export const SOCIAL_TITLE =
	"construction.live: Get Paid for What You Did. Get Covered for What You Couldn't.";

export const SITE_DESCRIPTION =
	"Agentic AI for construction. It reads every email, voice note, document revision and photo off your project, files it against the right job, links it to the drawing revision and schedule behind it, and flags the mismatches.";

/** Absolute URL for a path, for canonicals and sitemap entries. */
export function absoluteUrl(path = "/") {
	if (!path || path === "/") return SITE_URL;
	return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
