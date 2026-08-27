import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { apiKeyMatches, bearerFrom } from "@/lib/newsletterAuth";

/* Serves the sending agent its own integration spec, behind the same key it
   uses for everything else.

   The point is that the agent needs no local copy: it holds a key and an
   origin, asks what the contract is, and gets the current answer. A spec pasted
   into a prompt months ago is a spec that has quietly stopped matching the
   endpoints, and an agent working from a stale contract fails in ways that look
   like the API is broken.

   Authenticated rather than public. It is not a secret in the cryptographic
   sense — it holds no keys, and knowing the shape of the API doesn't get anyone
   past the bearer check on the endpoints themselves. But it is a map of exactly
   which paths accept an authenticated write, and there's no reason to hand that
   to someone who hasn't already got the key. */

export const runtime = "nodejs";
/* Read per request, so correcting the spec doesn't need a redeploy to take
   effect, and so a cached copy can't outlive a change to the contract. */
export const dynamic = "force-dynamic";

/* The single source of truth is the file in the repo. Serving a copy pasted
   into a TS module would mean two versions to keep in step, and the one that
   drifts is always the one nobody is reading.

   next.config.ts names this file in outputFileTracingIncludes so it ships with
   the deployed function — a file that only exists in the repo isn't there at
   runtime on a traced build. */
const SPECS: Record<string, string> = {
	/* The sending agent's operating manual. */
	agent: "docs/newsletter-agent-spec.md",
	/* How the product's signup checkbox opts somebody in. */
	product: "docs/product-newsletter-optin.md",
};
const DEFAULT_SPEC = "agent";

export async function GET(request: Request) {
	if (!apiKeyMatches(bearerFrom(request))) {
		/* Same answer for "no key" and "wrong key". Distinguishing them tells an
		   unauthenticated caller that the endpoint exists and is worth guessing
		   at, which is precisely the audience for the map inside. */
		return NextResponse.json({ error: "unauthorized" }, { status: 401 });
	}

	/* ?doc=agent (default) or ?doc=product. An unknown name is a 404 rather
	   than a silent fall back to the default: an agent that asked for the
	   product spec and got the sending manual would follow the wrong one. */
	const requested = new URL(request.url).searchParams.get("doc")?.trim() || DEFAULT_SPEC;
	const specPath = SPECS[requested];
	if (!specPath) {
		return NextResponse.json(
			{ error: "unknown_doc", available: Object.keys(SPECS) },
			{ status: 404 },
		);
	}

	let spec: string;
	try {
		spec = await readFile(path.join(process.cwd(), specPath), "utf8");
	} catch (error) {
		console.error("Spec is missing from the deployment", { path: specPath, error });
		return NextResponse.json({ error: "spec_unavailable" }, { status: 503 });
	}

	return new NextResponse(spec, {
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
			"Cache-Control": "no-store, private",
		},
	});
}
