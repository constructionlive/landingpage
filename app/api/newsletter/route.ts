import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { sanitizeAttributionPayload } from "@/lib/attribution";

/* The Convex React provider is disabled app-wide, so the newsletter form posts
   here and we call the mutation server-side over HTTP instead — the same shape
   as app/api/contact/route.ts.

   Adding a field means changing this validator, the mutation args in
   convex/newsletter.ts, the newsletterSubscribers table in convex/schema.ts and
   the form in components/NewsletterSignup.tsx. */

function asString(value: unknown, max = 500) {
	return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
	const convexUrl = process.env.CONVEX_URL ?? process.env.NEXT_PUBLIC_CONVEX_URL;
	if (!convexUrl) {
		console.error("Newsletter signup received but no Convex URL is configured.");
		return NextResponse.json({ error: "not_configured" }, { status: 503 });
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "invalid_body" }, { status: 400 });
	}

	const payload = body as Record<string, unknown>;

	/* Honeypot: a field the form keeps hidden, so only a bot fills it in. We
	   answer with the same success shape rather than an error, because telling
	   a scraper it was caught only teaches it to stop filling the field. */
	if (asString(payload.company_website, 200)) {
		return NextResponse.json({ status: "created" });
	}

	const email = asString(payload.email, 200);
	if (!email) {
		return NextResponse.json({ error: "missing_fields" }, { status: 400 });
	}
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return NextResponse.json({ error: "invalid_email" }, { status: 400 });
	}

	/* Everything but the address is optional: the footer strip asks for an
	   email and nothing else, and a name is not worth losing a subscriber over. */
	const name = asString(payload.name, 120);
	const company = asString(payload.company, 200);
	const interest = asString(payload.interest, 120);

	/* See the note in app/api/quote/route.ts. Reached only after the honeypot
	   check above, so a bot submission never gets attributed — otherwise crawler
	   traffic would quietly inflate whichever channel it happened to arrive on.
	   This is the field that tells us which LinkedIn campaign a subscriber came
	   from, so long as the link carried the UTMs. */
	const attribution = sanitizeAttributionPayload(payload.attribution);

	/* Minted here rather than in the mutation: this is a bearer secret in every
	   email we send, and it should come from the platform CSPRNG. The mutation
	   only uses it when it actually creates a row, so a repeat signup keeps the
	   token already printed in the subscriber's older mail. */
	const unsubscribeToken = crypto.randomUUID();

	try {
		const convex = new ConvexHttpClient(convexUrl);
		const result = await convex.mutation(api.newsletter.subscribe, {
			email,
			name: name || undefined,
			company: company || undefined,
			interest: interest || undefined,
			unsubscribeToken,
			attribution,
		});

		/* Passed back so the form can say "you were already on the list" instead
		   of implying a second signup happened. */
		return NextResponse.json({ status: result.status });
	} catch (error) {
		console.error("Failed to record newsletter signup", { email, error });
		return NextResponse.json({ error: "submit_failed" }, { status: 500 });
	}
}
