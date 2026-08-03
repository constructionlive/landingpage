"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
	FileUp, MessageSquare, Layers, Plug, Brain, FolderOpen, Video, BookOpen,
	FileText, Mail, BarChart3, CheckCircle2, ArrowRight, Search,
	Mic, PhoneCall, AlertTriangle, Receipt, WifiOff, HardHat, Camera, DollarSign,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ── Feature data ──────────────────────────────────────────────────── */

interface Feature {
	icon: LucideIcon;
	label: string;
	color: string;
	detail: string;
}

const features: Feature[] = [
	{ icon: Mic, label: "Field Voice Notes", color: "blue", detail: "One of many inputs, supers talk for 30 seconds and the voice note joins photos, integration data, and AI call summaries in one unified record" },
	{ icon: PhoneCall, label: "AI That Calls You", color: "emerald", detail: "End of shift? Our AI calls your supers and prompts a quick update. Reporting stops depending on whether anyone remembered the app" },
	{ icon: AlertTriangle, label: "Same-Day Money Alerts", color: "amber", detail: "Extras, unforeseen conditions, weather delays, no-shows \u2014 flagged the moment they\u2019re spoken, not 30 days later in pay-app review" },
	{ icon: Plug, label: "Integrates With Your Stack", color: "violet", detail: "Procore, Autodesk, Fieldwire, Microsoft 365, push daily logs and change orders into the systems your owner already uses" },
	{ icon: Receipt, label: "Bulletproof Pay App Packages", color: "pink", detail: "Every pay app auto-assembles a backup package, voice logs, geotagged photos, quantified scope, daily progress. Approved in 7 days" },
	{ icon: WifiOff, label: "Works Offline on Jobsites", color: "orange", detail: "Bad reception? Voice notes queue and sync when service returns. Built for the reality of where construction actually happens" },
];

const colorMap: Record<string, { iconBg: string; iconText: string; border: string; ring: string }> = {
	blue: { iconBg: "bg-blue-500/10", iconText: "text-blue-600 dark:text-blue-400", border: "border-blue-500/20", ring: "ring-blue-500/30" },
	emerald: { iconBg: "bg-emerald-500/10", iconText: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/20", ring: "ring-emerald-500/30" },
	amber: { iconBg: "bg-amber-500/10", iconText: "text-amber-600 dark:text-amber-400", border: "border-amber-500/20", ring: "ring-amber-500/30" },
	violet: { iconBg: "bg-violet-500/10", iconText: "text-violet-600 dark:text-violet-400", border: "border-violet-500/20", ring: "ring-violet-500/30" },
	cyan: { iconBg: "bg-cyan-500/10", iconText: "text-cyan-600 dark:text-cyan-400", border: "border-cyan-500/20", ring: "ring-cyan-500/30" },
	red: { iconBg: "bg-red-500/10", iconText: "text-red-600 dark:text-red-400", border: "border-red-500/20", ring: "ring-red-500/30" },
	pink: { iconBg: "bg-pink-500/10", iconText: "text-pink-600 dark:text-pink-400", border: "border-pink-500/20", ring: "ring-pink-500/30" },
	orange: { iconBg: "bg-orange-500/10", iconText: "text-orange-600 dark:text-orange-400", border: "border-orange-500/20", ring: "ring-orange-500/30" },
};

/* ── Animated workspace scene ──────────────────────────────────────── */

/* Simulates a mini workspace: sidebar with icons orbiting/flowing into a
   central "workspace" panel. Each feature icon flies in, lands, and shows
   its label, communicating visually that everything converges here. */

function WorkspaceAnimation({ inView }: { inView: boolean }) {
	const [activeIdx, setActiveIdx] = useState(0);

	useEffect(() => {
		if (!inView) return;
		const interval = setInterval(() => {
			setActiveIdx((prev) => (prev + 1) % features.length);
		}, 2800);
		return () => clearInterval(interval);
	}, [inView]);

	const active = features[activeIdx];
	const ac = colorMap[active.color];

	return (
		<div className="relative w-full max-w-4xl mx-auto">
			{/* Mock workspace shell */}
			<motion.div
				className="rounded-2xl border border-do-border bg-do-bg-card/80 backdrop-blur-sm overflow-hidden shadow-xl"
				initial={{ opacity: 0, y: 20 }}
				animate={inView ? { opacity: 1, y: 0 } : {}}
				transition={{ duration: 0.6 }}
			>
				{/* Top bar */}
				<div className="flex items-center gap-2 px-4 py-2.5 border-b border-do-border">
					<div className="flex gap-1.5">
						<div className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
						<div className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
						<div className="h-2.5 w-2.5 rounded-full bg-emerald-400/60" />
					</div>
					<div className="flex-1 flex justify-center">
						<div className="px-4 py-1 rounded-md bg-do-bg-light/80 border border-do-border text-[10px] font-mono text-do-text-muted">
							construction.live/workspace
						</div>
					</div>
				</div>

				<div className="flex min-h-[340px]">
					{/* Sidebar, feature icons */}
					<div className="w-14 md:w-16 border-r border-do-border flex flex-col items-center py-3 gap-1 shrink-0">
						{features.map((f, i) => {
							const c = colorMap[f.color];
							const isActive = i === activeIdx;
							return (
								<motion.button
									key={f.label}
									className={`h-9 w-9 md:h-10 md:w-10 rounded-lg flex items-center justify-center transition-all relative ${
										isActive ? `${c.iconBg} ring-2 ${c.ring}` : "hover:bg-do-bg-light/50"
									}`}
									onClick={() => setActiveIdx(i)}
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.95 }}
									type="button"
								>
									<f.icon className={`h-4 w-4 ${isActive ? c.iconText : "text-do-text-muted"}`} />
									{isActive && (
										<motion.div
											className="absolute -left-px top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-do-orange"
											layoutId="sidebar-indicator"
											transition={{ type: "spring", stiffness: 300, damping: 30 }}
										/>
									)}
								</motion.button>
							);
						})}
					</div>

					{/* Main content, animated feature showcase */}
					<div className="flex-1 p-6 md:p-8 flex flex-col relative overflow-hidden">
						<AnimatePresence mode="wait">
							<motion.div
								key={activeIdx}
								initial={{ opacity: 0, x: 30, filter: "blur(4px)" }}
								animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
								exit={{ opacity: 0, x: -30, filter: "blur(4px)" }}
								transition={{ duration: 0.35 }}
								className="flex-1 flex flex-col"
							>
								{/* Feature header */}
								<div className="flex items-center gap-3 mb-4">
									<motion.div
										className={`h-12 w-12 rounded-xl ${ac.iconBg} border ${ac.border} flex items-center justify-center`}
										initial={{ scale: 0.5, rotate: -20 }}
										animate={{ scale: 1, rotate: 0 }}
										transition={{ type: "spring", stiffness: 200, damping: 15 }}
									>
										<active.icon className={`h-6 w-6 ${ac.iconText}`} />
									</motion.div>
									<div>
										<motion.h3
											className="text-lg font-semibold text-do-text"
											initial={{ opacity: 0, y: 5 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.1 }}
										>
											{active.label}
										</motion.h3>
										<motion.p
											className="text-sm text-do-text-secondary"
											initial={{ opacity: 0, y: 5 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.15 }}
										>
											{active.detail}
										</motion.p>
									</div>
								</div>

								{/* Visual mock for the active feature */}
								<FeatureMock feature={active} color={ac} />
							</motion.div>
						</AnimatePresence>

						{/* Progress dots */}
						<div className="flex items-center justify-center gap-1.5 mt-4">
							{features.map((_, i) => (
								<button
									key={i}
									className={`h-1.5 rounded-full transition-all ${
										i === activeIdx ? "w-6 bg-do-orange" : "w-1.5 bg-do-text-muted/30"
									}`}
									onClick={() => setActiveIdx(i)}
									type="button"
								/>
							))}
						</div>
					</div>
				</div>
			</motion.div>
		</div>
	);
}

/* ── Mini visual mocks for each feature ────────────────────────────── */

function FeatureMock({ feature, color }: { feature: Feature; color: typeof colorMap[string] }) {
	const mockByLabel: Record<string, React.ReactNode> = {
		"Field Voice Notes": (
			<div className="flex-1 flex items-center justify-center">
				<motion.div
					className="rounded-xl border border-do-border bg-do-bg/40 p-6 w-full max-w-sm"
					animate={{ borderColor: ["var(--do-border)", "var(--do-border-accent)", "var(--do-border)"] }}
					transition={{ duration: 3, repeat: Infinity }}
				>
					<div className="flex items-center gap-3 mb-3">
						<motion.div
							className={`h-10 w-10 rounded-full ${color.iconBg} flex items-center justify-center`}
							animate={{ scale: [1, 1.08, 1] }}
							transition={{ duration: 1.6, repeat: Infinity }}
						>
							<Mic className={`h-5 w-5 ${color.iconText}`} />
						</motion.div>
						<div className="flex-1">
							<p className="text-[11px] font-mono text-do-text-muted">Mike, Super</p>
							<p className="text-xs text-do-text">0:28, Level 3 pour</p>
						</div>
					</div>
					<div className="flex items-end gap-0.5 h-8 mb-3">
						{Array.from({ length: 24 }).map((_, i) => (
							<motion.div
								key={i}
								className={`flex-1 rounded-full ${color.iconBg}`}
								animate={{ height: [`${20 + ((i * 13) % 60)}%`, `${40 + ((i * 7) % 50)}%`, `${20 + ((i * 13) % 60)}%`] }}
								transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.04 }}
							/>
						))}
					</div>
					<p className="text-[11px] text-do-text-secondary italic leading-relaxed">
						&ldquo;Found unexpected rebar in south footing, not on the drawings...&rdquo;
					</p>
				</motion.div>
			</div>
		),
		"AI That Calls You": (
			<div className="flex-1 flex flex-col gap-2">
				<div className="flex items-center gap-2 mb-1">
					<motion.div
						className="h-3 w-3 rounded-full bg-emerald-500"
						animate={{ scale: [1, 1.3, 1] }}
						transition={{ duration: 1.4, repeat: Infinity }}
					/>
					<span className="text-xs font-mono text-emerald-500">CALLING</span>
					<span className="text-xs text-do-text-muted ml-1">Mike, End of shift check-in</span>
				</div>
				{[
					"AI: \"Quick end-of-day summary for Tower B?\"",
					"Mike: \"Poured Level 3. Found rebar not on prints.\"",
					"AI: \"Got it. Flagging as unforeseen condition.\"",
				].map((line, i) => (
					<motion.div
						key={i}
						className="flex items-start gap-2 px-3 py-2 rounded-lg bg-do-bg-light/60 border border-do-border/50"
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: i * 0.3 }}
					>
						<CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
						<span className="text-xs text-do-text-secondary">{line}</span>
					</motion.div>
				))}
			</div>
		),
		"Same-Day Money Alerts": (
			<div className="flex-1 flex items-center justify-center">
				<div className="relative w-full max-w-xs">
					{[
						{ label: "Extras", icon: DollarSign, x: 0, y: 0 },
						{ label: "Unforeseen", icon: AlertTriangle, x: 140, y: 10 },
						{ label: "Weather delay", icon: Mail, x: 30, y: 70 },
						{ label: "No-show", icon: BarChart3, x: 160, y: 75 },
					].map((item, i) => (
						<motion.div
							key={item.label}
							className="absolute flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-do-bg-light border border-do-border text-xs text-do-text-secondary"
							style={{ left: item.x, top: item.y }}
							initial={{ opacity: 0, scale: 0.5 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: i * 0.2, type: "spring" }}
						>
							<item.icon className="h-3 w-3 text-do-orange" />
							{item.label}
						</motion.div>
					))}
					{/* Center brain */}
					<motion.div
						className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-do-orange/10 border border-do-orange/20 flex items-center justify-center"
						style={{ marginTop: 20 }}
						animate={{ scale: [1, 1.08, 1] }}
						transition={{ duration: 3, repeat: Infinity }}
					>
						<Brain className="h-6 w-6 text-do-orange" />
					</motion.div>
					{/* Connection lines (visual only) */}
					<svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ top: 20 }}>
						{[
							{ x1: "30%", y1: "15%", x2: "50%", y2: "50%" },
							{ x1: "75%", y1: "20%", x2: "50%", y2: "50%" },
							{ x1: "25%", y1: "70%", x2: "50%", y2: "50%" },
							{ x1: "80%", y1: "65%", x2: "50%", y2: "50%" },
						].map((l, i) => (
							<motion.line
								key={i}
								x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
								stroke="currentColor"
								className="text-do-orange/20"
								strokeWidth="1"
								strokeDasharray="4 3"
								initial={{ pathLength: 0 }}
								animate={{ pathLength: 1 }}
								transition={{ delay: i * 0.2 + 0.5, duration: 0.8 }}
							/>
						))}
					</svg>
					<div className="h-40" />
				</div>
			</div>
		),
		"Integrates With Your Stack": (
			<div className="flex-1 flex items-center justify-center">
				<div className="flex items-center gap-4">
					{[
						{ name: "Procore", connected: true },
						{ name: "Autodesk", connected: true },
						{ name: "Fieldwire", connected: true },
					].map((tool, i) => (
						<motion.div
							key={tool.name}
							className="flex flex-col items-center gap-2"
							initial={{ opacity: 0, y: 15 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: i * 0.15 }}
						>
							<div className="h-12 w-12 rounded-xl bg-do-bg-light border border-do-border flex items-center justify-center">
								<Plug className="h-5 w-5 text-do-text-muted" />
							</div>
							<span className="text-[10px] text-do-text-secondary">{tool.name}</span>
							<motion.div
								className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: i * 0.15 + 0.4 }}
							>
								<CheckCircle2 className="h-3 w-3" />
								Connected
							</motion.div>
						</motion.div>
					))}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.8 }}
						className="flex flex-col items-center gap-2"
					>
						<ArrowRight className="h-5 w-5 text-do-orange" />
					</motion.div>
					<motion.div
						className="flex flex-col items-center gap-2"
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 1, type: "spring" }}
					>
						<div className="h-12 w-12 rounded-xl bg-do-orange/10 border border-do-orange/20 flex items-center justify-center">
							<Brain className="h-5 w-5 text-do-orange" />
						</div>
						<span className="text-[10px] text-do-orange font-medium">Your AI</span>
					</motion.div>
				</div>
			</div>
		),
		"Bulletproof Pay App Packages": (
			<div className="flex-1 flex flex-col">
				<div className="flex items-center gap-2 mb-3">
					<Receipt className="h-3.5 w-3.5 text-do-text-muted" />
					<span className="text-xs text-do-text-muted">Pay App #6, auto-assembled backup</span>
				</div>
				{[
					{ doc: "VoiceLog-Aug04-0847.mp3", section: "Mike, Super, 28 sec", match: "Unforeseen rebar, south footing, 45 min delay" },
					{ doc: "Photo-Aug04-0851.jpg", section: "Geotagged + timestamped", match: "South footing rebar, 3 angles, lat/long" },
					{ doc: "DailyLog-Aug04.pdf", section: "Quantified scope change", match: "Change order #12 packet, $150K backup ready" },
				].map((result, i) => (
					<motion.div
						key={i}
						className="flex items-start gap-2 px-3 py-2.5 rounded-lg border border-do-border/50 bg-do-bg-light/40 mb-1.5"
						initial={{ opacity: 0, x: 15 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: i * 0.2 }}
					>
						<FileText className="h-3.5 w-3.5 text-do-orange mt-0.5 shrink-0" />
						<div>
							<p className="text-[11px] font-mono text-do-text-muted">{result.doc}, {result.section}</p>
							<p className="text-xs text-do-text">{result.match}</p>
						</div>
					</motion.div>
				))}
			</div>
		),
		"Works Offline on Jobsites": (
			<div className="flex-1 flex flex-col gap-1">
				<div className="flex items-center gap-2 mb-2 px-1">
					<WifiOff className="h-3.5 w-3.5 text-amber-500" />
					<span className="text-[11px] font-mono text-do-text-muted">No service, voice notes queued</span>
				</div>
				{[
					{ name: "Voice log, 08:47 AM", type: "queued", items: "Synced ✓" },
					{ name: "Photo, south footing", type: "queued", items: "Synced ✓" },
					{ name: "Voice log, 10:22 AM", type: "queued", items: "Queued" },
					{ name: "Photo, Level 3 pour", type: "queued", items: "Queued" },
					{ name: "Voice log, 12:05 PM", type: "queued", items: "Queued" },
				].map((item, i) => (
					<motion.div
						key={item.name}
						className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-do-bg-light/50 transition-colors"
						initial={{ opacity: 0, x: 10 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: i * 0.1 }}
					>
						<Mic className={`h-4 w-4 ${item.items === "Synced ✓" ? "text-emerald-500" : "text-amber-500"}`} />
						<span className="text-xs text-do-text flex-1">{item.name}</span>
						<span className={`text-[10px] font-mono ${item.items === "Synced ✓" ? "text-emerald-500" : "text-do-text-muted"}`}>{item.items}</span>
					</motion.div>
				))}
			</div>
		),
	};

	return mockByLabel[feature.label] || null;
}

/* ── Main component ────────────────────────────────────────────────── */

export default function Metrics() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-80px" });

	return (
		<section className="relative py-32 overflow-hidden bg-do-bg">
			<div className="absolute inset-0 do-blueprint-grid pointer-events-none" />

			<div className="relative z-10 max-w-6xl mx-auto px-6" ref={ref}>
				<motion.div
					className="text-center mb-16"
					initial={{ opacity: 0, y: 30 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6 }}
				>
					<span className="do-section-label text-do-orange">Capabilities</span>
					<h2 className="text-4xl md:text-5xl font-bold text-do-text mt-4 mb-5">
						Everything your team needs, in one place
					</h2>
					<p className="text-lg text-do-text-secondary max-w-2xl mx-auto text-balance">
						Six capabilities that turn every signal from your jobsite into the
						documentation that gets pay apps approved and change orders won.
					</p>
				</motion.div>

				{/* Interactive workspace animation */}
				<WorkspaceAnimation inView={inView} />
			</div>
		</section>
	);
}
