"use client";

import { useCallback, useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import posthog from "posthog-js";
import { OPEN_PREFERENCES_EVENT, consentRequired } from "@/lib/consent";
import { clearStoredAttribution, recordVisit } from "@/lib/attribution";

/* The consent banner. PostHog stores the decision itself, in
   `__ph_opt_in_out_<token>`, so this component holds no persistence of its own
   — it only asks the question and forwards the answer.

   One view, two equally weighted choices. There is exactly one optional cookie
   category here, so a toggle panel would only be a slower path to the same two
   outcomes; the copy explains the categories instead and the privacy policy
   carries the detail. */
export default function CookieConsent() {
	/* Starts closed and is only ever opened from an effect. Whether to show the
	   banner depends on cookies and localStorage, neither of which the server
	   can see, so deciding during render would desync hydration. */
	const [open, setOpen] = useState(false);

	useEffect(() => {
		/* If the token is missing, posthog.init() never completed and there is
		   nothing to consent to. */
		if (!posthog.__loaded) return;

		/* `get_explicit_consent_status()` and not the has_opted_* pair, which
		   cannot answer this question. posthog-js resolves
		   `has_opted_out_capturing()` through `isRejected()`, which is true when
		   the visitor is merely *undecided* and `opt_out_capturing_by_default`
		   is set — which is exactly every EEA visitor, since
		   instrumentation-client.ts sets that flag for them. So the old
		   `has_opted_in || has_opted_out` test read `decided === true` for the
		   one group the banner exists to ask, and the banner never opened in
		   the EEA at all: those visitors were silently opted out with no way to
		   opt in. This call returns "pending" until a real choice is stored. */
		const decided = posthog.get_explicit_consent_status() !== "pending";

		if (consentRequired() && !decided) setOpen(true);

		/* Anyone, in any region, can reopen this from the footer — that is how a
		   visitor withdraws consent, and how visitors outside the EEA exercise
		   the opt-out our privacy policy describes. */
		const reopen = () => setOpen(true);
		window.addEventListener(OPEN_PREFERENCES_EVENT, reopen);
		return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, reopen);
	}, []);

	const applyChoice = useCallback((allowAnalytics: boolean) => {
		const wasOptedIn = posthog.has_opted_in_capturing();

		if (allowAnalytics) {
			posthog.opt_in_capturing();
			/* The pageview for the current page was suppressed while we were
			   opted out, so record it now rather than losing the entry page.
			   Guarded so reopening the banner and accepting again doesn't
			   double-count it. */
			if (!wasOptedIn) posthog.capture("$pageview");
			/* Same reasoning for attribution: they may well have arrived on a
			   campaign link and only reached this banner afterwards. Recording
			   now captures that as first-touch instead of losing the very visit
			   that brought them here. */
			recordVisit(true);
		} else {
			posthog.opt_out_capturing();
			/* Withdrawing consent has to actually withdraw it. Leaving the
			   attribution cookie behind would keep a marketing identifier on the
			   device of someone who just said no. */
			clearStoredAttribution();
		}

		setOpen(false);
	}, []);

	if (!open) return null;

	return (
		<div
			role="dialog"
			aria-modal="false"
			aria-labelledby="cookie-consent-heading"
			className="fixed inset-x-0 bottom-0 z-50 p-4 sm:p-6"
		>
			{/* Wide and short: on desktop the buttons sit beside the copy rather
			    than under it, which removes a whole row of height. */}
			<div className="mx-auto max-w-5xl rounded-2xl border border-do-border bg-do-bg-card/95 backdrop-blur-md px-6 py-5 shadow-2xl">
				<div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
					<div className="flex gap-4 flex-1 min-w-0">
						<div className="hidden sm:flex h-10 w-10 shrink-0 rounded-lg bg-do-orange/10 border border-do-orange/20 items-center justify-center">
							<Cookie className="h-5 w-5 text-do-orange" aria-hidden="true" />
						</div>

						<div className="min-w-0">
							<h2
								id="cookie-consent-heading"
								className="font-semibold text-do-text mb-1"
							>
								construction.live cookies 🍪
							</h2>

							<p className="text-sm text-do-text-secondary leading-relaxed">
								We use essential cookies to keep the site running smoothly. We also use analytics cookies to see
								which pages people find useful, so we can improve them. You can choose which
								cookies to accept, and change this at any time.
							</p>

							<div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
								<a
									href="/privacy"
									className="text-sm font-medium text-do-orange hover:underline underline-offset-2"
								>
									Privacy Policy
								</a>
								<a
									href="/privacy#cookies-and-similar-technologies"
									className="text-sm font-medium text-do-orange hover:underline underline-offset-2"
								>
									More information
								</a>
							</div>
						</div>
					</div>

					<div className="flex flex-col sm:flex-row gap-3 shrink-0">
						<button
							type="button"
							onClick={() => applyChoice(false)}
							className="whitespace-nowrap rounded-lg bg-do-bg-hover px-5 py-2.5 text-sm font-semibold text-do-text transition-colors hover:bg-do-border-accent"
						>
							Essential only
						</button>
						<button
							type="button"
							onClick={() => applyChoice(true)}
							className="whitespace-nowrap rounded-lg bg-do-orange px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-do-orange-dark"
						>
							Accept all
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
