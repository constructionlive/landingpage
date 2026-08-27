import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { absoluteUrl } from "@/lib/site";

/* The list, for whatever is actually sending the newsletter.

   This exists so an external sender can mail-merge a DIFFERENT unsubscribe link
   into each recipient's copy. That is the part a Bcc from an inbox cannot do,
   and it is the part that makes the send lawful: one shared link can't tell us
   who to remove.

   Authenticated with a bearer secret shared with the sending app, not an admin
   session — the caller is a program, and there is no user to sign in as. The
   secret is checked again inside the Convex query behind this route; see the
   note there for why one check isn't enough.

   GET rather than POST because it reads and changes nothing, but it must never
   be cached: the response is a subscriber list with opt-out tokens in it. */

export const dynamic = "force-dynamic";

function bearerFrom(request: Request) {
	const header = request.headers.get("authorization") ?? "";
	const match = /^Bearer\s+(.+)$/i.exec(header.trim());
	return match ? match[1].trim() : "";
}

export async function GET(request: Request) {
	const convexUrl = process.env.CONVEX_URL ?? process.env.NEXT_PUBLIC_CONVEX_URL;
	if (!convexUrl) {
		console.error("Subscriber list requested but no Convex URL is configured.");
		return NextResponse.json({ error: "not_configured" }, { status: 503 });
	}

	const apiKey = bearerFrom(request);
	if (!apiKey) {
		return NextResponse.json({ error: "missing_api_key" }, { status: 401 });
	}

	const { searchParams } = new URL(request.url);
	const cursor = searchParams.get("cursor");
	const numItemsParam = Number(searchParams.get("limit"));
	const numItems = Number.isFinite(numItemsParam) && numItemsParam > 0 ? numItemsParam : undefined;

	let result;
	try {
		const convex = new ConvexHttpClient(convexUrl);
		result = await convex.query(api.newsletter.subscribersForSending, {
			apiKey,
			cursor,
			numItems,
		});
	} catch (error) {
		/* The query throws a ConvexError for both a missing server-side secret
		   and a wrong one. They are answered differently on purpose: a caller
		   presenting the wrong key learns only that it was rejected, while a
		   deployment that was never given a key is our problem to fix and should
		   not read as "your key is wrong". */
		const message = error instanceof Error ? error.message : "";
		if (message.includes("not configured")) {
			console.error("NEWSLETTER_API_KEY is not set on the Convex deployment.");
			return NextResponse.json({ error: "not_configured" }, { status: 503 });
		}
		if (message.includes("Invalid API key")) {
			return NextResponse.json({ error: "unauthorized" }, { status: 401 });
		}
		console.error("Failed to read the subscriber list", { error });
		return NextResponse.json({ error: "read_failed" }, { status: 500 });
	}

	/* The token is turned into finished URLs here rather than handed over raw,
	   so the sending app never has to know how we build an opt-out link. If the
	   path ever changes, the senders don't have to be redeployed with it.

	   `unsubscribeUrl` is the one that goes in the visible body copy; `oneClickUrl`
	   is the one that goes in the List-Unsubscribe header, and they are not
	   interchangeable — see the note in convex/emails.ts. */
	const subscribers = result.subscribers.map(
		(subscriber: {
			email: string;
			name?: string;
			company?: string;
			interest?: string;
			unsubscribeToken: string;
			createdAt: number;
		}) => {
			const token = encodeURIComponent(subscriber.unsubscribeToken);
			return {
				email: subscriber.email,
				name: subscriber.name ?? null,
				company: subscriber.company ?? null,
				interest: subscriber.interest ?? null,
				createdAt: subscriber.createdAt,
				unsubscribeUrl: absoluteUrl(`/newsletter/unsubscribe?token=${token}`),
				oneClickUrl: absoluteUrl(`/api/newsletter/unsubscribe?token=${token}`),
			};
		},
	);

	return NextResponse.json(
		{ subscribers, isDone: result.isDone, cursor: result.cursor },
		/* Opt-out tokens must not sit in a CDN or a proxy cache. */
		{ headers: { "Cache-Control": "no-store, private" } },
	);
}
