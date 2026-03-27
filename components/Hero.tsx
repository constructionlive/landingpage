"use client";

import { motion } from "framer-motion";
import {
	Building2,
	HardHat,
	Zap,
	FileSearch,
	Video,
	ArrowRight,
	Mail,
	FileUp,
	CalendarClock,
	Clock,
	Bot,
	Smartphone,
} from "lucide-react";

const floatingTags = [
	{ label: "RFI Analysis", icon: FileSearch, x: "10%", y: "20%", delay: 0 },
	{ label: "Cost Estimates", icon: Zap, x: "78%", y: "15%", delay: 0.8 },
	{ label: "Bid Levelling", icon: HardHat, x: "5%", y: "70%", delay: 1.6 },
	{ label: "Project Docs", icon: Building2, x: "82%", y: "65%", delay: 2.2 },
	{ label: "Meetings", icon: Video, x: "85%", y: "40%", delay: 1.2 },
];

export default function Hero() {
	return (
		<section className="relative min-h-screen flex items-center justify-center overflow-hidden do-blueprint-grid bg-do-bg">
			{/* Blueprint background elements */}
			<div className="absolute inset-0 pointer-events-none">
				<svg className="absolute inset-0 w-full h-full opacity-[0.06] dark:opacity-[0.06]">
					<line x1="10%" y1="0" x2="10%" y2="100%" stroke="#f97316" strokeWidth="0.5" strokeDasharray="8 4" />
					<line x1="90%" y1="0" x2="90%" y2="100%" stroke="#f97316" strokeWidth="0.5" strokeDasharray="8 4" />
					<line x1="0" y1="30%" x2="100%" y2="30%" stroke="#f97316" strokeWidth="0.5" strokeDasharray="8 4" />
					<line x1="0" y1="70%" x2="100%" y2="70%" stroke="#f97316" strokeWidth="0.5" strokeDasharray="8 4" />
					<circle cx="10%" cy="30%" r="8" fill="none" stroke="#f97316" strokeWidth="0.5" />
					<circle cx="90%" cy="30%" r="8" fill="none" stroke="#f97316" strokeWidth="0.5" />
					<circle cx="10%" cy="70%" r="8" fill="none" stroke="#f97316" strokeWidth="0.5" />
					<circle cx="90%" cy="70%" r="8" fill="none" stroke="#f97316" strokeWidth="0.5" />
				</svg>

				<motion.div
					className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] opacity-[0.06] dark:opacity-[0.04]"
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 0.04, y: 0 }}
					transition={{ duration: 2, delay: 0.5 }}
				>
					<svg viewBox="0 0 800 400" fill="none" stroke="#f97316" strokeWidth="1">
						<rect x="100" y="100" width="120" height="300" />
						<rect x="110" y="120" width="20" height="30" />
						<rect x="140" y="120" width="20" height="30" />
						<rect x="170" y="120" width="20" height="30" />
						<rect x="110" y="170" width="20" height="30" />
						<rect x="140" y="170" width="20" height="30" />
						<rect x="170" y="170" width="20" height="30" />
						<rect x="110" y="220" width="20" height="30" />
						<rect x="140" y="220" width="20" height="30" />
						<rect x="170" y="220" width="20" height="30" />
						<rect x="300" y="50" width="200" height="350" />
						<rect x="320" y="70" width="30" height="40" />
						<rect x="370" y="70" width="30" height="40" />
						<rect x="420" y="70" width="30" height="40" />
						<rect x="320" y="130" width="30" height="40" />
						<rect x="370" y="130" width="30" height="40" />
						<rect x="420" y="130" width="30" height="40" />
						<rect x="320" y="190" width="30" height="40" />
						<rect x="370" y="190" width="30" height="40" />
						<rect x="420" y="190" width="30" height="40" />
						<rect x="320" y="250" width="30" height="40" />
						<rect x="370" y="250" width="30" height="40" />
						<rect x="420" y="250" width="30" height="40" />
						<rect x="580" y="150" width="140" height="250" />
						<rect x="600" y="170" width="25" height="35" />
						<rect x="640" y="170" width="25" height="35" />
						<rect x="680" y="170" width="25" height="35" />
						<rect x="600" y="225" width="25" height="35" />
						<rect x="640" y="225" width="25" height="35" />
						<rect x="680" y="225" width="25" height="35" />
						<line x1="500" y1="50" x2="500" y2="0" strokeWidth="2" />
						<line x1="460" y1="0" x2="560" y2="0" strokeWidth="1.5" />
						<line x1="560" y1="0" x2="555" y2="20" strokeWidth="0.8" />
					</svg>
				</motion.div>

				<div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-do-orange/[0.04] dark:bg-do-orange/[0.03] rounded-full blur-[120px]" />
			</div>

			{/* Floating tags */}
			{floatingTags.map((tag) => (
				<motion.div
					key={tag.label}
					className="absolute hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-do-bg-card/80 border border-do-border backdrop-blur-sm text-xs text-do-text-secondary"
					style={{ left: tag.x, top: tag.y }}
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: tag.delay + 0.8, duration: 0.5, type: "spring" }}
				>
					<tag.icon className="h-3.5 w-3.5 text-do-orange" />
					{tag.label}
				</motion.div>
			))}

			{/* Hero content */}
			<div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20">
				<div className="text-center">
					<motion.div
						className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-do-orange/10 border border-do-orange/20 mb-8"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
					>
						<span className="h-1.5 w-1.5 rounded-full bg-do-orange animate-glow-pulse" />
						<span className="text-xs font-mono text-do-orange tracking-wider uppercase">
							The Integrated AI Office for Construction
						</span>
					</motion.div>

					<motion.h1
						className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.95] mb-6"
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.35, duration: 0.7 }}
					>
						<span className="text-do-text">The Only AI That</span>
						<br />
						<span className="bg-gradient-to-r from-do-orange via-orange-400 to-amber-400 bg-clip-text text-transparent">
							Works While You Sleep
						</span>
					</motion.h1>

					<motion.p
						className="text-lg sm:text-xl text-do-text-secondary max-w-2xl mx-auto mb-10 text-balance leading-relaxed"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.55 }}
					>
						construction.live is a sentient AI agent for construction — it checks your emails,
						drafts responses, tracks deadlines, and compiles reports on schedule.
						You set it up once. It never stops working.
					</motion.p>

					<motion.div
						className="flex flex-col sm:flex-row items-center justify-center gap-4"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.7 }}
					>
						<a
							href="https://app.construction.live"
							className="group px-8 py-3.5 text-base font-medium text-white bg-do-orange hover:bg-do-orange-dark rounded-xl transition-all shadow-[0_0_30px_rgba(249,115,22,0.25)] hover:shadow-[0_0_50px_rgba(249,115,22,0.4)] flex items-center gap-2"
						>
							Start Building Smarter
							<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
						</a>
						<a
							href="#use-cases"
							className="px-8 py-3.5 text-base font-medium text-do-text border border-do-border hover:border-do-border-accent rounded-xl transition-all hover:bg-do-bg-light/50"
						>
							See How Teams Use It
						</a>
					</motion.div>
				</div>

				{/* Sentient AI showcase — animated scheduled tasks */}
				<motion.div
					className="mt-16 max-w-3xl mx-auto"
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.85, duration: 0.6 }}
				>
					<div className="rounded-2xl border border-do-border bg-do-bg-card/80 backdrop-blur-sm overflow-hidden shadow-lg">
						<div className="px-5 py-3 border-b border-do-border flex items-center gap-3">
							<div className="h-7 w-7 rounded-lg bg-do-orange/10 flex items-center justify-center">
								<Bot className="h-4 w-4 text-do-orange" />
							</div>
							<span className="text-xs font-mono text-do-text-secondary uppercase tracking-wider">
								Your AI Agent — Always On
							</span>
							<div className="ml-auto flex items-center gap-1.5">
								<motion.div
									className="h-2 w-2 rounded-full bg-emerald-500"
									animate={{ opacity: [0.4, 1, 0.4] }}
									transition={{ duration: 2, repeat: Infinity }}
								/>
								<span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">Active</span>
							</div>
						</div>
						<div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
							{[
								{ icon: Mail, label: "Check project emails", time: "Every day, 8:00 AM", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10" },
								{ icon: FileUp, label: "Draft RFI responses", time: "Every day, 8:15 AM", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
								{ icon: CalendarClock, label: "Weekly progress report", time: "Every Monday, 9:00 AM", color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-500/10" },
								{ icon: Clock, label: "Submittal deadline tracker", time: "Every day, 7:00 AM", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
							].map((task, i) => (
								<motion.div
									key={task.label}
									className="flex items-center gap-3 px-3 py-3 rounded-xl bg-do-bg/60 border border-do-border/50"
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 1.0 + i * 0.12, duration: 0.4, type: "spring" }}
								>
									<div className={`h-9 w-9 rounded-lg ${task.bg} flex items-center justify-center shrink-0`}>
										<task.icon className={`h-4 w-4 ${task.color}`} />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-sm text-do-text font-medium truncate">{task.label}</p>
										<p className="text-[11px] text-do-text-muted font-mono">{task.time}</p>
									</div>
								</motion.div>
							))}
							{/* P.E. prep — spans full width */}
							<motion.div
								className="sm:col-span-2 flex items-center gap-3 px-3 py-3 rounded-xl bg-cyan-500/[0.04] border border-cyan-500/15"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 1.48, duration: 0.4, type: "spring" }}
							>
								<div className="h-9 w-9 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
									<Smartphone className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm text-do-text font-medium">Send me a P.E. prep question via SMS</p>
									<p className="text-[11px] text-do-text-muted font-mono">Every day, 6:00 AM</p>
								</div>
							</motion.div>
							{/* Featured complex task — spans full width */}
							<motion.div
								className="sm:col-span-2 flex items-start gap-3 px-3 py-3 rounded-xl bg-do-orange/[0.04] border border-do-orange/15"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 1.5, duration: 0.4, type: "spring" }}
							>
								<div className="h-9 w-9 rounded-lg bg-do-orange/10 flex items-center justify-center shrink-0 mt-0.5">
									<Video className="h-4 w-4 text-do-orange" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm text-do-text font-medium">Attend HVAC installation meeting</p>
									<p className="text-[11px] text-do-text-muted font-mono mb-1.5">Tomorrow, 8:00 AM</p>
									<div className="flex flex-col gap-1">
										{[
											"Join meeting & capture discussion notes",
											"Cross-check discussion against specs on Procore",
											"Send me findings with flagged discrepancies",
										].map((step, i) => (
											<motion.div
												key={i}
												className="flex items-center gap-1.5"
												initial={{ opacity: 0, x: -8 }}
												animate={{ opacity: 1, x: 0 }}
												transition={{ delay: 1.7 + i * 0.15 }}
											>
												<span className="h-1 w-1 rounded-full bg-do-orange/60 shrink-0" />
												<span className="text-[11px] text-do-text-secondary">{step}</span>
											</motion.div>
										))}
									</div>
								</div>
							</motion.div>
						</div>
					</div>
				</motion.div>

				{/* Stats strip */}
				<motion.div
					className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1.3 }}
				>
					{[
						{ value: "58%", label: "Doc Uploads", sub: "of sessions include files" },
						{ value: "8", label: "Use Cases", sub: "across construction workflows" },
						{ value: "50%+", label: "Calculations", sub: "involve formulas & data" },
						{ value: "30%+", label: "Code Review", sub: "technical doc analysis" },
					].map((stat) => (
						<div key={stat.label} className="text-center">
							<p className="text-3xl md:text-4xl font-bold text-do-text">{stat.value}</p>
							<p className="text-xs font-mono text-do-orange mt-1 uppercase tracking-wider">{stat.label}</p>
							<p className="text-[11px] text-do-text-muted mt-0.5">{stat.sub}</p>
						</div>
					))}
				</motion.div>
			</div>

			<div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-do-bg to-transparent" />
		</section>
	);
}
