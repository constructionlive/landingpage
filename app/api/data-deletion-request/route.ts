import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

/* See app/api/contact/route.ts: the Convex React provider is disabled
   app-wide, so the form posts here and we call the mutation over HTTP. */

function asString(value: unknown, max = 500) {
	return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
	const convexUrl = process.env.CONVEX_URL ?? process.env.NEXT_PUBLIC_CONVEX_URL;
	if (!convexUrl) {
		console.error("Data deletion request received but no Convex URL is configured.");
		return NextResponse.json({ error: "not_configured" }, { status: 503 });
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "invalid_body" }, { status: 400 });
	}

	const payload = body as Record<string, unknown>;

	/* Honeypot, same shape and reasoning as the contact form. */
	if (asString(payload.company_website, 200)) {
		return NextResponse.json({ status: "created" });
	}

	const name = asString(payload.name, 120);
	const email = asString(payload.email, 200);
	const scope = asString(payload.scope, 20);

	if (!name || !email || !scope) {
		return NextResponse.json({ error: "missing_fields" }, { status: 400 });
	}
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return NextResponse.json({ error: "invalid_email" }, { status: 400 });
	}
	if (scope !== "associated" && scope !== "all") {
		return NextResponse.json({ error: "invalid_scope" }, { status: 400 });
	}

	const company = asString(payload.company, 200);
	const details = asString(payload.details, 3000);

	try {
		const convex = new ConvexHttpClient(convexUrl);
		await convex.mutation(api.dataDeletion.submitDataDeletionRequest, {
			name,
			email,
			company: company || undefined,
			scope,
			details: details || undefined,
		});
	} catch (error) {
		console.error("Failed to record data deletion request", { email, error });
		return NextResponse.json({ error: "submit_failed" }, { status: 500 });
	}

	return NextResponse.json({ status: "created" });
}
