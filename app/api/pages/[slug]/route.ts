import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { FunctionArgs } from "convex/server";
import { api } from "@/convex/_generated/api";
import { bearerFrom } from "@/lib/newsletterAuth";
import { absoluteUrl } from "@/lib/site";
import { convexClient, mapConvexError, pickFields } from "@/lib/agentApi";
import { PAGE_UPDATE_FIELDS } from "@/lib/agentPages";

/* A single agent-managed landing page, addressed by its current slug.

   GET    — read the page back, including its HTML `content`.
   PUT    — partial update; only the fields present are written. Pass `newSlug`
            to move it, which purges the old URL as well as the new one.
   DELETE — remove it, and drop the rendered page from the cache.

   Same bearer secret as /api/blog, re-checked inside Convex. See the note in
   ../route.ts on why every write revalidates. */

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
		const page = await convex.query(api.landingPages.agentGet, { apiKey, slug });
		if (!page) {
			return NextResponse.json({ error: "not_found" }, { status: 404 });
		}
		return NextResponse.json(
			{ page },
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
			...pickFields(body, PAGE_UPDATE_FIELDS),
		} as unknown as FunctionArgs<typeof api.landingPages.agentUpdate>;
		const result = await convex.mutation(api.landingPages.agentUpdate, args);

		revalidatePath(`/for/${result.slug}`);
		/* A rename leaves the old URL cached and still serving the page it no
		   longer owns, so that one is purged too. */
		if (result.previousSlug !== result.slug) {
			revalidatePath(`/for/${result.previousSlug}`);
		}
		revalidatePath("/sitemap.xml");

		return NextResponse.json(
			{ id: result.id, slug: result.slug, url: absoluteUrl(`/for/${result.slug}`) },
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
		const result = await convex.mutation(api.landingPages.agentDelete, { apiKey, slug });

		revalidatePath(`/for/${result.slug}`);
		revalidatePath("/sitemap.xml");

		return NextResponse.json(
			{ deleted: result.deleted, slug: result.slug },
			{ headers: { "Cache-Control": "no-store, private" } },
		);
	} catch (error) {
		return mapConvexError(error);
	}
}
