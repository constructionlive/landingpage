"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, FormEvent } from "react";
import {
	ArrowRight,
	ArrowLeft,
	Calendar,
	Check,
	CheckCircle2,
	HardHat,
	Layers,
	Mail,
	Users,
} from "lucide-react";
import SiteNav from "@/components/home/SiteNav";
import SiteFooter from "@/components/home/SiteFooter";

const CALENDAR_URL = "https://calendar.app.google/Eb7GFYUJNLDof5oz6";

/* The contractor type is answered in their own words. These lists are only
   prompts, shown under the field so nobody stares at an empty box, and they
   branch off the role because a GC and a sub describe themselves differently.
   Other has no list on purpose: we'd only be guessing at what they do. */
const GC = "General Contractor";
const SUB = "Subcontractor";
const PM = "Project Manager";
const OTHER = "Other";
const ROLES = [GC, SUB, PM, OTHER];

const TRADE_SUGGESTIONS: Record<string, string[]> = {
	[GC]: [
		"Tenant fit-out",
		"Mixed-use",
		"Light commercial new build",
		"Retail rollout",
		"Hospitality & restaurant",
		"Multi-family",
	],
	[SUB]: [
		"Electrical",
		"Mechanical / HVAC",
		"Plumbing",
		"Drywall & framing",
		"Finishes & millwork",
		"Concrete",
		"Roofing & envelope",
		"Fire protection",
		"Low voltage",
	],
	[PM]: [
		"Owner's rep",
		"Construction manager",
		"Tenant fit-out",
		"Light commercial new build",
		"Multi-family",
		"Program management",
	],
	/* Nothing sensible to suggest for Other, so the field just stays open. */
};

const TEAM_SIZES = ["1-5", "6-20", "21-50", "50+"];

/* Optional, but the most useful answer on the form: it tells us which part of
   the platform to quote and what to open the call with. Chips append rather
   than replace, because most contractors have more than one of these. */
const PAIN_POINTS = [
	"Chasing daily reports",
	"Change orders getting lost",
	"Pay apps take too long",
	"RFIs and submittals slipping",
	"Can't find the right drawing",
	"Delay claims with no record",
];

/* Step 2 */
const HEARD_ABOUT = [
	"Google search",
	"LinkedIn",
	"From a friend or colleague",
	"Other",
];

const DRIVERS = [
	{
		icon: Layers,
		title: "How many projects are live",
		description:
			"We price per active project, so a contractor running two jobs isn't paying like one running twelve.",
	},
	{
		icon: Users,
		title: "How big the field team is",
		description:
			"Everyone who captures in the field, supers, foremen, PMs. The office seats that read the record come with it.",
	},
	{
		icon: HardHat,
		title: "What we need to connect to",
		description:
			"Procore, Autodesk, Bluebeam, your accounting and your email. Setup scope depends on what you already run.",
	},
];

const NEXT_STEPS = [
	{
		title: "We read it the same day",
		description: "Rahul goes through it himself. No SDR queue, no routing.",
	},
	{
		title: "You get a reply within one business day",
		description:
			"A quote shaped around your projects and team size, plus anything we'd want to check first.",
	},
	{
		title: "A 15-minute call if it looks like a fit",
		description: "No deck. We ask about your pay apps and show you what we'd do about them.",
	},
];

/* Changing a field here means changing four other places: the validator in
   app/api/quote/route.ts, the mutation args in convex/quotes.ts, the
   quoteRequests table in convex/schema.ts, and BOTH emails in
   convex/emails.ts (the internal `rows` table and the customer `recap`).
   A field added here but not there is collected and then silently dropped. */
type Answers = {
	role: string;
	trade: string;
	teamSize: string;
	website: string;
	painPoint: string;
	name: string;
	email: string;
	company: string;
	phone: string;
	heardAbout: string;
};

const EMPTY: Answers = {
	role: "",
	trade: "",
	teamSize: "",
	website: "",
	painPoint: "",
	name: "",
	email: "",
	company: "",
	phone: "",
	heardAbout: "",
};

const STEP_COUNT = 2;
const LAST_STEP = STEP_COUNT - 1;

/* ── Inputs ────────────────────────────────────────────────────────── */

function ChoiceGroup({
	label,
	options,
	value,
	onChange,
	multi = false,
	optional = false,
}: {
	label: string;
	options: string[];
	value: string | string[];
	onChange: (next: string) => void;
	multi?: boolean;
	optional?: boolean;
}) {
	const selected = (option: string) =>
		multi ? (value as string[]).includes(option) : value === option;

	return (
		<div>
			<p className="text-sm font-medium text-do-text mb-3">
				{label}
				{optional && <span className="text-do-text-muted font-normal"> (optional)</span>}
				{multi && !optional && (
					<span className="text-do-text-muted font-normal"> (pick any)</span>
				)}
			</p>
			<div className="flex flex-wrap gap-2.5">
				{options.map((option) => {
					const isSelected = selected(option);
					return (
						<button
							key={option}
							type="button"
							onClick={() => onChange(option)}
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

/* A field they type into, with examples underneath. Tapping an example fills it
   in so the quick path still exists, but the answer is theirs to word. */
function SuggestedField({
	label,
	value,
	onChange,
	suggestions,
	placeholder,
}: {
	label: string;
	value: string;
	onChange: (next: string) => void;
	suggestions: string[];
	placeholder?: string;
}) {
	return (
		<div>
			<label className="block">
				<span className="block text-sm font-medium text-do-text mb-3">{label}</span>
				<input
					type="text"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
					className="w-full px-4 py-3 rounded-xl border border-do-border bg-do-bg/60 text-do-text placeholder:text-do-text-muted text-sm focus:outline-none focus:border-do-orange/40 focus:ring-1 focus:ring-do-orange/40 transition-colors"
				/>
			</label>

			{/* Nothing to suggest until we know which role they're answering as. */}
			{suggestions.length > 0 && (
				<motion.div
					className="flex flex-wrap items-center gap-2 mt-3"
					initial={{ opacity: 0, y: -4 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.25 }}
				>
					<span className="text-xs text-do-text-muted">For example:</span>
					{suggestions.map((suggestion) => (
						<button
							key={suggestion}
							type="button"
							onClick={() => onChange(suggestion)}
							className="px-3 py-1.5 rounded-full border border-dashed border-do-border text-xs text-do-text-secondary hover:text-do-orange hover:border-do-orange/40 transition-colors"
						>
							{suggestion}
						</button>
					))}
				</motion.div>
			)}
		</div>
	);
}

/* Like SuggestedField, but the chips add to the answer instead of replacing it,
   and a second tap takes it back off. Contractors rarely have just one problem. */
function PainPointField({
	label,
	value,
	onChange,
	suggestions,
	placeholder,
}: {
	label: string;
	value: string;
	onChange: (next: string) => void;
	suggestions: string[];
	placeholder?: string;
}) {
	const parts = value
		.split(/,\s*/)
		.map((part) => part.trim())
		.filter(Boolean);

	const toggle = (suggestion: string) => {
		const without = parts.filter((part) => part !== suggestion);
		onChange(
			without.length === parts.length
				? [...parts, suggestion].join(", ")
				: without.join(", "),
		);
	};

	return (
		<div>
			<label className="block">
				<span className="block text-sm font-medium text-do-text mb-2">
					{label}
					<span className="text-do-text-muted font-normal"> (optional)</span>
				</span>
				<textarea
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
					rows={3}
					className="w-full px-4 py-3 rounded-xl border border-do-border bg-do-bg/60 text-do-text placeholder:text-do-text-muted text-sm leading-relaxed resize-y focus:outline-none focus:border-do-orange/40 focus:ring-1 focus:ring-do-orange/40 transition-colors"
				/>
			</label>

			<div className="flex flex-wrap items-center gap-2 mt-3">
				<span className="text-xs text-do-text-muted">Common ones:</span>
				{suggestions.map((suggestion) => {
					const isSelected = parts.includes(suggestion);
					return (
						<button
							key={suggestion}
							type="button"
							onClick={() => toggle(suggestion)}
							aria-pressed={isSelected}
							className={`px-3 py-1.5 rounded-full border text-xs transition-colors ${
								isSelected
									? "border-do-orange/40 text-do-orange bg-do-orange/[0.07]"
									: "border-dashed border-do-border text-do-text-secondary hover:text-do-orange hover:border-do-orange/40"
							}`}
						>
							{suggestion}
						</button>
					);
				})}
			</div>
		</div>
	);
}

/* ── Page ──────────────────────────────────────────────────────────── */

export default function PricingPage() {
	const [step, setStep] = useState(0);
	const [answers, setAnswers] = useState<Answers>(EMPTY);
	const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

	const set = <K extends keyof Answers>(key: K, value: Answers[K]) =>
		setAnswers((prev) => ({ ...prev, [key]: value }));

	/* Each step gates the next one, so nobody lands on the contact fields
	   without us knowing what we're quoting, and nobody sends the form
	   without a name we can reply to. */
	const stepReady = [
		answers.role !== "" &&
			answers.trade.trim() !== "" &&
			answers.teamSize !== "" &&
			answers.website.trim() !== "",
		answers.name.trim() !== "" &&
			answers.company.trim() !== "" &&
			/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(answers.email.trim()),
	];

	async function onSubmit(e: FormEvent) {
		e.preventDefault();
		if (status === "submitting" || !stepReady[LAST_STEP]) return;
		setStatus("submitting");
		try {
			const response = await fetch("/api/quote", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(answers),
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

			{/* Hero */}
			<section className="relative pt-20 pb-8 overflow-hidden">
				<div className="absolute inset-0 do-blueprint-grid pointer-events-none" />
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-do-orange/[0.04] rounded-full blur-[150px]" />

				<div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<span className="do-section-label text-do-orange">Pricing</span>
						<h2 className="text-3xl md:text-4xl font-bold text-do-text mt-4 tracking-tight">
							Get a Quote
				
						</h2>
						{/* <p className="text-lg text-do-text-secondary max-w-2xl mx-auto leading-relaxed">
							We price by project and team size. We&apos;re still shaping plans with
							early customers, so instead of a table that would be wrong for half the
							people reading it, tell us what you run and we&apos;ll come back with a
							real number.
						</p> */}
					</motion.div>
				</div>
			</section>

			{/* The form */}
			<section id="quote" className="relative pb-20 overflow-hidden scroll-mt-24">
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
									Got it. Rahul will reply within one business day.
								</h2>
								<p className="text-base text-do-text-secondary max-w-lg mx-auto leading-relaxed mb-8">
									A copy is on its way to {answers.email || "your inbox"}. If
									you&apos;d rather not wait, grab a time now and we&apos;ll walk
									through the quote live.
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
							<form onSubmit={onSubmit}>
								{/* Progress bar */}
								<div
									className="h-1 w-full rounded-full bg-do-border overflow-hidden mb-8"
									role="progressbar"
									aria-valuemin={1}
									aria-valuemax={STEP_COUNT}
									aria-valuenow={step + 1}
									aria-label={`Step ${step + 1} of ${STEP_COUNT}`}
								>
									<div
										className="h-full rounded-full bg-do-orange transition-[width] duration-300 ease-out"
										style={{ width: `${((step + 1) / STEP_COUNT) * 100}%` }}
									/>
								</div>

								<AnimatePresence mode="wait">
									<motion.div
										key={step}
										initial={{ opacity: 0, x: 16 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -16 }}
										transition={{ duration: 0.25 }}
										className="space-y-7"
									>
										{step === 0 && (
											<>
												<ChoiceGroup
													label="Which are you?"
													options={ROLES}
													value={answers.role}
													onChange={(v) => set("role", v)}
												/>
												{/* Always asked. Only the examples wait on the role. */}
												<SuggestedField
													label="What kind of work do you do?"
													value={answers.trade}
													onChange={(v) => set("trade", v)}
													suggestions={TRADE_SUGGESTIONS[answers.role] ?? []}
													placeholder="Tell us in your own words"
												/>
												<ChoiceGroup
													label="How big is your field team?"
													options={TEAM_SIZES}
													value={answers.teamSize}
													onChange={(v) => set("teamSize", v)}
												/>
												<TextField
													label="Company website"
													value={answers.website}
													onChange={(v) => set("website", v)}
													placeholder="reyeselectric.com"
												/>
												<PainPointField
													label="What are you hoping to fix?"
													value={answers.painPoint}
													onChange={(v) => set("painPoint", v)}
													suggestions={PAIN_POINTS}
													placeholder="Tell us what's costing you time or money right now. It helps us quote the right thing."
												/>
											</>
										)}

										{step === 1 && (
											<>
												<div className="grid sm:grid-cols-2 gap-5">
													<TextField
														label="You Name"
														value={answers.name}
														onChange={(v) => set("name", v)}
														placeholder="Jordan Reyes"
													/>
													<TextField
														label="Company Name"
														value={answers.company}
														onChange={(v) => set("company", v)}
														placeholder="Reyes Electric"
													/>
													<TextField
														label="Your Email"
														type="email"
														value={answers.email}
														onChange={(v) => set("email", v)}
														placeholder="you@company.com"
													/>
													<TextField
														label="Phone"
														type="tel"
														value={answers.phone}
														onChange={(v) => set("phone", v)}
														placeholder="(555) 019-2837"
														optional
													/>
												</div>
												<ChoiceGroup
													label="How did you hear about us?"
													options={HEARD_ABOUT}
													value={answers.heardAbout}
													onChange={(v) => set("heardAbout", v)}
													optional
												/>
											</>
										)}
									</motion.div>
								</AnimatePresence>

								{status === "error" && (
									<p className="mt-6 text-sm text-red-500">
										That didn&apos;t go through. Try again, or email{" "}
										<a
											className="underline"
											href="mailto:rahul@construction.live"
										>
											rahul@construction.live
										</a>
										.
									</p>
								)}

								{/* Controls */}
								<div className="flex items-center justify-between gap-4 mt-9 pt-7 border-t border-do-border">
									{step > 0 ? (
										<button
											type="button"
											onClick={() => setStep(step - 1)}
											className="group inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-do-text-secondary hover:text-do-text border border-do-border hover:border-do-border-accent rounded-xl transition-all"
										>
											<ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
											Back
										</button>
									) : (
										<span className="text-xs text-do-text-muted">
											Takes about a minute.
										</span>
									)}

									{step < LAST_STEP ? (
										<button
											type="button"
											onClick={() => setStep(step + 1)}
											disabled={!stepReady[step]}
											className="group inline-flex items-center gap-2 px-7 py-3 text-sm font-medium text-white bg-do-orange hover:bg-do-orange-dark rounded-xl transition-all shadow-[0_0_30px_rgba(249,115,22,0.25)] hover:shadow-[0_0_45px_rgba(249,115,22,0.45)] disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed"
										>
											Continue
											<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
										</button>
									) : (
										<button
											type="submit"
											disabled={status === "submitting" || !stepReady[step]}
											className="group inline-flex items-center gap-2 px-7 py-3 text-sm font-medium text-white bg-do-orange hover:bg-do-orange-dark rounded-xl transition-all shadow-[0_0_30px_rgba(249,115,22,0.25)] hover:shadow-[0_0_45px_rgba(249,115,22,0.45)] disabled:opacity-40 disabled:shadow-none disabled:cursor-not-allowed"
										>
											{status === "submitting" ? "Sending..." : "Get my quote"}
											<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
										</button>
									)}
								</div>
							</form>
						)}
					</motion.div>

					{/* <p className="mt-5 text-center text-xs text-do-text-muted">
						No card, no obligation. We don&apos;t share your details with anyone.{" "}
						<a href="/privacy" className="underline hover:text-do-text-secondary">
							Privacy
						</a>
					</p> */}
				</div>
			</section>

			{/* What happens next */}
			{/* <section className="relative py-16 overflow-hidden bg-do-bg-card">
				<div className="absolute inset-0 do-blueprint-grid-dense pointer-events-none" />
				<div className="relative z-10 max-w-4xl mx-auto px-6">
					<motion.div
						className="text-center mb-12"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<span className="do-section-label text-do-orange">After you send it</span>
						<h2 className="text-3xl font-bold text-do-text mt-4">What happens next</h2>
					</motion.div>

					<div className="grid md:grid-cols-3 gap-5">
						{NEXT_STEPS.map((item, i) => (
							<motion.div
								key={item.title}
								className="rounded-2xl border border-do-border bg-do-bg/60 backdrop-blur-sm p-6"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: i * 0.1, duration: 0.5 }}
							>
								<span className="do-section-label text-do-orange">0{i + 1}</span>
								<h3 className="text-base font-semibold text-do-text mt-3 mb-2">
									{item.title}
								</h3>
								<p className="text-sm text-do-text-secondary leading-relaxed">
									{item.description}
								</p>
							</motion.div>
						))}
					</div>

					<div className="flex flex-wrap justify-center gap-3 mt-12">
						<a
							href={CALENDAR_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="group inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-do-text-secondary hover:text-do-text border border-do-border hover:border-do-border-accent rounded-xl transition-all"
						>
							<Calendar className="h-4 w-4" />
							Rather just book a time?
						</a>
						<a
							href="mailto:rahul@construction.live"
							className="group inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-do-text-secondary hover:text-do-text border border-do-border hover:border-do-border-accent rounded-xl transition-all"
						>
							<Mail className="h-4 w-4" />
							Email us instead
						</a>
					</div>
				</div>
			</section> */}

			<SiteFooter />
		</main>
	);
}
