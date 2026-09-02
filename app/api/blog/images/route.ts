import { NextResponse } from "next/server";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { bearerFrom } from "@/lib/newsletterAuth";
import { convexClient, mapConvexError } from "@/lib/agentApi";

/* Host an image for an agent-written post and hand back a public URL to embed
   in the post's cover field or inline <img>.

   POST accepts either:
     - raw image bytes with an image/* Content-Type (e.g. a PNG the agent just
       generated), or
     - JSON { "sourceUrl": "https://…" } to pull an image from elsewhere.

   The file lands in Convex file storage on a *.convex.cloud host, which is
   already allowlisted for the Next image optimizer in next.config.ts, so the
   returned URL renders through <RemoteImage> like an editor's upload. Same
   bearer-secret auth as the other blog routes.

   Response: { "url": "https://…convex.cloud/…", "storageId": "…" }. */

export const dynamic = "force-dynamic";

/* A safety cap so a stray large upload can't be streamed into storage. Cover
   images and inline art sit well under this. */
const MAX_BYTES = 15 * 1024 * 1024;

export async function POST(request: Request) {
	const convex = convexClient();
	if (!convex) {
		return NextResponse.json({ error: "not_configured" }, { status: 503 });
	}

	const apiKey = bearerFrom(request);
	if (!apiKey) {
		return NextResponse.json({ error: "missing_api_key" }, { status: 401 });
	}

	const contentType = request.headers.get("content-type") ?? "";
	let bytes: ArrayBuffer;
	let mime: string;

	try {
		if (contentType.includes("application/json")) {
			const body = (await request.json()) as { sourceUrl?: unknown };
			const sourceUrl = typeof body?.sourceUrl === "string" ? body.sourceUrl.trim() : "";
			if (!sourceUrl) {
				return NextResponse.json(
					{ error: "missing_source", detail: "sourceUrl is required for a JSON body" },
					{ status: 400 },
				);
			}
			const fetched = await fetch(sourceUrl);
			if (!fetched.ok) {
				return NextResponse.json(
					{ error: "source_fetch_failed", status: fetched.status },
					{ status: 400 },
				);
			}
			mime = fetched.headers.get("content-type") ?? "application/octet-stream";
			bytes = await fetched.arrayBuffer();
		} else {
			mime = contentType || "application/octet-stream";
			bytes = await request.arrayBuffer();
		}
	} catch {
		return NextResponse.json({ error: "invalid_body" }, { status: 400 });
	}

	if (!mime.startsWith("image/")) {
		return NextResponse.json(
			{ error: "not_an_image", detail: `Content-Type was ${mime}` },
			{ status: 400 },
		);
	}
	if (bytes.byteLength === 0) {
		return NextResponse.json({ error: "empty_image" }, { status: 400 });
	}
	if (bytes.byteLength > MAX_BYTES) {
		return NextResponse.json(
			{ error: "image_too_large", max: MAX_BYTES, received: bytes.byteLength },
			{ status: 413 },
		);
	}

	try {
		/* Convex's flow: mint a one-time upload URL, POST the bytes to it, then
		   resolve the returned storage id to a public URL. */
		const uploadUrl = await convex.mutation(api.posts.agentGenerateUploadUrl, { apiKey });
		const uploaded = await fetch(uploadUrl, {
			method: "POST",
			headers: { "Content-Type": mime },
			body: bytes,
		});
		if (!uploaded.ok) {
			console.error("Convex storage upload failed", { status: uploaded.status });
			return NextResponse.json({ error: "upload_failed" }, { status: 502 });
		}
		const { storageId } = (await uploaded.json()) as { storageId: Id<"_storage"> };
		const url = await convex.query(api.posts.agentResolveImageUrl, { apiKey, storageId });
		return NextResponse.json(
			{ url, storageId },
			{ headers: { "Cache-Control": "no-store, private" } },
		);
	} catch (error) {
		return mapConvexError(error);
	}
}
