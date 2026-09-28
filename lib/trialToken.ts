import { createHash, randomBytes } from "node:crypto";

/* Secrets for the /try onboarding: the verification link, and the IP counter
   the rate limiter counts against.

   This is Node-only (node:crypto). It is imported by route handlers, which run
   on the Node runtime; don't pull it into a client component. */

/* 32 bytes of CSPRNG output, hex. Deliberately not randomUUID(): a UUIDv4
   carries 122 bits of entropy and a recognisable shape, and this token is the
   only thing standing between a guess and a verified signup. */
export function mintTrialToken() {
	return randomBytes(32).toString("hex");
}

/** The digest stored against a signup. Never store the token itself.

    Plain SHA-256 with no salt or stretching, which would be wrong for a
    password and is right here: the input is already 256 bits of randomness, so
    there is no dictionary to run and nothing for a work factor to slow down.
    What the digest buys is that a leaked database row can't be replayed as a
    working link — the only copy of the token is in the recipient's inbox. */
export function hashTrialToken(token: string) {
	return createHash("sha256").update(token).digest("hex");
}

/** The client IP, as the platform reports it, or null behind no proxy.

    x-forwarded-for is a client-settable header everywhere except behind a proxy
    that overwrites it, which is what our host does. It is spoofable in
    principle; it is still the only IP we get, and a rate limit that a
    determined attacker can rotate past is worth more than none, because it
    stops the undetermined majority. */
export function clientIp(request: Request) {
	const forwarded = request.headers.get("x-forwarded-for");
	if (forwarded) {
		/* The leftmost entry is the original client; everything after it was
		   appended by a hop. Trusting the rightmost instead would rate-limit our
		   own load balancer as one visitor. */
		const first = forwarded.split(",")[0]?.trim();
		if (first) return first;
	}
	return request.headers.get("x-real-ip")?.trim() || null;
}

/** A salted digest of an IP, for counting without keeping the address.

    The salt is the point. An unsalted SHA-256 of an IPv4 address is reversible
    by anyone willing to hash four billion inputs, which is minutes of work — so
    without TRIAL_IP_SALT set, the stored hashes would be a location log of
    everyone who used the form. With it, they are only useful for the one thing
    we need: telling whether two submissions came from the same place. */
export function hashIp(ip: string) {
	const salt = process.env.TRIAL_IP_SALT ?? process.env.NEWSLETTER_UNSUBSCRIBE_SECRET ?? "";
	return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}
