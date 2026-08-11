"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Camera, CheckCircle2, Receipt, Clock, Mail } from "lucide-react";

/* Attribution note: these describe workflows we run today, deliberately kept
   company-level with no named customer, logo or quote until we have one on
   record to attribute. Add the name/role/logo here when that lands. */

const featuredWins = [
	"No more scanning and rekeying",
	"Auto-priced from a live database",
	"Report, submit, approve in-app",
	"Tracked by Email Management",
];

const stories = [
	{
		tags: ["Daily Reporting", "Issue Tracking"],
		title: "Caught a not-ready site before it became a delay claim",
		body:
			"A sub couldn't start concreting, the GC hadn't finished reinforcement. The crew noted it, the AI flagged it, tied it to the schedule and daily log, and notified the sub's owner. The delay claim was evidenced the same day.",
		wins: [
			"Daily log to schedule to delay claim, linked",
			"Flagged automatically, sub's owner notified",
		],
	},
	{
		tags: ["Email Management", "Bid Proposal", "Takeoff & Estimates"],
		title: "Runs a whole bidding process without ever opening the platform",
		body:
			"One subcontractor works entirely by email. Forward a bid request, the AI pulls past-project data, generates the takeoff, and replies with the numbers ready to send. No login, no onboarding.",
		wins: [
			"Forward an email, get a takeoff back",
			"Uses past-project data automatically",
			"Zero onboarding, lives in the inbox",
		],
	},
];

function TMMockup() {
	const rows = [
		{ icon: Camera, label: "T&M-Aug04-crew3.jpg", detail: "Sheet photographed on site" },
		{ icon: Receipt, label: "Priced against live rates", detail: "18 hrs labour + 4 line items" },
		{ icon: Mail, label: "Sent for approval", detail: "Tracked until signed off" },
	];

	return (
		<div className="rounded-xl border border-do-border bg-do-bg/70 overflow-hidden">
			<div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-do-border">
				<Clock className="h-3.5 w-3.5 text-do-orange" />
				<span className="text-[10px] font-mono text-do-text-secondary uppercase tracking-wider">
					T&amp;M module
				</span>
			</div>
			<div className="p-2 space-y-1.5">
				{rows.map((row, i) => (
					<motion.div
						key={row.label}
						className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-do-bg-card/70 border border-do-border/60"
						initial={{ opacity: 0, x: -12 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true, margin: "-30px" }}
						transition={{ delay: i * 0.12, duration: 0.4 }}
					>
						<row.icon className="h-4 w-4 text-do-orange shrink-0" />
						<div className="min-w-0 flex-1">
							<p className="text-[11px] font-mono text-do-text truncate">{row.label}</p>
							<p className="text-[10px] text-do-text-muted truncate">{row.detail}</p>
						</div>
						<CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
					</motion.div>
				))}
			</div>
		</div>
	);
}

export default function SuccessStories() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-80px" });

	return (
		<section id="stories" className="relative py-24 md:py-32 overflow-hidden bg-do-bg-card">
			<div className="absolute inset-0 do-blueprint-grid-dense pointer-events-none" />
			<div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-do-orange/[0.03] rounded-full blur-[110px]" />

			<div className="relative z-10 max-w-6xl mx-auto px-6" ref={ref}>
				<motion.div
					className="text-center mb-14"
					initial={{ opacity: 0, y: 30 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6 }}
				>
					<span className="do-section-label text-do-orange">Success stories</span>
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-do-text mt-4 mb-5 tracking-tight">
						How others are using it
					</h2>
					{/* <p className="text-lg text-do-text-secondary max-w-2xl mx-auto text-balance">
						Three jobs the platform is doing on live projects today, in the words of
						the work itself.
					</p> */}
				</motion.div>

				{/* Featured story */}
				<motion.div
					className="rounded-2xl border border-do-border bg-do-bg/80 backdrop-blur-sm overflow-hidden mb-6"
					initial={{ opacity: 0, y: 25 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6, delay: 0.1 }}
				>
					<div className="grid lg:grid-cols-5">
						<div className="lg:col-span-3 p-7 md:p-10">
							<div className="flex flex-wrap items-center gap-2.5 mb-5">
								<span className="inline-flex items-center px-3 py-1 rounded-full border border-do-orange/30 bg-do-orange/[0.07] text-[11px] font-medium text-do-orange">
									Time &amp; Material
								</span>
								<span className="do-section-label text-do-text-muted">Featured story</span>
							</div>

							<h3 className="text-xl md:text-2xl font-bold text-do-text leading-snug mb-5">
								Time &amp; material tracking, from a 40-hour-a-month chore to a photo.
							</h3>

							<div className="space-y-4 text-[15px] leading-relaxed text-do-text-secondary">
								<p>
									<span className="font-semibold text-do-text">Before:</span> crews
									filled T&amp;M sheets by hand. One admin scanned, digitized,
									rekeyed into Excel, priced it, and assembled reports with every
									sheet attached, roughly 40 hours a month.
								</p>
								<p>
									<span className="font-semibold text-do-text">Now:</span> crews snap
									a photo in the app. It&apos;s priced against a live database,
									reports generate on demand, and submission, approval and tracking
									all flow through the system.
								</p>
							</div>
						</div>

						<div className="lg:col-span-2 p-7 md:p-10 border-t lg:border-t-0 lg:border-l border-do-border bg-do-bg-card/70 flex flex-col justify-center">
							<p className="do-section-label text-do-text-muted mb-3">The result</p>
							<p className="text-4xl font-bold text-do-orange leading-none mb-1">
								~40 hrs
							</p>
							<p className="text-sm text-do-text-muted mb-6">of admin a month, gone</p>

							<div className="space-y-3 mb-6">
								{featuredWins.map((win, i) => (
									<motion.div
										key={win}
										className="flex items-start gap-2.5"
										initial={{ opacity: 0, x: -10 }}
										animate={inView ? { opacity: 1, x: 0 } : {}}
										transition={{ delay: 0.35 + i * 0.09 }}
									>
										<CheckCircle2 className="h-4 w-4 text-do-orange shrink-0 mt-0.5" />
										<span className="text-sm text-do-text leading-snug">{win}</span>
									</motion.div>
								))}
							</div>

							<TMMockup />
						</div>
					</div>
				</motion.div>

				{/* Secondary stories */}
				<div className="grid md:grid-cols-2 gap-6">
					{stories.map((story, i) => (
						<motion.div
							key={story.title}
							className="rounded-2xl border border-do-border bg-do-bg/70 backdrop-blur-sm p-7 hover:border-do-border-accent transition-colors"
							initial={{ opacity: 0, y: 25 }}
							animate={inView ? { opacity: 1, y: 0 } : {}}
							transition={{ delay: 0.25 + i * 0.12, duration: 0.5 }}
						>
							<div className="flex flex-wrap gap-2 mb-4">
								{story.tags.map((tag) => (
									<span
										key={tag}
										className="inline-flex items-center px-2.5 py-1 rounded-full border border-do-border bg-do-bg-card/70 text-[11px] text-do-text-secondary"
									>
										{tag}
									</span>
								))}
							</div>
							<h3 className="text-lg font-semibold text-do-text leading-snug mb-3">
								{story.title}
							</h3>
							<p className="text-sm text-do-text-secondary leading-relaxed mb-5">
								{story.body}
							</p>
							<div className="space-y-2.5">
								{story.wins.map((win) => (
									<div key={win} className="flex items-start gap-2.5">
										<CheckCircle2 className="h-4 w-4 text-do-orange shrink-0 mt-0.5" />
										<span className="text-sm text-do-text leading-snug">{win}</span>
									</div>
								))}
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
