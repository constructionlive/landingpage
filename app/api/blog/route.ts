import { NextResponse } from "next/server";
import type { FunctionArgs } from "convex/server";
import { api } from "@/convex/_generated/api";
import { bearerFrom } from "@/lib/newsletterAuth";
import { absoluteUrl } from "@/lib/site";
import { convexClient, mapConvexError, pickFields, CREATE_FIELDS } from "@/lib/agentBlog";

/* The editorial agent's blog collection endpoint.

   GET  — list every post (id, slug, title, excerpt, timestamps), newest first,
          so the agent can see what already exists before writing.
   POST — create a post from a JSON body: { title, content, ...optional }.

   Authenticated with a bearer secret shared with the agent, not an editor
   session — the caller is a program with no user to sign in as. The secret is
   verified again inside the Convex function behind this route; see
   convex/posts.ts for why one check isn't enough. Posts written here are
   identical rows to the ones the /blog/new editor writes, so they appear in the
   same /blog list at the same URLs.

   Never cached: writes must reach Convex and the list must be live. */

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
	const convex = convexClient();
	if (!convex) {
		return NextResponse.json({ error: "not_configured" }, { status: 503 });
	}

	const apiKey = bearerFrom(request);
	if (!apiKey) {
		return NextResponse.json({ error: "missing_api_key" }, { status: 401 });
	}

	try {
		const posts = await convex.query(api.posts.agentList, { apiKey });
		return NextResponse.json(
			{ posts },
			{ headers: { "Cache-Control": "no-store, private" } },
		);
	} catch (error) {
		return mapConvexError(error);
	}
}

export async function POST(request: Request) {
	const convex = convexClient();
	if (!convex) {
		return NextResponse.json({ error: "not_configured" }, { status: 503 });
	}

	const apiKey = bearerFrom(request);
	if (!apiKey) {
		return NextResponse.json({ error: "missing_api_key" }, { status: 401 });
	}

	let body: Record<string, unknown>;
	try {
		body = (await request.json()) as Record<string, unknown>;
	} catch {
		return NextResponse.json({ error: "invalid_body" }, { status: 400 });
	}

	/* title and content carry the post; refuse early with a clear message rather
	   than letting Convex's validator reject a half-empty call. */
	if (typeof body?.title !== "string" || !body.title.trim()) {
		return NextResponse.json(
			{ error: "missing_fields", detail: "title is required" },
			{ status: 400 },
		);
	}
	if (typeof body?.content !== "string" || !body.content.trim()) {
		return NextResponse.json(
			{ error: "missing_fields", detail: "content is required" },
			{ status: 400 },
		);
	}

	try {
		/* Fields are validated (title/content above) and whitelisted by
		   pickFields; cast to the function's arg shape, which Convex re-checks. */
		const args = {
			apiKey,
			...pickFields(body, CREATE_FIELDS),
		} as unknown as FunctionArgs<typeof api.posts.agentCreate>;
		const result = await convex.mutation(api.posts.agentCreate, args);
		return NextResponse.json(
			{ id: result.id, slug: result.slug, url: absoluteUrl(`/blog/${result.slug}`) },
			{ status: 201, headers: { "Cache-Control": "no-store, private" } },
		);
	} catch (error) {
		return mapConvexError(error);
	}
}
