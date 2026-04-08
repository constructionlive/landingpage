"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import {
	FileSearch,
	Table2,
	Calculator,
	Brain,
	AlertTriangle,
	Upload,
	FileText,
	CheckCircle2,
	ArrowRight,
	HelpCircle,
	Mail,
	Lock,
	Globe,
} from "lucide-react";

/* ── Features data ─────────────────────────────────────────────────── */

const features = [
	{
		number: "01",
		icon: FileSearch,
		title: "AI Document Analysis",
		subtitle: "AI-powered",
		tagline: "Read 200 pages in 90 seconds. Flag what matters.",
		description:
			"AI document analysis is the automated review of construction documents including specs, submittals, RFIs, and contracts. It uses AI trained on construction workflows to pull out key requirements, spot conflicts, and surface risks much faster than a manual review.",
		detail:
			"Upload any project document and construction.live reads it with full construction context. It knows the difference between a structural spec and a mechanical schedule. It understands that Division 03 covers concrete, that a submittal register is not the same as a shop drawing log, and that a change order tied to a prior RFI has cost implications downstream.",
		impact:
			"Most teams spend 4 to 6 hours reviewing a spec package before a bid. This brings that down to minutes, with every requirement, exclusion, and ambiguity already highlighted.",
		capabilities: [
			"Spec review",
			"Submittal analysis",
			"Contract parsing",
			"RFI drafting",
			"Drawing cross-reference",
			"Issue flagging",
		],
		example:
			"Review this submittal package and flag anything that does not match the Division 07 spec, especially waterproofing requirements.",
		notes: [
			"Works with PDF, DOCX, XLSX, and CAD exports",
			"Understands CSI MasterFormat structure",
			"Cross-references multiple files at once",
		],
	},
	{
		number: "02",
		icon: Table2,
		title: "Bid Leveling",
		subtitle: "Estimating",
		tagline: "Stop comparing numbers. Start comparing scopes.",
		description:
			"Bid leveling is the process of adjusting multiple subcontractor bids to a common scope baseline. It accounts for inclusions, exclusions, and assumptions so a general contractor or owner can make a fair comparison rather than just picking the lowest number.",
		detail:
			"The cheapest bid is rarely the best one. When teams skip proper leveling, they often award scopes with missing exclusions and absorb the difference as a change order months later. construction.live reads each bid package, pulls out what is in and what is out, and builds a normalized comparison matrix automatically.",
		impact:
			"Upload three mechanical sub-bids and ask for a leveled summary. The AI will show where Bidder A excluded vibration isolation, where Bidder C priced a smaller equipment package, and where the spec requires something none of them included.",
		capabilities: [
			"Scope normalization",
			"Exclusion extraction",
			"Bid comparison matrix",
			"Qualification summary",
			"Missing scope flags",
		],
		example:
			"Level these four electrical bids against Division 26. Build a comparison matrix and flag any scope that appears in the spec but not in any of the bids.",
		notes: [],
	},
	{
		number: "03",
		icon: Calculator,
		title: "Engineering Calculations",
		subtitle: "Calculations",
		tagline: "Quantities, formulas, and load calcs. Verified and ready to use.",
		description:
			"Engineering calculations in construction include quantity takeoffs, material sizing, unit conversions, structural load analysis, and formula generation for estimating and procurement. These are tasks that traditionally require specialist software or a licensed engineer's time to complete correctly.",
		detail:
			"Over 50% of construction.live sessions involve formulas or data calculations. From concrete volume with waste factors to rebar density to HVAC load estimates, the AI generates Excel-ready formulas, checks unit consistency, and shows its working so your team can verify the logic.",
		impact:
			"You do not need to know the formula. You need the right answer with a clear, traceable method. construction.live delivers that fast enough to use mid-estimate and accurate enough to present to a client.",
		capabilities: [
			"Quantity takeoffs",
			"Material calculations",
			"Excel formula generation",
			"Unit conversions",
			"Load calculations",
			"Waste factor analysis",
		],
		example:
			"Calculate the total concrete volume for this foundation drawing, apply a 10% waste factor, and give me a cost breakdown at $185 per cubic meter supply and place.",
		notes: [
			"Outputs Excel-ready formulas",
			"Shows full working, not just a result",
		],
	},
	{
		number: "04",
		icon: Brain,
		title: "Project Intelligence",
		subtitle: "Intelligence",
		tagline: "An AI that understands your project, not just your question.",
		description:
			"Project intelligence is the ongoing AI analysis of construction project data including schedules, documents, emails, meeting notes, and field reports. It helps project managers and site teams identify risks, track progress, and make faster decisions across the full project lifecycle.",
		detail:
			"construction.live builds a working understanding of your project from every file you upload. Ask it to compare the mechanical schedule in the drawings against what the spec requires. Ask it to flag anything in a field report that contradicts the last RFI response. Ask it which open submittals are sitting on the critical path.",
		impact:
			"It runs automated daily checks, reviews your inbox, tracks deadlines, and compiles reports on a schedule you set. Your team gets full project awareness without manual effort. Set it up once and it runs in the background while you are on site.",
		capabilities: [
			"Schedule analysis",
			"Risk identification",
			"Meeting intelligence",
			"Deadline tracking",
			"Automated reporting",
			"Cross-document analysis",
		],
		example:
			"Based on the project schedule and current submittal log, which open items are most likely to cause a delay in the next 30 days?",
		notes: [],
	},
	{
		number: "05",
		icon: AlertTriangle,
		title: "Scope Gap Detection",
		subtitle: "Risk",
		tagline: "Find what is missing before it becomes a change order.",
		description:
			"Scope gap detection is the process of identifying work that is required by a contract or specification but not included in any subcontractor bid, the project schedule, or the approved estimate. These gaps are one of the most common causes of cost overruns, claims, and budget disputes in construction.",
		detail:
			"Industry data shows that 60 to 80 percent of construction change orders come from incomplete scope definition at the bid stage. Scope gaps are almost always preventable with a thorough review. The problem is that most teams do not have the time to do that review manually on every package.",
		impact:
			"Upload your specification, your estimate, and your sub-bid packages. Ask construction.live to identify what the spec requires that nobody has priced. It cross-references all three at once, flags the gaps, ranks them by estimated cost exposure, and gives you a clear picture of what needs to be sorted before you sign anything.",
		capabilities: [
			"Spec vs estimate crosscheck",
			"Bid coverage analysis",
			"Unpriced scope flags",
			"Cost exposure ranking",
			"Pre-award risk summary",
		],
		example:
			"Cross-check this specification against our estimate and the three sub-bids. Give me a ranked list of scope items that appear in the spec but are not priced by anyone.",
		notes: [
			"Works across GC estimates and sub-bid packages",
			"Flags exclusions and qualifications in bid letters",
		],
	},
];

const faqs = [
	{
		question: "What types of construction documents can construction.live analyze?",
		answer:
			"construction.live accepts PDFs, Word documents, Excel spreadsheets, CAD exports, and images. It handles specs, submittals, RFIs, contracts, change orders, schedules, field reports, bid packages, and meeting minutes. Basically any document your team works with on a normal project.",
	},
	{
		question: "How is bid leveling different from comparing numbers in a spreadsheet?",
		answer:
			"A spreadsheet compares totals. Bid leveling compares scopes. construction.live reads each bid package in full, pulling out what every bidder included, excluded, and qualified. That means you can see whether the lowest number is actually covering the full scope or whether it is missing items that will come back as change orders later.",
	},
	{
		question: "Are the engineering calculations accurate enough for real construction use?",
		answer:
			"Yes. The AI shows its full working so your team can check every step. construction.live produces traceable calculations with the formula, unit logic, and assumptions written out clearly. For anything that needs a professional engineer's stamp, the outputs give your licensed engineer a solid, reviewed starting point to certify.",
	},
	{
		question: "How does scope gap detection work in practice?",
		answer:
			"Upload your specification, your project estimate, and your sub-bid packages. Tell construction.live to cross-reference them. It reads all three at the same time, maps every requirement in the spec against line items in the estimate and bids, and returns a ranked list of items that have been specified but not priced by anyone, sorted by likely cost exposure.",
	},
	{
		question: "Does construction.live work with Procore, Autodesk, or other project management platforms?",
		answer:
			"construction.live works with documents exported from any platform. Files from Procore, Autodesk Construction Cloud, Buildertrend, and similar tools all upload without any issues. Native integrations are on the roadmap. Contact the team for current availability.",
	},
	{
		question: "Is construction.live built for large firms or does it work for small contractors too?",
		answer:
			"Both. Small contractors get expert-level analysis without needing to hire extra staff. Larger teams use it to handle volume, reviewing more bid packages, submittals, and documents than their team could process on their own. The AI scales to your project load.",
	},
];

/* ── Feature section ───────────────────────────────────────────────── */

function FeatureSection({
	feature,
	index,
}: {
	feature: (typeof features)[0];
	index: number;
}) {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-100px" });
	const isEven = index % 2 === 0;

	return (
		<section
			id={`feature-${feature.number}`}
			className="relative py-24 overflow-hidden"
			ref={ref}
		>
			<div className="absolute inset-0 do-blueprint-grid pointer-events-none" />
			<div
				className={`absolute top-0 ${isEven ? "left-0" : "right-0"} w-[500px] h-[500px] bg-do-orange/[0.03] rounded-full blur-[120px]`}
			/>

			<div className="relative z-10 max-w-6xl mx-auto px-6">
				<div
					className={`flex flex-col ${isEven ? "lg:flex-row" : "lg:flex-row-reverse"} gap-12 lg:gap-20 items-start`}
				>
					{/* Left: Text content */}
					<motion.div
						className="flex-1"
						initial={{ opacity: 0, x: isEven ? -30 : 30 }}
						animate={inView ? { opacity: 1, x: 0 } : {}}
						transition={{ duration: 0.6 }}
					>
						<div className="flex items-center gap-3 mb-6">
							<span className="text-xs font-mono font-bold text-do-orange">
								{feature.number}
							</span>
							<span className="text-[10px] font-mono text-do-text-muted px-2.5 py-1 rounded-full bg-do-bg-light border border-do-border uppercase tracking-wider">
								{feature.subtitle}
							</span>
						</div>

						<h2 className="text-3xl md:text-4xl font-bold text-do-text mb-4">
							{feature.title}
						</h2>

						<p className="text-xl text-do-orange font-medium mb-6">
							{feature.tagline}
						</p>

						<p className="text-base text-do-text-secondary leading-relaxed mb-6">
							{feature.description}
						</p>

						<p className="text-base text-do-text leading-relaxed mb-8">
							{feature.detail}
						</p>

						<div className="rounded-xl bg-do-bg-card/80 backdrop-blur-sm border border-do-border p-6 mb-8">
							<p className="text-sm text-do-text-secondary leading-relaxed">
								{feature.impact}
							</p>
						</div>

						{/* Capabilities */}
						<div className="mb-8">
							<p className="text-xs font-mono text-do-text-muted uppercase tracking-wider mb-4">
								Capabilities
							</p>
							<div className="grid grid-cols-2 gap-3">
								{feature.capabilities.map((cap) => (
									<div key={cap} className="flex items-center gap-2.5">
										<CheckCircle2 className="h-4 w-4 text-do-orange shrink-0" />
										<span className="text-sm text-do-text">{cap}</span>
									</div>
								))}
							</div>
						</div>

						{/* Notes */}
						{feature.notes.length > 0 && (
							<div className="space-y-2">
								{feature.notes.map((note) => (
									<div key={note} className="flex items-center gap-2">
										<div className="h-1.5 w-1.5 rounded-full bg-do-orange" />
										<span className="text-sm text-do-text-secondary">{note}</span>
									</div>
								))}
							</div>
						)}
					</motion.div>

					{/* Right: Visual card */}
					<motion.div
						className="w-full lg:w-[420px] shrink-0"
						initial={{ opacity: 0, x: isEven ? 30 : -30 }}
						animate={inView ? { opacity: 1, x: 0 } : {}}
						transition={{ duration: 0.6, delay: 0.15 }}
					>
						<div className="rounded-2xl border border-do-border bg-do-bg-card/80 backdrop-blur-xl p-8">
							<div className="h-14 w-14 rounded-xl bg-do-orange/10 border border-do-orange/20 flex items-center justify-center mb-6">
								<feature.icon className="h-7 w-7 text-do-orange" />
							</div>

							{/* Example prompt */}
							<div className="rounded-xl bg-do-bg/80 border border-do-border p-5 mb-6">
								<div className="flex items-center gap-2 mb-3">
									<div className="h-2 w-2 rounded-full bg-do-orange animate-glow-pulse" />
									<span className="text-[10px] font-mono text-do-text-muted uppercase tracking-wider">
										Example prompt
									</span>
								</div>
								<p className="text-sm text-do-text/80 italic leading-relaxed">
									&quot;{feature.example}&quot;
								</p>
							</div>

							{/* Mini capabilities list */}
							<div className="space-y-2.5">
								{feature.capabilities.slice(0, 4).map((cap) => (
									<div
										key={cap}
										className="flex items-center gap-3 text-sm text-do-text-secondary"
									>
										<div className="h-5 w-5 rounded-md bg-do-bg-light border border-do-border flex items-center justify-center">
											<CheckCircle2 className="h-3 w-3 text-do-orange/60" />
										</div>
										{cap}
									</div>
								))}
								{feature.capabilities.length > 4 && (
									<p className="text-xs text-do-text-muted pl-8">
										+{feature.capabilities.length - 4} more
									</p>
								)}
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
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

function FeatureCTA() {
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
						Try it on your actual project documents.
					</h2>
					<p className="text-lg text-do-text-secondary mb-8">
						Upload a spec, a bid package, or a submittal. No setup required.
						Results in minutes.
					</p>

					<a
						href="https://app.construction.live"
						className="group inline-flex items-center gap-2 px-8 py-4 text-base font-medium text-white bg-do-orange hover:bg-do-orange-dark rounded-xl transition-all shadow-[0_0_40px_rgba(249,115,22,0.3)] hover:shadow-[0_0_60px_rgba(249,115,22,0.5)]"
					>
						Get Started Free
						<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
					</a>
				</motion.div>
			</div>
		</section>
	);
}

/* ── Page ──────────────────────────────────────────────────────────── */

import { useState } from "react";

export default function FeaturesPage() {
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
							Platform features
						</span>
						<h1 className="text-4xl md:text-6xl font-bold text-do-text mt-4 mb-6">
							Everything your team needs.
							<br />
							<span className="text-do-text-secondary font-normal">
								Nothing you have to manage.
							</span>
						</h1>
						<p className="text-lg md:text-xl text-do-text-secondary max-w-2xl mx-auto leading-relaxed">
							construction.live gives project managers, estimators, and site
							engineers one AI workspace that reads documents, checks numbers,
							and catches problems before they reach the job site.
						</p>
					</motion.div>

					{/* Quick nav pills */}
					<motion.div
						className="flex flex-wrap justify-center gap-3 mt-12"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.5 }}
					>
						{features.map((f) => (
							<a
								key={f.number}
								href={`#feature-${f.number}`}
								className="px-4 py-2 text-sm text-do-text-secondary hover:text-do-text bg-do-bg-card/80 hover:bg-do-bg-card border border-do-border hover:border-do-border-accent rounded-full transition-all"
							>
								{f.subtitle}
							</a>
						))}
					</motion.div>
				</div>
			</section>

			{/* Feature sections */}
			{features.map((feature, index) => (
				<FeatureSection key={feature.number} feature={feature} index={index} />
			))}

			<FAQSection />
			<FeatureCTA />
			<Footer />
		</main>
	);
}
