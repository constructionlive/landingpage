import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

/* The Convex React provider is disabled app-wide, so the quote form posts here
   and we call the mutation server-side over HTTP instead. */

function asString(value: unknown, max = 500) {
	return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
	const convexUrl = process.env.CONVEX_URL ?? process.env.NEXT_PUBLIC_CONVEX_URL;
	if (!convexUrl) {
		console.error("Quote request received but no Convex URL is configured.");
		return NextResponse.json({ error: "not_configured" }, { status: 503 });
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "invalid_body" }, { status: 400 });
	}

	const payload = body as Record<string, unknown>;
	const name = asString(payload.name, 120);
	const email = asString(payload.email, 200);
	const company = asString(payload.company, 200);

	if (!name || !email || !company) {
		return NextResponse.json({ error: "missing_fields" }, { status: 400 });
	}

	const phone = asString(payload.phone, 40);
	const heardAbout = asString(payload.heardAbout, 120);

	try {
		const convex = new ConvexHttpClient(convexUrl);
		await convex.mutation(api.quotes.submitQuote, {
			role: asString(payload.role, 80),
			trade: asString(payload.trade, 300),
			teamSize: asString(payload.teamSize, 40),
			website: asString(payload.website, 300),
			name,
			email,
			company,
			phone: phone || undefined,
			heardAbout: heardAbout || undefined,
		});
	} catch (error) {
		console.error("Failed to record quote request", { email, error });
		return NextResponse.json({ error: "submit_failed" }, { status: 500 });
	}

	return NextResponse.json({ status: "created" });
}
