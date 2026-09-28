"use client";

import { useRef, useState, FormEvent } from "react";
import { MailCheck } from "lucide-react";
import { EVENTS, track } from "@/lib/analytics";
import { attributionForSubmit } from "@/lib/attribution";
import { isDisposableEmail, isPlausibleEmail } from "@/lib/disposableEmail";
import TryShell from "./shell";

/* Step 1 of "Try now": the account request. Email, name, company — the sign-up
   form minus the password, because there isn't one: we confirm the address,
   ask three questions after the click, and set the account up ourselves.
   See app/try/verify/page.tsx for what follows the click.

   Deliberately the shortest form on the site. Everything we could ask here we
   ask after the click instead, because the only thing this page has to do is
   get a real address into an inbox we can mail. Every extra field costs a
   real signup and stops zero bots.

   Changing a field here means changing the validator in
   app/api/try/start/route.ts, the args in convex/trial.ts, the trialSignups
   table in convex/schema.ts and the verification mail in convex/emails.ts. */

type Answers = {
	email: string;
	name: string;
	company: string;
};

const EMPTY: Answers = { email: "", name: "", company: "" };

type Status = "idle" | "submitting" | "sent" | "error";
type ErrorKind = "disposable" | "rate_limited" | "generic";

const INPUT =
	"w-full rounded-lg border border-do-border bg-do-bg/60 px-3.5 py-2.5 text-sm text-do-text placeholder:text-do-text-muted focus:outline-none focus:border-do-orange/40 focus:ring-1 focus:ring-do-orange/40 transition-colors";

function Field({
	label,
	type = "text",
	value,
	onChange,
	placeholder,
	autoComplete,
	autoFocus,
}: {
	label: string;
	type?: string;
	value: string;
	onChange: (next: string) => void;
	placeholder?: string;
	autoComplete?: string;
	autoFocus?: boolean;
}) {
	return (
		<label className="block">
			<span className="block text-xs font-medium text-do-text-secondary mb-1.5">{label}</span>
			<input
				type={type}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				autoComplete={autoComplete}
				autoFocus={autoFocus}
				required
				className={INPUT}
			/>
		</label>
	);
}

export default function TryPage() {
	const [answers, setAnswers] = useState<Answers>(EMPTY);
	/* Hidden from people, visible to bots. See the honeypot note in the route. */
	const [honeypot, setHoneypot] = useState("");
	const [status, setStatus] = useState<Status>("idle");
	const [errorKind, setErrorKind] = useState<ErrorKind>("generic");
	/* When the form appeared. Sent with the submission so the route can tell a
	   person who typed three fields from a script that posted them in 40ms. */
	const mountedAt = useRef(Date.now());

	const set = <K extends keyof Answers>(key: K, value: Answers[K]) =>
		setAnswers((prev) => ({ ...prev, [key]: value }));

	const ready =
		answers.company.trim() !== "" &&
		answers.name.trim() !== "" &&
		isPlausibleEmail(answers.email);

	async function onSubmit(e: FormEvent) {
		e.preventDefault();
		if (status === "submitting" || !ready) return;

		/* Checked here as well as in the route, so the person gets told before
		   the round-trip rather than after. The route is still the one that
		   decides; this is the same list, so they never disagree. */
		if (isDisposableEmail(answers.email)) {
			setErrorKind("disposable");
			setStatus("error");
			return;
		}

		setStatus("submitting");
		try {
			const response = await fetch("/api/try/start", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...answers,
					company_website: honeypot,
					elapsedMs: Date.now() - mountedAt.current,
					attribution: attributionForSubmit(),
				}),
			});

			if (!response.ok) {
				const result = (await response.json().catch(() => ({}))) as { error?: string };
				setErrorKind(
					result.error === "disposable_email"
						? "disposable"
						: response.status === 429
							? "rate_limited"
							: "generic",
				);
				throw new Error(result.error ?? "submit_failed");
			}

			track(EVENTS.TRIAL_STARTED);
			setStatus("sent");
		} catch {
			track(EVENTS.TRIAL_FAILED, { step: "start" });
			setStatus("error");
		}
	}

	if (status === "sent") {
		return (
			<TryShell>
				<div className="text-center py-2">
					<div className="h-12 w-12 rounded-xl bg-do-orange/10 border border-do-orange/20 flex items-center justify-center mx-auto mb-4">
						<MailCheck className="h-6 w-6 text-do-orange" />
					</div>
					<h1 className="text-2xl font-bold text-do-text mb-2">Check your inbox</h1>
					<p className="text-sm text-do-text-secondary leading-relaxed">
						We&apos;ve sent a confirmation link to{" "}
						<span className="text-do-text font-medium">{answers.email.trim()}</span>.
						Open it to finish setting up your account — three quick questions, about
						a minute.
					</p>
					<p className="mt-5 text-xs text-do-text-muted leading-relaxed">
						Nothing in a minute or two? Check spam, then{" "}
						<button
							type="button"
							onClick={() => setStatus("idle")}
							className="underline underline-offset-2 hover:text-do-text-secondary"
						>
							send it again
						</button>
						. Still stuck? Email{" "}
						<a className="underline" href="mailto:rahul@construction.live">
							rahul@construction.live
						</a>
						.
					</p>
				</div>
			</TryShell>
		);
	}

	return (
		<TryShell>
			<h1 className="text-2xl font-bold text-do-text">Create your account</h1>
			<p className="mt-1.5 mb-6 text-sm text-do-text-secondary leading-relaxed">
				No password. Confirm your email, answer three quick questions, and we set up
				the rest for you.
			</p>

			<form onSubmit={onSubmit} className="flex flex-col gap-4">
				<Field
					label="Work email"
					type="email"
					value={answers.email}
					onChange={(v) => set("email", v)}
					placeholder="you@company.com"
					autoComplete="email"
					autoFocus
				/>
				<Field
					label="Your name"
					value={answers.name}
					onChange={(v) => set("name", v)}
					placeholder="Jordan Reyes"
					autoComplete="name"
				/>
				<Field
					label="Company"
					value={answers.company}
					onChange={(v) => set("company", v)}
					placeholder="Reyes Electric"
					autoComplete="organization"
				/>

				{/* Honeypot. Off-screen rather than display:none, which some bots
				    know to skip, and never announced or tabbed into. */}
				<div aria-hidden="true" className="absolute left-[-9999px] top-auto">
					<label htmlFor="company_website">Company website (leave this empty)</label>
					<input
						id="company_website"
						name="company_website"
						type="text"
						tabIndex={-1}
						autoComplete="off"
						value={honeypot}
						onChange={(e) => setHoneypot(e.target.value)}
					/>
				</div>

				{status === "error" && (
					<p className="text-sm text-red-500">
						{errorKind === "disposable" ? (
							<>
								That looks like a temporary inbox. Use an address you&apos;ll still
								have next week — your account gets set up against it.
							</>
						) : errorKind === "rate_limited" ? (
							<>
								That&apos;s a few tries in a row. Give it an hour, or email{" "}
								<a className="underline" href="mailto:rahul@construction.live">
									rahul@construction.live
								</a>{" "}
								and we&apos;ll set you up by hand.
							</>
						) : (
							<>
								That didn&apos;t go through. Try again, or email{" "}
								<a className="underline" href="mailto:rahul@construction.live">
									rahul@construction.live
								</a>
								.
							</>
						)}
					</p>
				)}

				<button
					type="submit"
					disabled={status === "submitting" || !ready}
					className="mt-1 w-full rounded-lg bg-do-orange px-4 py-2.5 text-sm font-medium text-white hover:bg-do-orange-dark transition-colors shadow-[0_0_24px_rgba(249,115,22,0.25)] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed"
				>
					{status === "submitting" ? "Sending link..." : "Continue with email"}
				</button>
			</form>

			{/* Said up front rather than discovered. Someone who knows the click is
			    coming looks for the mail; someone who doesn't closes the tab and
			    wonders why nothing happened. */}
			<p className="mt-5 text-xs text-do-text-muted leading-relaxed text-center">
				We&apos;ll email you a confirmation link. Accounts are set up by hand once
				the founder has reviewed your details.
			</p>
		</TryShell>
	);
}
