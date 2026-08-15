/**
 * The construction.live CL mark: a disc with the C stem and L foot cut into
 * it, plus a dot whose diameter matches the stroke weight.
 *
 * Draws in `currentColor`, so callers set the colour with a text class
 * (`text-do-orange` on the site). Background-free by design — the white
 * circle treatment lives only in the favicon assets (app/icon.svg,
 * app/apple-icon.svg), which are static files and repeat these shapes.
 *
 * The cut-outs are transparent, so on a light surface the mark reads the same
 * as public/cl_logo.svg. Keep the geometry here, in the two icon files, in
 * public/cl_logo.svg and in app/opengraph-image.tsx in sync.
 */

const DISC =
	"M300,65.8 L300,190 A50,50 0 0,0 350,240 L474.2,240 A140,140 0 1,1 300,65.8 Z";

/* The dot, as a path rather than <circle> so app/opengraph-image.tsx can
   reuse the exact same markup under satori. */
const DOT = "M331,159 A50,50 0 1,1 431,159 A50,50 0 1,1 331,159 Z";

export default function BrandMark({
	className = "h-8 w-8",
	title,
}: {
	className?: string;
	title?: string;
}) {
	return (
		<svg
			viewBox="200 60 280 280"
			className={`shrink-0 ${className}`}
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
			role={title ? "img" : undefined}
			aria-hidden={title ? undefined : true}
		>
			{title ? <title>{title}</title> : null}
			<path d={DISC} />
			<path d={DOT} />
		</svg>
	);
}
