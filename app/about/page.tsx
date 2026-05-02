"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import {
	Building2,
	Factory,
	Hospital,
	HardHat,
	Home,
	Store,
	ArrowRight,
	HelpCircle,
	Mail,
	Lock,
	Globe,
	Users,
	Zap,
	Eye,
	Brain,
	Clock,
	MapPin,
} from "lucide-react";

/* ── Industries data ───────────────────────────────────────────────── */

const industries = [
	{
		icon: Building2,
		title: "Commercial Construction",
		description: "Office towers, mixed-use, tenant fit-outs",
	},
	{
		icon: Factory,
		title: "Industrial and Manufacturing",
		description: "Warehouses, process facilities, plant expansions",
	},
	{
		icon: Hospital,
		title: "Institutional and Government",
		description: "Schools, hospitals, public infrastructure",
	},
	{
		icon: HardHat,
		title: "Heavy Civil and Infrastructure",
		description: "Roads, bridges, utilities, site development",
	},
	{
		icon: Home,
		title: "Residential and Multi-Family",
		description: "Custom homes, condos, townhouse developments",
	},
	{
		icon: Store,
		title: "Retail and Hospitality",
		description: "Retail build-outs, restaurants, hotels",
	},
];

/* ── Beliefs data ──────────────────────────────────────────────────── */

const beliefs = [
	{
		number: "1",
		title: "Construction people are not the problem. Their tools are.",
		description:
			"Project managers, estimators, and site engineers are some of the most capable professionals in any industry. They manage complex logistics, tight budgets, and real physical risk every day. The reason they are buried in admin work is not a lack of skill. It is a lack of tools built specifically for how they work.",
	},
	{
		number: "2",
		title: "AI should show its work, not hide it.",
		description:
			"In construction, a wrong number has real consequences. A calculation that cannot be checked is a liability. Every output from construction.live is traceable. Formulas are shown in full. Assumptions are stated. Code references are cited. Your team should always be able to verify what the AI tells them.",
	},
	{
		number: "3",
		title: "Domain knowledge is not optional.",
		description:
			"A general-purpose AI that does not understand the difference between a structural submittal and a mechanical schedule is not useful on a construction project. construction.live is built with construction context at its core. It knows CSI MasterFormat. It knows the difference between an RFI and a change order. It understands what a project manager actually needs from a code lookup.",
	},
	{
		number: "4",
		title: "The best tool is the one that keeps working when you stop watching.",
		description:
			"Most software tools require active input to do anything. construction.live is designed to run on schedule in the background. Checking emails. Tracking deadlines. Attending meetings. Compiling reports. You set it up once and it keeps going whether you are in the office, on site, or asleep.",
	},
	{
		number: "5",
		title: "Every sector builds differently. The AI should know that.",
		description:
			"A hospital project has different compliance requirements than a warehouse. A heavy civil contract reads differently than a residential fit-out. construction.live adapts to the sector and project type, not the other way around. The same platform covers commercial, industrial, institutional, civil, residential, and retail construction because it understands the context of each.",
	},
];

/* ── Problems data ─────────────────────────────────────────────────── */

const problems = [
	{
		number: "01",
		title: "Document volume that no team can keep up with",
		description:
			"A mid-size commercial project generates tens of thousands of documents over its lifecycle. Specs, drawings, RFIs, submittals, change orders, meeting minutes, field reports. Reading all of them carefully is not possible. Missing something critical is common.",
	},
	{
		number: "02",
		title: "Scope gaps that turn into expensive change orders",
		description:
			"Industry data shows that 60 to 80 percent of construction change orders come from incomplete scope definition at the bid stage. The information to prevent them exists. The time to review it thoroughly often does not.",
	},
	{
		number: "03",
		title: "Calculations that take too long and carry too much risk",
		description:
			"Quantity takeoffs, load calculations, material estimates. Done manually, they take hours. Done quickly, they carry the risk of errors that show up weeks later on site or in the budget.",
	},
	{
		number: "04",
		title: "Reporting that steals time from actual project work",
		description:
			"Progress reports, deficiency logs, proposal documents, RFI responses. Every project needs them. Writing them from scratch every week takes time that most project teams do not have to spare.",
	},
];

/* ── FAQ data ──────────────────────────────────────────────────────── */

const faqs = [
	{
		question: "What is construction.live and who is it built for?",
		answer:
			"construction.live is an AI platform built specifically for the construction industry. It is designed for project managers, estimators, site engineers, general contractors, and owners who work with construction documents, calculations, and reporting on a daily basis. It handles document analysis, bid leveling, engineering calculations, project intelligence, and scope gap detection in one workspace.",
	},
	{
		question: "Is construction.live a general AI tool or is it built specifically for construction?",
		answer:
			"It is built specifically for construction. The platform understands construction document types, CSI MasterFormat structure, industry terminology, building codes by jurisdiction, and the workflows that project teams actually use. This is not a general chatbot adapted for construction. It was designed from the ground up for the way construction teams work.",
	},
	{
		question: "What makes construction.live different from other project management software?",
		answer:
			"Most project management software helps you organize and track work. construction.live does the work. It reads and analyzes documents, runs calculations, detects scope gaps, generates reports, and monitors deadlines automatically. The closest comparison is having a highly experienced team member who is always available, never misses a detail, and keeps working after everyone else has gone home.",
	},
	{
		question: "Is the platform secure enough for confidential project documents?",
		answer:
			"Yes. construction.live is built with enterprise-grade security. Project documents contain commercially sensitive information and the platform is designed to handle them accordingly. Contact the team for details on data handling, storage, and security protocols for your specific requirements.",
	},
	{
		question: "How do I get started?",
		answer:
			"You can get started for free with no setup required. There is no onboarding process or configuration before your first session. Upload a project document, ask a question, and the AI starts working. Most users see value in the first session.",
	},
];

/* ── Team section ──────────────────────────────────────────────────── */

function TeamSection() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-80px" });

	return (
		<section className="relative py-24 overflow-hidden" ref={ref}>
			<div className="absolute inset-0 do-blueprint-grid pointer-events-none" />

			<div className="relative z-10 max-w-4xl mx-auto px-6">
				<motion.div
					className="text-center mb-16"
					initial={{ opacity: 0, y: 30 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6 }}
				>
					<span className="do-section-label text-do-orange">The team</span>
					<h2 className="text-3xl md:text-4xl font-bold text-do-text mt-4 mb-4">
						Built by people who understand construction.
					</h2>
					<p className="text-base text-do-text-secondary max-w-xl mx-auto">
						construction.live was built by a team that combines hands-on
						construction experience with deep technical expertise in AI.
					</p>
				</motion.div>

				{/* Placeholder team card */}
				<motion.div
					className="max-w-sm mx-auto rounded-2xl border border-do-border bg-do-bg-card/80 backdrop-blur-sm p-8 text-center"
					initial={{ opacity: 0, y: 20 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ delay: 0.2, duration: 0.5 }}
				>
					<div className="h-24 w-24 rounded-full bg-do-orange/10 border-2 border-do-orange/20 mx-auto mb-6 flex items-center justify-center">
						<Users className="h-10 w-10 text-do-orange/60" />
					</div>
					<h3 className="text-lg font-semibold text-do-text mb-1">
						Rahul Vaishnav
					</h3>
					<p className="text-sm text-do-orange font-medium mb-4">Founder</p>
					<p className="text-xs text-do-text-muted">
						[ Add team member details here ]
					</p>
				</motion.div>
			</div>
		</section>
	);
}

/* ── Beliefs section ──────────────────────────────────────────────── */

function BeliefsSection() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-80px" });

	return (
		<section className="relative py-24 overflow-hidden bg-do-bg-card" ref={ref}>
			<div className="absolute inset-0 do-blueprint-grid-dense pointer-events-none" />

			<div className="relative z-10 max-w-4xl mx-auto px-6">
				<motion.div
					className="text-center mb-16"
					initial={{ opacity: 0, y: 30 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6 }}
				>
					<span className="do-section-label text-do-orange">What we believe</span>
					<h2 className="text-3xl md:text-4xl font-bold text-do-text mt-4">
						A few things that shape how we build.
					</h2>
				</motion.div>

				<div className="space-y-8">
					{beliefs.map((belief, i) => (
						<motion.div
							key={belief.number}
							className="flex gap-6 items-start"
							initial={{ opacity: 0, x: -20 }}
							animate={inView ? { opacity: 1, x: 0 } : {}}
							transition={{ delay: i * 0.1, duration: 0.5 }}
						>
							<div className="shrink-0">
								<div className="h-10 w-10 rounded-xl bg-do-orange/10 border border-do-orange/20 flex items-center justify-center">
									<span className="text-sm font-bold font-mono text-do-orange">
										{belief.number}
									</span>
								</div>
							</div>
							<div className="flex-1 pt-1">
								<h3 className="text-lg font-semibold text-do-text mb-2">
									{belief.title}
								</h3>
								<p className="text-sm text-do-text-secondary leading-relaxed">
									{belief.description}
								</p>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}

/* ── Problems section ─────────────────────────────────────────────── */

function ProblemsSection() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-80px" });

	return (
		<section className="relative py-24 overflow-hidden" ref={ref}>
			<div className="absolute inset-0 do-blueprint-grid pointer-events-none" />
			<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-do-orange/[0.03] rounded-full blur-[120px]" />

			<div className="relative z-10 max-w-5xl mx-auto px-6">
				<motion.div
					className="text-center mb-16"
					initial={{ opacity: 0, y: 30 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6 }}
				>
					<span className="do-section-label text-do-orange">
						The problem we are solving
					</span>
					<h2 className="text-3xl md:text-4xl font-bold text-do-text mt-4 mb-4">
						Construction is one of the least digitized industries in the world.
						<br />
						<span className="text-do-text-secondary font-normal">
							That is the opportunity.
						</span>
					</h2>
					<p className="text-base text-do-text-secondary max-w-2xl mx-auto">
						The construction industry accounts for 13% of global GDP and employs
						hundreds of millions of people. It is also one of the last major
						industries where most knowledge work still happens manually, in
						spreadsheets, PDF readers, and email threads. AI has transformed finance,
						healthcare, and logistics. Construction is next.
					</p>
				</motion.div>

				<div className="grid md:grid-cols-2 gap-6">
					{problems.map((problem, i) => (
						<motion.div
							key={problem.number}
							className="rounded-2xl border border-do-border bg-do-bg-card/80 backdrop-blur-sm p-8"
							initial={{ opacity: 0, y: 20 }}
							animate={inView ? { opacity: 1, y: 0 } : {}}
							transition={{ delay: i * 0.1, duration: 0.5 }}
						>
							<div className="flex items-center gap-3 mb-4">
								<span className="text-xs font-mono font-bold text-do-orange">
									Problem {problem.number}
								</span>
							</div>
							<h3 className="text-lg font-semibold text-do-text mb-3">
								{problem.title}
							</h3>
							<p className="text-sm text-do-text-secondary leading-relaxed">
								{problem.description}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}

/* ── Industries section ───────────────────────────────────────────── */

function IndustriesSection() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-80px" });

	return (
		<section className="relative py-24 overflow-hidden bg-do-bg-card" ref={ref}>
			<div className="absolute inset-0 do-blueprint-grid-dense pointer-events-none" />

			<div className="relative z-10 max-w-5xl mx-auto px-6">
				<motion.div
					className="text-center mb-16"
					initial={{ opacity: 0, y: 30 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6 }}
				>
					<span className="do-section-label text-do-orange">Who we serve</span>
				</motion.div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{industries.map((industry, i) => (
						<motion.div
							key={industry.title}
							className="rounded-xl border border-do-border bg-do-bg/80 p-6 hover:border-do-border-accent transition-colors"
							initial={{ opacity: 0, y: 20 }}
							animate={inView ? { opacity: 1, y: 0 } : {}}
							transition={{ delay: i * 0.05, duration: 0.4 }}
						>
							<div className="h-10 w-10 rounded-lg bg-do-orange/10 flex items-center justify-center mb-4">
								<industry.icon className="h-5 w-5 text-do-orange" />
							</div>
							<h3 className="font-semibold text-do-text mb-1">
								{industry.title}
							</h3>
							<p className="text-sm text-do-text-secondary">
								{industry.description}
							</p>
						</motion.div>
					))}
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
		<section className="relative py-24 overflow-hidden" ref={ref}>
			<div className="absolute inset-0 do-blueprint-grid pointer-events-none" />

			<div className="relative z-10 max-w-3xl mx-auto px-6">
				<motion.div
					className="text-center mb-16"
					initial={{ opacity: 0, y: 30 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6 }}
				>
					<span className="do-section-label text-do-orange">
						Common questions
					</span>
					<h2 className="text-3xl md:text-4xl font-bold text-do-text mt-4">
						Frequently asked
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
								className="w-full text-left rounded-xl border border-do-border bg-do-bg-card/80 p-5 hover:border-do-border-accent transition-colors"
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

function AboutCTA() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-80px" });

	return (
		<section className="relative py-24 overflow-hidden" ref={ref}>
			<div className="absolute inset-0 do-blueprint-grid-dense pointer-events-none" />
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

export default function AboutPage() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-80px" });

	return (
		<main className="min-h-screen bg-do-bg">
			<Navbar />

			{/* Hero */}
			<section className="relative pt-40 pb-20 overflow-hidden" ref={ref}>
				<div className="absolute inset-0 do-blueprint-grid pointer-events-none" />
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-do-orange/[0.04] rounded-full blur-[150px]" />

				<div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<span className="do-section-label text-do-orange">About</span>
						<h1 className="text-4xl md:text-6xl font-bold text-do-text mt-4 mb-6">
							We built the AI office
							<br />
							<span className="text-do-text-secondary font-normal">
								that construction never had.
							</span>
						</h1>
						<p className="text-lg md:text-xl text-do-text-secondary max-w-2xl mx-auto leading-relaxed">
							construction.live is an AI platform built specifically for the
							construction industry. It reads your documents, runs your
							calculations, tracks your deadlines, and compiles your reports. You
							set it up once. It works around the clock so your team does not have
							to.
						</p>
					</motion.div>

					{/* Stats */}
					<motion.div
						className="flex flex-wrap justify-center gap-8 mt-12"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.5 }}
					>
						<div className="text-center">
							<p className="text-3xl font-bold text-do-orange">2025</p>
							<p className="text-sm text-do-text-muted">Founded</p>
						</div>
						<div className="text-center">
							<p className="text-3xl font-bold text-do-orange">8</p>
							<p className="text-sm text-do-text-muted">Core workflows covered</p>
						</div>
						<div className="text-center">
							<p className="text-3xl font-bold text-do-orange">58%</p>
							<p className="text-sm text-do-text-muted">
								Of sessions include uploads
							</p>
						</div>
						<div className="text-center">
							<p className="text-3xl font-bold text-do-orange">6</p>
							<p className="text-sm text-do-text-muted">Industry sectors served</p>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Our Story */}
			<section className="relative py-24 overflow-hidden">
				<div className="absolute inset-0 do-blueprint-grid-dense pointer-events-none" />

				<div className="relative z-10 max-w-3xl mx-auto px-6">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<span className="do-section-label text-do-orange">Our Story</span>
						<h2 className="text-3xl md:text-4xl font-bold text-do-text mt-4 mb-8">
							Construction moves fast. The tools it runs on have not kept up.
						</h2>
					</motion.div>

					<motion.div
						className="space-y-6"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.5 }}
					>
						<p className="text-base text-do-text-secondary leading-relaxed">
							Every day, construction project managers, estimators, and site
							engineers spend hours on work that should take minutes. Reading
							through 200-page specifications to find one clause. Building bid
							comparison spreadsheets from scratch. Writing progress reports from
							handwritten site notes. Waiting for a specialist callback to diagnose
							a field issue.
						</p>
						<p className="text-base text-do-text-secondary leading-relaxed">
							These are not small inefficiencies. They compound across every
							project, every team, and every deadline. The construction industry
							loses an estimated 35% of productive working time to administrative
							tasks, document handling, and information retrieval. That is time
							that should be going into building.
						</p>
						<p className="text-base text-do-text leading-relaxed">
							construction.live was built to give that time back. Not by replacing
							the people who do the work, but by handling the parts of the job
							that slow them down. The document reviews. The calculations. The
							reports. The deadline tracking. The email monitoring. The things
							that need to get done but do not require a project manager&apos;s
							judgment to do.
						</p>
					</motion.div>

					{/* Placeholder for founding story */}
					<motion.div
						className="mt-12 p-6 rounded-xl border-2 border-dashed border-do-border bg-do-bg-card/50"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.4 }}
					>
						<p className="text-sm text-do-text-muted text-center">
							[ Add your founding story here. Who built this, where you came from,
							what you experienced firsthand that made you want to build it. Two
							to three sentences about the specific moment or project that made
							the problem impossible to ignore. ]
						</p>
					</motion.div>
				</div>
			</section>

			<ProblemsSection />
			<BeliefsSection />
			<IndustriesSection />
			<TeamSection />
			<FAQSection />
			<AboutCTA />
			<Footer />
		</main>
	);
}
