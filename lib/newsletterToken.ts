import { createHmac, timingSafeEqual } from "node:crypto";

/* Signed unsubscribe links.

   The sending app and this site share a secret, so the sender can derive a
   recipient's opt-out token from their address alone — no call back here, no
   list of tokens to hold. We recompute the same value and compare.

   This secret is NOT the API key that guards the subscriber feed, and the two
   must not be merged back into one. They do different jobs on different
   clocks: the API key is an access credential you should be able to revoke the
   afternoon a laptop goes missing, while this one signs links that have to
   keep working for months in inboxes we can't reach. Share one secret between
   them and revoking access silently kills every opt-out link already sent —
   which is the single failure an unsubscribe mechanism cannot have. Reusing one
   key for both authentication and signing is a bad idea on its own terms too.

   The signature covers the NORMALISED address, so a link still verifies when a
   mail client rewrites the query string's casing, and so it matches the
   normalizedEmail the register is keyed on. Sign the raw address instead and
   the same person gets two different valid tokens depending on how they typed
   their address the day they subscribed.

   No expiry in the token on purpose. CASL requires the mechanism to keep
   working for at least 60 days after a send, people unsubscribe from mail they
   dug out of an archive, and an opt-out link that has quietly expired is worse
   than no link. The token grants exactly one power — removing that one address
   from a marketing list — so a long life is a fair trade.

   This is Node-only (node:crypto). It is imported by route handlers, which run
   on the Node runtime; don't pull it into a client component. */

export const TOKEN_ALGORITHM = "sha256";

export function normalizeEmail(email: string) {
	return email.trim().toLowerCase();
}

/** The token for an address. Hex HMAC-SHA256 of the normalised address. */
export function signEmail(email: string, secret: string) {
	return createHmac(TOKEN_ALGORITHM, secret).update(normalizeEmail(email)).digest("hex");
}

/** The signing secrets, current first.

    A second, optional secret exists so the current one can actually be rotated.
    Links are derived rather than stored, so the moment the secret changes every
    unsubscribe link already delivered stops verifying. Set the old value as
    NEWSLETTER_UNSUBSCRIBE_SECRET_PREVIOUS when rotating and both are accepted;
    drop it once enough time has passed that the old links no longer matter.
    Without this, rotating the key means breaking opt-out for everyone who was
    mailed before the change. */
export function unsubscribeSecrets() {
	return [
		process.env.NEWSLETTER_UNSUBSCRIBE_SECRET,
		process.env.NEWSLETTER_UNSUBSCRIBE_SECRET_PREVIOUS,
	].filter((secret): secret is string => typeof secret === "string" && secret !== "");
}

/** Whether `token` is our signature for `email` under ANY accepted secret. */
export function verifyEmailTokenWithAny(email: string, token: string, secrets: string[]) {
	/* Every secret is checked even after one matches. Stopping early would make
	   the response time reveal which key signed the link, and a rotation window
	   is exactly when that is worth not leaking. */
	return secrets.reduce(
		(matched, secret) => verifyEmailToken(email, token, secret) || matched,
		false,
	);
}

/** Whether `token` is our signature for `email`. Never throws on malformed input. */
export function verifyEmailToken(email: string, token: string, secret: string) {
	if (!email || !token || !secret) return false;

	const expected = signEmail(email, secret);

	/* timingSafeEqual throws on a length mismatch, which would itself leak the
	   expected length, so the lengths are compared first and a mismatch is just
	   a rejection. Both sides are fixed-length hex from the same algorithm, so
	   an unequal length only ever means a malformed token. */
	if (token.length !== expected.length) return false;

	try {
		return timingSafeEqual(Buffer.from(token, "utf8"), Buffer.from(expected, "utf8"));
	} catch {
		return false;
	}
}
