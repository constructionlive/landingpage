import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

/* The site-wide social card. Next picks this file up by convention and emits
   both og:image and twitter:image, so nothing in layout.tsx has to reference
   it. Every page inherits this card unless it ships its own opengraph-image.

   Rendered by satori, not a browser: flexbox only, no CSS variables, and any
   div with more than one child needs an explicit display:flex. Tailwind class
   names do nothing here, so the brand tokens are inlined as literals. */

export const alt =
	"construction.live: get paid for what you did, get covered for what you couldn't.";
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
					<svg width="72" height="72" viewBox="165 53 350 350" fill={ORANGE}>
						<path d="M 463.7 104.3 A 175 175 0 1 0 463.7 351.7 A 15 15 0 0 0 442.5 330.5 A 145 145 0 1 1 442.5 125.5 A 15 15 0 0 0 463.7 104.3 Z" />
						<path
							fillRule="evenodd"
							d="M 250 145 Q 250 138 255 133 L 279 105 Q 284 100 291 100 L 303 100 Q 310 100 310 107 L 310 255 Q 310 262 317 262 L 463 262 Q 470 262 470 269 L 470 315 Q 470 322 463 322 L 257 322 Q 250 322 250 315 Z M 272 140 L 288 140 Q 293 140 293 145 L 293 161 Q 293 166 288 166 L 272 166 Q 267 166 267 161 L 267 145 Q 267 140 272 140 Z M 272 182 L 288 182 Q 293 182 293 187 L 293 203 Q 293 208 288 208 L 272 208 Q 267 208 267 203 L 267 187 Q 267 182 272 182 Z M 272 224 L 288 224 Q 293 224 293 229 L 293 245 Q 293 250 288 250 L 272 250 Q 267 250 267 245 L 267 229 Q 267 224 272 224 Z M 335 279 L 351 279 Q 356 279 356 284 L 356 300 Q 356 305 351 305 L 335 305 Q 330 305 330 300 L 330 284 Q 330 279 335 279 Z M 382 279 L 398 279 Q 403 279 403 284 L 403 300 Q 403 305 398 305 L 382 305 Q 377 305 377 300 L 377 284 Q 377 279 382 279 Z M 429 279 L 445 279 Q 450 279 450 284 L 450 300 Q 450 305 445 305 L 429 305 Q 424 305 424 300 L 424 284 Q 424 279 429 279 Z"
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
					<div
						style={{
							marginTop: 24,
							fontSize: 72,
							fontWeight: 700,
							color: TEXT,
							lineHeight: 1.1,
							letterSpacing: "-0.03em",
							maxWidth: 980,
						}}
					>
						Get paid for what you did. Get covered for what you couldn&apos;t.
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
