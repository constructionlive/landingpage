import Image, { type ImageProps } from "next/image";

/* Blog cover and author images come from two places: files uploaded to Convex
   storage, and URLs an author pastes into the "Cover Image URL" box by hand.
   The pasted ones can point at any host on the internet.

   next/image refuses to render a remote host that isn't in next.config's
   remotePatterns, and it fails at request time, not at build. So an allowlist
   alone would mean any author pasting an image from a host we didn't predict
   silently breaks their post in production.

   So: hosts we know about get the optimizer (resizing, AVIF/WebP, the real
   Core Web Vitals win), and anything else falls back to `unoptimized`, which
   still gives lazy loading and reserved dimensions so the layout doesn't
   shift. Nothing 404s either way. Add a host to OPTIMIZED_HOSTS below AND to
   remotePatterns in next.config.ts to promote it out of the fallback. */
const OPTIMIZED_HOSTS = [/\.convex\.cloud$/, /\.convex\.site$/];

function isOptimizable(src: string) {
	try {
		return OPTIMIZED_HOSTS.some((pattern) => pattern.test(new URL(src).hostname));
	} catch {
		/* Relative path, or something unparseable. Relative is local and always
		   fine; unparseable would break either way. */
		return src.startsWith("/");
	}
}

export default function RemoteImage({ src, ...props }: ImageProps & { src: string }) {
	return <Image src={src} unoptimized={!isOptimizable(src)} {...props} />;
}
