"use client";

import { motion } from "framer-motion";
import { useState, FormEvent } from "react";
import { ArrowRight, Check, CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { EVENTS, track } from "@/lib/analytics";
import SiteNav from "@/components/home/SiteNav";
import SiteFooter from "@/components/home/SiteFooter";

/* Changing a field here means changing four other places: the validator in
   app/api/data-deletion-request/route.ts, the mutation args in
   convex/dataDeletion.ts, the dataDeletionRequests table in convex/schema.ts,
   and BOTH emails in convex/emails.ts. A field added here but not there is
   collected and then silently dropped. */
type Scope = "associated" | "all";

type Answers = {
	name: string;
	email: string;
	company: string;
	scope: Scope | "";
	details: string;
};

const EMPTY: Answers = {
	name: "",
	email: "",
	company: "",
	scope: "",
	details: "",
};

/* The two choices, spelled out so nobody picks "all" thinking it means "all
   my recordings" and loses their login. */
const SCOPES: { value: Scope; title: string; body: string }[] = [
	{
		value: "associated",
		title: "Delete associated data only",
		body: "Recordings, transcripts, reports, photos, files and other content tied to my account. Keep the account itself so I can still sign in.",
	},
	{
		value: "all",
		title: "Delete all data, including my account",
		body: "Everything above plus the account: sign-in credentials, profile, settings, connected email and calendar accounts, and access to every project and organization. This cannot be undone.",
	},
];

function TextField({
	label,
	type = "text",
	value,
	onChange,
	placeholder,
	optional = false,
	hint,
}: {
	label: string;
	type?: string;
	value: string;
	onChange: (next: string) => void;
	placeholder?: string;
	optional?: boolean;
	hint?: string;
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
			{hint && <span className="block mt-2 text-xs text-do-text-muted">{hint}</span>}
		</label>
	);
}

export default function DataDeletionRequestPage() {
	const [answers, setAnswers] = useState<Answers>(EMPTY);
	/* Hidden from people, visible to bots. See the honeypot note in the route. */
	const [honeypot, setHoneypot] = useState("");
	const [confirmed, setConfirmed] = useState(false);
	const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

	const set = <K extends keyof Answers>(key: K, value: Answers[K]) =>
		setAnswers((prev) => ({ ...prev, [key]: value }));

	const ready =
		answers.name.trim() !== "" &&
		answers.scope !== "" &&
		confirmed &&
		/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.email.trim());

	async function onSubmit(e: FormEvent) {
		e.preventDefault();
		if (status === "submitting" || !ready) return;
		setStatus("submitting");
		try {
			const response = await fetch("/api/data-deletion-request", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...answers, company_website: honeypot }),
			});
			if (!response.ok) throw new Error("submit_failed");
			track(EVENTS.DATA_DELETION_SUBMITTED, { scope: answers.scope });
			setStatus("done");
		} catch {
			track(EVENTS.DATA_DELETION_FAILED);
			setStatus("error");
		}
	}

	return (
		<main className="min-h-screen bg-do-bg">
			<SiteNav />

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
							<span className="do-section-label text-do-orange">Privacy</span>
							<h1 className="text-3xl md:text-4xl font-bold text-do-text mt-4 tracking-tight">
								Request data deletion
							</h1>
							<p className="mt-5 text-base md:text-lg text-do-text-secondary leading-relaxed">
								Tell us what to delete and which account it belongs to. We may email
								you first to confirm it&apos;s really you, then complete the deletion
								within 30 days and confirm when it&apos;s done.
							</p>
							<p className="mt-4 text-sm text-do-text-muted">
								Using the mobile app? <strong className="text-do-text-secondary">Settings → Delete account</strong> removes
								your account immediately, with nothing to wait for. See the{" "}
								<Link href="/privacy" className="underline hover:text-do-text">
									privacy policy
								</Link>{" "}
								for what remains after deletion.
							</p>
						</motion.div>
					</div>
				</section>

				{/* Form */}
				<section id="request" className="relative pb-20 scroll-mt-24">
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
										Request received.
									</h2>
									<p className="text-base text-do-text-secondary max-w-lg mx-auto leading-relaxed">
										A confirmation is on its way to {answers.email || "your inbox"}.
										We may reply there to verify it&apos;s you before anything is
										deleted. The deletion is completed within 30 days, and you&apos;ll
										get an email when it&apos;s done.
									</p>
									<p className="mt-6 text-xs text-do-text-muted">
										Sent this by mistake? Reply to the confirmation email and we&apos;ll
										cancel it.
									</p>
								</motion.div>
							) : (
								<form onSubmit={onSubmit} className="space-y-7">
									<div className="grid sm:grid-cols-2 gap-5">
										<TextField
											label="Your name"
											value={answers.name}
											onChange={(v) => set("name", v)}
											placeholder="Jordan Reyes"
										/>
										<TextField
											label="Account email"
											type="email"
											value={answers.email}
											onChange={(v) => set("email", v)}
											placeholder="you@company.com"
											hint="The address you sign in with. We confirm the request there."
										/>
									</div>

									<TextField
										label="Company"
										value={answers.company}
										onChange={(v) => set("company", v)}
										placeholder="Reyes Electric"
										optional
									/>

									{/* Scope. Radios drawn as cards so the two options and their
									    consequences sit side by side rather than in a dropdown. */}
									<fieldset>
										<legend className="text-sm font-medium text-do-text mb-3">
											What should we delete?
										</legend>
										<div className="grid gap-3">
											{SCOPES.map((option) => {
												const isSelected = answers.scope === option.value;
												return (
													<label
														key={option.value}
														className={`flex gap-4 items-start p-4 rounded-2xl border cursor-pointer transition-colors ${
															isSelected
																? "border-do-orange/40 bg-do-orange/[0.07]"
																: "border-do-border bg-do-bg/60 hover:border-do-border-accent"
														}`}
													>
														<input
															type="radio"
															name="scope"
															value={option.value}
															checked={isSelected}
															onChange={() => set("scope", option.value)}
															className="sr-only"
														/>
														<span
															aria-hidden="true"
															className={`mt-0.5 h-5 w-5 shrink-0 rounded-full border flex items-center justify-center ${
																isSelected
																	? "border-do-orange bg-do-orange text-white"
																	: "border-do-border"
															}`}
														>
															{isSelected && <Check className="h-3 w-3" />}
														</span>
														<span>
															<span
																className={`block text-sm font-medium ${
																	isSelected ? "text-do-orange" : "text-do-text"
																}`}
															>
																{option.title}
															</span>
															<span className="block mt-1 text-sm text-do-text-secondary leading-relaxed">
																{option.body}
															</span>
														</span>
													</label>
												);
											})}
										</div>
									</fieldset>

									<label className="block">
										<span className="block text-sm font-medium text-do-text mb-2">
											Anything we should know?{" "}
											<span className="text-do-text-muted font-normal">(optional)</span>
										</span>
										<textarea
											value={answers.details}
											onChange={(e) => set("details", e.target.value)}
											placeholder="Specific projects, a second email on the account, or a deadline you need us to meet."
											rows={4}
											className="w-full px-4 py-3 rounded-xl border border-do-border bg-do-bg/60 text-do-text placeholder:text-do-text-muted text-sm leading-relaxed resize-y focus:outline-none focus:border-do-orange/40 focus:ring-1 focus:ring-do-orange/40 transition-colors"
										/>
									</label>

									<label className="flex items-start gap-3 text-sm text-do-text-secondary leading-relaxed cursor-pointer">
										<input
											type="checkbox"
											checked={confirmed}
											onChange={(e) => setConfirmed(e.target.checked)}
											className="mt-1 h-4 w-4 shrink-0 accent-[#f97316]"
										/>
										<span>
											I understand this deletion cannot be undone, and that records I
											filed into an organization&apos;s shared projects stay with those
											projects with my name and contact details removed.
										</span>
									</label>

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
											</a>{" "}
											from your account address.
										</p>
									)}

									<div className="flex flex-wrap items-center justify-between gap-4 pt-7 border-t border-do-border">
										<span className="inline-flex items-center gap-2 text-xs text-do-text-muted">
											<ShieldCheck className="h-4 w-4" />
											Logged with a timestamp, as the privacy policy requires.
										</span>
										<button
											type="submit"
											disabled={status === "submitting" || !ready}
											className="group inline-flex items-center gap-2 px-7 py-3 text-sm font-medium text-white bg-do-orange hover:bg-do-orange-dark rounded-xl transition-all shadow-[0_0_30px_rgba(249,115,22,0.25)] hover:shadow-[0_0_45px_rgba(249,115,22,0.45)] disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed"
										>
											{status === "submitting" ? "Sending..." : "Submit deletion request"}
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
