import { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			/* Internal only. These are staff routes behind auth with no search
			   value, and the editors would surface draft copy. Each one also
			   carries a noindex, since a disallowed page can still be indexed
			   as a bare URL if something links to it. */
			disallow: ["/admin", "/signin", "/blog/new", "/blog/*/edit"],
		},
		sitemap: absoluteUrl("/sitemap.xml"),
	};
}
