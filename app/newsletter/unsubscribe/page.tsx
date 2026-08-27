"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Mail } from "lucide-react";
import SiteNav from "@/components/home/SiteNav";
import SiteFooter from "@/components/home/SiteFooter";
import { EVENTS, track } from "@/lib/analytics";

/* Opting out. Reached from the link in every issue, and from the mail client's
   own unsubscribe button by way of app/api/newsletter/unsubscribe/route.ts.

   It asks before acting rather than unsubscribing on load. Inbox security
   scanners fetch every link in a message before a person ever sees it, so a
   page that opted people out on sight would quietly empty the list. One button
   press is the difference between a click and a crawl.

   The address is never shown before the press: the page only holds a token, and
   resolving it to an address in the browser would turn a link anyone can copy
   into an email lookup. The confirmation names it, because by then the person
   has proved they hold the token. */

type Status = "idle" | "submitting" | "done" | "error";

function UnsubscribeCard() {
	const token = useSearchParams().get("token")?.trim() ?? "";
	const [status, setStatus] = useState<Status>("idle");
	const [email, setEmail] = useState<string | null>(null);

	async function onConfirm() {
		if (status === "submitting" || !token) return;
		setStatus("submitting");
		try {
			const response = await fetch("/api/newsletter/unsubscribe", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token }),
			});
			if (!response.ok) throw new Error("unsubscribe_failed");

			const result = (await response.json()) as { status?: string; email?: string };
			setEmail(result.email ?? null);
			track(EVENTS.NEWSLETTER_UNSUBSCRIBED, {
				/* An unknown token is still a completed opt-out from where the person
				   is standing, but it is not a list change, and the two should not be
				   counted as the same thing. */
				known: result.status !== "unknown",
			});
			setStatus("done");
		} catch {
			setStatus("error");
		}
	}

	/* A link with no token at all — someone typed the path, or a mail client
	   mangled the query string. There is nothing to act on, so say so plainly
	   and give them the one thing that does work. */
	if (!token) {
		return (
			<>
				<h1 className="text-2xl md:text-3xl font-bold text-do-text mb-3">
					This unsubscribe link is incomplete
				</h1>
				<p className="text-base text-do-text-secondary leading-relaxed">
					The link is missing the part that tells us which subscription to end.
					Open the unsubscribe link in any issue we&apos;ve sent you, or email{" "}
					<a className="text-do-orange hover:underline" href="mailto:rahul@construction.live">
						rahul@construction.live
					</a>{" "}
					and we&apos;ll take you off the list by hand.
				</p>
			</>
		);
	}

	if (status === "done") {
		return (
			<div className="text-center py-2">
				<div className="h-14 w-14 rounded-2xl bg-do-orange/10 border border-do-orange/20 flex items-center justify-center mx-auto mb-5">
					<CheckCircle2 className="h-7 w-7 text-do-orange" />
				</div>
				<h1 className="text-2xl md:text-3xl font-bold text-do-text mb-3">
					You&apos;re unsubscribed.
				</h1>
				<p className="text-base text-do-text-secondary max-w-lg mx-auto leading-relaxed">
					{email ? (
						<>
							<span className="text-do-text font-medium">{email}</span> won&apos;t get
							the newsletter again.
						</>
					) : (
						<>That address won&apos;t get the newsletter again.</>
					)}{" "}
					No hard feelings — you can still reach us any time at{" "}
					<a className="text-do-orange hover:underline" href="/contact">
						/contact
					</a>
					.
				</p>
			</div>
		);
	}

	return (
		<div className="text-center py-2">
			<div className="h-14 w-14 rounded-2xl bg-do-orange/10 border border-do-orange/20 flex items-center justify-center mx-auto mb-5">
				<Mail className="h-7 w-7 text-do-orange" />
			</div>
			<h1 className="text-2xl md:text-3xl font-bold text-do-text mb-3">
				Unsubscribe from the newsletter?
			</h1>
			<p className="text-base text-do-text-secondary max-w-lg mx-auto leading-relaxed mb-8">
				One press and the address this link came from stops receiving it. Nothing else
				changes, and you can subscribe again whenever you like.
			</p>

			{status === "error" && (
				<p className="text-sm text-red-500 mb-5">
					That didn&apos;t go through. Try again, or email{" "}
					<a className="underline" href="mailto:rahul@construction.live">
						rahul@construction.live
					</a>{" "}
					and we&apos;ll do it by hand.
				</p>
			)}

			<button
				type="button"
				onClick={onConfirm}
				disabled={status === "submitting"}
				className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-white bg-do-orange hover:bg-do-orange-dark rounded-xl transition-all shadow-[0_0_40px_rgba(249,115,22,0.3)] hover:shadow-[0_0_60px_rgba(249,115,22,0.5)] disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed"
			>
				{status === "submitting" ? "Unsubscribing..." : "Yes, unsubscribe me"}
			</button>
			<p className="mt-4 text-xs text-do-text-muted">
				Changed your mind? Just close this tab — nothing happens until you press it.
			</p>
		</div>
	);
}

export default function UnsubscribePage() {
	return (
		<main className="min-h-screen bg-do-bg">
			<SiteNav />

			<div className="relative overflow-hidden">
				<div className="absolute inset-0 do-blueprint-grid pointer-events-none" />
				<div className="absolute top-[18rem] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-do-orange/[0.04] rounded-full blur-[150px] pointer-events-none" />

				<section className="relative pt-28 pb-24">
					<div className="relative z-10 max-w-2xl mx-auto px-6">
						<div className="rounded-3xl border border-do-orange/20 bg-do-bg-card/80 backdrop-blur-xl p-7 md:p-10">
							{/* useSearchParams opts the tree into client rendering, and Next
							    requires the boundary to be explicit. */}
							<Suspense
								fallback={
									<p className="text-sm text-do-text-secondary text-center py-8">
										Loading...
									</p>
								}
							>
								<UnsubscribeCard />
							</Suspense>
						</div>
					</div>
				</section>
			</div>

			<SiteFooter />
		</main>
	);
}
