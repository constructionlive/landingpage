import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	images: {
		/* Convex file storage, where uploaded cover and author images live.
		   Images pasted in as arbitrary URLs won't match this and are rendered
		   `unoptimized` instead. See components/RemoteImage.tsx. */
		remotePatterns: [
			{ protocol: "https", hostname: "**.convex.cloud" },
			{ protocol: "https", hostname: "**.convex.site" },
		],
	},
	/* app/api/newsletter/spec/route.ts reads this markdown file at request time.
	   A traced build only ships what it can see being imported, and a path built
	   at runtime isn't visible to that analysis — so without this the route
	   deploys fine and then 503s on every call. */
	outputFileTracingIncludes: {
		"/api/newsletter/spec": [
			"./docs/newsletter-agent-spec.md",
			"./docs/product-newsletter-optin.md",
		],
	},
	/* /solutions replaced these. A 308 keeps whatever ranking and inbound links
	   the old URLs earned, and redirects run before filesystem routing, so
	   app/features/ is now unreachable. /how-it-works and /use-cases never had
	   pages at all: they were 404ing while still listed in the sitemap. */
	async redirects() {
		return ["/features", "/how-it-works", "/use-cases"].map((source) => ({
			source,
			destination: "/solutions",
			permanent: true,
		}));
	},
};

export default nextConfig;
