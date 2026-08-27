"use client";

import { useState, FormEvent } from "react";
import { ArrowRight, Check, CheckCircle2 } from "lucide-react";
import { EVENTS, track } from "@/lib/analytics";
import { attributionForSubmit } from "@/lib/attribution";

/* One form, two shapes.

   "inline" is the strip in the footer of every page: an address and a button,
   because a footer that asks four questions gets none of them answered.
   "card" is the form on /newsletter, where someone arrived on purpose and the
   extra answers are worth asking for.

   Both post to the same endpoint, so the register never has to care which one
   an address came from. Adding a field means changing this file, the validator
   in app/api/newsletter/route.ts, the mutation args in convex/newsletter.ts and
   the newsletterSubscribers table in convex/schema.ts. */

/* Optional, and the answer that decides which stories are worth their time.
   Only asked on the full card — the footer has no room for it. */
const INTERESTS = [
	"General contractor",
	"Subcontractor / trade",
	"Owner / developer",
	"Consultant",
	"Something else",
];

/* "already" is not an error and must not be shown as one, but it isn't a fresh
   signup either — see the note in lib/analytics.ts. */
type Status = "idle" | "submitting" | "done" | "already" | "error";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INPUT_CLASS =
	"w-full px-4 py-3 rounded-xl border border-do-border bg-do-bg/60 text-do-text placeholder:text-do-text-muted text-sm focus:outline-none focus:border-do-orange/40 focus:ring-1 focus:ring-do-orange/40 transition-colors";

export default function NewsletterSignup({
	variant = "card",
	location,
}: {
	variant?: "inline" | "card";
	/* Which copy of the form this is, for the event. See EVENTS in
	   lib/analytics.ts: without it, the footer and the page share one number. */
	location: string;
}) {
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [company, setCompany] = useState("");
	const [interest, setInterest] = useState("");
	/* Hidden from people, visible to bots. See the honeypot note in the route. */
	const [honeypot, setHoneypot] = useState("");
	const [status, setStatus] = useState<Status>("idle");

	const isCard = variant === "card";
	const ready = EMAIL_PATTERN.test(email.trim());

	async function onSubmit(e: FormEvent) {
		e.preventDefault();
		if (status === "submitting" || !ready) return;
		setStatus("submitting");
		try {
			const response = await fetch("/api/newsletter", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: email.trim(),
					/* The inline variant never renders these, so they go up empty and
					   the mutation leaves whatever it already had alone. */
					name: name.trim(),
					company: company.trim(),
					interest,
					company_website: honeypot,
					/* Read at submit time, not page load — that is what keeps it
					   working for visitors who never accepted the cookie, and what
					   carries the LinkedIn UTMs through to the register. */
					attribution: attributionForSubmit(),
				}),
			});
			if (!response.ok) throw new Error("submit_failed");

			const result = (await response.json()) as { status?: string };
			if (result.status === "already") {
				track(EVENTS.NEWSLETTER_ALREADY_SUBSCRIBED, { location });
				setStatus("already");
				return;
			}

			track(EVENTS.NEWSLETTER_SUBSCRIBED, {
				location,
				interest: interest || "unspecified",
				/* Distinguishes a returning address from a new one, so the growth
				   number doesn't quietly include people coming back. */
				returning: result.status === "resubscribed",
			});
			setStatus("done");
		} catch {
			/* A spike here means a broken form, not a quiet week. */
			track(EVENTS.NEWSLETTER_FAILED, { location });
			setStatus("error");
		}
	}

	/* ── Success ─────────────────────────────────────────────────────── */

	if (status === "done" || status === "already") {
		const heading =
			status === "already" ? "You're already on the list." : "You're on the list.";
		const detail =
			status === "already"
				? `${email.trim()} was already subscribed, so nothing changed. The next issue goes out to it as normal.`
				: `Check ${email.trim()} for a confirmation. The next issue lands within a week, and every one has an unsubscribe link.`;

		if (!isCard) {
			return (
				<div className="flex items-start gap-2.5">
					<CheckCircle2 className="h-4 w-4 text-do-orange shrink-0 mt-0.5" />
					<p className="text-sm text-do-text-secondary leading-relaxed">
						<span className="text-do-text font-medium">{heading}</span> {detail}
					</p>
				</div>
			);
		}

		return (
			<div className="text-center py-6">
				<div className="h-14 w-14 rounded-2xl bg-do-orange/10 border border-do-orange/20 flex items-center justify-center mx-auto mb-5">
					<CheckCircle2 className="h-7 w-7 text-do-orange" />
				</div>
				<h2 className="text-2xl md:text-3xl font-bold text-do-text mb-3">{heading}</h2>
				<p className="text-base text-do-text-secondary max-w-lg mx-auto leading-relaxed">
					{detail}
				</p>
			</div>
		);
	}

	/* ── Form ────────────────────────────────────────────────────────── */

	/* Off-screen rather than display:none, which some bots know to skip, and
	   never announced or tabbed into. The id is suffixed because the footer
	   renders this form on the same page as the one on /newsletter, and two
	   inputs sharing an id is exactly the ambiguity a screen reader trips on. */
	const honeypotId = `company_website_${variant}`;
	const honeypotField = (
		<div aria-hidden="true" className="absolute left-[-9999px] top-auto">
			<label htmlFor={honeypotId}>Company website (leave this empty)</label>
			<input
				id={honeypotId}
				name="company_website"
				type="text"
				tabIndex={-1}
				autoComplete="off"
				value={honeypot}
				onChange={(e) => setHoneypot(e.target.value)}
			/>
		</div>
	);

	const errorNote = status === "error" && (
		<p className="text-sm text-red-500">
			That didn&apos;t go through. Try again, or email{" "}
			<a className="underline" href="mailto:rahul@construction.live">
				rahul@construction.live
			</a>
			.
		</p>
	);

	if (!isCard) {
		return (
			<form onSubmit={onSubmit} className="relative">
				<div className="flex flex-col sm:flex-row gap-2.5">
					<label className="flex-1 min-w-0">
						<span className="sr-only">Your email</span>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="you@company.com"
							required
							className={INPUT_CLASS}
						/>
					</label>
					<button
						type="submit"
						disabled={status === "submitting" || !ready}
						className="group inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-white bg-do-orange hover:bg-do-orange-dark rounded-xl transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
					>
						{status === "submitting" ? "Subscribing..." : "Subscribe"}
						<ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
					</button>
				</div>
				{honeypotField}
				{errorNote && <div className="mt-2.5">{errorNote}</div>}
			</form>
		);
	}

	return (
		<form onSubmit={onSubmit} className="relative space-y-7">
			<div className="grid sm:grid-cols-2 gap-5">
				<label className="block">
					<span className="block text-sm font-medium text-do-text mb-2">Your email</span>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="you@company.com"
						required
						autoFocus
						className={INPUT_CLASS}
					/>
				</label>
				<label className="block">
					<span className="block text-sm font-medium text-do-text mb-2">
						Your name
						<span className="text-do-text-muted font-normal"> (optional)</span>
					</span>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Jordan Reyes"
						className={INPUT_CLASS}
					/>
				</label>
			</div>

			<label className="block">
				<span className="block text-sm font-medium text-do-text mb-2">
					Company
					<span className="text-do-text-muted font-normal"> (optional)</span>
				</span>
				<input
					type="text"
					value={company}
					onChange={(e) => setCompany(e.target.value)}
					placeholder="Reyes Electric"
					className={INPUT_CLASS}
				/>
			</label>

			<div>
				<p className="text-sm font-medium text-do-text mb-3">
					What do you do?
					<span className="text-do-text-muted font-normal"> (optional)</span>
				</p>
				<div className="flex flex-wrap gap-2.5">
					{INTERESTS.map((option) => {
						const isSelected = interest === option;
						return (
							<button
								key={option}
								type="button"
								/* A second tap clears it, so nobody is stuck with a category
								   they picked by accident on a phone. */
								onClick={() => setInterest(isSelected ? "" : option)}
								aria-pressed={isSelected}
								className={`flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-colors ${
									isSelected
										? "border-do-orange/40 text-do-orange bg-do-orange/[0.07]"
										: "border-do-border text-do-text-secondary hover:text-do-text hover:border-do-border-accent bg-do-bg/60"
								}`}
							>
								{isSelected && <Check className="h-3.5 w-3.5" />}
								{option}
							</button>
						);
					})}
				</div>
			</div>

			{honeypotField}
			{errorNote}

			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-7 border-t border-do-border">
				<span className="text-xs text-do-text-muted">
					One email a week. Unsubscribe from any of them in one click.
				</span>
				<button
					type="submit"
					disabled={status === "submitting" || !ready}
					className="group inline-flex items-center justify-center gap-2 px-7 py-3 text-sm font-medium text-white bg-do-orange hover:bg-do-orange-dark rounded-xl transition-all shadow-[0_0_30px_rgba(249,115,22,0.25)] hover:shadow-[0_0_45px_rgba(249,115,22,0.45)] disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed"
				>
					{status === "submitting" ? "Subscribing..." : "Subscribe"}
					<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
				</button>
			</div>
		</form>
	);
}
