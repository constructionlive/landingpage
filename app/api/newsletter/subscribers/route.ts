import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { absoluteUrl } from "@/lib/site";

/* The register, as a feed the sending app can keep a local copy from.

   Ask with no `since` for a full sync; ask with the `nextSince` from the last
   answer for everything that changed after it. Both subscribes AND unsubscribes
   come back, because a sender that only hears about subscribes can add people
   but never remove them, and keeps mailing everyone who ever opted out.

   `since` accepts epoch milliseconds or any date string Date can parse, so a
   caller can hand back the value we gave it or a plain ISO timestamp.

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

	/* A `since` we can't read is rejected rather than quietly treated as "from
	   the beginning". Silently widening it would answer a delta request with the
	   entire list, which looks like it worked and is the kind of thing a caller
	   only notices at the point it has re-sent the newsletter to everyone. */
	const sinceParam = searchParams.get("since");
	let since: number | undefined;
	if (sinceParam !== null && sinceParam.trim() !== "") {
		const raw = sinceParam.trim();
		/* Epoch milliseconds, as handed back from a previous nextSince, or any
		   date string Date can parse. */
		const parsed = /^\d+$/.test(raw) ? Number(raw) : Date.parse(raw);
		if (!Number.isFinite(parsed)) {
			return NextResponse.json({ error: "invalid_since" }, { status: 400 });
		}
		since = parsed;
	}

	let result;
	try {
		const convex = new ConvexHttpClient(convexUrl);
		result = await convex.query(api.newsletter.subscribersForSending, {
			apiKey,
			since,
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
			status: string;
			unsubscribeToken: string;
			createdAt: number;
			resubscribedAt?: number;
			unsubscribedAt?: number;
			updatedAt: number;
		}) => {
			const token = encodeURIComponent(subscriber.unsubscribeToken);
			return {
				email: subscriber.email,
				name: subscriber.name ?? null,
				company: subscriber.company ?? null,
				interest: subscriber.interest ?? null,
				/* "subscribed" or "unsubscribed". The field the caller acts on:
				   anything not subscribed must come out of its local list. */
				status: subscriber.status,
				createdAt: subscriber.createdAt,
				resubscribedAt: subscriber.resubscribedAt ?? null,
				unsubscribedAt: subscriber.unsubscribedAt ?? null,
				/* When this row last changed. Ordering is ascending on this field. */
				updatedAt: subscriber.updatedAt,
				/* Ready-made links, for a caller that would rather not derive them.
				   The signed scheme in lib/newsletterToken.ts produces equivalent
				   links from the address alone — either works. */
				unsubscribeUrl: absoluteUrl(`/newsletter/unsubscribe?token=${token}`),
				oneClickUrl: absoluteUrl(`/api/newsletter/unsubscribe?token=${token}`),
			};
		},
	);

	return NextResponse.json(
		{
			subscribers,
			/* Follow `cursor` while isDone is false to finish this sync. Only
			   store `nextSince` once isDone is true — storing it halfway would
			   move the watermark past rows the remaining pages still hold. */
			isDone: result.isDone,
			cursor: result.cursor,
			nextSince: result.nextSince,
		},
		/* Opt-out tokens must not sit in a CDN or a proxy cache. */
		{ headers: { "Cache-Control": "no-store, private" } },
	);
}
