import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { absoluteUrl } from "@/lib/site";
import { bearerFrom } from "@/lib/newsletterAuth";

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

/* ── Import ─────────────────────────────────────────────────────────────
   POST the same path to push a list collected before this register existed.

   Body: { "subscribers": [ { "email", "name"?, "company"?, "interest"?,
   "status"?, "subscribedAt"?, "consentSource"? } ] }

   Set "expressOptIn": true when a person is ticking a box right now — at
   product signup, say. That mode lets a previously-unsubscribed address back on
   the list, because an explicit tick is fresh consent, and sends the welcome
   email so the first thing they get carries an unsubscribe link. It requires
   consentSource on every row and caps the batch, because those two rules are
   exactly what stops a bulk restore from re-mailing everyone who left.

   `status` defaults to "subscribed"; send "unsubscribed" to bring over an old
   suppression list, which is worth doing FIRST and separately — see the note on
   importSubscribers in convex/newsletter.ts for what an import will and won't
   overwrite. `subscribedAt` is when they originally agreed, epoch ms or a date
   string; it becomes their consent date rather than today's.

   No welcome email goes out. These people subscribed elsewhere, and greeting
   them as new signups reads as a mistake at best.

   A malformed row is reported and skipped rather than failing the batch: one
   bad address in a five-hundred-row export should not cost the other 499. */

const MAX_IMPORT_ROWS = 500;
/* An express opt-in is one person ticking a box, so a batch of them is a
   handful at most. The low cap is a circuit breaker: it makes "restore the
   whole list with expressOptIn set" fail loudly instead of mailing a welcome
   to everyone who ever unsubscribed. */
const MAX_OPT_IN_ROWS = 50;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asString(value: unknown, max = 500) {
	return typeof value === "string" ? value.trim().slice(0, max) : "";
}

/** Epoch ms, or any date string Date can parse. Undefined when absent/unusable. */
function asTimestamp(value: unknown) {
	if (typeof value === "number" && Number.isFinite(value)) return value;
	if (typeof value === "string" && value.trim() !== "") {
		const parsed = /^\d+$/.test(value.trim()) ? Number(value.trim()) : Date.parse(value.trim());
		if (Number.isFinite(parsed)) return parsed;
	}
	return undefined;
}

export async function POST(request: Request) {
	const convexUrl = process.env.CONVEX_URL ?? process.env.NEXT_PUBLIC_CONVEX_URL;
	if (!convexUrl) {
		console.error("Subscriber import attempted but no Convex URL is configured.");
		return NextResponse.json({ error: "not_configured" }, { status: 503 });
	}

	const apiKey = bearerFrom(request);
	if (!apiKey) {
		return NextResponse.json({ error: "missing_api_key" }, { status: 401 });
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "invalid_body" }, { status: 400 });
	}

	const rows = (body as Record<string, unknown>)?.subscribers;
	if (!Array.isArray(rows)) {
		return NextResponse.json({ error: "missing_subscribers" }, { status: 400 });
	}
	if (rows.length === 0) {
		return NextResponse.json({ error: "empty_import" }, { status: 400 });
	}
	/* Rejected rather than truncated. Silently importing the first 500 of 2000
	   and answering 200 looks exactly like a complete import, and the 1500 who
	   were dropped are invisible until someone counts. */
	const expressOptIn = (body as Record<string, unknown>)?.expressOptIn === true;

	const maxRows = expressOptIn ? MAX_OPT_IN_ROWS : MAX_IMPORT_ROWS;
	if (rows.length > maxRows) {
		return NextResponse.json(
			{ error: "too_many_rows", max: maxRows, received: rows.length },
			{ status: 413 },
		);
	}

	/* Mirrors the args validator on newsletter.importSubscribers. Spelled out
	   rather than inferred so a field renamed there fails to compile here,
	   instead of arriving as undefined and importing blanks. */
	type ImportRow = {
		email: string;
		normalizedEmail: string;
		name?: string;
		company?: string;
		interest?: string;
		status: "subscribed" | "unsubscribed";
		subscribedAt?: number;
		consentSource?: string;
		unsubscribeToken: string;
	};

	const invalid: { index: number; email: string; reason: string }[] = [];
	const subscribers: ImportRow[] = [];
	const seen = new Set<string>();

	rows.forEach((raw, index) => {
		const row = (raw ?? {}) as Record<string, unknown>;
		const email = asString(row.email, 200);

		if (!email || !EMAIL_PATTERN.test(email)) {
			invalid.push({ index, email, reason: "invalid_email" });
			return;
		}

		/* Convex mutations run in one transaction, so two rows for the same
		   address would have the second read a row the first had not committed
		   and insert a duplicate. Deduped here instead. */
		const normalizedEmail = email.toLowerCase();
		if (seen.has(normalizedEmail)) {
			invalid.push({ index, email, reason: "duplicate_in_batch" });
			return;
		}
		seen.add(normalizedEmail);

		const status = asString(row.status, 20).toLowerCase();
		if (status && status !== "subscribed" && status !== "unsubscribed") {
			invalid.push({ index, email, reason: "invalid_status" });
			return;
		}

		/* Required on an express opt-in, and only there. This is the mode that
		   can put a previously-unsubscribed address back on the list and send
		   mail, so "where did this consent come from" has to have an answer
		   before it runs, not after somebody complains. */
		if (expressOptIn && !asString(row.consentSource, 300)) {
			invalid.push({ index, email, reason: "missing_consent_source" });
			return;
		}

		subscribers.push({
			email,
			normalizedEmail,
			name: asString(row.name, 120) || undefined,
			company: asString(row.company, 200) || undefined,
			interest: asString(row.interest, 120) || undefined,
			status: status === "unsubscribed" ? "unsubscribed" : "subscribed",
			subscribedAt: asTimestamp(row.subscribedAt),
			consentSource: asString(row.consentSource, 300) || undefined,
			/* One per row, from the platform CSPRNG, used only if a row is
			   created. An existing subscriber keeps the token already printed in
			   every email we have sent them. */
			unsubscribeToken: crypto.randomUUID(),
		});
	});

	if (subscribers.length === 0) {
		return NextResponse.json({ error: "no_valid_rows", invalid }, { status: 400 });
	}

	try {
		const convex = new ConvexHttpClient(convexUrl);
		const result = await convex.mutation(api.newsletter.importSubscribers, {
			apiKey,
			expressOptIn,
			subscribers,
		});

		/* `suppressed` is the count worth reading: addresses the file said were
		   subscribed that we refused to re-add because they opted out here. */
		return NextResponse.json(
			{ counts: result.counts, results: result.results, invalid },
			{ headers: { "Cache-Control": "no-store, private" } },
		);
	} catch (error) {
		const message = error instanceof Error ? error.message : "";
		if (message.includes("not configured")) {
			console.error("NEWSLETTER_API_KEY is not set on the Convex deployment.");
			return NextResponse.json({ error: "not_configured" }, { status: 503 });
		}
		if (message.includes("Invalid API key")) {
			return NextResponse.json({ error: "unauthorized" }, { status: 401 });
		}
		console.error("Failed to import subscribers", { error });
		return NextResponse.json({ error: "import_failed" }, { status: 500 });
	}
}
