import { NextResponse } from "next/server";
import type { FunctionArgs } from "convex/server";
import { api } from "@/convex/_generated/api";
import { bearerFrom } from "@/lib/newsletterAuth";
import { absoluteUrl } from "@/lib/site";
import { convexClient, mapConvexError, pickFields, UPDATE_FIELDS } from "@/lib/agentBlog";

/* A single agent-managed post, addressed by its current slug.

   GET    — read the full post (including content) so the agent can edit from
            what's actually stored rather than guessing.
   PUT    — partial update from a JSON body: only the fields present are written,
            so fixing a typo doesn't mean resending the whole post. Pass
            `newSlug` to rename; the URL otherwise stays put.
   DELETE — remove the post.

   Same bearer-secret auth as the collection route; the secret is re-checked
   inside Convex. */

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(request: Request, { params }: Ctx) {
	const convex = convexClient();
	if (!convex) {
		return NextResponse.json({ error: "not_configured" }, { status: 503 });
	}

	const apiKey = bearerFrom(request);
	if (!apiKey) {
		return NextResponse.json({ error: "missing_api_key" }, { status: 401 });
	}

	const { slug } = await params;
	try {
		const post = await convex.query(api.posts.agentGet, { apiKey, slug });
		if (!post) {
			return NextResponse.json({ error: "not_found" }, { status: 404 });
		}
		return NextResponse.json(
			{ post },
			{ headers: { "Cache-Control": "no-store, private" } },
		);
	} catch (error) {
		return mapConvexError(error);
	}
}

export async function PUT(request: Request, { params }: Ctx) {
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

	const { slug } = await params;
	try {
		const args = {
			apiKey,
			slug,
			...pickFields(body, UPDATE_FIELDS),
		} as unknown as FunctionArgs<typeof api.posts.agentUpdate>;
		const result = await convex.mutation(api.posts.agentUpdate, args);
		return NextResponse.json(
			{ id: result.id, slug: result.slug, url: absoluteUrl(`/blog/${result.slug}`) },
			{ headers: { "Cache-Control": "no-store, private" } },
		);
	} catch (error) {
		return mapConvexError(error);
	}
}

export async function DELETE(request: Request, { params }: Ctx) {
	const convex = convexClient();
	if (!convex) {
		return NextResponse.json({ error: "not_configured" }, { status: 503 });
	}

	const apiKey = bearerFrom(request);
	if (!apiKey) {
		return NextResponse.json({ error: "missing_api_key" }, { status: 401 });
	}

	const { slug } = await params;
	try {
		const result = await convex.mutation(api.posts.agentDelete, { apiKey, slug });
		return NextResponse.json(
			{ deleted: result.deleted, slug: result.slug },
			{ headers: { "Cache-Control": "no-store, private" } },
		);
	} catch (error) {
		return mapConvexError(error);
	}
}
