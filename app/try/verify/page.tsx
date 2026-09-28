"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Check, CheckCircle2, MailCheck } from "lucide-react";
import TryShell from "../shell";
import { EVENTS, track } from "@/lib/analytics";
import { attributionForSubmit } from "@/lib/attribution";
import { TRIAL_NOTES_LABEL, TRIAL_NOTES_MAX, TRIAL_QUESTIONS } from "@/lib/trial";

/* Steps 2 and 3 of "Try now": the link from the mail lands here, one press
   confirms the address, and the three questions follow on the same page.

   The press is not ceremony. Inbox security scanners open every link in a
   message before a person sees it, so a page that verified on load would mark
   scraper-fed addresses as confirmed and hand the founder a list of inboxes
   that answer nothing. One button is the difference between a click and a
   crawl — the same reasoning as app/newsletter/unsubscribe/page.tsx. It is
   labelled as the start of the questions, so it never reads as an extra step.

   The token in the URL is the only credential, held in state and posted with
   the answers. It is never shown, and the page never resolves it to an address
   before the press: by the time a name appears, the person has proved they
   hold the link. */

type Stage =
	| { kind: "confirm" }
	| { kind: "verifying" }
	| { kind: "questions"; name: string; company: string }
	| { kind: "submitting"; name: string; company: string }
	| { kind: "done"; name: string }
	| { kind: "already"; name: string }
	| { kind: "expired" }
	| { kind: "unknown" }
	| { kind: "error"; back: Stage };

type Answers = {
	biggestProblem: string;
	workType: string;
	teamSize: string;
	notes: string;
};

const EMPTY: Answers = { biggestProblem: "", workType: "", teamSize: "", notes: "" };

function firstNameOf(name: string) {
	return name.trim().split(/\s+/)[0] || name;
}

function ChoiceGroup({
	label,
	help,
	options,
	value,
	onChange,
}: {
	label: string;
	help?: string;
	options: string[];
	value: string;
	onChange: (next: string) => void;
}) {
	return (
		<div>
			<p className="text-sm font-medium text-do-text">{label}</p>
			{help && <p className="text-xs text-do-text-muted mt-1">{help}</p>}
			<div className="flex flex-wrap gap-2 mt-2.5">
				{options.map((option) => {
					const isSelected = value === option;
					return (
						<button
							key={option}
							type="button"
							onClick={() => onChange(option)}
							aria-pressed={isSelected}
							className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-[13px] font-medium transition-colors ${
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
	);
}

function Icon({ children }: { children: React.ReactNode }) {
	return (
		<div className="h-12 w-12 rounded-xl bg-do-orange/10 border border-do-orange/20 flex items-center justify-center mx-auto mb-4">
			{children}
		</div>
	);
}

const PRIMARY_BUTTON =
	"group w-full inline-flex items-center justify-center gap-2 rounded-lg bg-do-orange px-4 py-2.5 text-sm font-medium text-white hover:bg-do-orange-dark transition-colors shadow-[0_0_24px_rgba(249,115,22,0.25)] disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed";

function VerifyCard() {
	const searchParams = useSearchParams();
	const token = searchParams.get("token")?.trim() ?? "";
	const [stage, setStage] = useState<Stage>({ kind: "confirm" });
	const [answers, setAnswers] = useState<Answers>(EMPTY);

	const set = <K extends keyof Answers>(key: K, value: Answers[K]) =>
		setAnswers((prev) => ({ ...prev, [key]: value }));

	const answered = TRIAL_QUESTIONS.every((q) => answers[q.key] !== "");

	async function onConfirm() {
		if (!token) return;
		setStage({ kind: "verifying" });
		try {
			const response = await fetch("/api/try/verify", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token }),
			});
			if (!response.ok) throw new Error("verify_failed");

			const result = (await response.json()) as {
				status: "verified" | "completed" | "expired" | "unknown";
				name?: string;
				company?: string;
			};

			if (result.status === "verified") {
				track(EVENTS.TRIAL_VERIFIED);
				setStage({ kind: "questions", name: result.name ?? "", company: result.company ?? "" });
			} else if (result.status === "completed") {
				setStage({ kind: "already", name: result.name ?? "" });
			} else if (result.status === "expired") {
				setStage({ kind: "expired" });
			} else {
				setStage({ kind: "unknown" });
			}
		} catch {
			track(EVENTS.TRIAL_FAILED, { step: "verify" });
			setStage({ kind: "error", back: { kind: "confirm" } });
		}
	}

	async function onSubmitAnswers(name: string, company: string) {
		if (!answered) return;
		setStage({ kind: "submitting", name, company });
		try {
			const response = await fetch("/api/try/answers", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					token,
					...answers,
					attribution: attributionForSubmit(),
				}),
			});
			if (!response.ok) throw new Error("submit_failed");

			const result = (await response.json()) as {
				status: "completed" | "already" | "unverified" | "expired" | "unknown";
			};

			if (result.status === "completed") {
				track(EVENTS.TRIAL_COMPLETED, { biggestProblem: answers.biggestProblem });
				setStage({ kind: "done", name });
			} else if (result.status === "already") {
				setStage({ kind: "already", name });
			} else if (result.status === "expired") {
				setStage({ kind: "expired" });
			} else {
				setStage({ kind: "unknown" });
			}
		} catch {
			track(EVENTS.TRIAL_FAILED, { step: "answers" });
			setStage({ kind: "error", back: { kind: "questions", name, company } });
		}
	}

	/* A link with no token — someone typed the path, or a mail client mangled
	   the query string. There is nothing to act on, so say so and point at the
	   one thing that does work. */
	if (!token || stage.kind === "unknown") {
		return (
			<div className="text-center py-2">
				<h1 className="text-2xl font-bold text-do-text mb-2">
					This link is incomplete
				</h1>
				<p className="text-sm text-do-text-secondary leading-relaxed mb-6">
					It&apos;s missing the part that tells us who you are, which usually means it
					was copied without the end. Open the link straight from the email, or
					start again and we&apos;ll send a fresh one.
				</p>
				<a href="/try" className={PRIMARY_BUTTON}>
					Start again
					<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
				</a>
			</div>
		);
	}

	if (stage.kind === "expired") {
		return (
			<div className="text-center py-2">
				<h1 className="text-2xl font-bold text-do-text mb-2">
					This link has expired
				</h1>
				<p className="text-sm text-do-text-secondary leading-relaxed mb-6">
					Confirmation links only last a day, so one that sits in an inbox can&apos;t
					be picked up later by someone else. Fill in the form again and a new one
					arrives straight away.
				</p>
				<a href="/try" className={PRIMARY_BUTTON}>
					Get a new link
					<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
				</a>
			</div>
		);
	}

	if (stage.kind === "done" || stage.kind === "already") {
		const first = firstNameOf(stage.name);
		return (
			<motion.div
				className="text-center py-2"
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
			>
				<Icon>
					<CheckCircle2 className="h-6 w-6 text-do-orange" />
				</Icon>
				<h1 className="text-2xl font-bold text-do-text mb-2">
					{stage.kind === "already"
						? `You're already in${first ? `, ${first}` : ""}.`
						: `That's everything${first ? `, ${first}` : ""}.`}
				</h1>
				{/* The promise here has to match the confirmation mail in
				    convex/emails.ts in substance: the founder reviews, then the login
				    arrives. No booking link — there is nothing left for them to do,
				    and a button here would suggest otherwise. */}
				<p className="text-sm text-do-text-secondary leading-relaxed">
					The founder is reviewing your details now. Your login details will be
					sent to your email shortly after verification — usually within one
					business day. Nothing more for you to do.
				</p>
				<p className="mt-4 text-xs text-do-text-muted leading-relaxed">
					A copy of what you told us is on its way to your inbox. Reply to it if
					anything changes.
				</p>
			</motion.div>
		);
	}

	if (stage.kind === "questions" || stage.kind === "submitting" || (stage.kind === "error" && stage.back.kind === "questions")) {
		const current = stage.kind === "error" ? stage.back : stage;
		const name = current.kind === "questions" || current.kind === "submitting" ? current.name : "";
		const company = current.kind === "questions" || current.kind === "submitting" ? current.company : "";
		const first = firstNameOf(name);
		const busy = stage.kind === "submitting";

		return (
			<motion.form
				onSubmit={(e) => {
					e.preventDefault();
					void onSubmitAnswers(name, company);
				}}
				className="space-y-6"
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4 }}
			>
				<div>
					<span className="do-section-label text-do-orange">Email confirmed</span>
					<h1 className="text-2xl font-bold text-do-text mt-2 mb-1.5">
						{first ? `Thanks, ${first}.` : "Thanks."} Three quick questions.
					</h1>
					<p className="text-sm text-do-text-secondary leading-relaxed">
						{company ? `So the founder knows what to bring to the call with ${company}.` : "So the founder knows what to bring to the call."}
					</p>
				</div>

				{TRIAL_QUESTIONS.map((question) => (
					<ChoiceGroup
						key={question.key}
						label={question.label}
						help={question.help}
						options={question.options}
						value={answers[question.key]}
						onChange={(v) => set(question.key, v)}
					/>
				))}

				<label className="block">
					<span className="block text-sm font-medium text-do-text mb-2">
						{TRIAL_NOTES_LABEL}
						<span className="text-do-text-muted font-normal"> (optional)</span>
					</span>
					<textarea
						value={answers.notes}
						onChange={(e) => set("notes", e.target.value.slice(0, TRIAL_NOTES_MAX))}
						placeholder="The software you use today, a project that's coming up, the thing that made you look for this."
						rows={3}
						className="w-full rounded-lg border border-do-border bg-do-bg/60 px-3.5 py-2.5 text-sm text-do-text placeholder:text-do-text-muted leading-relaxed resize-y focus:outline-none focus:border-do-orange/40 focus:ring-1 focus:ring-do-orange/40 transition-colors"
					/>
				</label>

				{stage.kind === "error" && (
					<p className="text-sm text-red-500">
						That didn&apos;t go through. Try again, or email{" "}
						<a className="underline" href="mailto:rahul@construction.live">
							rahul@construction.live
						</a>
						.
					</p>
				)}

				<div className="pt-1">
					<button
						type="submit"
						disabled={busy || !answered}
						className={PRIMARY_BUTTON}
					>
						{busy ? "Sending..." : "Send to the founder"}
						<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
					</button>
				</div>
			</motion.form>
		);
	}

	/* confirm, verifying, or an error on the way to verifying. */
	const busy = stage.kind === "verifying";
	return (
		<div className="text-center py-2">
			<Icon>
				<MailCheck className="h-6 w-6 text-do-orange" />
			</Icon>
			<h1 className="text-2xl font-bold text-do-text mb-2">
				Confirm your email to continue
			</h1>
			<p className="text-sm text-do-text-secondary leading-relaxed mb-6">
				One press confirms the address this link was sent to and opens three quick
				questions. About a minute, and then the founder takes it from there.
			</p>

			{stage.kind === "error" && (
				<p className="text-sm text-red-500 mb-5">
					That didn&apos;t go through. Try again, or email{" "}
					<a className="underline" href="mailto:rahul@construction.live">
						rahul@construction.live
					</a>
					.
				</p>
			)}

			<button type="button" onClick={onConfirm} disabled={busy} className={PRIMARY_BUTTON}>
				{busy ? "Confirming..." : "Confirm and continue"}
				<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
			</button>
			<p className="mt-4 text-xs text-do-text-muted">
				Didn&apos;t sign up? Close this tab — nothing happens until you press it.
			</p>
		</div>
	);
}

export default function TryVerifyPage() {
	return (
		<TryShell>
			{/* useSearchParams opts the tree into client rendering, and Next
			    requires the boundary to be explicit. */}
			<Suspense
				fallback={
					<p className="text-sm text-do-text-secondary text-center py-8">Loading...</p>
				}
			>
				<VerifyCard />
			</Suspense>
		</TryShell>
	);
}
