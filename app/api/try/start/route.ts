import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { sanitizeAttributionPayload } from "@/lib/attribution";
import { isDisposableEmail, isPlausibleEmail } from "@/lib/disposableEmail";
import { clientIp, hashIp, hashTrialToken, mintTrialToken } from "@/lib/trialToken";

/* Step 1 of /try: company, name, email. Writes a pending row and mails a link.

   This route does more checking than the others under app/api because it is
   the one that is worth automating against. In order:

     - honeypot        a hidden field only a bot fills in
     - timing          a form nobody could complete in under two seconds
     - disposable mail an inbox that exists to click links and disappear
     - rate limits     per IP and per address, enforced in convex/trial.ts

   Each of the first three answers with the same success shape as a real
   submission. A bot told it was caught learns what to change; a bot told
   "check your inbox" waits for a mail that never comes.

   The Convex React provider is disabled app-wide, so this posts to Convex
   server-side over HTTP — the same shape as app/api/contact/route.ts. */

function asString(value: unknown, max = 500) {
	return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/* Under this, and the "form" was filled by something that never rendered it.
   Two seconds is well below the time it takes a person to type a company name,
   their own name and an address, and well above what a script needs. */
const MIN_FILL_MS = 2000;

const ACCEPTED = { status: "pending" as const };

export async function POST(request: Request) {
	const convexUrl = process.env.CONVEX_URL ?? process.env.NEXT_PUBLIC_CONVEX_URL;
	if (!convexUrl) {
		console.error("Trial signup received but no Convex URL is configured.");
		return NextResponse.json({ error: "not_configured" }, { status: 503 });
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "invalid_body" }, { status: 400 });
	}

	const payload = body as Record<string, unknown>;

	/* Honeypot. See the note in app/api/contact/route.ts. */
	if (asString(payload.company_website, 200)) {
		return NextResponse.json(ACCEPTED);
	}

	/* Timing. The page records when it mounted and sends the elapsed time.
	   A missing value is treated as suspicious rather than ignored: the real
	   form always sends it, so its absence means the request didn't come from
	   the form. */
	const elapsed = typeof payload.elapsedMs === "number" ? payload.elapsedMs : 0;
	if (elapsed < MIN_FILL_MS) {
		return NextResponse.json(ACCEPTED);
	}

	const company = asString(payload.company, 200);
	const name = asString(payload.name, 120);
	const email = asString(payload.email, 200);

	if (!company || !name || !email) {
		return NextResponse.json({ error: "missing_fields" }, { status: 400 });
	}
	if (!isPlausibleEmail(email)) {
		return NextResponse.json({ error: "invalid_email" }, { status: 400 });
	}
	/* This one IS reported, because a person who typed a throwaway address on
	   purpose needs to know why nothing arrives — and a bot that reads the
	   error has only learned that it needs a real inbox, which is the point. */
	if (isDisposableEmail(email)) {
		return NextResponse.json({ error: "disposable_email" }, { status: 400 });
	}

	/* Reached only after the checks above, so a bot submission never gets
	   attributed — see the note in app/api/quote/route.ts. */
	const attribution = sanitizeAttributionPayload(payload.attribution);

	/* Minted here, from the platform CSPRNG, and hashed before it goes near the
	   database. The raw value goes to the mail action and nowhere else. */
	const token = mintTrialToken();
	const tokenHash = hashTrialToken(token);
	const ip = clientIp(request);
	const ipHash = ip ? hashIp(ip) : undefined;

	try {
		const convex = new ConvexHttpClient(convexUrl);
		const result = await convex.mutation(api.trial.startTrial, {
			company,
			name,
			email,
			token,
			tokenHash,
			ipHash,
			attribution,
		});

		if (result.status === "rate_limited") {
			return NextResponse.json({ error: "rate_limited" }, { status: 429 });
		}
	} catch (error) {
		console.error("Failed to record trial signup", { email, error });
		return NextResponse.json({ error: "submit_failed" }, { status: 500 });
	}

	return NextResponse.json(ACCEPTED);
}
