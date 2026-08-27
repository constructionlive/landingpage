"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import posthog from "posthog-js";
import NewsletterSignup from "@/components/NewsletterSignup";
import { EVENTS, track } from "@/lib/analytics";
import { consentRequired } from "@/lib/consent";

/* The subscribe prompt for someone who is still reading.

   It is a corner card rather than a modal over a dimmed page, and that is a
   deliberate downgrade of what was asked for. A blocking interstitial on a
   phone is the pattern Google demotes mobile results for, and this site earns
   its traffic through search — a few extra subscribers is a bad trade for the
   rankings that produce them. A card anchored to the corner covers nothing,
   needs no scroll lock and no focus trap, and converts nearly as well.

   Everything below is about NOT showing it. A prompt that appears twice, or
   appears to somebody who just subscribed, costs more goodwill than it earns. */

/* Long enough that a bounce never sees it, short enough to catch somebody
   halfway down the second page they opened. */
const DELAY_MS = 90_000;
/* And they must have actually moved down a page. Time alone shows it to a
   parked tab, which is a prompt nobody reads and a dismissal we then honour
   for a month. */
const SCROLL_FRACTION = 0.2;

const STORAGE_KEY = "cl_newsletter_prompt";
const DISMISS_DAYS = 30;

/* Where it must never appear.

   /newsletter is the ask itself; prompting there is asking twice. The opt-out
   page is worse than useless — inviting somebody to subscribe on the screen
   where they are leaving reads as not listening. The rest are staff routes. */
const SUPPRESSED_PREFIXES = ["/newsletter", "/admin", "/signin", "/blog/new"];

function isSuppressedPath(pathname: string) {
	if (SUPPRESSED_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return true;
	/* /blog/<slug>/edit */
	return /^\/blog\/[^/]+\/edit\/?$/.test(pathname);
}

/** "subscribed" forever, or a dismissal that expires. Unreadable storage = don't show. */
function shouldStayHidden() {
	try {
		const stored = window.localStorage.getItem(STORAGE_KEY);
		if (!stored) return false;
		if (stored === "subscribed") return true;

		const dismissedAt = Number(stored);
		if (!Number.isFinite(dismissedAt)) return true;
		return Date.now() - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000;
	} catch {
		/* Safari in private mode throws on localStorage. With no way to remember
		   a dismissal, the only respectful behaviour is to never ask. */
		return true;
	}
}

/** Records that this visitor should not be asked again. Never throws. */
export function silenceNewsletterPrompt(reason: "subscribed" | "dismissed") {
	try {
		window.localStorage.setItem(
			STORAGE_KEY,
			reason === "subscribed" ? "subscribed" : String(Date.now()),
		);
	} catch {
		/* Storage unavailable. The prompt stays hidden for this page view
		   regardless, because the component's own state has already closed it. */
	}
}

export default function NewsletterPrompt() {
	const pathname = usePathname();
	const reduceMotion = useReducedMotion();
	const [open, setOpen] = useState(false);
	const [closed, setClosed] = useState(false);

	useEffect(() => {
		if (closed || isSuppressedPath(pathname)) return;
		if (shouldStayHidden()) return;

		/* Never on top of the consent banner. Two overlays at once is a mess,
		   and the one that must be answered is the one about cookies. Checked
		   at fire time rather than on mount, so accepting cookies in the
		   meantime lets this appear normally. */
		const consentPending = () =>
			consentRequired() && (!posthog.__loaded || posthog.get_explicit_consent_status() === "pending");

		let scrolled = false;
		const onScroll = () => {
			const height = document.documentElement.scrollHeight - window.innerHeight;
			if (height > 0 && window.scrollY / height >= SCROLL_FRACTION) scrolled = true;
		};
		window.addEventListener("scroll", onScroll, { passive: true });
		onScroll();

		const timer = setTimeout(() => {
			if (!scrolled || consentPending()) return;
			setOpen(true);
			track(EVENTS.NEWSLETTER_PROMPT_SHOWN, { path: pathname });
		}, DELAY_MS);

		return () => {
			clearTimeout(timer);
			window.removeEventListener("scroll", onScroll);
		};
	}, [pathname, closed]);

	const dismiss = useCallback(() => {
		setOpen(false);
		/* Closed for this session as well as stored, so it cannot reappear on the
		   next navigation while the write is being swallowed by private mode. */
		setClosed(true);
		silenceNewsletterPrompt("dismissed");
		track(EVENTS.NEWSLETTER_PROMPT_DISMISSED, { path: pathname });
	}, [pathname]);

	/* Escape closes it. Cheap, expected, and the only keyboard affordance a
	   non-blocking card needs. */
	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") dismiss();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, dismiss]);

	return (
		<AnimatePresence>
			{open && (
				<motion.aside
					/* Not role="dialog": it neither traps focus nor blocks the page,
					   and announcing it as a modal would promise behaviour it does
					   not have. A complementary landmark is what this actually is. */
					aria-label="Subscribe to the newsletter"
					className="fixed z-40 inset-x-4 bottom-4 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[24rem]"
					initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
					animate={{ opacity: 1, y: 0 }}
					exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
					transition={{ duration: 0.35, ease: "easeOut" }}
				>
					<div className="relative rounded-2xl border border-do-orange/20 bg-do-bg-card/95 backdrop-blur-xl p-5 shadow-2xl">
						<button
							type="button"
							onClick={dismiss}
							aria-label="Close"
							className="absolute top-3 right-3 p-1.5 rounded-lg text-do-text-muted hover:text-do-text hover:bg-do-bg-light transition-colors"
						>
							<X className="h-4 w-4" />
						</button>

						<p className="do-section-label text-do-orange">Newsletter</p>
						<p className="mt-2 text-sm font-semibold text-do-text leading-snug pr-6">
							What AI is actually doing to construction paperwork
						</p>
						<p className="mt-1.5 text-[13px] text-do-text-secondary leading-relaxed">
							One email a week from the team building it. No pitch, one click to
							leave.
						</p>

						<div className="mt-4">
							{/* The same one-field form as the DM link. Somebody interrupted
							    mid-read will not fill in their trade. */}
							<NewsletterSignup variant="inline" location="scroll_prompt" />
						</div>
					</div>
				</motion.aside>
			)}
		</AnimatePresence>
	);
}
