import { timingSafeEqual } from "node:crypto";

/* Bearer-key checking for the newsletter endpoints the sending agent calls.

   Node-only (node:crypto), so it belongs to route handlers rather than
   anything that could be pulled into a client bundle. */

/** The token from an `Authorization: Bearer …` header, or "" if absent. */
export function bearerFrom(request: Request) {
	const header = request.headers.get("authorization") ?? "";
	const match = /^Bearer\s+(.+)$/i.exec(header.trim());
	return match ? match[1].trim() : "";
}

/** Whether `provided` is the configured API key. False when none is set. */
export function apiKeyMatches(provided: string) {
	const expected = process.env.NEWSLETTER_API_KEY;

	/* No key configured means nothing matches, never "everything matches".
	   Falling open here would turn a missing env var into an open endpoint. */
	if (!expected || !provided) return false;

	/* Compared in time that doesn't depend on where the first difference is.
	   timingSafeEqual throws on a length mismatch, which would itself leak the
	   expected length, so lengths are checked first and a mismatch is simply a
	   rejection. */
	if (provided.length !== expected.length) return false;

	try {
		return timingSafeEqual(Buffer.from(provided, "utf8"), Buffer.from(expected, "utf8"));
	} catch {
		return false;
	}
}
