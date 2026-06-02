"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import CallMeForm from "@components/CallMeForm";
import {
	Building2,
	Zap,
	Wrench,
	Hammer,
	ShoppingBag,
	UtensilsCrossed,
	ArrowRight,
	HelpCircle,
	Phone,
} from "lucide-react";

/* ── Who we serve ──────────────────────────────────────────────────── */

const industries = [
	{
		icon: Building2,
		title: "Small & Mid-Size Commercial GCs",
		description: "$5M–$100M tenant fit-out, mixed-use, light commercial new build",
	},
	{
		icon: Zap,
		title: "Electrical Subs",
		description: "Commercial fit-out, T&M-heavy projects, multi-site rollouts",
	},
	{
		icon: Wrench,
		title: "Mechanical & Plumbing Subs",
		description: "HVAC, controls, plumbing on commercial projects",
	},
	{
		icon: Hammer,
		title: "Specialty Subs",
		description: "Drywall, framing, finishes, millwork — trade-stacking-heavy work",
	},
	{
		icon: ShoppingBag,
		title: "Retail Fit-Out Contractors",
		description: "National retail rollouts, big-box, tenant build-outs",
	},
	{
		icon: UtensilsCrossed,
		title: "Hospitality & Restaurant Build-Outs",
		description: "Restaurants, hotels, entertainment — owner-change-heavy",
	},
];

/* ── Beliefs data ──────────────────────────────────────────────────── */

const beliefs = [
	{
		number: "1",
		title: "Daily logs only matter if they protect payment.",
		description:
			"Most field-reporting tools treat daily logs as compliance paperwork. We treat them as the front line of cash flow. Every voice note, every photo, every AI call summary is a piece of payment protection — or it's not worth capturing.",
	},
	{
		number: "2",
		title: "Adoption is the only metric that matters.",
		description:
			"A daily-log app with a 30 percent fill rate is worthless. Every product decision we make optimizes for whether the super actually uses it. That's why we built voice-first input, AI outbound calls, and offline-first sync — not because they're elegant, but because they're the only way logs actually get created.",
	},
	{
		number: "3",
		title: "Construction-trained AI, not generic AI.",
		description:
			"A general LLM that doesn't know what 'rebar not on the prints' means isn't useful on a jobsite. Our models are trained on construction context — they understand the difference between an extra and a back-charge, between an unforeseen condition and a coordination issue. The intelligence is the product.",
	},
	{
		number: "4",
		title: "Built for the contractor doing the work, not the consultant studying it.",
		description:
			"Enterprise construction software is designed for committee approval at large GCs. We're built for the $5M–$100M commercial contractor where the PM is sometimes the owner and the super is covering three jobs. Different problem, different product.",
	},
	{
		number: "5",
		title: "The dispute always comes later. Document like it's coming.",
		description:
			"Eight months from now, the owner will dispute a change order. The contractor with timestamped voice transcripts, geotagged photos, and quantified scope changes from day one wins. The contractor relying on memory loses. We help you be the first one.",
	},
];

/* ── Problems data ─────────────────────────────────────────────────── */

const problems = [
	{
		number: "01",
		title: "Documentation is the #1 cause of disputed payments.",
		description:
			"Industry data shows contractors lose $1M+ a year to disputed pay apps, denied change orders, and challenged T&M. Almost all of it comes from documentation that arrived too late or was too thin to defend.",
	},
	{
		number: "02",
		title: "Daily-log apps have an adoption problem.",
		description:
			"Most field-reporting tools require typing on a phone. Most supers don't use them. The result: logs filed days late, half the day's events forgotten, no proof when the dispute comes.",
	},
	{
		number: "03",
		title: "Change orders get denied on documentation, not merit.",
		description:
			"60 to 80 percent of change orders contractors lose come from documentation problems. The work happened. The contract supported it. But the paper trail started weeks too late.",
	},
	{
		number: "04",
		title: "Small and mid-size commercial contractors are underserved.",
		description:
			"Enterprise construction software is built and priced for large GCs with dedicated documentation staff. The $5M–$100M commercial contractor — where margins are thin and one disputed change order matters — gets no purpose-built tool.",
	},
];

/* ── FAQ data ──────────────────────────────────────────────────────── */

const faqs = [
	{
		question: "Who exactly is construction.live built for?",
		answer:
			"Small and mid-size commercial general contractors — typically $5M–$100M annual revenue — and the electrical, mechanical, and specialty subs they hire. We're focused on tenant fit-out, mixed-use, light commercial new build, retail, and hospitality. Not built for enterprise GCs, heavy civil, or institutional/healthcare.",
	},
	{
		question: "Why focus on small and mid-size, not enterprise?",
		answer:
			"Enterprise GCs already have dedicated documentation staff, PMO teams, and software budgets sized for committee evaluation. Their problem isn't ours. The $5M–$100M commercial contractor — where the PM is often the owner and the super is covering three jobs — has the documentation problem we solve, and they don't have a tool built for them. That's our market.",
	},
	{
		question: "What makes construction.live different from Raken, Fieldwire, or Procore field logs?",
		answer:
			"Those tools collect data — usually through typed forms supers don't fill out reliably. We unify voice notes, photos, AI outbound calls, and integration data into one intelligence layer that flags money moments same-day and auto-assembles pay-app backup. The output is payment protection, not just a daily log.",
	},
	{
		question: "Do you replace Procore or work alongside it?",
		answer:
			"Alongside. We push daily logs, change orders, and pay-app backup directly into Procore, Autodesk, Fieldwire, and Microsoft 365. Your owners see the same record you do. We're the unified field intelligence layer that feeds the systems your owner already requires.",
	},
	{
		question: "Is my data secure?",
		answer:
			"Yes. Project documentation contains commercially sensitive information and construction.live is built to handle it accordingly — enterprise-grade encryption at rest and in transit, role-based access, and audit logging. Contact us for the details your IT team needs.",
	},
	{
		question: "How do I get started?",
		answer:
			"Have our AI call you. Leave a 30-second field update like you're calling your office. See what gets documented in 60 seconds. No signup, no credit card, no app to install.",
	},
];

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
						The problem we&apos;re solving
					</span>
					<h2 className="text-3xl md:text-4xl font-bold text-do-text mt-4 mb-4">
						Contractors lose $1M a year to documentation problems.
						<br />
						<span className="text-do-text-secondary font-normal">
							That&apos;s the gap we close.
						</span>
					</h2>
					<p className="text-base text-do-text-secondary max-w-2xl mx-auto">
						Disputed pay apps. Denied change orders. Challenged T&M. The work
						happened. The contract supported it. The documentation arrived too
						late.
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
					<h2 className="text-3xl md:text-4xl font-bold text-do-text mt-4 mb-4">
						Built for commercial. Not for everyone.
					</h2>
					<p className="text-base text-do-text-secondary max-w-2xl mx-auto">
						Small and mid-size commercial GCs and the subs they hire. If you run
						$5M–$100M projects and your margins live or die by how well the field
						gets documented, this is built for you.
					</p>
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
						Built by people who&apos;ve been on the losing side of a change-order dispute.
					</h2>
					<p className="text-base text-do-text-secondary max-w-xl mx-auto">
						Construction operators and AI engineers. We know what gets disputed
						and we know how to document it before the dispute starts.
					</p>
				</motion.div>

				<motion.div
					className="max-w-sm mx-auto rounded-2xl border border-do-border bg-do-bg-card/80 backdrop-blur-sm p-8 text-center"
					initial={{ opacity: 0, y: 20 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ delay: 0.2, duration: 0.5 }}
				>
					<div className="relative h-28 w-28 rounded-full mx-auto mb-6 overflow-hidden border-2 border-do-orange/30 shadow-[0_0_30px_rgba(249,115,22,0.15)]">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src="/profile.jpg"
							alt="Rahul Vaishnav, founder of construction.live"
							className="h-full w-full object-cover"
							loading="lazy"
						/>
					</div>
					<h3 className="text-lg font-semibold text-do-text mb-1">
						Rahul Vaishnav
					</h3>
					<p className="text-sm text-do-orange font-medium mb-4">Founder</p>
					<p className="text-xs text-do-text-secondary leading-relaxed">
						10+ years across construction and AI. Built construction.live because
						he&apos;s been on the losing side of enough change-order disputes to
						know what the documentation gap actually costs.
					</p>
				</motion.div>
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
		<section className="relative py-24 overflow-hidden bg-do-bg-card" ref={ref}>
			<div className="absolute inset-0 do-blueprint-grid-dense pointer-events-none" />
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-do-orange/[0.04] rounded-full blur-[150px]" />

			<div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6 }}
				>
					<h2 className="text-3xl md:text-4xl font-bold text-do-text mb-5">
						Win one $50K change order. The platform pays for itself.
					</h2>
					<p className="text-lg text-do-text-secondary mb-8">
						Drop your number. Our AI calls within 60 seconds. Leave a 30-second
						field update and see what gets documented.
					</p>

					<CallMeForm source="about">
						{({ open }) => (
							<button
								type="button"
								onClick={open}
								className="group inline-flex items-center gap-2 px-8 py-4 text-base font-medium text-white bg-do-orange hover:bg-do-orange-dark rounded-xl transition-all shadow-[0_0_40px_rgba(249,115,22,0.3)] hover:shadow-[0_0_60px_rgba(249,115,22,0.5)]"
							>
								<Phone className="h-4 w-4" />
								Have Our AI Call You
								<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
							</button>
						)}
					</CallMeForm>
				</motion.div>
			</div>
		</section>
	);
}

/* ── Page ──────────────────────────────────────────────────────────── */

export default function AboutPage() {
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
						<span className="do-section-label text-do-orange">About</span>
						<h1 className="text-4xl md:text-6xl font-bold text-do-text mt-4 mb-6">
							Built for small &amp; mid-size
							<br />
							<span className="text-do-text-secondary font-normal">
								commercial contractors.
							</span>
						</h1>
						<p className="text-lg md:text-xl text-do-text-secondary max-w-2xl mx-auto leading-relaxed">
							construction.live is unified field intelligence for the $5M–$100M
							commercial GC and the electrical, mechanical, and specialty subs
							they hire. We turn every signal from your jobsite into bulletproof
							payment protection.
						</p>
					</motion.div>

					<motion.div
						className="flex flex-wrap justify-center gap-8 mt-12"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.5 }}
					>
						<div className="text-center">
							<p className="text-3xl font-bold text-do-orange">$5M–$100M</p>
							<p className="text-sm text-do-text-muted">target GC size</p>
						</div>
						<div className="text-center">
							<p className="text-3xl font-bold text-do-orange">$1M+</p>
							<p className="text-sm text-do-text-muted">protected per contractor</p>
						</div>
						<div className="text-center">
							<p className="text-3xl font-bold text-do-orange">7 days</p>
							<p className="text-sm text-do-text-muted">pay-app approval</p>
						</div>
						<div className="text-center">
							<p className="text-3xl font-bold text-do-orange">30 sec</p>
							<p className="text-sm text-do-text-muted">per field update</p>
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
						<span className="do-section-label text-do-orange">Our story</span>
						<h2 className="text-3xl md:text-4xl font-bold text-do-text mt-4 mb-8">
							Most contractors lose $1M a year because the daily log never got created.
						</h2>
					</motion.div>

					<motion.div
						className="space-y-6"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.5 }}
					>
						<p className="text-base text-do-text-secondary leading-relaxed">
							It&apos;s not because the work didn&apos;t happen. It&apos;s because the
							super was busy running three jobs, the PM was buried in pay apps, and
							the daily log app on the phone never got opened. Eight months later,
							the owner disputes a change order. The work is real. The contract
							supports it. But the documentation isn&apos;t there.
						</p>
						<p className="text-base text-do-text-secondary leading-relaxed">
							Enterprise GCs solve this with dedicated documentation staff and
							software priced for committee approval. The $5M–$100M commercial
							contractor — where the PM is sometimes the owner and one super
							covers multiple jobs — doesn&apos;t have a tool built for them.
						</p>
						<p className="text-base text-do-text leading-relaxed">
							We built construction.live to be that tool. Voice notes. Photos. AI
							outbound calls. Integration with the systems your owner already
							uses. Unified into one defensible record. Pay apps get approved.
							Change orders get won. Margins get protected.
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
