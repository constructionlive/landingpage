import { NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { describeAttribution, sanitizeAttributionPayload } from "@/lib/attribution";
import { hashTrialToken } from "@/lib/trialToken";
import { isValidAnswer, TRIAL_NOTES_MAX } from "@/lib/trial";

/* Step 3 of /try: the three questions, posted with the token from the link.

   The token is the only credential. There is no session and no cookie, which
   is fine because the token was mailed to the address and has already been
   used to verify it — holding it is the proof. convex/trial.ts refuses answers
   for a row that isn't verified, so this route can't be used to skip the mail. */

function asString(value: unknown, max = 500) {
	return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
	const convexUrl = process.env.CONVEX_URL ?? process.env.NEXT_PUBLIC_CONVEX_URL;
	if (!convexUrl) {
		console.error("Trial answers received but no Convex URL is configured.");
		return NextResponse.json({ error: "not_configured" }, { status: 503 });
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: "invalid_body" }, { status: 400 });
	}

	const payload = body as Record<string, unknown>;

	const token = asString(payload.token, 64);
	if (!/^[0-9a-f]{64}$/.test(token)) {
		return NextResponse.json({ status: "unknown" });
	}

	/* Answers must be one of the options the page offered. Free text here
	   would make the founder's inbox an open field for whatever a script wants
	   to write; the notes box below is the one place for that, and it is
	   length-capped. */
	const biggestProblem = asString(payload.biggestProblem, 120);
	const workType = asString(payload.workType, 120);
	const teamSize = asString(payload.teamSize, 120);
	if (
		!isValidAnswer("biggestProblem", biggestProblem) ||
		!isValidAnswer("workType", workType) ||
		!isValidAnswer("teamSize", teamSize)
	) {
		return NextResponse.json({ error: "invalid_answers" }, { status: 400 });
	}
	const notes = asString(payload.notes, TRIAL_NOTES_MAX);

	const attribution = sanitizeAttributionPayload(payload.attribution);

	try {
		const convex = new ConvexHttpClient(convexUrl);
		const result = await convex.mutation(api.trial.submitTrialAnswers, {
			tokenHash: hashTrialToken(token),
			biggestProblem,
			workType,
			teamSize,
			notes: notes || undefined,
			sourceFirst: attribution?.first && describeAttribution(attribution.first),
			sourceLast: attribution?.last && describeAttribution(attribution.last),
		});
		return NextResponse.json(result);
	} catch (error) {
		console.error("Failed to record trial answers", { error });
		return NextResponse.json({ error: "submit_failed" }, { status: 500 });
	}
}
