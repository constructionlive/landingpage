import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import {
	describeAttribution,
	sanitizeAttributionPayload,
} from "@/lib/attribution";

/* The Convex React provider is disabled app-wide, so the contact form posts
   here and we call the action server-side over HTTP instead. */

function asString(value: unknown, max = 500) {
	return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
	const convexUrl = process.env.CONVEX_URL ?? process.env.NEXT_PUBLIC_CONVEX_URL;
	if (!convexUrl) {
		console.error("Contact message received but no Convex URL is configured.");
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

	const name = asString(payload.name, 120);
	const email = asString(payload.email, 200);
	/* Free text, so it gets a lot more room than the other answers. */
	const message = asString(payload.message, 5000);

	if (!name || !email || !message) {
		return NextResponse.json({ error: "missing_fields" }, { status: 400 });
	}
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return NextResponse.json({ error: "invalid_email" }, { status: 400 });
	}

	const company = asString(payload.company, 200);
	const topic = asString(payload.topic, 120);

	/* See the note in app/api/quote/route.ts. Reached only after the honeypot
	   check above, so a bot submission never gets attributed — otherwise crawler
	   traffic would quietly inflate whichever channel it happened to arrive on. */
	const attribution = sanitizeAttributionPayload(payload.attribution);

	try {
		const convex = new ConvexHttpClient(convexUrl);
		await convex.mutation(api.contact.submitContact, {
			name,
			email,
			company: company || undefined,
			topic: topic || undefined,
			message,
			attribution,
			sourceFirst: attribution?.first && describeAttribution(attribution.first),
			sourceLast: attribution?.last && describeAttribution(attribution.last),
		});
	} catch (error) {
		console.error("Failed to record contact message", { email, error });
		return NextResponse.json({ error: "submit_failed" }, { status: 500 });
	}

	return NextResponse.json({ status: "created" });
}
