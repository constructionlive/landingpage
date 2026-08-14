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
