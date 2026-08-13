"use client";

import { motion } from "framer-motion";
import { useState, FormEvent } from "react";
import { ArrowRight, Calendar, Check, CheckCircle2 } from "lucide-react";
import SiteNav from "@/components/home/SiteNav";
import SiteFooter from "@/components/home/SiteFooter";

const CALENDAR_URL = "https://calendar.app.google/Eb7GFYUJNLDof5oz6";

/* Optional, and the answer that decides who reads it first. Left open-ended at
   the end because a contact form that forces a category gets the wrong one. */
const TOPICS = [
	"Product question",
	"Pricing",
	"Partnership",
	"Help with my account",
	"Something else",
];

/* Changing a field here means changing four other places: the validator in
   app/api/contact/route.ts, the action args in convex/contact.ts, the
   contactMessages table in convex/schema.ts, and BOTH emails in
   convex/emails.ts (the internal `rows` table and the customer `recap`).
   A field added here but not there is collected and then silently dropped. */
type Answers = {
	topic: string;
	name: string;
	email: string;
	company: string;
	message: string;
};

const EMPTY: Answers = {
	topic: "",
	name: "",
	email: "",
	company: "",
	message: "",
};

/* ── Inputs ────────────────────────────────────────────────────────── */

function ChoiceGroup({
	label,
	options,
	value,
	onChange,
	optional = false,
}: {
	label: string;
	options: string[];
	value: string;
	onChange: (next: string) => void;
	optional?: boolean;
}) {
	return (
		<div>
			<p className="text-sm font-medium text-do-text mb-3">
				{label}
				{optional && <span className="text-do-text-muted font-normal"> (optional)</span>}
			</p>
			<div className="flex flex-wrap gap-2.5">
				{options.map((option) => {
					const isSelected = value === option;
					return (
						<button
							key={option}
							type="button"
							/* A second tap clears it, so nobody is stuck with a category
							   they picked by accident on a phone. */
							onClick={() => onChange(isSelected ? "" : option)}
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
	);
}

function TextField({
	label,
	type = "text",
	value,
	onChange,
	placeholder,
	optional = false,
}: {
	label: string;
	type?: string;
	value: string;
	onChange: (next: string) => void;
	placeholder?: string;
	optional?: boolean;
}) {
	return (
		<label className="block">
			<span className="block text-sm font-medium text-do-text mb-2">
				{label}
				{optional && <span className="text-do-text-muted font-normal"> (optional)</span>}
			</span>
			<input
				type={type}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder={placeholder}
				required={!optional}
				className="w-full px-4 py-3 rounded-xl border border-do-border bg-do-bg/60 text-do-text placeholder:text-do-text-muted text-sm focus:outline-none focus:border-do-orange/40 focus:ring-1 focus:ring-do-orange/40 transition-colors"
			/>
		</label>
	);
}

/* ── Page ──────────────────────────────────────────────────────────── */

export default function ContactPage() {
	const [answers, setAnswers] = useState<Answers>(EMPTY);
	/* Hidden from people, visible to bots. See the honeypot note in the route. */
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
		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...answers, company_website: honeypot }),
			});
			if (!response.ok) throw new Error("submit_failed");
			setStatus("done");
		} catch {
			setStatus("error");
		}
	}

	return (
		<main className="min-h-screen bg-do-bg">
			<SiteNav />

			{/* Hero and form share one background layer. Two separate grids would
			    restart the 40px tiling at the section seam and read as a break. */}
			<div className="relative overflow-hidden">
				<div className="absolute inset-0 do-blueprint-grid pointer-events-none" />
				<div className="absolute top-[22rem] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-do-orange/[0.04] rounded-full blur-[150px] pointer-events-none" />

				{/* Hero */}
				<section className="relative pt-20 pb-8">
					<div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
						<motion.div
							initial={{ opacity: 0, y: 30 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6 }}
						>
							<span className="do-section-label text-do-orange">Contact</span>
							<h1 className="text-3xl md:text-4xl font-bold text-do-text mt-4 tracking-tight">
								Talk to us
							</h1>
							<p className="mt-5 text-base md:text-lg text-do-text-secondary leading-relaxed">
								Questions, a problem you want fixed, or something you think we should
								build. It goes straight to the team, and you get a reply within one
								business day.
							</p>
						</motion.div>
					</div>
				</section>

				{/* The form. They came here to write a message, so it gets the page to
				    itself rather than competing with links to somewhere else. */}
				<section id="message" className="relative pb-20 scroll-mt-24">
					<div className="relative z-10 max-w-3xl mx-auto px-6">
						<motion.div
						className="rounded-3xl border border-do-orange/20 bg-do-bg-card/80 backdrop-blur-xl p-7 md:p-10"
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.15 }}
					>
						{status === "done" ? (
							<motion.div
								className="text-center py-6"
								initial={{ opacity: 0, y: 12 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.4 }}
							>
								<div className="h-14 w-14 rounded-2xl bg-do-orange/10 border border-do-orange/20 flex items-center justify-center mx-auto mb-5">
									<CheckCircle2 className="h-7 w-7 text-do-orange" />
								</div>
								<h2 className="text-2xl md:text-3xl font-bold text-do-text mb-3">
									Message sent. We&apos;ll reply within one business day.
								</h2>
								<p className="text-base text-do-text-secondary max-w-lg mx-auto leading-relaxed mb-8">
									A copy is on its way to {answers.email || "your inbox"}. Reply to
									it if you remember something else and it lands in the same
									thread.
								</p>
								<a
									href={CALENDAR_URL}
									target="_blank"
									rel="noopener noreferrer"
									className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-white bg-do-orange hover:bg-do-orange-dark rounded-xl transition-all shadow-[0_0_40px_rgba(249,115,22,0.3)] hover:shadow-[0_0_60px_rgba(249,115,22,0.5)]"
								>
									<Calendar className="h-4 w-4" />
									Book 15 minutes now
									<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
								</a>
								<p className="mt-4 text-xs text-do-text-muted">
									Opens Google Calendar in a new tab.
								</p>
							</motion.div>
						) : (
							/* Ordered the way the visit goes: the message they came to write,
							   then what it is about, then who to reply to. */
							<form onSubmit={onSubmit} className="space-y-7">
								<label className="block">
									<span className="block text-sm font-medium text-do-text mb-2">
										Your message
									</span>
									<textarea
										value={answers.message}
										onChange={(e) => set("message", e.target.value)}
										placeholder="Tell us what you need. The more detail, the better the first reply."
										rows={6}
										required
										autoFocus
										className="w-full px-4 py-3 rounded-xl border border-do-border bg-do-bg/60 text-do-text placeholder:text-do-text-muted text-sm leading-relaxed resize-y focus:outline-none focus:border-do-orange/40 focus:ring-1 focus:ring-do-orange/40 transition-colors"
									/>
								</label>

								<ChoiceGroup
									label="What's this about?"
									options={TOPICS}
									value={answers.topic}
									onChange={(v) => set("topic", v)}
									optional
								/>

									<div className="grid sm:grid-cols-2 gap-5">
									<TextField
										label="Your name"
										value={answers.name}
										onChange={(v) => set("name", v)}
										placeholder="Jordan Reyes"
									/>
									<TextField
										label="Your email"
										type="email"
										value={answers.email}
										onChange={(v) => set("email", v)}
										placeholder="you@company.com"
									/>
								</div>

								<TextField
									label="Company"
									value={answers.company}
									onChange={(v) => set("company", v)}
									placeholder="Reyes Electric"
									optional
								/>

								{/* Honeypot. Off-screen rather than display:none, which some
								    bots know to skip, and never announced or tabbed into. */}
								<div aria-hidden="true" className="absolute left-[-9999px] top-auto">
									<label htmlFor="company_website">
										Company website (leave this empty)
									</label>
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
										That didn&apos;t go through. Try again, or email{" "}
										<a className="underline" href="mailto:rahul@construction.live">
											rahul@construction.live
										</a>
										.
									</p>
								)}

								<div className="flex items-center justify-end gap-4 pt-7 border-t border-do-border">
									{/* <span className="text-xs text-do-text-muted">
										We don&apos;t share your details with anyone.
									</span> */}
									<button
										type="submit"
										disabled={status === "submitting" || !ready}
										className="group inline-flex items-center gap-2 px-7 py-3 text-sm font-medium text-white bg-do-orange hover:bg-do-orange-dark rounded-xl transition-all shadow-[0_0_30px_rgba(249,115,22,0.25)] hover:shadow-[0_0_45px_rgba(249,115,22,0.45)] disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed"
									>
										{status === "submitting" ? "Sending..." : "Send message"}
										<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
									</button>
								</div>
							</form>
						)}
					</motion.div>
					</div>
				</section>
			</div>

			<SiteFooter />
		</main>
	);
}
