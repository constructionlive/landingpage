import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { hashTrialToken } from "@/lib/trialToken";

/* Step 2 of /try: the link from the mail is opened.

   A POST rather than a GET on purpose, and the page only calls it once the
   person presses a button. Inbox security scanners fetch every link in a
   message before anyone reads it, so a link that verified on sight would mark
   scraper-fed addresses as verified — the exact thing this step exists to
   prevent. See app/try/verify/page.tsx. */

export async function POST(request: Request) {
	const convexUrl = process.env.CONVEX_URL ?? process.env.NEXT_PUBLIC_CONVEX_URL;
	if (!convexUrl) {
		console.error("Trial verification received but no Convex URL is configured.");
		return NextResponse.json({ error: "not_configured" }, { status: 503 });
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "invalid_body" }, { status: 400 });
	}

	const token = typeof (body as { token?: unknown }).token === "string"
		? (body as { token: string }).token.trim()
		: "";
	/* Tokens are 64 hex characters (see mintTrialToken). Anything else is not
	   ours, and is rejected before it costs a database read. */
	if (!/^[0-9a-f]{64}$/.test(token)) {
		return NextResponse.json({ status: "unknown" });
	}

	try {
		const convex = new ConvexHttpClient(convexUrl);
		const result = await convex.mutation(api.trial.verifyTrial, {
			tokenHash: hashTrialToken(token),
		});
		return NextResponse.json(result);
	} catch (error) {
		console.error("Failed to verify trial signup", { error });
		return NextResponse.json({ error: "verify_failed" }, { status: 500 });
	}
}
