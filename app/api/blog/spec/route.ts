import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { api } from "@/convex/_generated/api";
import { bearerFrom } from "@/lib/newsletterAuth";
import { convexClient, mapConvexError } from "@/lib/agentApi";
import { agentSpec } from "@/lib/agentSpec";

/* Serves the authoring agent its own capability manifest, behind the same key
   it uses for everything else — the counterpart of /api/newsletter/spec.

   The point is that the agent needs no local copy: it holds a key and an
   origin, asks what it can do, and gets the current answer. A list of endpoints
   pasted into a prompt months ago is a list that has quietly stopped matching
   the API, and an agent working from a stale contract fails in ways that look
   like the API is broken.

   Two shapes, because they answer different questions. The default JSON is the
   contract — every endpoint, and for the write ones the exact field names,
   built from the same whitelists the routes enforce so it cannot drift.
   `?doc=` returns the prose guides, which cover the part a field list can't:
   what makes a post or a landing page worth publishing.

   Authenticated rather than public, for the same reason the newsletter spec is:
   it holds no secrets, but it is a map of exactly which paths accept an
   authenticated write, and there's no reason to hand that to someone who hasn't
   already got the key. */

export const runtime = "nodejs";
/* Read per request, so correcting a doc doesn't need a redeploy, and so a
   cached copy can't outlive a change to the contract. */
export const dynamic = "force-dynamic";

/* next.config.ts names these in outputFileTracingIncludes so they ship with the
   deployed function — a file that only exists in the repo isn't there at
   runtime on a traced build. */
const DOCS: Record<string, string> = {
	blog: "docs/agentic-blog-authoring.md",
	pages: "docs/agentic-landing-pages.md",
};

export async function GET(request: Request) {
	const convex = convexClient();
	if (!convex) {
		return NextResponse.json({ error: "not_configured" }, { status: 503 });
	}

	const apiKey = bearerFrom(request);
	if (!apiKey) {
		return NextResponse.json({ error: "unauthorized" }, { status: 401 });
	}

	/* The key lives on the Convex deployment, not here, so Convex is what says
	   whether it's good. Same answer for "no key" and "wrong key": telling an
	   unauthenticated caller that the endpoint exists and is worth guessing at
	   is precisely the audience for the map inside. */
	try {
		await convex.query(api.agent.verifyKey, { apiKey });
	} catch (error) {
		return mapConvexError(error);
	}

	const requested = new URL(request.url).searchParams.get("doc")?.trim();
	if (!requested) {
		return NextResponse.json(agentSpec(), {
			headers: { "Cache-Control": "no-store, private" },
		});
	}

	/* An unknown name is a 404 rather than a silent fall back to the JSON: an
	   agent that asked for the landing-page guide and got something else would
	   follow the wrong one. */
	const docPath = DOCS[requested];
	if (!docPath) {
		return NextResponse.json(
			{ error: "unknown_doc", available: Object.keys(DOCS) },
			{ status: 404 },
		);
	}

	let doc: string;
	try {
		doc = await readFile(path.join(process.cwd(), docPath), "utf8");
	} catch (error) {
		console.error("Agent doc is missing from the deployment", { path: docPath, error });
		return NextResponse.json({ error: "doc_unavailable" }, { status: 503 });
	}

	return new NextResponse(doc, {
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
			"Cache-Control": "no-store, private",
		},
	});
}
