/**
 * The construction.live mark: the C drawn as a live signal — two broadcast
 * rings opening rightward around a solid core.
 *
 * In the wordmark it stands as the c of "construction" rather than sitting
 * beside a second one, so callers pair it with "onstruction.live" and size it
 * off the text's cap height (h-6 against text-lg). Alone — favicons, the
 * schema.org raster — it is just the mark.
 *
 * Draws in `currentColor`, so callers set the colour with a text class
 * (`text-do-orange` on the site). That is deliberate: in the nav and footer the
 * mark sits beside `.live` in the same accent, and the brand's own two tints
 * (#e8531a on light, #ff6b35 on dark) would read as a near-miss against it.
 * The literal tints live only in the static assets, which have no theme to
 * inherit: public/icon.svg, public/icon-light.svg, public/icon-dark.svg and
 * public/logo.svg.
 *
 * Background-free by design — the white disc treatment belongs to the favicons
 * (app/icon.svg, app/apple-icon.svg), which repeat these shapes as static
 * files. Coordinates are absolute rather than wrapped in a translate so
 * app/opengraph-image.tsx can reuse them verbatim under satori. Keep the
 * geometry here, in the two icon files and in the OG card in sync.
 */

/* Both rings are stroked, not filled, so the gap between them is the surface
   showing through. Stroke widths differ (34 / 30) on purpose: the outer ring
   carries at favicon sizes, the inner one has to stay lighter or the two close
   up into a blob. */
const OUTER_RING = "M230.1,203.1 A110,110 0 1 1 230.1,76.9";
const INNER_RING = "M179.9,187.5 A62,62 0 1 1 179.9,92.5";

/* The core, as a path rather than <circle> so satori renders the same markup. */
const CORE = "M110,140 A30,30 0 1,1 170,140 A30,30 0 1,1 110,140 Z";

export default function BrandMark({
	className = "h-8 w-8",
	title,
}: {
	className?: string;
	title?: string;
}) {
	return (
		<svg
			viewBox="0 0 280 280"
			className={`shrink-0 ${className}`}
			fill="none"
			stroke="currentColor"
			xmlns="http://www.w3.org/2000/svg"
			role={title ? "img" : undefined}
			aria-hidden={title ? undefined : true}
		>
			{title ? <title>{title}</title> : null}
			<path d={OUTER_RING} strokeWidth={34} />
			<path d={INNER_RING} strokeWidth={30} />
			<path d={CORE} fill="currentColor" stroke="none" />
		</svg>
	);
}
