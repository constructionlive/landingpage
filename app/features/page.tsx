"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import {
	Mic,
	PhoneCall,
	AlertTriangle,
	Receipt,
	ShieldCheck,
	CheckCircle2,
	ArrowRight,
	HelpCircle,
} from "lucide-react";

/* ── Features data ─────────────────────────────────────────────────── */

const features = [
	{
		number: "01",
		icon: Mic,
		title: "Field Voice Notes",
		subtitle: "Inputs",
		tagline: "30 seconds. No forms. No typing on dirty phones.",
		description:
			"Field voice notes let superintendents document construction activity by talking to their phone: no forms to fill, no typing required. Voice is one of several inputs that feed the unified intelligence layer.",
		detail:
			"Walk the site. Talk for 30 seconds. The voice note becomes a timestamped daily log entry with a transcript, automatic categorization, and links to any photos taken in the same window. Supers don't change how they work. They just stop typing.",
		impact:
			"Most daily-log apps require 15 minutes of typing. Most supers do it days late, if at all. With voice, the log gets created the same shift- which is the only way it ever protects you in a dispute.",
		capabilities: [
			"30-second voice updates",
			"Auto-transcription",
			"Same-day daily logs",
			"Categorization by scope",
			"Photo linking",
			"Works offline",
		],
		example:
			"Pouring Level 3 concrete today. Found unexpected rebar in the south footing- not on the drawings. Taking photos. Crew stopped for 45 minutes while we figured it out.",
		notes: [
			"Voice notes queue when offline and sync when service returns",
			"Construction-trained AI understands trades jargon",
			"No app to fight with: works on any phone",
		],
	},
	{
		number: "02",
		icon: PhoneCall,
		title: "AI Outbound Calls",
		subtitle: "Reporting",
		tagline: "Our AI calls your supers, not the other way around.",
		description:
			"AI outbound calls turn proactive reporting upside down. Instead of waiting for a super to remember to log a day, our AI calls them at shift change and prompts a quick update. Reporting stops depending on whether anyone remembered the app.",
		detail:
			"Set the schedule, set the questions. Our AI calls every super at end of shift, asks for a summary, captures pour progress, extras, delays, and crew issues. The call gets transcribed, categorized, and routed to the right project and scope.",
		impact:
			"Adoption is the killer of every field-reporting tool ever shipped. AI outbound calls solve adoption- because the platform calls the field, not the other way around.",
		capabilities: [
			"Scheduled outbound calls",
			"End-of-shift prompts",
			"Follow-up on missed days",
			"Transcribed + categorized",
			"Routes to right project",
			"Works on any phone",
		],
		example:
			"End-of-day check-in for Tower B. Quick summary of pours, any issues, any extras today?",
		notes: [
			"Call supers, PMs, or subs on the schedule that fits the project",
			"Multi-language support for field crews",
		],
	},
	{
		number: "03",
		icon: AlertTriangle,
		title: "Same-Day Money Alerts",
		subtitle: "Intelligence",
		tagline: "PMs see the money moments the day they happen- not 30 days later.",
		description:
			"Same-day money alerts are the intelligence layer. Construction-trained AI listens for extras, unforeseen conditions, weather delays, owner-supplied issues, and subcontractor no-shows and flags them to PMs the same day, with draft notifications ready to send.",
		detail:
			"Every voice note, photo, integration data point, and AI call summary runs through a model trained on construction context. It knows what 'unexpected rebar' means. It knows when 'electrical sub showed up at 10:30' is a back-charge candidate. It catches the words contractors say but rarely document.",
		impact:
			"Industry data shows contractors lose $500K+ a year on change orders they couldn't prove. Almost all of that comes from documentation that arrived too late. Same-day alerts close that gap.",
		capabilities: [
			"Extra work detection",
			"Unforeseen conditions",
			"Weather + schedule delays",
			"Subcontractor no-shows",
			"Owner-directed changes",
			"Coordination conflicts",
		],
		example:
			"Auto-flagged: Unforeseen condition (rebar in south footing). Drafting owner notification + change order packet. PM notified at 9:02 AM.",
		notes: [
			"Eight categories of money moments tracked automatically",
			"Drafts owner notifications and change orders for one-click send",
		],
	},
	{
		number: "04",
		icon: Receipt,
		title: "Bulletproof Pay App Backup",
		subtitle: "Payment protection",
		tagline: "Every pay app ships with a complete backup package. First-try approval.",
		description:
			"Pay applications submitted with construction.live ship with auto-assembled backup packages: voice logs, geotagged photos, quantified scope changes, daily progress, and timestamps for every line item. Owners stop disputing. Cycles drop from weeks to days.",
		detail:
			"At pay-app time, the platform assembles every relevant voice log, photo, transcript, and integration data point: organized by scope item, line by line. What used to take a PM two days of digging through emails and notebooks is ready in 90 seconds.",
		impact:
			"Cash flow is the silent killer in construction. Every week a disputed pay app sits unapproved is a week you are financing the owner's project.",
		capabilities: [
			"Auto-assembled backup",
			"Per-line-item evidence",
			"Geotagged photos linked to scope",
			"Quantified progress",
			"Owner-ready package",
			"Ready at submission time",
		],
		example:
			"Pay App #6: backup package ready. 47 voice logs, 184 photos, 12 quantified scope changes, day-by-day progress tied to schedule.",
		notes: [
			"Pushes to Procore, Autodesk, and other systems your owner already uses",
		],
	},
	{
		number: "05",
		icon: ShieldCheck,
		title: "Defensible Change Orders",
		subtitle: "Margin protection",
		tagline: "Day-one documentation. Owners stop pushing back.",
		description:
			"Change orders submitted with day-one documentation get approved. The platform builds the record from the moment a super first mentions the condition: voice transcript, photo, timestamp, schedule impact. By the time you submit, the case is unanswerable.",
		detail:
			"60 to 80 percent of construction change orders come from documentation problems, not scope problems. The work was done. The contract supported it. But the proof showed up weeks late, or not at all. construction.live builds the proof live.",
		impact:
			"At $1000 per active project per month, a single defended change order covers the platform for years. The math only works if the documentation exists before the dispute starts.",
		capabilities: [
			"Day-one documentation",
			"Voice + photo evidence",
			"Schedule impact quantified",
			"Owner-direct change capture",
			"Differing site conditions",
			"Claim-ready packet",
		],
		example:
			"Change order #12: submitted with a 47-day documentation trail starting the day the rebar was found, voice transcript, geotagged photos, and quantified schedule impact attached.",
		notes: [
			"Voice transcripts become written record with audio backup",
			"Works for both prime contracts and subcontract change orders",
		],
	},
];

const faqs = [
	{
		question: "What does \"unified field intelligence\" actually mean?",
		answer:
			"It means every signal from your jobsite: voice notes from supers, photos, AI call summaries, Procore data, Autodesk drawings, integration data from your existing tools, flows into one timestamped, defensible record. Other tools collect data in silos. We unify it into the package owners can't dispute.",
	},
	{
		question: "How is this different from a daily-log app like Raken or Fieldwire?",
		answer:
			"Daily-log apps make supers type. We make the platform call the super, capture a 30-second voice note, geotag a photo, pull data from your existing tools, and build the daily log automatically. The adoption rate is the difference: most daily-log apps die because nobody uses them.",
	},
	{
		question: "What do the AI calls sound like to my supers?",
		answer:
			"A short, conversational check-in: usually 30 to 60 seconds. The AI asks for a quick summary, follows up on anything specific the PM flagged, and captures the response. Supers describe it as easier than texting their office because they don't have to remember to do it.",
	},
	{
		question: "How does the platform decide what to flag as a money moment?",
		answer:
			"Construction-trained models track eight categories: extras not in contract, unforeseen conditions, weather/schedule delays, subcontractor no-shows, owner-supplied issues, coordination conflicts, T&M hours, and owner-directed changes. When a super's voice note mentions any of them, the PM gets a same-day alert.",
	},
	{
		question: "Does it work with Procore, Autodesk, Fieldwire, and Microsoft 365?",
		answer:
			"Yes. The platform integrates with the systems your owners already require: pushing daily logs, change orders, and pay-app backup directly into Procore (or whatever your project runs on), so nobody has to copy-paste documentation between tools.",
	},
	{
		question: "What about offline use: jobsites have bad reception?",
		answer:
			"Voice notes and photos queue locally and sync when service returns. Built for the reality of where construction actually happens.",
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

							<div className="rounded-xl bg-do-bg/80 border border-do-border p-5 mb-6">
								<div className="flex items-center gap-2 mb-3">
									<div className="h-2 w-2 rounded-full bg-do-orange animate-glow-pulse" />
									<span className="text-[10px] font-mono text-do-text-muted uppercase tracking-wider">
										From the field
									</span>
								</div>
								<p className="text-sm text-do-text/80 italic leading-relaxed">
									&quot;{feature.example}&quot;
								</p>
							</div>

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
							Features
						</span>
						<h1 className="text-4xl md:text-6xl font-bold text-do-text mt-4 mb-6">
							Every signal from your jobsite.
							<br />
							<span className="text-do-text-secondary font-normal">
								One unified record.
							</span>
						</h1>
						<p className="text-lg md:text-xl text-do-text-secondary max-w-2xl mx-auto leading-relaxed">
							Voice notes, photos, AI outbound calls, integrations with the systems
							your owners already use, unified into bulletproof pay-app and
							change-order documentation.
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
								{f.title}
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
