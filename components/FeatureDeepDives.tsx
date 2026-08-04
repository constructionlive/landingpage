"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
	Mic,
	PhoneCall,
	AlertTriangle,
	Receipt,
	CheckCircle2,
	Camera,
	FileText,
	DollarSign,
	Clock,
	Plug,
	HardHat,
	CloudRain,
	UserX,
} from "lucide-react";

/* ── Section wrapper ───────────────────────────────────────────────── */

interface DeepDiveProps {
	number: string;
	tagline: string;
	title: string;
	description: string;
	metrics: { value: string; label: string }[];
	reverse?: boolean;
	bg?: "default" | "card";
	mockup: React.ReactNode;
}

function DeepDive({ number, tagline, title, description, metrics, reverse, bg, mockup }: DeepDiveProps) {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-80px" });

	return (
		<section
			ref={ref}
			className={`relative py-24 md:py-32 overflow-hidden ${bg === "card" ? "bg-do-bg-card" : "bg-do-bg"}`}
		>
			<div className="absolute inset-0 do-blueprint-grid pointer-events-none opacity-60" />
			<div className={`absolute top-1/2 ${reverse ? "left-0" : "right-0"} w-[500px] h-[500px] bg-do-orange/[0.04] rounded-full blur-[120px]`} />

			<div className="relative z-10 max-w-6xl mx-auto px-6">
				<div className={`flex flex-col ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12 lg:gap-16 items-center`}>
					{/* Text side */}
					<motion.div
						className="flex-1"
						initial={{ opacity: 0, x: reverse ? 30 : -30 }}
						animate={inView ? { opacity: 1, x: 0 } : {}}
						transition={{ duration: 0.6 }}
					>
						<div className="flex items-center gap-3 mb-5">
							<span className="text-xs font-mono font-bold text-do-orange">
								{number}
							</span>
							<span className="text-[10px] font-mono text-do-text-muted px-2.5 py-1 rounded-full bg-do-bg-light border border-do-border uppercase tracking-wider">
								{tagline}
							</span>
						</div>

						<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-do-text mb-5 tracking-tight leading-[1.1]">
							{title}
						</h2>

						<p className="text-lg text-do-text-secondary leading-relaxed mb-8">
							{description}
						</p>

						<div className="grid grid-cols-2 gap-4">
							{metrics.map((m) => (
								<div key={m.label} className="rounded-xl border border-do-border bg-do-bg-card/60 backdrop-blur-sm px-5 py-4">
									<p className="text-2xl md:text-3xl font-bold text-do-text leading-none">
										{m.value}
									</p>
									<p className="text-xs font-mono text-do-orange mt-1.5 uppercase tracking-wider">
										{m.label}
									</p>
								</div>
							))}
						</div>
					</motion.div>

					{/* Mockup side */}
					<motion.div
						className="flex-1 w-full"
						initial={{ opacity: 0, x: reverse ? -30 : 30 }}
						animate={inView ? { opacity: 1, x: 0 } : {}}
						transition={{ duration: 0.6, delay: 0.15 }}
					>
						{mockup}
					</motion.div>
				</div>
			</div>
		</section>
	);
}

/* ── Mockup 1: Voice + AI Outbound Calls ──────────────────────────── */

function VoiceMockup() {
	return (
		<div className="rounded-2xl border border-do-border bg-do-bg-card/80 backdrop-blur-sm shadow-xl overflow-hidden">
			<div className="flex items-center gap-3 px-5 py-3 border-b border-do-border">
				<div className="h-7 w-7 rounded-lg bg-do-orange/10 flex items-center justify-center">
					<Mic className="h-4 w-4 text-do-orange" />
				</div>
				<span className="text-xs font-mono text-do-text-secondary uppercase tracking-wider">
					Live transcript, Tower B
				</span>
				<div className="ml-auto flex items-center gap-1.5">
					<motion.div
						className="h-2 w-2 rounded-full bg-emerald-500"
						animate={{ opacity: [0.4, 1, 0.4] }}
						transition={{ duration: 2, repeat: Infinity }}
					/>
					<span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">Recording</span>
				</div>
			</div>

			<div className="p-5 space-y-3">
				{/* Voice waveform */}
				<div className="flex items-center gap-3 p-3 rounded-xl bg-do-bg/40 border border-do-border">
					<div className="h-10 w-10 rounded-full bg-do-bg border border-do-border flex items-center justify-center shrink-0">
						<HardHat className="h-4 w-4 text-do-text-secondary" />
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-[11px] font-mono text-do-text-muted mb-1">
							Mike, Super, 0:28
						</p>
						<div className="flex items-end gap-0.5 h-5">
							{Array.from({ length: 32 }).map((_, i) => (
								<motion.div
									key={i}
									className="flex-1 rounded-full bg-do-orange/60"
									animate={{ height: [`${15 + ((i * 11) % 70)}%`, `${30 + ((i * 7) % 60)}%`, `${15 + ((i * 11) % 70)}%`] }}
									transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.03 }}
								/>
							))}
						</div>
					</div>
				</div>

				{/* Transcript */}
				<div className="rounded-xl bg-do-bg/40 border border-do-border p-4">
					<p className="text-[10px] font-mono text-do-text-muted mb-2 uppercase tracking-wider">
						Auto-transcript
					</p>
					<p className="text-sm text-do-text/90 italic leading-relaxed">
						&ldquo;Pouring Level 3 concrete today. Found unexpected rebar in
						the south footing, not on the drawings. Taking photos. Crew
						stopped for 45 minutes.&rdquo;
					</p>
				</div>

				{/* AI outbound call alt input */}
				<div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
					<div className="flex items-center gap-2 mb-2">
						<PhoneCall className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
						<p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
							Or, AI called Mike at shift change
						</p>
					</div>
					<p className="text-xs text-do-text-secondary leading-relaxed">
						&ldquo;End-of-day check-in for Tower B. Quick summary of pours,
						any issues, any extras?&rdquo;, captured the same content,
						handsfree.
					</p>
				</div>
			</div>
		</div>
	);
}

/* ── Mockup 2: Same-Day Money Alerts ──────────────────────────────── */

function AlertsMockup() {
	const alerts = [
		{
			icon: AlertTriangle,
			title: "Unforeseen condition flagged",
			detail: "Rebar in south footing, not in contract drawings",
			time: "8:48 AM",
			color: "amber",
		},
		{
			icon: DollarSign,
			title: "Change order candidate",
			detail: "$15K–$30K estimate, owner notification drafted",
			time: "8:48 AM",
			color: "emerald",
		},
		{
			icon: CloudRain,
			title: "Schedule impact",
			detail: "45 min crew standby, schedule extension drafted",
			time: "8:49 AM",
			color: "cyan",
		},
		{
			icon: UserX,
			title: "Coordination conflict",
			detail: "Electrical sub late, back-charge tracker updated",
			time: "10:32 AM",
			color: "violet",
		},
	];

	const colorMap: Record<string, { bg: string; text: string; border: string }> = {
		amber: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/20" },
		emerald: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/20" },
		cyan: { bg: "bg-cyan-500/10", text: "text-cyan-600 dark:text-cyan-400", border: "border-cyan-500/20" },
		violet: { bg: "bg-violet-500/10", text: "text-violet-600 dark:text-violet-400", border: "border-violet-500/20" },
	};

	return (
		<div className="rounded-2xl border border-do-border bg-do-bg-card/80 backdrop-blur-sm shadow-xl overflow-hidden">
			<div className="flex items-center gap-3 px-5 py-3 border-b border-do-border">
				<div className="h-7 w-7 rounded-lg bg-do-orange/10 flex items-center justify-center">
					<AlertTriangle className="h-4 w-4 text-do-orange" />
				</div>
				<span className="text-xs font-mono text-do-text-secondary uppercase tracking-wider">
					PM dashboard, same-day alerts
				</span>
				<div className="ml-auto text-[10px] font-mono text-do-text-muted">
					Tower B • Aug 4
				</div>
			</div>

			<div className="p-3 space-y-2">
				{alerts.map((alert, i) => {
					const c = colorMap[alert.color];
					return (
						<motion.div
							key={alert.title}
							className={`flex items-start gap-3 px-4 py-3 rounded-xl ${c.bg} border ${c.border}`}
							initial={{ opacity: 0, x: 20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true, margin: "-30px" }}
							transition={{ delay: i * 0.12, duration: 0.4 }}
						>
							<div className={`h-9 w-9 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center shrink-0`}>
								<alert.icon className={`h-4 w-4 ${c.text}`} />
							</div>
							<div className="flex-1 min-w-0">
								<p className="text-sm text-do-text font-medium">{alert.title}</p>
								<p className="text-[11px] text-do-text-secondary leading-snug">{alert.detail}</p>
							</div>
							<span className="text-[10px] font-mono text-do-text-muted shrink-0">
								{alert.time}
							</span>
						</motion.div>
					);
				})}

				<motion.div
					className="mt-2 p-3 rounded-xl bg-do-orange/[0.06] border border-do-orange/20"
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.6 }}
				>
					<p className="text-[10px] font-mono text-do-orange uppercase tracking-wider mb-1">
						PM action
					</p>
					<p className="text-xs text-do-text leading-relaxed">
						Owner notification ready to send. Change order packet drafted.
						One click to approve.
					</p>
				</motion.div>
			</div>
		</div>
	);
}

/* ── Mockup 3: Pay App Backup ─────────────────────────────────────── */

function PayAppMockup() {
	const items = [
		{ icon: Mic, label: "VoiceLog-Aug04-0847.mp3", detail: "Mike, Super, 28 sec + transcript" },
		{ icon: Camera, label: "Photo-Aug04-0851.jpg", detail: "South footing, geotagged" },
		{ icon: Clock, label: "Delay quantified", detail: "45 min crew standby, line 7" },
		{ icon: FileText, label: "Change order #12 packet", detail: "$150K, day-one documentation trail" },
		{ icon: Plug, label: "Synced to Procore", detail: "Owner sees the same record" },
	];

	return (
		<div className="rounded-2xl border border-do-border bg-do-bg-card/80 backdrop-blur-sm shadow-xl overflow-hidden">
			<div className="flex items-center gap-3 px-5 py-3 border-b border-do-border">
				<div className="h-7 w-7 rounded-lg bg-do-orange/10 flex items-center justify-center">
					<Receipt className="h-4 w-4 text-do-orange" />
				</div>
				<span className="text-xs font-mono text-do-text-secondary uppercase tracking-wider">
					Pay App #6, backup package
				</span>
				<div className="ml-auto flex items-center gap-1.5">
					<CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
					<span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">Ready to submit</span>
				</div>
			</div>

			<div className="p-3 space-y-1.5">
				{items.map((item, i) => (
					<motion.div
						key={item.label}
						className="flex items-center gap-3 px-4 py-3 rounded-xl bg-do-bg/40 border border-do-border/60 hover:border-do-border-accent transition-colors"
						initial={{ opacity: 0, x: -15 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true, margin: "-30px" }}
						transition={{ delay: i * 0.1, duration: 0.4 }}
					>
						<div className="h-8 w-8 rounded-lg bg-do-bg-light border border-do-border flex items-center justify-center shrink-0">
							<item.icon className="h-4 w-4 text-do-orange" />
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-[12px] font-mono text-do-text truncate">{item.label}</p>
							<p className="text-[11px] text-do-text-muted leading-snug">{item.detail}</p>
						</div>
						<CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
					</motion.div>
				))}

				<motion.div
					className="mt-3 p-4 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/20"
					initial={{ opacity: 0, y: 10 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ delay: 0.6 }}
				>
					<div className="flex items-center gap-2 mb-1">
						<CheckCircle2 className="h-4 w-4 text-emerald-500" />
						<p className="text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
							Backup package ready
						</p>
					</div>
					<p className="text-sm text-do-text leading-relaxed">
						Everything the owner would ask for, assembled before they ask.
						Nothing to dig out of a month of emails.
					</p>
				</motion.div>
			</div>
		</div>
	);
}

/* ── Main export ──────────────────────────────────────────────────── */

function SectionIntro() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-80px" });

	return (
		<section id="how-it-works" className="relative pt-28 pb-4 overflow-hidden bg-do-bg">
			<div className="absolute inset-0 do-blueprint-grid pointer-events-none opacity-60" />
			<motion.div
				ref={ref}
				className="relative z-10 max-w-3xl mx-auto px-6 text-center"
				initial={{ opacity: 0, y: 30 }}
				animate={inView ? { opacity: 1, y: 0 } : {}}
				transition={{ duration: 0.6 }}
			>
				<span className="do-section-label text-do-orange">How it works</span>
				<h2 className="text-4xl md:text-5xl font-bold text-do-text mt-4 mb-5">
					The field-to-payment platform you can talk to
				</h2>
				<p className="text-lg text-do-text-secondary text-balance">
					Three steps from a 30-second voice note to an approved pay app. No
					forms. No training. Built for how supers and PMs actually work.
				</p>
			</motion.div>
		</section>
	);
}

export default function FeatureDeepDives() {
	return (
		<>
			<SectionIntro />

			<DeepDive
				number="01"
				tagline="Field input"
				title="Two ways to capture the field. Both take 30 seconds."
				description="Supers leave a voice note when something happens, or our AI calls them at shift change. Either way, the platform transcribes, categorizes, and routes to the right project and scope. No forms, no typing, no app to fight with."
				metrics={[
					{ value: "30 sec", label: "Per update" },
					{ value: "2 ways in", label: "Voice note or AI call" },
				]}
				bg="default"
				mockup={<VoiceMockup />}
			/>

			<DeepDive
				number="02"
				tagline="Intelligence"
				title="Catch the money moments the day they happen."
				description="Construction-trained AI listens for extras, unforeseen conditions, weather delays, no-shows, and owner-directed changes. Flags them to the PM the same day with draft notifications and change-order packets ready to send."
				metrics={[
					{ value: "8 categories", label: "Money moments tracked" },
					{ value: "Same day", label: "PM alerts" },
				]}
				reverse
				bg="card"
				mockup={<AlertsMockup />}
			/>

			<DeepDive
				number="03"
				tagline="Payment protection"
				title="Pay apps approved first-try. Change orders won."
				description="At pay-app time, the platform auto-assembles the backup package, voice logs, geotagged photos, quantified scope changes, timestamps for every line item. Push to Procore, Autodesk, or whatever your owner already uses. First-try approval becomes the norm."
				metrics={[
					{ value: "90 sec", label: "Backup package assembled" },
					{ value: "Day one", label: "Change-order proof" },
				]}
				bg="default"
				mockup={<PayAppMockup />}
			/>
		</>
	);
}
