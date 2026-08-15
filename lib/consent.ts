/* Cookie-consent plumbing, shared by three callers that must agree exactly:
   middleware.ts (edge, sets the region cookie), instrumentation-client.ts
   (decides how to boot PostHog) and components/CookieConsent.tsx (the banner).
   Keep it free of browser-only globals at module scope so the edge runtime can
   import it. */

/** Coarse region hint written by middleware. Holds "eu" or "row" — never an
    identifier, which is why it needs no consent of its own. */
export const REGION_COOKIE = "cl_region";

export type Region = "eu" | "row";

/** EU27 + the three non-EU EEA states + the UK, which retained UK GDPR/PECR
    after leaving. These are the visitors who must opt in before we may set an
    analytics cookie. */
const CONSENT_REQUIRED_COUNTRIES = new Set([
	// EU27
	"AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
	"DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
	"PL", "PT", "RO", "SK", "SI", "ES", "SE",
	// EEA, non-EU
	"IS", "LI", "NO",
	// United Kingdom
	"GB",
]);

/* Vercel and Cloudflare expose the visitor's country under different header
   names. Next 15 removed `request.geo`, so we read the headers directly. */
export const GEO_HEADERS = ["x-vercel-ip-country", "cf-ipcountry"] as const;

/** Maps a country code to a region. An unknown or missing code fails *closed*
    to "eu": if we can't prove a visitor is outside the EEA, we ask for consent
    rather than silently tracking someone who is protected. */
export function regionForCountry(country: string | null | undefined): Region {
	if (!country) return "eu";
	return CONSENT_REQUIRED_COUNTRIES.has(country.toUpperCase()) ? "eu" : "row";
}

/** Reads the region cookie in the browser. Same fail-closed default as above,
    which also covers the first request of a session, before middleware has
    run. */
export function readRegion(): Region {
	if (typeof document === "undefined") return "eu";
	const match = document.cookie.match(
		new RegExp(`(?:^|; )${REGION_COOKIE}=([^;]*)`),
	);
	return match?.[1] === "row" ? "row" : "eu";
}

/** True when this visitor must opt in before PostHog may capture or store
    anything. */
export function consentRequired(): boolean {
	return readRegion() === "eu";
}

/** Dispatched by the footer's "Cookie preferences" link to reopen the banner.
    Withdrawing consent has to be as easy as giving it, and visitors outside the
    EEA use this as the opt-out our privacy policy promises. */
export const OPEN_PREFERENCES_EVENT = "cl:open-cookie-preferences";
