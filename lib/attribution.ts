/* Marketing attribution: where a lead actually came from.

   Two tiers, because a marketing cookie is not a strictly-necessary one.

   Tier A — no device storage, runs for everyone, always. At submit time we read
   the UTMs off the current URL and the referrer off the document. Nothing is
   written to the visitor's device, so PECR Art. 5(3) never engages. Storing the
   result against the lead is ordinary GDPR processing under legitimate
   interest, disclosed in the privacy policy. This alone catches most paid
   traffic, which usually converts on the page it landed on.

   Tier B — a `cl_attr` cookie, written only after the visitor opts in. This is
   what buys first-touch and the slow organic path: read a post, come back a
   week later, book a call. Note the difference from REGION_COOKIE in
   lib/consent.ts, which needs no consent precisely because it powers the
   consent mechanism itself. This one is marketing, so it waits to be asked.

   Kept free of browser globals at module scope so the edge runtime can import
   it, same constraint lib/consent.ts respects. */

/** Cookie holding first- and last-touch. Consented visitors only. */
export const ATTRIBUTION_COOKIE = "cl_attr";

/* Cookies cap around 4KB and referrer URLs can be enormous, so every stored
   string is capped. Two touches plus overhead stays comfortably inside. */
const MAX_FIELD = 200;
const COOKIE_MAX_AGE = 60 * 60 * 24 * 90; // 90 days, roughly a B2B sales cycle

/** Coarse bucket for reporting. Deliberately small: a channel list that splits
    every source into its own bucket stops being a summary. */
export type Channel =
	| "paid_search"
	| "paid_social"
	| "organic_search"
	| "social"
	| "email"
	| "referral"
	| "direct"
	| "internal";

export type Attribution = {
	utmSource?: string;
	utmMedium?: string;
	utmCampaign?: string;
	utmContent?: string;
	utmTerm?: string;
	/* Ad-platform click IDs. Needed later to match conversions back to the
	   platform that sold us the click. */
	gclid?: string;
	fbclid?: string;
	liFatId?: string;
	ttclid?: string;
	msclkid?: string;
	channel: Channel;
	landingPath?: string;
	referrer?: string;
	referrerHost?: string;
	/** When this touch happened, epoch ms. */
	at: number;
};

export type StoredAttribution = {
	first: Attribution;
	last: Attribution;
};

/** What gets sent with a form submission and written to the lead row. */
export type AttributionPayload = {
	first?: Attribution;
	last?: Attribution;
};

function clean(value: string | null | undefined): string | undefined {
	if (!value) return undefined;
	const trimmed = value.trim().slice(0, MAX_FIELD);
	return trimmed === "" ? undefined : trimmed;
}

/** Lowercases and trims a source/medium/campaign value.

    This is the whole defence against `LinkedIn` and `linkedin` becoming two
    permanent, separately-reported channels. Applied on the way in, so the
    stored value is already normalised and no report has to remember to do it. */
export function normalizeSource(value: string | null | undefined) {
	const cleaned = clean(value);
	return cleaned?.toLowerCase();
}

function hostOf(url: string | undefined): string | undefined {
	if (!url) return undefined;
	try {
		return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
	} catch {
		return undefined;
	}
}

/* Host fragments, matched as suffixes so `m.facebook.com` and `l.instagram.com`
   land in the right bucket without listing every subdomain a platform invents. */
const SEARCH_HOSTS = ["google.", "bing.com", "duckduckgo.com", "yahoo.", "ecosia.org", "brave.com", "startpage.com"];
const SOCIAL_HOSTS = [
	"linkedin.com", "lnkd.in",
	"facebook.com", "instagram.com",
	"t.co", "x.com", "twitter.com",
	"youtube.com", "youtu.be",
	"reddit.com", "tiktok.com",
	"pinterest.com", "threads.net", "threads.com",
];

function hostMatches(host: string, needles: string[]) {
	return needles.some((needle) =>
		needle.endsWith(".") ? host.startsWith(needle) || host.includes(`.${needle}`) : host === needle || host.endsWith(`.${needle}`),
	);
}

/** Buckets a referrer host when no UTMs are present.

    This matters more than it looks: organic search and dark social never carry
    UTMs, so without this every unpaid visit collapses into "direct" and the
    channel report says our best-performing channel is "we don't know". */
export function classifyReferrer(referrer: string | undefined, ownHost?: string): Channel {
	const host = hostOf(referrer);
	if (!host) return "direct";
	if (ownHost && (host === ownHost || host.endsWith(`.${ownHost}`))) return "internal";
	if (hostMatches(host, SEARCH_HOSTS)) return "organic_search";
	if (hostMatches(host, SOCIAL_HOSTS)) return "social";
	return "referral";
}

/* utm_medium is free text, so this maps the conventions people actually type
   rather than pretending there is a standard. */
function channelFromMedium(medium: string | undefined): Channel | undefined {
	if (!medium) return undefined;
	if (/^(cpc|ppc|paid_?search|sem|google_?ads)$/.test(medium)) return "paid_search";
	if (/^(paid_?social|social_?paid|display|paid)$/.test(medium)) return "paid_social";
	if (/^(organic_?social|social)$/.test(medium)) return "social";
	if (/^(email|newsletter)$/.test(medium)) return "email";
	if (/^(referral|partner)$/.test(medium)) return "referral";
	if (/^organic$/.test(medium)) return "organic_search";
	return undefined;
}

/** Derives the channel from the strongest signal available.

    Order matters. An explicit utm_medium beats a click ID, because the medium
    is what we chose to declare and the click ID is only a hint. */
function deriveChannel(
	attribution: Omit<Attribution, "channel" | "at">,
	ownHost?: string,
): Channel {
	const declared = channelFromMedium(attribution.utmMedium);
	if (declared) return declared;

	/* gclid and msclkid only ever come from a paid click, so they are safe to
	   treat as proof of paid search.

	   fbclid is NOT: Facebook and Instagram append it to organic outbound links
	   too, so treating it as paid would credit the ad budget for posts we never
	   paid to promote. It means "came from Meta", nothing more. */
	if (attribution.gclid || attribution.msclkid) return "paid_search";
	if (attribution.liFatId || attribution.ttclid) return "paid_social";
	if (attribution.fbclid) return "social";

	/* A utm_source with no medium at least tells us it was a tagged link. */
	if (attribution.utmSource) {
		const referrerChannel = classifyReferrer(attribution.referrer, ownHost);
		return referrerChannel === "direct" || referrerChannel === "internal"
			? "referral"
			: referrerChannel;
	}

	return classifyReferrer(attribution.referrer, ownHost);
}

/** Reads a single touch out of a URL and a referrer. Pure: no globals, no
    storage, safe to call on the server or in a test. */
export function parseAttribution(
	url: string,
	referrer?: string,
	now: number = Date.now(),
): Attribution {
	let params: URLSearchParams;
	let landingPath: string | undefined;
	let ownHost: string | undefined;

	try {
		const parsed = new URL(url);
		params = parsed.searchParams;
		landingPath = clean(parsed.pathname);
		ownHost = parsed.hostname.replace(/^www\./, "").toLowerCase();
	} catch {
		params = new URLSearchParams();
	}

	const referrerValue = clean(referrer);

	const base = {
		utmSource: normalizeSource(params.get("utm_source")),
		utmMedium: normalizeSource(params.get("utm_medium")),
		utmCampaign: normalizeSource(params.get("utm_campaign")),
		/* Not lowercased: utm_content and utm_term identify a specific creative
		   or keyword, where case can be meaningful. */
		utmContent: clean(params.get("utm_content")),
		utmTerm: clean(params.get("utm_term")),
		gclid: clean(params.get("gclid")),
		fbclid: clean(params.get("fbclid")),
		liFatId: clean(params.get("li_fat_id")),
		ttclid: clean(params.get("ttclid")),
		msclkid: clean(params.get("msclkid")),
		landingPath,
		referrer: referrerValue,
		referrerHost: hostOf(referrerValue),
	};

	return { ...base, channel: deriveChannel(base, ownHost), at: now };
}

/** True when a touch carries a real acquisition signal.

    An internal click from one of our own pages is not a new touch. Overwriting
    last-touch on every internal navigation would rewrite every visitor's source
    to "internal" the moment they clicked a second page, which is the classic
    way home-grown attribution destroys its own data. */
export function hasSignal(attribution: Attribution) {
	return (
		attribution.channel !== "direct" &&
		attribution.channel !== "internal" &&
		(Boolean(attribution.utmSource) ||
			Boolean(attribution.utmCampaign) ||
			Boolean(attribution.gclid) ||
			Boolean(attribution.fbclid) ||
			Boolean(attribution.liFatId) ||
			Boolean(attribution.ttclid) ||
			Boolean(attribution.msclkid) ||
			Boolean(attribution.referrerHost))
	);
}

/* ── Tier B: consented storage ──────────────────────────────────────── */

function readCookie(name: string): string | undefined {
	if (typeof document === "undefined") return undefined;
	const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
	return match ? decodeURIComponent(match[1]) : undefined;
}

/** Reads the stored touches. Returns null when there is no cookie, which is the
    normal state for a visitor who hasn't consented. */
export function readStoredAttribution(): StoredAttribution | null {
	const raw = readCookie(ATTRIBUTION_COOKIE);
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw) as StoredAttribution;
		if (!parsed?.first || !parsed?.last) return null;
		return parsed;
	} catch {
		/* Corrupt or hand-edited. Treat as absent rather than throwing inside a
		   click handler and breaking the form. */
		return null;
	}
}

/** Removes the cookie. Called when consent is withdrawn — withdrawing has to
    actually withdraw, not just stop future writes. */
export function clearStoredAttribution() {
	if (typeof document === "undefined") return;
	document.cookie = `${ATTRIBUTION_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
}

function writeStoredAttribution(value: StoredAttribution) {
	if (typeof document === "undefined") return;
	const secure = window.location.protocol === "https:" ? "; Secure" : "";
	document.cookie =
		`${ATTRIBUTION_COOKIE}=${encodeURIComponent(JSON.stringify(value))}` +
		`; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
}

/** Records the current page as a touch, if the visitor has consented.

    `canStore` is passed in rather than read here, so this module never has to
    import posthog and stays testable. The caller (components/AttributionTracker)
    owns that decision. */
export function recordVisit(canStore: boolean) {
	if (typeof window === "undefined") return;
	if (!canStore) return;

	const touch = parseAttribution(window.location.href, document.referrer);
	const stored = readStoredAttribution();

	if (!stored) {
		/* First ever visit. Even a signal-less direct landing is worth storing:
		   it is a true first touch, and without it a visitor who arrives direct
		   and converts three pages later has no first touch at all. */
		writeStoredAttribution({ first: touch, last: touch });
		return;
	}

	/* Only a genuine new acquisition signal moves last-touch. See hasSignal. */
	if (hasSignal(touch)) {
		writeStoredAttribution({ first: stored.first, last: touch });
	}
}

/* ── What the forms send ────────────────────────────────────────────── */

/** Builds the attribution payload for a form submission.

    Works with or without consent. Without the cookie this is Tier A only: the
    live page's own UTMs and referrer, which is exactly the case for someone who
    clicks an ad and converts on the landing page. */
export function attributionForSubmit(): AttributionPayload {
	if (typeof window === "undefined") return {};

	const live = parseAttribution(window.location.href, document.referrer);
	const stored = readStoredAttribution();

	if (!stored) {
		/* Tier A. Report it as last-touch only — we genuinely do not know
		   whether this was their first visit, and guessing would be a lie the
		   reports would then treat as fact. */
		return { last: live };
	}

	/* A live signal on the converting page beats the stored one: they clicked a
	   fresh campaign link and landed straight on the form. */
	return {
		first: stored.first,
		last: hasSignal(live) ? live : stored.last,
	};
}

/* ── Server-side validation ─────────────────────────────────────────── */

/* Everything above runs in the browser, which means everything it produces is
   attacker-controlled: a query string is whatever the person sending the link
   decided to put there. So nothing from the client is trusted on the way into
   the database. */

const TOUCH_STRING_FIELDS = [
	"utmSource", "utmMedium", "utmCampaign", "utmContent", "utmTerm",
	"gclid", "fbclid", "liFatId", "ttclid", "msclkid",
	"landingPath", "referrer", "referrerHost",
] as const;

const CHANNELS: Channel[] = [
	"paid_search", "paid_social", "organic_search",
	"social", "email", "referral", "direct", "internal",
];

function sanitizeTouch(input: unknown, now: number): Attribution | undefined {
	if (!input || typeof input !== "object") return undefined;
	const raw = input as Record<string, unknown>;

	const touch: Attribution = { channel: "direct", at: now };
	let hasAny = false;

	for (const field of TOUCH_STRING_FIELDS) {
		const value = raw[field];
		if (typeof value !== "string") continue;
		const trimmed = value.trim().slice(0, MAX_FIELD);
		if (trimmed === "") continue;
		touch[field] = trimmed;
		hasAny = true;
	}

	/* An unrecognised channel is coerced rather than rejected. Rejecting would
	   throw out a real lead over a reporting label, and a lead is worth more
	   than a tidy enum. */
	if (typeof raw.channel === "string" && (CHANNELS as string[]).includes(raw.channel)) {
		touch.channel = raw.channel as Channel;
		hasAny = true;
	}

	/* The client's clock is the client's, so a timestamp is only accepted if it
	   is finite and not in the future. Otherwise the server's time stands. */
	if (typeof raw.at === "number" && Number.isFinite(raw.at) && raw.at > 0 && raw.at <= now) {
		touch.at = raw.at;
	}

	return hasAny ? touch : undefined;
}

/** Validates an attribution payload from a form POST.

    Returns undefined when there is nothing usable, so the caller can leave the
    field off the row entirely rather than storing an empty shell. */
export function sanitizeAttributionPayload(
	input: unknown,
	now: number = Date.now(),
): AttributionPayload | undefined {
	if (!input || typeof input !== "object") return undefined;
	const raw = input as Record<string, unknown>;

	const first = sanitizeTouch(raw.first, now);
	const last = sanitizeTouch(raw.last, now);

	if (!first && !last) return undefined;
	return { ...(first && { first }), ...(last && { last }) };
}

/** One-line summary for a notification email or an admin table. */
export function describeAttribution(touch: Attribution | undefined): string {
	if (!touch) return "unknown";

	const parts: string[] = [touch.channel];
	if (touch.utmSource) parts.push(touch.utmSource);
	else if (touch.referrerHost) parts.push(touch.referrerHost);
	if (touch.utmCampaign) parts.push(`campaign: ${touch.utmCampaign}`);
	if (touch.utmContent) parts.push(`content: ${touch.utmContent}`);
	if (touch.landingPath) parts.push(`landed on ${touch.landingPath}`);

	return parts.join(" · ");
}
