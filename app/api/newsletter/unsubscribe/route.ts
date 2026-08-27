import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { absoluteUrl } from "@/lib/site";

/* Opting out, by token only. Never by email address: an endpoint that takes a
   raw address is an endpoint anyone can use to unsubscribe anyone.

   POST is the RFC 8058 one-click path — Gmail and Yahoo call it themselves from
   the List-Unsubscribe header, with no human involved, and expect a 200 and no
   redirect. The form on /newsletter/unsubscribe posts here too.

   GET is a human following the header link in a client that doesn't do
   one-click. It deliberately does NOT unsubscribe; it hands them to the page,
   which asks first. Inbox security scanners fetch every link in a message, so a
   GET that acted on sight would opt people out who never clicked. */

function tokenFrom(request: Request) {
	return new URL(request.url).searchParams.get("token")?.trim() ?? "";
}

export async function POST(request: Request) {
	const convexUrl = process.env.CONVEX_URL ?? process.env.NEXT_PUBLIC_CONVEX_URL;
	if (!convexUrl) {
		console.error("Unsubscribe requested but no Convex URL is configured.");
		return NextResponse.json({ error: "not_configured" }, { status: 503 });
	}

	/* One-click sends the token in the query string; the page's own form sends
	   it in a JSON body. Accept both rather than making the mail provider match
	   our form's shape. */
	let token = tokenFrom(request);
	if (!token) {
		try {
			const body = (await request.json()) as Record<string, unknown>;
			if (typeof body.token === "string") token = body.token.trim();
		} catch {
			/* One-click POSTs arrive form-encoded with no JSON body at all. That
			   is fine as long as the query string carried the token. */
		}
	}

	if (!token) {
		return NextResponse.json({ error: "missing_token" }, { status: 400 });
	}

	try {
		const convex = new ConvexHttpClient(convexUrl);
		const result = await convex.mutation(api.newsletter.unsubscribe, {
			unsubscribeToken: token,
		});
		return NextResponse.json(result);
	} catch (error) {
		console.error("Failed to unsubscribe", { error });
		return NextResponse.json({ error: "unsubscribe_failed" }, { status: 500 });
	}
}

export async function GET(request: Request) {
	const token = tokenFrom(request);
	const target = token
		? absoluteUrl(`/newsletter/unsubscribe?token=${encodeURIComponent(token)}`)
		: absoluteUrl("/newsletter/unsubscribe");

	return NextResponse.redirect(target, 302);
}
