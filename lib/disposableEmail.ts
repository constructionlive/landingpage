/* Throwaway mailbox domains, rejected by the /try onboarding.

   Verification alone doesn't stop a script: every domain below hands out a
   working inbox with no signup, so a bot can receive our link and click it. The
   list is what makes the mail step mean something — after it, getting through
   costs either a real work address or the trouble of registering a domain.

   Deliberately short and hand-kept rather than one of the 100k-entry lists on
   npm. Those are mostly dead domains, they go stale the moment they're vendored
   and every false positive is a real contractor told their email is invalid.
   These are the services that actually show up in signup noise. Add one when
   you see it in the register, not preemptively.

   Free consumer providers (gmail, outlook, yahoo) are NOT here and must not be
   added: a two-person framing crew running off a Gmail address is exactly who
   this product is for, and blocking them to look enterprise would cost real
   customers to stop zero bots. */
const DISPOSABLE_DOMAINS = new Set([
	"10minutemail.com",
	"20minutemail.com",
	"33mail.com",
	"dispostable.com",
	"emailondeck.com",
	"fakeinbox.com",
	"getairmail.com",
	"getnada.com",
	"guerrillamail.com",
	"guerrillamail.info",
	"guerrillamail.net",
	"inboxbear.com",
	"mailcatch.com",
	"maildrop.cc",
	"mailinator.com",
	"mailnesia.com",
	"mailsac.com",
	"moakt.com",
	"mohmal.com",
	"mytemp.email",
	"sharklasers.com",
	"spam4.me",
	"temp-mail.io",
	"temp-mail.org",
	"tempmail.com",
	"tempmailo.com",
	"tempr.email",
	"throwawaymail.com",
	"trashmail.com",
	"tuta.io",
	"yopmail.com",
	"yopmail.fr",
	"yopmail.net",
]);

/* Subdomain services: one host below covers every `anything.mailinator.com`,
   which is how these are handed out and how a blocklist of bare domains gets
   walked around in one character. */
const DISPOSABLE_SUFFIXES = [
	".mailinator.com",
	".guerrillamail.com",
	".yopmail.com",
	".33mail.com",
	".temp-mail.org",
];

export function isDisposableEmail(email: string) {
	const domain = email.trim().toLowerCase().split("@")[1];
	if (!domain) return false;
	if (DISPOSABLE_DOMAINS.has(domain)) return true;
	return DISPOSABLE_SUFFIXES.some((suffix) => domain.endsWith(suffix));
}

/* Stricter than the loose pattern the other forms use, because this address has
   to actually receive a message for the signup to go anywhere. Still a shape
   check and nothing more: the only real test of an address is mail arriving at
   it, which is the entire point of the step that follows. */
export function isPlausibleEmail(email: string) {
	return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(email.trim());
}
