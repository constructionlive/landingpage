import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { absoluteUrl } from "@/lib/site";
import { verifyEmailToken } from "@/lib/newsletterToken";

/* Opting out. Two link shapes reach here, and both have to keep working.

   SIGNED — ?email=you@co.com&token=<hmac>. What the sending app builds: it
   derives the token from the address with the shared secret, so it needs no
   call back here and no list of tokens. We recompute the signature and, if it
   matches, unsubscribe that address. See lib/newsletterToken.ts.

   STORED — ?token=<random>. The original scheme, and the one in every welcome
   email already delivered. Those links are in people's inboxes and must not
   stop working because we added a second scheme; an opt-out link that has
   quietly died is the one failure this endpoint cannot have.

   An email with no token, or with one that doesn't verify, is NOT treated as a
   stored token and never falls through to the address path — that would turn a
   signature check into a suggestion.

   POST is the RFC 8058 one-click path: Gmail and Yahoo call it themselves from
   the List-Unsubscribe header, with no human involved, and expect a 200 and no
   redirect. The form on /newsletter/unsubscribe posts here too.

   GET is a human following the header link in a client that doesn't do
   one-click. It deliberately does NOT unsubscribe; it hands them to the page,
   which asks first. Inbox security scanners fetch every link in a message, so a
   GET that acted on sight would opt people out who never clicked. */

export const runtime = "nodejs";

type Params = { token: string; email: string };

function paramsFromUrl(request: Request): Params {
	const { searchParams } = new URL(request.url);
	return {
		token: searchParams.get("token")?.trim() ?? "",
		email: searchParams.get("email")?.trim() ?? "",
	};
}

export async function POST(request: Request) {
	const convexUrl = process.env.CONVEX_URL ?? process.env.NEXT_PUBLIC_CONVEX_URL;
	if (!convexUrl) {
		console.error("Unsubscribe requested but no Convex URL is configured.");
		return NextResponse.json({ error: "not_configured" }, { status: 503 });
	}

	/* One-click sends both in the query string; the page's own form sends them
	   in a JSON body. Accept either rather than making the mail provider match
	   our form's shape. */
	const params = paramsFromUrl(request);
	let { token, email } = params;
	if (!token) {
		try {
			const body = (await request.json()) as Record<string, unknown>;
			if (typeof body.token === "string") token = body.token.trim();
			if (!email && typeof body.email === "string") email = body.email.trim();
		} catch {
			/* One-click POSTs arrive form-encoded with no JSON body at all. That
			   is fine as long as the query string carried the token. */
		}
	}

	if (!token) {
		return NextResponse.json({ error: "missing_token" }, { status: 400 });
	}

	const convex = new ConvexHttpClient(convexUrl);

	/* ── Signed link ─────────────────────────────────────────────────── */
	if (email) {
		const secret = process.env.NEWSLETTER_API_KEY;
		if (!secret) {
			/* Refuse rather than fall through to the stored-token path, which
			   would accept the signature as if it were a random token. */
			console.error("Signed unsubscribe link received but NEWSLETTER_API_KEY is not set.");
			return NextResponse.json({ error: "not_configured" }, { status: 503 });
		}

		if (!verifyEmailToken(email, token, secret)) {
			/* Deliberately vague. A caller probing addresses learns only that this
			   link is bad, not whether the address is on the list. */
			return NextResponse.json({ error: "invalid_token" }, { status: 403 });
		}

		try {
			const result = await convex.mutation(api.newsletter.unsubscribeByEmail, {
				email,
				apiKey: secret,
			});
			return NextResponse.json(result);
		} catch (error) {
			console.error("Failed to unsubscribe a signed link", { error });
			return NextResponse.json({ error: "unsubscribe_failed" }, { status: 500 });
		}
	}

	/* ── Stored token ────────────────────────────────────────────────── */
	try {
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
	const { token, email } = paramsFromUrl(request);

	/* Both parameters are carried through untouched, so the page can post back
	   exactly the link the person was given. Nothing is verified here — the page
	   asks first, and POST above is what checks the signature. */
	const query = new URLSearchParams();
	if (token) query.set("token", token);
	if (email) query.set("email", email);

	const suffix = query.toString();
	return NextResponse.redirect(
		absoluteUrl(`/newsletter/unsubscribe${suffix ? `?${suffix}` : ""}`),
		302,
	);
}
