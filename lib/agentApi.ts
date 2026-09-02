import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";

/* Server-only helpers shared by every agent-facing route under /api — blog
   posts and landing pages both. They stand between the agent's
   bearer-authenticated HTTP calls and the secret-authed Convex functions. The
   bearer the caller sends is forwarded as `apiKey`; Convex is what actually
   verifies it, so a leaked or missing secret fails at the source, not just
   here.

   Field whitelists live next to the thing they describe: lib/agentBlog.ts for
   posts, lib/agentPages.ts for landing pages. */

/** A Convex HTTP client, or null when no deployment URL is configured. */
export function convexClient() {
	const url = process.env.CONVEX_URL ?? process.env.NEXT_PUBLIC_CONVEX_URL;
	return url ? new ConvexHttpClient(url) : null;
}

/* Turn a ConvexError thrown by an agent function into the right HTTP status.
   Matched on message text, the same approach the newsletter route uses, so the
   distinctions the functions draw survive the trip to the caller:
     - a deployment with no secret set is our misconfiguration (503), told apart
       from a caller presenting the wrong key (401), so "your key is wrong" is
       never shown for "we forgot to set the key".
     - a missing post or unknown author is 404, a slug clash is 409, and the
       various "cannot be empty / provide an id" guards are 400. */
export function mapConvexError(error: unknown) {
	const message = error instanceof Error ? error.message : "";

	if (message.includes("is not configured")) {
		console.error("BLOG_AGENT_API_KEY is not set on the Convex deployment.");
		return NextResponse.json({ error: "not_configured" }, { status: 503 });
	}
	if (message.includes("Invalid API key")) {
		return NextResponse.json({ error: "unauthorized" }, { status: 401 });
	}
	if (message.includes("not found") || message.includes("No user found")) {
		return NextResponse.json({ error: "not_found", detail: clean(message) }, { status: 404 });
	}
	if (message.includes("already exists")) {
		return NextResponse.json({ error: "slug_conflict", detail: clean(message) }, { status: 409 });
	}
	if (
		message.includes("cannot be empty") ||
		message.includes("could not be generated") ||
		message.includes("Provide an id") ||
		message.includes("may only contain") ||
		message.includes("No author available") ||
		message.includes("matches no user")
	) {
		return NextResponse.json({ error: "invalid_request", detail: clean(message) }, { status: 400 });
	}

	console.error("Agent API error", { error });
	return NextResponse.json({ error: "request_failed" }, { status: 500 });
}

/* ConvexError messages arrive wrapped (e.g. "[Request ID: …] … Uncaught
   ConvexError: <text>"); hand the caller just the text we threw. */
function clean(message: string) {
	const marker = "ConvexError:";
	const at = message.lastIndexOf(marker);
	return (at >= 0 ? message.slice(at + marker.length) : message).trim();
}

/** Copy only `keys` that are present on `body`, so Convex's arg validator never
    rejects the call over a stray field the caller included. */
export function pickFields<T extends Record<string, unknown>>(body: T, keys: readonly string[]) {
	const out: Record<string, unknown> = {};
	for (const key of keys) {
		if (body[key] !== undefined) out[key] = body[key];
	}
	return out;
}
