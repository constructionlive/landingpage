"use client";

import { motion } from "framer-motion";
import {
	HardHat,
	Mic,
	AlertTriangle,
	Camera,
	ClipboardCheck,
	FileText,
	DollarSign,
} from "lucide-react";

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
							Unified field intelligence platform
						</span>
					</motion.div>

					<motion.h1
						className="font-bold tracking-tight mb-6"
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.35, duration: 0.7 }}
					>
						<span className="block pb-1 bg-gradient-to-r from-do-orange via-orange-400 to-amber-400 bg-clip-text text-transparent text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.02] text-balance">
							Failing to get on top of a project's paper work?
						</span>
						<span className="block mt-2 sm:mt-3 text-do-text text-2xl sm:text-3xl md:text-4xl lg:text-5xl leading-[1.15] text-balance">
							Save yourself with our AI project management!
						</span>
					</motion.h1>

					<motion.p
						className="text-lg sm:text-xl text-do-text-secondary max-w-2xl mx-auto mb-4 text-balance leading-relaxed"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.55 }}
					>
						Construction.live AI reads every email, voice note, document revision and photo that comes off your project, files it against the right job, links it to the drawing revision and schedule behind it, and flags the mismatches.
					</motion.p>

					<motion.p
						className="text-sm sm:text-base text-do-text-muted max-w-xl mx-auto mb-10 text-balance"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.65 }}
					>
						Creating your paper trail in real time with AI while you build.
					</motion.p>

					<motion.div
						className="flex flex-col items-center justify-center gap-5"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.7 }}
					>
						<a
							href="/book"
							className="group px-8 py-3.5 text-base font-medium text-white bg-do-orange hover:bg-do-orange-dark rounded-xl transition-all shadow-[0_0_30px_rgba(249,115,22,0.25)] hover:shadow-[0_0_50px_rgba(249,115,22,0.4)] flex items-center gap-2"
						>
							Book a Demo
						</a>
						{/* <a
							href="#how-it-works"
							className="text-sm text-do-text-secondary hover:text-do-text underline underline-offset-4 decoration-do-border hover:decoration-do-text-secondary transition-colors"
						>
							See how it protects margins
						</a> */}
					</motion.div>

					{/* Removed until attributable: "Helping contractors protect $50M+ in annual billings" */}
				</div>

				{/* Unified field intelligence showcase */}
				{/* <motion.div
					className="mt-16 max-w-3xl mx-auto"
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.85, duration: 0.6 }}
				>
					<div className="rounded-2xl border border-do-border bg-do-bg-card/80 backdrop-blur-sm overflow-hidden shadow-lg">
						<div className="px-5 py-3 border-b border-do-border flex items-center gap-3">
							<div className="h-7 w-7 rounded-lg bg-do-orange/10 flex items-center justify-center">
								<Mic className="h-4 w-4 text-do-orange" />
							</div>
							<span className="text-xs font-mono text-do-text-secondary uppercase tracking-wider">
								Unified intelligence, Tower B, 8:47 AM
							</span>
							<div className="ml-auto flex items-center gap-1.5">
								<motion.div
									className="h-2 w-2 rounded-full bg-emerald-500"
									animate={{ opacity: [0.4, 1, 0.4] }}
									transition={{ duration: 2, repeat: Infinity }}
								/>
								<span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">Documenting</span>
							</div>
						</div>

				
						<div className="px-5 py-4 border-b border-do-border bg-do-bg/40">
							<div className="flex items-start gap-3">
								<div className="h-9 w-9 rounded-full bg-do-bg border border-do-border flex items-center justify-center shrink-0">
									<HardHat className="h-4 w-4 text-do-text-secondary" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-[11px] font-mono text-do-text-muted mb-1">
										Mike, Superintendent, 0:28
									</p>
									<p className="text-sm text-do-text leading-relaxed italic">
										&ldquo;Pouring Level 3 concrete today. Found unexpected rebar in
										the south footing, not on the drawings. Taking photos. Crew
										stopped for 45 minutes while we figured it out.&rdquo;
									</p>
								</div>
							</div>
						</div>

				
						<div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
							{[
								{ icon: AlertTriangle, label: "Unforeseen conditions flagged", time: "Unexpected rebar, not in contract", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
								{ icon: DollarSign, label: "Change order candidate", time: "Owner notification drafted", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
								{ icon: Camera, label: "Photos geotagged", time: "3 photos, south footing, 8:47 AM", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10" },
								{ icon: ClipboardCheck, label: "Daily log entry created", time: "Logged, Level 3 concrete pour", color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-500/10" },
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
										<p className="text-[11px] text-do-text-muted truncate">{task.time}</p>
									</div>
								</motion.div>
							))}

					
							<motion.div
								className="sm:col-span-2 flex items-start gap-3 px-3 py-3 rounded-xl bg-do-orange/[0.04] border border-do-orange/15"
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 1.5, duration: 0.4, type: "spring" }}
							>
								<div className="h-9 w-9 rounded-lg bg-do-orange/10 flex items-center justify-center shrink-0 mt-0.5">
									<FileText className="h-4 w-4 text-do-orange" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm text-do-text font-medium">Pay app backup package, auto-assembled</p>
									<p className="text-[11px] text-do-text-muted font-mono mb-1.5">Ready in 90 seconds</p>
									<div className="flex flex-col gap-1">
										{[
											"Timestamped voice log + transcript",
											"4 geotagged photos linked to scope items",
											"Quantified delay: 45 min + change-order packet",
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
				</motion.div> */}

				{/* Stats strip, hidden until we have real customer numbers to attribute.
				    Restore with attribution (e.g. "across N pilot contractors, 2026").
				<motion.div
					className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1.3 }}
				>
					{[
						{ value: "30 sec", label: "Per Update", sub: "not 15 minutes typing" },
						{ value: "7 days", label: "Pay Apps", sub: "approved (was 45)" },
						{ value: "$150K", label: "Change Order", sub: "won with day-one proof" },
						{ value: "$1M+", label: "Protected", sub: "annually per contractor" },
					].map((stat) => (
						<div key={stat.label} className="text-center">
							<p className="text-3xl md:text-4xl font-bold text-do-text">{stat.value}</p>
							<p className="text-xs font-mono text-do-orange mt-1 uppercase tracking-wider">{stat.label}</p>
							<p className="text-[11px] text-do-text-muted mt-0.5">{stat.sub}</p>
						</div>
					))}
				</motion.div>
				*/}
			</div>

			<div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-do-bg to-transparent" />
		</section>
	);
}
