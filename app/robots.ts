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
			/* /newsletter itself is public and in the sitemap; only the opt-out
			   path is internal. It does nothing without a token, and an indexed
			   "unsubscribe" result under our own name is a link people click by
			   mistake. It carries a noindex too — see the layout. */
			disallow: [
				"/admin",
				"/signin",
				"/blog/new",
				"/blog/*/edit",
				"/newsletter/unsubscribe",
			],
		},
		sitemap: absoluteUrl("/sitemap.xml"),
	};
}
