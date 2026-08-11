"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import {
	Mic,
	AlertTriangle,
	Receipt,
	Clock,
	CloudRain,
	UserX,
	PhoneCall,
	ArrowRight,
	Users,
	ArrowLeft,
} from "lucide-react";

/* ── Use case data ─────────────────────────────────────────────────── */

const useCases = [
	{
		number: "01",
		icon: Mic,
		badge: "Most used",
		title: "Unified Daily Reports",
		roles: ["Superintendents", "Project managers", "Foremen"],
		tagline: "30 seconds in the field. A complete daily log on your desk.",
		description:
			"A unified daily report combines voice notes, geotagged photos, integration data, and AI call summaries into a single timestamped record. Supers don't fill in forms, they talk for 30 seconds, drop a photo, or take a call from our AI. The platform builds the log automatically.",
		detail:
			"Daily logs only protect the contractor if they actually get created, every shift, every project, every day. Typed daily-log apps fail this test almost universally. Voice notes, AI outbound calls, and photo capture solve the adoption problem because they work the way supers already work.",
		context:
			"Voice transcription, geotagging, scope categorization, and routing happen automatically in the background. PMs see a complete picture of every project at end of shift, without anyone typing a report.",
		before: "Daily logs filed days late, or not at all. Half the day's events forgotten by the time someone sits down to type. Pay-app review reconstructs from memory weeks later.",
		after: "Daily logs created the same shift, automatically. Voice notes, photos, and AI call summaries unified into one timestamped record per project, per day.",
		capabilities: [
			"30-second voice updates",
			"Geotagged photos",
			"AI outbound calls",
			"Auto-transcription",
			"Same-day daily logs",
			"Project + scope routing",
		],
		example:
			"Pouring Level 3 concrete today. Found unexpected rebar in the south footing. Taking photos. Crew stopped for 45 minutes.",
	},
	{
		number: "02",
		icon: AlertTriangle,
		badge: "",
		title: "Change Order Capture",
		roles: ["Project managers", "Estimators", "Owner-operators"],
		tagline: "Catch the change order the day it happens. Win it the week you submit.",
		description:
			"Change order capture is the automated detection of contract-extra work the moment it's mentioned in the field. Voice notes, AI call summaries, and integration data run through construction-trained models that flag extras, unforeseen conditions, and owner-directed changes for the PM the same day.",
		detail:
			"60 to 80 percent of construction change orders come from documentation problems, not scope problems. The work happens. The contract supports it. But the proof shows up late or never. Same-day capture closes that gap.",
		context:
			"When a super's voice note mentions 'not in the contract' or 'wasn't on the drawings,' the PM gets an alert with a draft change-order notification ready to send. Day-one documentation makes the change order unanswerable by submission time.",
		before: "Change orders submitted weeks late, with documentation reconstructed from memory. Owners push back. Half get denied or negotiated down.",
		after: "Change orders submitted with day-one voice transcripts, geotagged photos, schedule impact quantified. Owners stop pushing back.",
		capabilities: [
			"Extra work detection",
			"Day-one voice + photo evidence",
			"Auto-drafted notifications",
			"Schedule impact quantified",
			"Owner-direct change capture",
			"Claim-ready packets",
		],
		example:
			"Found unexpected rebar in the south footing, not on the drawings. Crew stopped 45 minutes while we figured it out. Taking photos now.",
	},
	{
		number: "03",
		icon: Receipt,
		badge: "Biggest ROI",
		title: "Bulletproof Pay Applications",
		roles: ["Project managers", "Project accountants", "GCs"],
		tagline: "Every pay app ships with its backup package already attached.",
		description:
			"Bulletproof pay applications ship with auto-assembled backup packages, voice logs, geotagged photos, quantified scope changes, daily progress, and timestamps for every line item. The owner gets the documentation before they think to ask for it.",
		detail:
			"At pay-app time, the platform assembles every relevant voice log, photo, transcript, and integration data point, organized by scope item. What used to take a PM two days of digging through emails and notebooks is ready in 90 seconds.",
		context:
			"Pay applications push directly into Procore, Autodesk, and other systems your owner requires, no copy-paste, no manual assembly. First-try approval becomes the norm.",
		before: "Pay app filed. Owner: 'Disputed. Please provide documentation.' PM digs through 30 days of emails and notebooks. 45-day cycles. Cash flow problems.",
		after: "Pay app filed with full backup auto-assembled. Line-by-line proof attached, nothing left to dig for.",
		capabilities: [
			"Auto-assembled backup",
			"Per-line-item evidence",
			"Geotagged photos linked to scope",
			"Quantified progress",
			"Procore + Autodesk push",
			"Ready at submission time",
		],
		example:
			"Level 3 slab pour finished today, roughly 40 percent of the concrete scope complete. Photos are up for the pay app.",
	},
	{
		number: "04",
		icon: Clock,
		badge: "",
		title: "T&M That Doesn't Get Disputed",
		roles: ["Electrical subs", "Mechanical subs", "Specialty contractors"],
		tagline: "Every hour timestamped, so T&M tickets arrive with their own proof.",
		description:
			"T&M tracking captures every labor hour, every outlet, every condition as it happens, not reconstructed from memory three weeks later. Supers voice-log T&M directly from the field; integration data backs it up. When owners push back, you have the proof, hour by hour.",
		detail:
			"T&M disputes are won or lost on the quality of contemporaneous documentation. When a $41K invoice gets challenged, the contractor with timestamped voice logs and photos for every hour gets paid. The contractor with a typed summary doesn't.",
		context:
			"Voice logs route to the right T&M ticket, the right scope, the right pay-app line, automatically. Owners see hour-by-hour proof when they ask for it.",
		before: "T&M tickets reconstructed from memory at end of project. Owner disputes 350 of 800 hours. Negotiate, eat the loss, or fight it.",
		after: "Every hour voice-logged in real time. T&M tickets ship with hour-by-hour proof the owner can check against photos.",
		capabilities: [
			"Real-time hour logging",
			"Per-task voice notes",
			"Photo + voice for every condition",
			"Auto-routed to T&M ticket",
			"Integration with payroll",
			"Owner-ready timeline",
		],
		example:
			"Ran 14 T&M hours on the added outlets in Suite 210 today. Photos of every rough-in before we closed the wall.",
	},
	{
		number: "05",
		icon: AlertTriangle,
		badge: "",
		title: "Unforeseen Conditions Log",
		roles: ["GCs", "Project managers", "Superintendents"],
		tagline: "Soil, utilities, structure, day-by-day proof from the moment you find them.",
		description:
			"Unforeseen conditions logging captures differing site conditions, hidden utilities, structural surprises, and owner-supplied material issues with voice notes, geotagged photos, and timestamps from the day they're discovered. Day-by-day proof is the difference between a winning claim and a denied one.",
		detail:
			"Most unforeseen-conditions claims fail on documentation, not merit. The contractor knew on day one. The owner found out on day 30. The paper trail starts mid-claim. Same-day capture builds the trail from minute one.",
		context:
			"When a super's voice note mentions soil conditions, hidden utilities, or anything 'not on the drawings,' the AI flags it as a potential differing site condition and starts the documentation timeline.",
		before: "Claim filed at end of project. Owner: 'You should have notified us at the time.' Documentation reconstructed from memory. Claim denied.",
		after: "Day-one voice log, photo, transcript, timestamp. By the time the claim is filed, the trail is irrefutable.",
		capabilities: [
			"Differing site conditions",
			"Hidden utilities documentation",
			"Day-one voice + photo",
			"Timeline preservation",
			"Owner notification drafts",
			"Claim-ready packet",
		],
		example:
			"Hit wet clay at the south footing again, third day running. Logging depth measurements and photos before we backfill.",
	},
	{
		number: "06",
		icon: CloudRain,
		badge: "",
		title: "Weather & Delay Documentation",
		roles: ["Project managers", "Superintendents", "Schedulers"],
		tagline: "Weather, access, standby, quantified schedule extension proof.",
		description:
			"Weather and delay documentation captures weather impact, access issues, standby crews, and schedule disruption with voice notes, timestamps, and integration data from weather services. Schedule extension requests ship with proof, not memory.",
		detail:
			"Weather days, owner-caused access issues, and standby crews are billable, if you can prove them. Most contractors can't, because the documentation never gets created. Voice logs from the field, plus integrated weather data, build the proof automatically.",
		context:
			"Supers voice-log delays in real time. Integration data backs them up with weather service records. Standby crew hours route to the right T&M ticket.",
		before: "Schedule extension filed at end of project. Owner: 'No proof. Denied.' Crews already absorbed as overhead.",
		after: "Delays voice-logged the day they happen. Schedule extension requests come with hour-by-hour proof tied to weather records.",
		capabilities: [
			"Weather impact logging",
			"Access issue documentation",
			"Standby crew tracking",
			"Schedule extension proof",
			"Weather service integration",
			"Owner-ready timeline",
		],
		example:
			"Site shut down for 4 hours, wind gusts over 40 mph, crane down. Two crews on standby.",
	},
	{
		number: "07",
		icon: UserX,
		badge: "",
		title: "Subcontractor No-Shows",
		roles: ["GCs", "Project managers", "Superintendents"],
		tagline: "Missing trades, undermanned crews, late starts, back-charge ready.",
		description:
			"Subcontractor no-show documentation captures missed crews, undermanned trades, late starts, and trade-stacking conflicts with voice notes, timestamps, and manpower counts. Back-charges, delay claims, and coordination disputes get the documentation they need.",
		detail:
			"GCs lose money every week to sub coordination problems. Most of it goes uncollected because the documentation isn't tight enough to back-charge. Voice logs and timestamped manpower counts close that gap.",
		context:
			"Supers voice-log no-shows and undermanning in real time. The platform routes the documentation to the right sub contract for back-charge processing.",
		before: "Sub didn't show. GC ate the cost. No documentation. No back-charge.",
		after: "Sub didn't show. Voice log + timestamp + manpower count filed. Back-charge processed with proof.",
		capabilities: [
			"No-show logging",
			"Manpower counts",
			"Late-start documentation",
			"Trade-stacking conflicts",
			"Auto-back-charge routing",
			"Coordination meeting prep",
		],
		example:
			"Electrical sub showed up at 10:30, supposed to be on site at 7. Two of our crews waiting. Coordination meeting needed.",
	},
	{
		number: "08",
		icon: PhoneCall,
		badge: "",
		title: "AI Calls the Field",
		roles: ["Project managers", "Operations leaders", "Owner-operators"],
		tagline: "Our AI calls your supers, reporting stops depending on memory.",
		description:
			"AI outbound calls turn proactive reporting upside down. Instead of waiting for a super to remember to log a day, our AI calls them at shift change and prompts a quick update. Missed a log day? AI follows up. Reporting becomes automatic.",
		detail:
			"Adoption is the killer of every field-reporting tool. AI outbound calls solve adoption because the platform calls the field, not the other way around. Supers describe it as easier than texting their office.",
		context:
			"Set the schedule, set the questions. Calls go out at shift change, capture a 30-second summary, transcribe, categorize, and route to the right project and scope.",
		before: "Daily logs filed 40 percent of days. PMs chase supers for updates. Reporting depends on whether anyone remembered.",
		after: "AI calls every super at shift change. Reporting stops depending on whether anyone remembered the app. PMs stop chasing.",
		capabilities: [
			"Scheduled outbound calls",
			"End-of-shift prompts",
			"Follow-up on missed days",
			"Multi-language support",
			"Transcribed + categorized",
			"Routes to right project",
		],
		example:
			"End-of-day check-in for Tower B. Quick summary of pours, any issues, any extras today?",
	},
];

const colorMap: Record<string, { bg: string; border: string; text: string; tagBg: string }> = {
	blue: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-600 dark:text-blue-400", tagBg: "bg-blue-500/10" },
	emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-600 dark:text-emerald-400", tagBg: "bg-emerald-500/10" },
	amber: { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-600 dark:text-amber-400", tagBg: "bg-amber-500/10" },
	violet: { bg: "bg-violet-500/10", border: "border-violet-500/20", text: "text-violet-600 dark:text-violet-400", tagBg: "bg-violet-500/10" },
	red: { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-600 dark:text-red-400", tagBg: "bg-red-500/10" },
	cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/20", text: "text-cyan-600 dark:text-cyan-400", tagBg: "bg-cyan-500/10" },
	pink: { bg: "bg-pink-500/10", border: "border-pink-500/20", text: "text-pink-600 dark:text-pink-400", tagBg: "bg-pink-500/10" },
	orange: { bg: "bg-orange-500/10", border: "border-orange-500/20", text: "text-orange-600 dark:text-orange-400", tagBg: "bg-orange-500/10" },
};

const colors = ["blue", "amber", "emerald", "violet", "red", "cyan", "pink", "orange"];

/* ── Use case card ─────────────────────────────────────────────────── */

function UseCaseCard({
	uc,
	index,
	onClick,
}: {
	uc: (typeof useCases)[0];
	index: number;
	onClick: () => void;
}) {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-50px" });
	const color = colorMap[colors[index % colors.length]];

	return (
		<motion.div
			ref={ref}
			className={`group relative rounded-2xl border ${color.border} bg-do-bg-card/80 backdrop-blur-sm p-8 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
			initial={{ opacity: 0, y: 30 }}
			animate={inView ? { opacity: 1, y: 0 } : {}}
			transition={{ delay: index * 0.05, duration: 0.5 }}
			onClick={onClick}
		>
			<div className="flex items-start gap-5">
				<div
					className={`h-12 w-12 rounded-xl ${color.bg} border ${color.border} flex items-center justify-center shrink-0`}
				>
					<uc.icon className={`h-6 w-6 ${color.text}`} />
				</div>

				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-1">
						<span className="text-xs font-mono font-bold text-do-orange">
							{uc.number}
						</span>
						{uc.badge && (
							<span className="text-[10px] font-mono text-do-orange bg-do-orange/10 px-2 py-0.5 rounded-full">
								{uc.badge}
							</span>
						)}
					</div>

					<h3 className="text-lg font-semibold text-do-text mb-2">{uc.title}</h3>

					<p className="text-[14px] text-do-text-secondary leading-relaxed line-clamp-2 mb-4">
						{uc.description}
					</p>

					<div className="flex flex-wrap gap-2">
						{uc.roles.map((role) => (
							<span
								key={role}
								className="text-[11px] text-do-text-muted bg-do-bg-light border border-do-border px-2 py-1 rounded-md"
							>
								{role}
							</span>
						))}
					</div>

					<div className="mt-4 flex items-center gap-1 text-sm text-do-orange opacity-0 group-hover:opacity-100 transition-opacity">
						<span>View details</span>
						<ArrowRight className="h-4 w-4" />
					</div>
				</div>
			</div>
		</motion.div>
	);
}

/* ── Use case detail modal ────────────────────────────────────────── */

function UseCaseDetail({
	uc,
	color,
	onClose,
	onPrev,
	onNext,
	hasPrev,
	hasNext,
}: {
	uc: (typeof useCases)[0];
	color: (typeof colorMap)[string];
	onClose: () => void;
	onPrev: () => void;
	onNext: () => void;
	hasPrev: boolean;
	hasNext: boolean;
}) {
	return (
		<motion.div
			className="fixed inset-0 z-50 bg-do-bg/95 backdrop-blur-xl overflow-y-auto"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<div className="min-h-screen max-w-4xl mx-auto px-6 py-24">
				<button
					onClick={onClose}
					className="fixed top-6 right-6 p-3 rounded-xl bg-do-bg-card border border-do-border hover:border-do-border-accent transition-colors"
				>
					<ArrowLeft className="h-5 w-5 text-do-text" />
				</button>

				<div className="space-y-10">
					<div>
						<div className="flex items-center gap-3 mb-4">
							<span className="text-xs font-mono font-bold text-do-orange">
								{uc.number}
							</span>
							<span
								className={`text-[10px] font-mono px-2.5 py-1 rounded-full ${color.bg} ${color.text} border ${color.border}`}
							>
								{uc.badge || "Use case"}
							</span>
						</div>

						<h1 className="text-3xl md:text-4xl font-bold text-do-text mb-4">
							{uc.title}
						</h1>

						<p className="text-xl text-do-orange font-medium mb-6">
							{uc.tagline}
						</p>

						<div className="flex items-center gap-2 mb-8">
							<Users className="h-4 w-4 text-do-text-muted" />
							<div className="flex flex-wrap gap-2">
								{uc.roles.map((role) => (
									<span
										key={role}
										className="text-sm text-do-text-secondary bg-do-bg-card border border-do-border px-3 py-1 rounded-full"
									>
										{role}
									</span>
								))}
							</div>
						</div>
					</div>

					<div className="grid lg:grid-cols-5 gap-10">
						<div className="lg:col-span-3 space-y-8">
							<div>
								<p className="text-base text-do-text-secondary leading-relaxed">
									{uc.description}
								</p>
							</div>

							<div>
								<p className="text-base text-do-text leading-relaxed">
									{uc.detail}
								</p>
							</div>

							<div>
								<p className="text-base text-do-text leading-relaxed">
									{uc.context}
								</p>
							</div>

							<div className="grid sm:grid-cols-2 gap-4">
								<div className="rounded-xl border border-do-border bg-do-bg-card p-5">
									<p className="text-[10px] font-mono text-do-text-muted uppercase tracking-wider mb-3">
										Before
									</p>
									<p className="text-sm text-do-text-secondary leading-relaxed">
										{uc.before}
									</p>
								</div>
								<div className="rounded-xl border border-do-orange/20 bg-do-orange/5 p-5">
									<p className="text-[10px] font-mono text-do-orange uppercase tracking-wider mb-3">
										After
									</p>
									<p className="text-sm text-do-text leading-relaxed">
										{uc.after}
									</p>
								</div>
							</div>
						</div>

						<div className="lg:col-span-2 space-y-6">
							<div className="rounded-xl bg-do-bg-card border border-do-border p-6">
								<div className="flex items-center gap-2 mb-4">
									<div className="h-2 w-2 rounded-full bg-do-orange animate-glow-pulse" />
									<span className="text-[10px] font-mono text-do-text-muted uppercase tracking-wider">
										From the field
									</span>
								</div>
								<p className="text-sm text-do-text/80 italic leading-relaxed">
									&quot;{uc.example}&quot;
								</p>
							</div>

							<div className="rounded-xl bg-do-bg-card border border-do-border p-6">
								<p className="text-[10px] font-mono text-do-text-muted uppercase tracking-wider mb-4">
									Capabilities
								</p>
								<div className="space-y-3">
									{uc.capabilities.map((cap) => (
										<div key={cap} className="flex items-center gap-3">
											<div
												className={`h-6 w-6 rounded-md ${color.bg} border ${color.border} flex items-center justify-center`}
											>
												<uc.icon
													className={`h-3.5 w-3.5 ${color.text}`}
												/>
											</div>
											<span className="text-sm text-do-text">{cap}</span>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>

					<div className="flex items-center justify-between pt-8 border-t border-do-border">
						<button
							onClick={onPrev}
							disabled={!hasPrev}
							className="flex items-center gap-2 px-4 py-2 text-sm text-do-text-secondary hover:text-do-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
						>
							<ArrowLeft className="h-4 w-4" />
							Previous
						</button>
						<button
							onClick={onNext}
							disabled={!hasNext}
							className="flex items-center gap-2 px-4 py-2 text-sm text-do-text-secondary hover:text-do-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
						>
							Next
							<ArrowRight className="h-4 w-4" />
						</button>
					</div>
				</div>
			</div>
		</motion.div>
	);
}

/* ── CTA section ───────────────────────────────────────────────────── */

function UseCasesCTA() {
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
						Pick a use case and try it on your next project.
					</h2>
					<p className="text-lg text-do-text-secondary mb-8">
						Book a 15-minute demo and see exactly how we&apos;d protect your
						margins on your next project.
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

export default function UseCasesPage() {
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

	const selectedUseCase = selectedIndex !== null ? useCases[selectedIndex] : null;
	const selectedColor = selectedIndex !== null ? colorMap[colors[selectedIndex % colors.length]] : colorMap.blue;

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
						<span className="do-section-label text-do-orange">Use Cases</span>
						<h1 className="text-4xl md:text-6xl font-bold text-do-text mt-4 mb-6">
							8 ways small &amp; mid-size commercial contractors stop losing margin
							to thin documentation.
						</h1>
						<p className="text-lg md:text-xl text-do-text-secondary max-w-2xl mx-auto leading-relaxed">
							From voice daily reports to AI outbound calls to bulletproof pay-app
							backup, every use case below is the difference between getting paid
							and absorbing the loss. Built for the $2M-50M commercial GC and
							subcontractors.
						</p>
					</motion.div>

					{/* Stats, hidden until we have real customer numbers to attribute.
					<motion.div
						className="flex flex-wrap justify-center gap-8 mt-12"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.5 }}
					>
						<div className="text-center">
							<p className="text-3xl font-bold text-do-orange">7 days</p>
							<p className="text-sm text-do-text-muted">pay-app approval</p>
						</div>
						<div className="text-center">
							<p className="text-3xl font-bold text-do-orange">$150K</p>
							<p className="text-sm text-do-text-muted">change orders won</p>
						</div>
						<div className="text-center">
							<p className="text-3xl font-bold text-do-orange">30 sec</p>
							<p className="text-sm text-do-text-muted">per field update</p>
						</div>
						<div className="text-center">
							<p className="text-3xl font-bold text-do-orange">$1M+</p>
							<p className="text-sm text-do-text-muted">protected annually</p>
						</div>
					</motion.div>
					*/}
				</div>
			</section>

			{/* Role filter */}
			<section className="relative py-8 overflow-hidden border-y border-do-border bg-do-bg-card/50">
				<div className="max-w-6xl mx-auto px-6">
					<div className="flex flex-wrap items-center justify-center gap-3">
						<span className="text-xs font-mono text-do-text-muted uppercase tracking-wider">
							Used by
						</span>
						<div className="flex flex-wrap justify-center gap-2">
							<span className="px-3 py-1.5 text-xs bg-do-orange/10 text-do-orange border border-do-orange/20 rounded-full">
								All roles
							</span>
							<span className="px-3 py-1.5 text-xs text-do-text-secondary bg-do-bg border border-do-border rounded-full">
								Superintendents
							</span>
							<span className="px-3 py-1.5 text-xs text-do-text-secondary bg-do-bg border border-do-border rounded-full">
								Project managers
							</span>
							<span className="px-3 py-1.5 text-xs text-do-text-secondary bg-do-bg border border-do-border rounded-full">
								Estimators
							</span>
							<span className="px-3 py-1.5 text-xs text-do-text-secondary bg-do-bg border border-do-border rounded-full">
								Commercial GCs
							</span>
							<span className="px-3 py-1.5 text-xs text-do-text-secondary bg-do-bg border border-do-border rounded-full">
								Electrical / Mechanical / Concrete subs
							</span>
						</div>
					</div>
				</div>
			</section>

			{/* Use case cards */}
			<section className="relative py-16 overflow-hidden">
				<div className="absolute inset-0 do-blueprint-grid pointer-events-none" />

				<div className="relative z-10 max-w-6xl mx-auto px-6">
					<div className="grid md:grid-cols-2 gap-6">
						{useCases.map((uc, i) => (
							<UseCaseCard
								key={uc.number}
								uc={uc}
								index={i}
								onClick={() => setSelectedIndex(i)}
							/>
						))}
					</div>
				</div>
			</section>

			<UseCasesCTA />
			<Footer />

			{/* Detail modal */}
			{selectedUseCase && (
				<UseCaseDetail
					uc={selectedUseCase}
					color={selectedColor}
					onClose={() => setSelectedIndex(null)}
					onPrev={() => setSelectedIndex(selectedIndex !== null ? Math.max(0, selectedIndex - 1) : 0)}
					onNext={() => setSelectedIndex(selectedIndex !== null ? Math.min(useCases.length - 1, selectedIndex + 1) : 0)}
					hasPrev={selectedIndex !== null && selectedIndex > 0}
					hasNext={selectedIndex !== null && selectedIndex < useCases.length - 1}
				/>
			)}
		</main>
	);
}
