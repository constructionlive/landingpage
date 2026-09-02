import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { FunctionArgs } from "convex/server";
import { api } from "@/convex/_generated/api";
import { bearerFrom } from "@/lib/newsletterAuth";
import { absoluteUrl } from "@/lib/site";
import { convexClient, mapConvexError, pickFields } from "@/lib/agentApi";
import { PAGE_CREATE_FIELDS } from "@/lib/agentPages";

/* The agent's landing-page collection endpoint.

   GET  — list every page (slug, headline, timestamps), so the agent can see
          what exists before writing another one.
   POST — create a page from { slug, headline, content, ...optional }.

   Same bearer secret as /api/blog, re-checked inside Convex.

   Unlike the blog, the pages these write are statically rendered: /for/<slug>
   is generated once and served from the cache, so a visitor never waits on
   Convex. That only stays correct if a write invalidates what was cached, which
   is what the revalidatePath calls below do — the sitemap too, since a new page
   changes it. Without them a page would be created and then 404 until the next
   deploy. */

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
		const pages = await convex.query(api.landingPages.agentList, { apiKey });
		return NextResponse.json(
			{ pages },
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

	/* Refuse early with a clear message rather than letting Convex's validator
	   reject a half-empty call. */
	for (const field of ["slug", "headline", "content"] as const) {
		const value = body?.[field];
		if (typeof value !== "string" || !value.trim()) {
			return NextResponse.json(
				{ error: "missing_fields", detail: `${field} is required` },
				{ status: 400 },
			);
		}
	}

	try {
		const args = {
			apiKey,
			...pickFields(body, PAGE_CREATE_FIELDS),
		} as unknown as FunctionArgs<typeof api.landingPages.agentCreate>;
		const result = await convex.mutation(api.landingPages.agentCreate, args);

		revalidatePath(`/for/${result.slug}`);
		revalidatePath("/sitemap.xml");

		return NextResponse.json(
			{ id: result.id, slug: result.slug, url: absoluteUrl(`/for/${result.slug}`) },
			{ status: 201, headers: { "Cache-Control": "no-store, private" } },
		);
	} catch (error) {
		return mapConvexError(error);
	}
}
