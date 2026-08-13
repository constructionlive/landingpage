import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

/* The Convex React provider is disabled app-wide, so the contact form posts
   here and we call the action server-side over HTTP instead. It arrives as
   multipart/form-data because of the optional photo. */

/* A phone photo is comfortably under this. The ceiling is not ours: a serverless
   function on Vercel rejects request bodies over 4.5MB before any of this code
   runs, so the cap has to leave room for the rest of the multipart body. Raising
   it means moving the upload off this route entirely. */
const MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = [
	"image/png",
	"image/jpeg",
	"image/jpg",
	"image/webp",
	"image/gif",
	"image/heic",
	"image/heif",
];

function asString(value: FormDataEntryValue | null, max = 500) {
	return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
	const convexUrl = process.env.CONVEX_URL ?? process.env.NEXT_PUBLIC_CONVEX_URL;
	if (!convexUrl) {
		console.error("Contact message received but no Convex URL is configured.");
		return NextResponse.json({ error: "not_configured" }, { status: 503 });
	}

	let form: FormData;
	try {
		form = await request.formData();
	} catch {
		return NextResponse.json({ error: "invalid_body" }, { status: 400 });
	}

	/* Honeypot: a field the form keeps hidden, so only a bot fills it in. We
	   answer with the same success shape rather than an error, because telling
	   a scraper it was caught only teaches it to stop filling the field. */
	if (asString(form.get("company_website"), 200)) {
		return NextResponse.json({ status: "created" });
	}

	const name = asString(form.get("name"), 120);
	const email = asString(form.get("email"), 200);
	/* Free text, so it gets a lot more room than the other answers. */
	const message = asString(form.get("message"), 5000);

	if (!name || !email || !message) {
		return NextResponse.json({ error: "missing_fields" }, { status: 400 });
	}
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return NextResponse.json({ error: "invalid_email" }, { status: 400 });
	}

	const company = asString(form.get("company"), 200);
	const topic = asString(form.get("topic"), 120);

	let attachment: { name: string; type: string; bytes: ArrayBuffer } | undefined;
	const file = form.get("attachment");
	if (file && typeof file !== "string" && file.size > 0) {
		if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
			return NextResponse.json({ error: "unsupported_file" }, { status: 400 });
		}
		if (file.size > MAX_ATTACHMENT_BYTES) {
			return NextResponse.json({ error: "file_too_large" }, { status: 400 });
		}
		attachment = {
			name: (file.name || "photo").slice(0, 200),
			type: file.type,
			bytes: await file.arrayBuffer(),
		};
	}

	try {
		const convex = new ConvexHttpClient(convexUrl);
		await convex.action(api.contact.submitContact, {
			name,
			email,
			company: company || undefined,
			topic: topic || undefined,
			message,
			attachment,
		});
	} catch (error) {
		console.error("Failed to record contact message", { email, error });
		return NextResponse.json({ error: "submit_failed" }, { status: 500 });
	}

	return NextResponse.json({ status: "created" });
}
