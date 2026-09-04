"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { EVENTS, track } from "@/lib/analytics";
import { attributionForSubmit } from "@/lib/attribution";

/* Training enquiry, posted to the existing /api/contact endpoint.

   Deliberately no new route, table or email template. That pipeline already
   validates, screens a honeypot, records to contactMessages, notifies
   CONTACT_NOTIFICATION_EMAIL (rahul@construction.live) and sends the enquirer
   an acknowledgement. A second copy of all of that would be four more places
   to keep in step — see the note at the top of app/contact/page.tsx about what
   adding a field costs.

   Which is also why "on site or online" is carried in `topic` rather than as a
   new column: `topic` is free text the API already accepts and both emails
   already print, so the preference reaches the inbox without a schema change. */

const DELIVERY = [
	{ value: "On site", hint: "We come to the trailer" },
	{ value: "Online", hint: "Scheduled around the job" },
	{ value: "Not sure yet", hint: "Talk it through with us" },
];

type Answers = {
	delivery: string;
	name: string;
	email: string;
	company: string;
	message: string;
};

const EMPTY: Answers = {
	delivery: "",
	name: "",
	email: "",
	company: "",
	message: "",
};

const fieldClass =
	"w-full rounded-xl border border-do-border bg-do-bg px-4 py-3 text-[15px] text-do-text placeholder:text-do-text-muted outline-none transition-colors focus:border-do-orange/60";

export default function TrainingEnquiryForm() {
	const [answers, setAnswers] = useState<Answers>(EMPTY);
	/* Hidden from people, visible to bots. The route answers a filled honeypot
	   with the same success shape, so a scraper learns nothing. */
	const [honeypot, setHoneypot] = useState("");
	const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

	const set = <K extends keyof Answers>(key: K, value: Answers[K]) =>
		setAnswers((prev) => ({ ...prev, [key]: value }));

	const ready =
		answers.name.trim() !== "" &&
		answers.message.trim() !== "" &&
		/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.email.trim());

	async function onSubmit(e: FormEvent) {
		e.preventDefault();
		if (status === "submitting" || !ready) return;
		setStatus("submitting");

		const topic = answers.delivery
			? `Training — ${answers.delivery.toLowerCase()}`
			: "Training";

		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: answers.name,
					email: answers.email,
					company: answers.company,
					message: answers.message,
					topic,
					company_website: honeypot,
					/* Read at submit time, not page load — that is what keeps it
					   working for visitors who never accepted the cookie. */
					attribution: attributionForSubmit(),
				}),
			});
			if (!response.ok) throw new Error("submit_failed");
			track(EVENTS.CONTACT_SUBMITTED, { topic });
			setStatus("done");
		} catch {
			/* A spike here means a broken form, not a quiet week. */
			track(EVENTS.CONTACT_FAILED, { topic });
			setStatus("error");
		}
	}

	if (status === "done") {
		return (
			<div className="rounded-2xl border border-do-orange/25 bg-do-bg-card p-8 text-center sm:p-10">
				<CheckCircle2 className="mx-auto h-10 w-10 text-do-orange" />
				<h3 className="mt-5 text-2xl font-bold text-do-text">That is with us.</h3>
				<p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-do-text-secondary">
					We will come back to you with a couple of times and a short plan for the
					first session — the roles we would start with and what we would train on.
					Check your inbox for a copy of what you sent.
				</p>
			</div>
		);
	}

	return (
		<form
			onSubmit={onSubmit}
			className="rounded-2xl border border-do-border bg-do-bg-card p-6 sm:p-8"
		>
			<fieldset className="border-0 p-0">
				<legend className="mb-3 text-sm font-medium text-do-text">
					Where would you want the training?
					<span className="ml-2 font-normal text-do-text-muted">Optional</span>
				</legend>
				<div className="grid gap-2.5 sm:grid-cols-3">
					{DELIVERY.map((option) => {
						const selected = answers.delivery === option.value;
						return (
							<button
								key={option.value}
								type="button"
								onClick={() => set("delivery", selected ? "" : option.value)}
								aria-pressed={selected}
								className={`rounded-xl border px-4 py-3 text-left transition-all ${
									selected
										? "border-do-orange bg-do-orange/[0.07]"
										: "border-do-border bg-do-bg hover:border-do-border-accent"
								}`}
							>
								<span className="block text-sm font-medium text-do-text">
									{option.value}
								</span>
								<span className="mt-0.5 block text-xs text-do-text-secondary">
									{option.hint}
								</span>
							</button>
						);
					})}
				</div>
			</fieldset>

			<div className="mt-6 grid gap-4 sm:grid-cols-2">
				<label className="block">
					<span className="mb-2 block text-sm font-medium text-do-text">Your name</span>
					<input
						type="text"
						required
						autoComplete="name"
						value={answers.name}
						onChange={(e) => set("name", e.target.value)}
						className={fieldClass}
					/>
				</label>
				<label className="block">
					<span className="mb-2 block text-sm font-medium text-do-text">Work email</span>
					<input
						type="email"
						required
						autoComplete="email"
						value={answers.email}
						onChange={(e) => set("email", e.target.value)}
						className={fieldClass}
					/>
				</label>
			</div>

			<label className="mt-4 block">
				<span className="mb-2 block text-sm font-medium text-do-text">
					Company
					<span className="ml-2 font-normal text-do-text-muted">Optional</span>
				</span>
				<input
					type="text"
					autoComplete="organization"
					value={answers.company}
					onChange={(e) => set("company", e.target.value)}
					className={fieldClass}
				/>
			</label>

			<label className="mt-4 block">
				<span className="mb-2 block text-sm font-medium text-do-text">
					Who needs training, and on what?
				</span>
				<textarea
					required
					rows={4}
					value={answers.message}
					onChange={(e) => set("message", e.target.value)}
					placeholder="e.g. four supers and two PMs, mostly daily logs and RFIs. We start a hospital fit-out in March."
					className={`${fieldClass} resize-y`}
				/>
			</label>

			{/* Honeypot. Hidden from people, left in the tab order for nobody. */}
			<div aria-hidden className="absolute h-0 w-0 overflow-hidden opacity-0">
				<label>
					Company website
					<input
						type="text"
						tabIndex={-1}
						autoComplete="off"
						value={honeypot}
						onChange={(e) => setHoneypot(e.target.value)}
					/>
				</label>
			</div>

			<div className="mt-6 flex flex-wrap items-center gap-4">
				<motion.button
					type="submit"
					disabled={!ready || status === "submitting"}
					whileTap={ready ? { scale: 0.98 } : undefined}
					className="group inline-flex items-center gap-2 rounded-lg bg-do-orange px-6 py-3.5 text-sm font-medium text-white transition-all hover:bg-do-orange-dark disabled:cursor-not-allowed disabled:opacity-40"
				>
					{status === "submitting" ? "Sending…" : "Ask about training"}
					<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
				</motion.button>
				<p className="text-xs text-do-text-muted">
					Goes straight to our team. No sequence, no drip.
				</p>
			</div>

			{status === "error" && (
				<p className="mt-4 text-sm text-red-500" role="alert">
					That did not send. Try again, or email{" "}
					<a href="mailto:rahul@construction.live" className="underline">
						rahul@construction.live
					</a>{" "}
					directly.
				</p>
			)}
		</form>
	);
}
