"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import {
	Mic,
	Brain,
	FileText,
	ShieldCheck,
	ArrowRight,
	HelpCircle,
	PhoneCall,
	Camera,
	Plug,
} from "lucide-react";

/* ── Steps data ────────────────────────────────────────────────────── */

const steps = [
	{
		number: "01",
		icon: Mic,
		title: "Talk, don't type",
		description:
			"Supers walk the site and talk for 30 seconds. Or send a photo. Or take a quick call from our AI at end of shift. Three inputs, same unified record. No forms, no app to fight with on a dirty phone.",
		detail: [
			"30-second voice notes from any phone",
			"Geotagged + timestamped photos",
			"AI outbound calls at shift change",
			"Works offline: syncs when service returns",
		],
		example: "Pouring Level 3 concrete today. Found unexpected rebar in the south footing, not on the drawings. Taking photos.",
	},
	{
		number: "02",
		icon: Brain,
		title: "AI catches the money moments",
		description:
			"Construction-trained AI listens for the words that cost contractors money, extras, unforeseen conditions, weather delays, no-shows, owner changes. PMs see the alert the same day, not 30 days later.",
		detail: [
			"Eight categories of money moments tracked",
			"Same-day alerts to PMs",
			"Auto-drafted owner notifications",
			"Routes to right project + scope",
		],
		example: "Auto-flagged: Unforeseen condition (rebar in south footing). Drafting owner notification + change-order packet.",
	},
	{
		number: "03",
		icon: FileText,
		title: "Documentation assembles itself",
		description:
			"Voice transcripts, geotagged photos, integration data, and AI call summaries: unified into one timestamped record per project, per day, per scope item. Searchable when the dispute comes 8 months later.",
		detail: [
			"Voice transcript + audio backup",
			"Photos linked to scope items",
			"Quantified delays + schedule impact",
			"Searchable by project, trade, date",
		],
		example: "Day 47 record: voice log + transcript, 4 photos (south footing 8:47 AM), 45-min delay quantified.",
	},
	{
		number: "04",
		icon: ShieldCheck,
		title: "Pay apps & change orders get approved",
		description:
			"Pay apps ship with auto-assembled backup packages instead of a PM digging through a month of emails. Change orders submit with day-one documentation owners can't dispute. T&M tickets come with hour-by-hour proof.",
		detail: [
			"Pay app backup auto-assembled",
			"Change orders with day-one proof",
			"T&M tickets with hour-by-hour evidence",
			"Pushes to Procore, Autodesk, Fieldwire",
		],
		example: "Pay App #6 submitted with full backup attached. Change order #12 packet assembled from day-one rebar documentation.",
	},
];

/* ── FAQ data ──────────────────────────────────────────────────────── */

const faqs = [
	{
		question: "Who is construction.live built for?",
		answer:
			"Small and mid-size commercial general contractors and subcontractors. Specifically, $2M-50M commercial GCs running tenant fit-out, light commercial new build, retail, and hospitality projects, plus the electrical, mechanical, and specialty subcontractors. Not built for enterprise GCs, heavy civil, or institutional construction.",
	},
	{
		question: "Do supers need to learn an app?",
		answer:
			"No. The whole point is that they don't. Supers talk for 30 seconds, send a photo, or take a call from our AI , the same way they already work. No forms, no typing, no training. The platform handles the rest.",
	},
	{
		question: "What does the AI outbound call sound like?",
		answer:
			"A 30 to 60 second conversational check-in. The AI asks for a quick summary , pours, extras, delays, issues. The super answers, the AI transcribes, categorizes, and routes everything to the right project and scope. Easier than texting the office.",
	},
	{
		question: "How does same-day flagging actually work?",
		answer:
			"Voice notes, photos, and AI call summaries run through construction-trained models that track eight categories of money moments, extras not in contract, unforeseen conditions, weather delays, subcontractor no-shows, owner-supplied issues, coordination conflicts, T&M hours, and owner-directed changes. When any of them show up in field input, the PM gets a same-day alert.",
	},
	{
		question: "Does it integrate with Procore, Autodesk, and Fieldwire?",
		answer:
			"Yes. Daily logs, change orders, and pay-app backup push directly into the systems your owner already requires. Nobody copy-pastes documentation between tools.",
	},
	{
		question: "What does this cost?",
		answer:
			"$1000/month per active project. Win one $50K change order or speed up one pay app by 30 days and the platform pays for itself for a lifetime. Built and priced for small and mid-size commercial contractors.",
	},
];

/* ── Step card component ───────────────────────────────────────────── */

function StepCard({
	step,
	index,
	isActive,
	onClick,
}: {
	step: (typeof steps)[0];
	index: number;
	isActive: boolean;
	onClick: () => void;
}) {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-50px" });

	return (
		<motion.div
			ref={ref}
			className={`relative cursor-pointer transition-all duration-300 ${isActive ? "" : "opacity-70 hover:opacity-100"}`}
			initial={{ opacity: 0, y: 30 }}
			animate={inView ? { opacity: isActive ? 1 : 0.7, y: 0 } : {}}
			transition={{ delay: index * 0.1, duration: 0.5 }}
			onClick={onClick}
		>
			<div className="flex gap-6 items-start">
				<div className="hidden md:flex flex-col items-center shrink-0">
					<div
						className={`h-16 w-16 rounded-2xl border-2 flex items-center justify-center transition-all ${
							isActive
								? "bg-do-orange border-do-orange text-white"
								: "bg-do-bg border-do-border text-do-text-muted"
						}`}
					>
						<span className="text-lg font-bold font-mono">{step.number}</span>
					</div>
					{index < steps.length - 1 && (
						<div className="w-px h-12 bg-gradient-to-b from-do-border to-transparent" />
					)}
				</div>

				<div className="flex-1 rounded-2xl border bg-do-bg-card/80 backdrop-blur-sm p-8 transition-all hover:border-do-border-accent">
					<div className="flex items-center gap-4 mb-4">
						<div
							className={`h-12 w-12 rounded-xl flex items-center justify-center ${
								isActive ? "bg-do-orange/10" : "bg-do-bg-light"
							}`}
						>
							<step.icon
								className={`h-6 w-6 ${isActive ? "text-do-orange" : "text-do-text-muted"}`}
							/>
						</div>
						<div>
							<span
								className={`text-xs font-mono ${isActive ? "text-do-orange" : "text-do-text-muted"}`}
							>
								STEP {step.number}
							</span>
							<h3 className="text-xl font-semibold text-do-text">{step.title}</h3>
						</div>
					</div>

					<p className="text-base text-do-text-secondary leading-relaxed mb-6">
						{step.description}
					</p>

					<div className="grid sm:grid-cols-2 gap-3 mb-6">
						{step.detail.map((item) => (
							<div key={item} className="flex items-center gap-2">
								<div className="h-1.5 w-1.5 rounded-full bg-do-orange" />
								<span className="text-sm text-do-text-secondary">{item}</span>
							</div>
						))}
					</div>

					<div className="rounded-lg bg-do-bg/80 border border-do-border p-4">
						<p className="text-[10px] font-mono text-do-text-muted uppercase tracking-wider mb-1.5">
							Example
						</p>
						<p className="text-sm text-do-text/80 italic">{step.example}</p>
					</div>
				</div>
			</div>
		</motion.div>
	);
}

/* ── Interactive demo ─────────────────────────────────────────────── */

function InteractiveDemo() {
	const [activeStep, setActiveStep] = useState(0);

	const inputIcons = [Mic, Brain, FileText, ShieldCheck];

	return (
		<div className="relative max-w-2xl mx-auto">
			<div className="rounded-2xl border border-do-border bg-do-bg-card/80 backdrop-blur-xl overflow-hidden shadow-2xl">
				<div className="flex items-center gap-3 px-5 py-4 border-b border-do-border bg-do-bg/50">
					<div className="flex gap-1.5">
						<div className="h-3 w-3 rounded-full bg-red-500/60" />
						<div className="h-3 w-3 rounded-full bg-yellow-500/60" />
						<div className="h-3 w-3 rounded-full bg-green-500/60" />
					</div>
					<div className="flex-1 flex justify-center">
						<div className="h-7 rounded-lg bg-do-bg-light border border-do-border px-4 flex items-center gap-2">
							<div className="h-3 w-3 rounded bg-do-orange/30" />
							<span className="text-xs text-do-text-muted font-mono">
								Unified intelligence, Tower B
							</span>
						</div>
					</div>
				</div>

				<div className="flex border-b border-do-border">
					{steps.map((step, i) => {
						const Icon = inputIcons[i];
						return (
							<button
								key={step.number}
								onClick={() => setActiveStep(i)}
								className={`flex-1 px-4 py-3 text-xs font-mono transition-colors flex items-center justify-center gap-1.5 ${
									activeStep === i
										? "text-do-orange border-b-2 border-do-orange bg-do-orange/5"
										: "text-do-text-muted hover:text-do-text hover:bg-do-bg-light"
								}`}
							>
								<Icon className="h-3.5 w-3.5" />
								{step.number}
							</button>
						);
					})}
				</div>

				<div className="p-6">
					{activeStep === 0 && (
						<motion.div
							className="space-y-3"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
						>
							<div className="flex items-center gap-3 p-3 rounded-xl bg-do-bg-light/40 border border-do-border">
								<div className="h-10 w-10 rounded-full bg-do-orange/10 flex items-center justify-center">
									<Mic className="h-5 w-5 text-do-orange" />
								</div>
								<div className="flex-1">
									<p className="text-xs font-mono text-do-text-muted">Mike, Super, 0:28</p>
									<p className="text-sm text-do-text italic">&quot;Found unexpected rebar, south footing&quot;</p>
								</div>
							</div>
							<div className="flex items-center gap-3 p-3 rounded-xl bg-do-bg-light/40 border border-do-border">
								<div className="h-10 w-10 rounded-full bg-do-orange/10 flex items-center justify-center">
									<Camera className="h-5 w-5 text-do-orange" />
								</div>
								<div className="flex-1">
									<p className="text-xs font-mono text-do-text-muted">3 photos, 8:51 AM</p>
									<p className="text-sm text-do-text">Geotagged, south footing</p>
								</div>
							</div>
							<div className="flex items-center gap-3 p-3 rounded-xl bg-do-bg-light/40 border border-do-border">
								<div className="h-10 w-10 rounded-full bg-do-orange/10 flex items-center justify-center">
									<PhoneCall className="h-5 w-5 text-do-orange" />
								</div>
								<div className="flex-1">
									<p className="text-xs font-mono text-do-text-muted">AI call, end of shift</p>
									<p className="text-sm text-do-text">Scheduled 5:30 PM</p>
								</div>
							</div>
						</motion.div>
					)}

					{activeStep === 1 && (
						<motion.div className="space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
							{[
								{ label: "Unforeseen condition flagged", detail: "Rebar, not in contract" },
								{ label: "Change order candidate", detail: "Owner notification drafted" },
								{ label: "Delay quantified", detail: "45 min crew standby" },
							].map((item, i) => (
								<motion.div
									key={i}
									className="flex items-center gap-3 p-3 rounded-xl bg-do-orange/5 border border-do-orange/20"
									initial={{ opacity: 0, x: 15 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: i * 0.2 }}
								>
									<div className="h-9 w-9 rounded-lg bg-do-orange/10 flex items-center justify-center">
										<Brain className="h-4 w-4 text-do-orange" />
									</div>
									<div className="flex-1">
										<p className="text-sm font-medium text-do-text">{item.label}</p>
										<p className="text-xs text-do-text-secondary">{item.detail}</p>
									</div>
								</motion.div>
							))}
						</motion.div>
					)}

					{activeStep === 2 && (
						<motion.div className="space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
							{[
								{ name: "VoiceLog-Aug04-0847.mp3", detail: "Mike, Super, 28 sec + transcript" },
								{ name: "Photo-Aug04-0851.jpg", detail: "South footing, geotagged" },
								{ name: "DailyLog-Aug04.pdf", detail: "Unforeseen condition record" },
							].map((item, i) => (
								<motion.div
									key={i}
									className="flex items-center gap-3 p-3 rounded-xl bg-do-bg-light/40 border border-do-border"
									initial={{ opacity: 0, x: 15 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: i * 0.2 }}
								>
									<FileText className="h-4 w-4 text-do-orange shrink-0" />
									<div className="flex-1 min-w-0">
										<p className="text-xs font-mono text-do-text truncate">{item.name}</p>
										<p className="text-[11px] text-do-text-secondary">{item.detail}</p>
									</div>
								</motion.div>
							))}
						</motion.div>
					)}

					{activeStep === 3 && (
						<motion.div className="space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
							<div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
								<div className="h-9 w-9 rounded-lg bg-emerald-500/15 flex items-center justify-center">
									<ShieldCheck className="h-4 w-4 text-emerald-500" />
								</div>
								<div className="flex-1">
									<p className="text-sm font-medium text-do-text">Pay App #6, backup package attached</p>
									<p className="text-xs text-do-text-secondary">Auto-assembled, line by line, ready to submit</p>
								</div>
							</div>
							<div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
								<div className="h-9 w-9 rounded-lg bg-emerald-500/15 flex items-center justify-center">
									<ShieldCheck className="h-4 w-4 text-emerald-500" />
								</div>
								<div className="flex-1">
									<p className="text-sm font-medium text-do-text">Change Order #12 packet ready</p>
									<p className="text-xs text-do-text-secondary">Day-one rebar documentation, owner-ready</p>
								</div>
							</div>
							<div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
								<div className="h-9 w-9 rounded-lg bg-emerald-500/15 flex items-center justify-center">
									<Plug className="h-4 w-4 text-emerald-500" />
								</div>
								<div className="flex-1">
									<p className="text-sm font-medium text-do-text">Synced to Procore + Autodesk</p>
									<p className="text-xs text-do-text-secondary">Owner sees the same record you do</p>
								</div>
							</div>
						</motion.div>
					)}
				</div>
			</div>
		</div>
	);
}

/* ── FAQ section ───────────────────────────────────────────────────── */

function FAQSection() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-80px" });
	const [openIndex, setOpenIndex] = useState<number | null>(null);

	return (
		<section className="relative py-24 overflow-hidden bg-do-bg-card" ref={ref}>
			<div className="absolute inset-0 do-blueprint-grid-dense pointer-events-none" />

			<div className="relative z-10 max-w-3xl mx-auto px-6">
				<motion.div
					className="text-center mb-16"
					initial={{ opacity: 0, y: 30 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6 }}
				>
					<span className="do-section-label text-do-orange">
						Frequently asked questions
					</span>
					<h2 className="text-3xl md:text-4xl font-bold text-do-text mt-4">
						Common questions
					</h2>
				</motion.div>

				<div className="space-y-4">
					{faqs.map((faq, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, y: 20 }}
							animate={inView ? { opacity: 1, y: 0 } : {}}
							transition={{ delay: i * 0.05, duration: 0.4 }}
						>
							<button
								onClick={() => setOpenIndex(openIndex === i ? null : i)}
								className="w-full text-left rounded-xl border border-do-border bg-do-bg/80 p-5 hover:border-do-border-accent transition-colors"
							>
								<div className="flex items-center justify-between gap-4">
									<span className="font-medium text-do-text">{faq.question}</span>
									<HelpCircle
										className={`h-5 w-5 text-do-text-muted shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`}
									/>
								</div>
								{openIndex === i && (
									<p className="mt-4 text-sm text-do-text-secondary leading-relaxed">
										{faq.answer}
									</p>
								)}
							</button>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}

/* ── CTA section ───────────────────────────────────────────────────── */

function HowItWorksCTA() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-80px" });

	return (
		<section className="relative py-24 overflow-hidden" ref={ref}>
			<div className="absolute inset-0 do-blueprint-grid pointer-events-none" />
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-do-orange/[0.04] rounded-full blur-[150px]" />

			<div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6 }}
				>
					<h2 className="text-3xl md:text-4xl font-bold text-do-text mb-5">
						The best way to understand is to try it.
					</h2>
					<p className="text-lg text-do-text-secondary mb-8">
						Book a 15-minute demo and we&apos;ll show you exactly how it works
						on your projects. No deck, no sales pitch.
					</p>

					<a
						href="/book"
						className="group inline-flex items-center gap-2 px-8 py-4 text-base font-medium text-white bg-do-orange hover:bg-do-orange-dark rounded-xl transition-all shadow-[0_0_40px_rgba(249,115,22,0.3)] hover:shadow-[0_0_60px_rgba(249,115,22,0.5)]"
					>
						Book a Demo
						<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
					</a>
				</motion.div>
			</div>
		</section>
	);
}

/* ── Page ──────────────────────────────────────────────────────────── */

export default function HowItWorksPage() {
	const [activeStep, setActiveStep] = useState(0);

	return (
		<main className="min-h-screen bg-do-bg">
			<Navbar />

			{/* Hero */}
			<section className="relative pt-40 pb-20 overflow-hidden">
				<div className="absolute inset-0 do-blueprint-grid pointer-events-none" />
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-do-orange/[0.04] rounded-full blur-[150px]" />

				<div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<span className="do-section-label text-do-orange">
							How it works
						</span>
						<h1 className="text-4xl md:text-6xl font-bold text-do-text mt-4 mb-6">
							30 seconds in the field.
							<br />
							<span className="text-do-text-secondary font-normal">
								A pay app that defends itself.
							</span>
						</h1>
						<p className="text-lg md:text-xl text-do-text-secondary max-w-2xl mx-auto leading-relaxed">
							Four steps from voice note to approved payment. Built for small and
							mid-size commercial GCs and subcontractors.
						</p>
					</motion.div>
				</div>
			</section>

			{/* Interactive demo */}
			<section className="relative py-16 overflow-hidden">
				<div className="absolute inset-0 do-blueprint-grid-dense pointer-events-none" />

				<div className="relative z-10 max-w-4xl mx-auto px-6">
					<InteractiveDemo />
				</div>
			</section>

			{/* Step cards */}
			<section className="relative py-16 overflow-hidden">
				<div className="absolute inset-0 do-blueprint-grid pointer-events-none" />

				<div className="relative z-10 max-w-4xl mx-auto px-6">
					<div className="space-y-8">
						{steps.map((step, i) => (
							<StepCard
								key={step.number}
								step={step}
								index={i}
								isActive={activeStep === i}
								onClick={() => setActiveStep(i)}
							/>
						))}
					</div>
				</div>
			</section>

			<FAQSection />
			<HowItWorksCTA />
			<Footer />
		</main>
	);
}
