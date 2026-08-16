import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

/* The site-wide social card. Next picks this file up by convention and emits
   both og:image and twitter:image, so nothing in layout.tsx has to reference
   it. Every page inherits this card unless it ships its own opengraph-image.

   Rendered by satori, not a browser: flexbox only, no CSS variables, and any
   div with more than one child needs an explicit display:flex. Tailwind class
   names do nothing here, so the brand tokens are inlined as literals. */

export const alt =
	"construction.live: AI to manage project paperwork.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Mirrors the dark theme in globals.css. */
const BG = "#0a0e1a";
const ORANGE = "#f97316";
const TEXT = "#e2e8f0";
const TEXT_SECONDARY = "#8892a4";
const BORDER = "#1e293b";

export default function OpengraphImage() {
	return new ImageResponse(
		(
			<div
				style={{
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					background: BG,
					/* Stands in for the blueprint grid. A real grid needs repeating
					   backgrounds, which satori renders inconsistently. */
					backgroundImage: `radial-gradient(1000px 600px at 78% 12%, rgba(249,115,22,0.18), transparent 60%)`,
					padding: "72px 80px",
					fontFamily: "sans-serif",
				}}
			>
				{/* Wordmark */}
				<div style={{ display: "flex", alignItems: "center" }}>
					{/* Same geometry as components/BrandMark.tsx — keep the two in sync.
					    Absolute coordinates, no <g transform>: satori applies its own
					    layout pass to SVG children and a translated group lands off
					    centre. */}
					<svg width="72" height="72" viewBox="0 0 280 280" fill="none" stroke={ORANGE}>
						<path d="M230.1,203.1 A110,110 0 1 1 230.1,76.9" strokeWidth={34} />
						<path d="M179.9,187.5 A62,62 0 1 1 179.9,92.5" strokeWidth={30} />
						<path
							d="M110,140 A30,30 0 1,1 170,140 A30,30 0 1,1 110,140 Z"
							fill={ORANGE}
							stroke="none"
						/>
					</svg>
					<span
						style={{
							marginLeft: 20,
							fontSize: 34,
							fontWeight: 700,
							color: TEXT,
							letterSpacing: "-0.02em",
						}}
					>
						{SITE_NAME}
					</span>
				</div>

				{/* Headline */}
				<div style={{ display: "flex", flexDirection: "column" }}>
					<div
						style={{
							fontSize: 20,
							fontWeight: 600,
							color: ORANGE,
							letterSpacing: "0.16em",
							textTransform: "uppercase",
						}}
					>
						Agentic AI for construction
					</div>
					{/* Two lines, orange then white, mirroring the two-tone <h1> in
					    components/Hero.tsx. Sized so the question clears 1040px on one
					    line — wrapped, it breaks as "Drowned in project / paperwork?",
					    which reads as two thoughts. Re-check this if the copy changes. */}
					<div
						style={{
							marginTop: 24,
							fontSize: 66,
							fontWeight: 700,
							color: ORANGE,
							lineHeight: 1.1,
							letterSpacing: "-0.03em",
							maxWidth: 1040,
						}}
					>
						Drowned in project paperwork?
					</div>
					<div
						style={{
							marginTop: 12,
							fontSize: 50,
							fontWeight: 700,
							color: TEXT,
							lineHeight: 1.15,
							letterSpacing: "-0.02em",
							maxWidth: 1040,
						}}
					>
						Let our AI manage it!
					</div>
				</div>

				{/* Footer strip */}
				<div
					style={{
						display: "flex",
						alignItems: "center",
						borderTop: `1px solid ${BORDER}`,
						paddingTop: 28,
						fontSize: 24,
						color: TEXT_SECONDARY,
					}}
				>
					Change orders, pay-app backup and daily reports, documented as they
					happen.
				</div>
			</div>
		),
		size,
	);
}
