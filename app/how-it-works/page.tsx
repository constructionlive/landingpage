"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import {
	Upload,
	MessageSquare,
	Calculator,
	FileOutput,
	ArrowRight,
	HelpCircle,
	Clock,
	Shield,
	Zap,
	Globe,
	Mail,
	Smartphone,
	Users,
} from "lucide-react";

/* ── Steps data ────────────────────────────────────────────────────── */

const steps = [
	{
		number: "01",
		icon: Upload,
		title: "Upload your documents",
		description:
			"Specs, drawings, contracts, submittals, field reports. Drop any file in and the AI builds a working understanding of your project.",
		detail: [
			"PDFs, Word docs, Excel, CAD exports",
			"Drawings, specs, submittals",
			"Contracts, change orders, RFIs",
			"Field reports, meeting minutes",
		],
		example: "Upload a 200-page spec and ask about structural requirements in Division 03.",
	},
	{
		number: "02",
		icon: MessageSquare,
		title: "Ask your question",
		description:
			"Ask anything. Compare sections across files. Get technical requirements explained in plain language. No training required.",
		detail: [
			"Cross-reference multiple documents",
			"Compare specs to drawings",
			"Explain technical requirements",
			"Flag conflicts and gaps",
		],
		example: "Compare the mechanical schedule in the drawings against what's specified in Section 23 00 00.",
	},
	{
		number: "03",
		icon: Calculator,
		title: "Calculate and solve",
		description:
			"Run quantities, generate formulas, convert units, and validate calculations. From material takeoffs to load calculations, fast and traceable.",
		detail: [
			"Quantity takeoffs with waste factors",
			"Excel-ready formula generation",
			"Unit conversions and checks",
			"Full working shown for verification",
		],
		example: "Calculate concrete volume for this foundation with a 10% waste factor.",
	},
	{
		number: "04",
		icon: FileOutput,
		title: "Generate your deliverable",
		description:
			"Turn analysis into reports, bid comparisons, RFI responses, and presentations. From raw data to a polished output, ready to send.",
		detail: [
			"Progress and inspection reports",
			"Bid leveling summaries",
			"RFI and proposal drafts",
			"Client-ready presentations",
		],
		example: "Generate a bid leveling summary comparing these three mechanical sub-bids.",
	},
];

/* ── FAQ data ──────────────────────────────────────────────────────── */

const faqs = [
	{
		question: "Who uses construction.live on a typical project team?",
		answer:
			"Project managers, estimators, site engineers, and general contractors are the most common users. Owners and developers also use it for document review and progress reporting. The platform is built for anyone who works with construction documents, numbers, or reports as part of their job.",
	},
	{
		question: "Do I need to learn how to use it or does it work like a conversation?",
		answer:
			"It works like a conversation. There is no training required and no workflow to configure before you start. Upload a document, ask a question, and get an answer. Most users are productive from the first session without any onboarding.",
	},
	{
		question: "Can construction.live handle multiple documents at the same time?",
		answer:
			"Yes. You can upload multiple files and ask construction.live to cross-reference them. Compare the mechanical drawings against the spec. Cross-check a bid against the estimate. Map field report observations against the RFI log. The AI reads all the files together and answers in full context.",
	},
	{
		question: "How accurate are the calculations and code lookups?",
		answer:
			"Calculations are shown with full working including the formula, unit logic, and assumptions, so your team can check every step. Code lookups reference the relevant section and jurisdiction. For anything requiring a professional engineer stamp or legal sign-off, the outputs are a strong starting point for review rather than a final certified answer.",
	},
	{
		question: "Is construction.live useful outside of the office or only at a desk?",
		answer:
			"It works anywhere. Site engineers use it on their phones between walks. Project managers pull it up in site meetings to answer questions on the spot. The platform is browser-based and works on any device, so it fits into how construction teams actually move through their day.",
	},
	{
		question: "Can I automate repetitive tasks so construction.live runs without me asking?",
		answer:
			"Yes. You can set up scheduled tasks that run automatically. Daily email checks, weekly progress report compilation, submittal deadline tracking, and meeting attendance with notes and discrepancy flags are all examples of tasks teams have already automated on the platform. You set it up once and it runs on schedule.",
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
				{/* Step number circle */}
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

				{/* Content card */}
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

					{/* Detail list */}
					<div className="grid sm:grid-cols-2 gap-3 mb-6">
						{step.detail.map((item) => (
							<div key={item} className="flex items-center gap-2">
								<div className="h-1.5 w-1.5 rounded-full bg-do-orange" />
								<span className="text-sm text-do-text-secondary">{item}</span>
							</div>
						))}
					</div>

					{/* Example */}
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
	const [inputValue, setInputValue] = useState("");

	const demoInputs = [
		"Upload your spec package, drawing set, or any project document here...",
		"Ask anything about your project documents...",
		"Request calculations, formulas, or conversions...",
		"Generate reports, summaries, or proposals...",
	];

	return (
		<div className="relative max-w-2xl mx-auto">
			{/* Main demo card */}
			<div className="rounded-2xl border border-do-border bg-do-bg-card/80 backdrop-blur-xl overflow-hidden shadow-2xl">
				{/* Header */}
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
								app.construction.live
							</span>
						</div>
					</div>
				</div>

				{/* Step tabs */}
				<div className="flex border-b border-do-border">
					{steps.map((step, i) => (
						<button
							key={step.number}
							onClick={() => setActiveStep(i)}
							className={`flex-1 px-4 py-3 text-xs font-mono transition-colors ${
								activeStep === i
									? "text-do-orange border-b-2 border-do-orange bg-do-orange/5"
									: "text-do-text-muted hover:text-do-text hover:bg-do-bg-light"
							}`}
						>
							{step.number} {step.title.split(" ")[0]}
						</button>
					))}
				</div>

				{/* Content area */}
				<div className="p-6">
					{/* Upload state */}
					{activeStep === 0 && (
						<motion.div
							className="border-2 border-dashed border-do-border rounded-xl p-12 text-center"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
						>
							<div className="h-14 w-14 rounded-xl bg-do-orange/10 flex items-center justify-center mx-auto mb-4">
								<Upload className="h-7 w-7 text-do-orange" />
							</div>
							<p className="text-sm text-do-text mb-2">
								Drag and drop files here
							</p>
							<p className="text-xs text-do-text-muted">
								or click to browse
							</p>
							<div className="flex flex-wrap justify-center gap-2 mt-4">
								{["PDF", "DOCX", "XLSX", "CAD"].map((ext) => (
									<span
										key={ext}
										className="px-2 py-1 text-[10px] font-mono bg-do-bg-light border border-do-border rounded"
									>
										{ext}
									</span>
								))}
							</div>
						</motion.div>
					)}

					{/* Chat state */}
					{activeStep > 0 && (
						<motion.div
							className="space-y-4"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
						>
							{/* AI message */}
							<div className="flex gap-3">
								<div className="h-8 w-8 rounded-lg bg-do-orange/10 flex items-center justify-center shrink-0">
									<svg
										viewBox="0 0 24 24"
										className="h-4 w-4 text-do-orange"
										fill="none"
										stroke="currentColor"
										strokeWidth={2}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M2 20h20M4 20V10l8-6 8 6v10M9 20v-6h6v6"
										/>
									</svg>
								</div>
								<div className="flex-1 rounded-xl bg-do-bg-light border border-do-border p-4">
									<p className="text-sm text-do-text leading-relaxed">
										{steps[activeStep].description}
									</p>
								</div>
							</div>

							{/* User message */}
							<div className="flex gap-3 justify-end">
								<div className="rounded-xl bg-do-orange/10 border border-do-orange/20 p-4 max-w-[80%]">
									<p className="text-sm text-do-text italic">
										{steps[activeStep].example}
									</p>
								</div>
							</div>

							{/* Input */}
							<div className="relative mt-4">
								<input
									type="text"
									value={inputValue}
									onChange={(e) => setInputValue(e.target.value)}
									placeholder={demoInputs[activeStep]}
									className="w-full rounded-xl border border-do-border bg-do-bg px-4 py-3 pr-12 text-sm text-do-text placeholder:text-do-text-muted focus:outline-none focus:border-do-orange"
								/>
								<button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-do-orange/10 hover:bg-do-orange/20 transition-colors">
									<ArrowRight className="h-4 w-4 text-do-orange" />
								</button>
							</div>
						</motion.div>
					)}
				</div>
			</div>

			{/* Floating indicators */}
			<motion.div
				className="absolute -left-4 top-1/4"
				animate={{ y: [0, -8, 0] }}
				transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
			>
				<div className="rounded-lg bg-do-orange/10 border border-do-orange/20 px-3 py-1.5 text-xs text-do-orange font-mono">
					{steps[activeStep].number} Active
				</div>
			</motion.div>

			<motion.div
				className="absolute -right-4 top-1/3"
				animate={{ y: [0, 8, 0] }}
				transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
			>
				<div className="rounded-lg bg-do-bg-card border border-do-border px-3 py-1.5 text-xs text-do-text-muted font-mono">
					AI Powered
				</div>
			</motion.div>
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
						See what your team can do with an AI that never stops working.
					</h2>
					<p className="text-lg text-do-text-secondary mb-8">
						Join the construction teams already using construction.live to move
						faster, catch more, and deliver better results.
					</p>

					<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
						<a
							href="https://app.construction.live"
							className="group inline-flex items-center gap-2 px-8 py-4 text-base font-medium text-white bg-do-orange hover:bg-do-orange-dark rounded-xl transition-all shadow-[0_0_40px_rgba(249,115,22,0.3)] hover:shadow-[0_0_60px_rgba(249,115,22,0.5)]"
						>
							Get Started Free
							<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
						</a>
						<a
							href="/"
							className="group inline-flex items-center gap-2 px-8 py-4 text-base font-medium text-do-text bg-do-bg-card hover:bg-do-bg-card/80 border border-do-border hover:border-do-border-accent rounded-xl transition-all"
						>
							Book a Demo
						</a>
					</div>
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
							One workspace.
							<br />
							<span className="text-do-text-secondary font-normal">
								Endless possibilities.
							</span>
						</h1>
						<p className="text-lg md:text-xl text-do-text-secondary max-w-2xl mx-auto leading-relaxed">
							Four simple steps connect your documents to AI-powered analysis,
							calculations, and deliverable generation. No training. No setup.
							Just results.
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
