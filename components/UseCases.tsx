"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
	Mic,
	AlertTriangle,
	Receipt,
	Clock,
	CloudRain,
	UserX,
	Camera,
	PhoneCall,
} from "lucide-react";

/* ── Animated blueprint building background ────────────────────────── */

const FloorRow = ({ y, windowY, windowCount, width, x, delay }: {
	y: number; windowY: number; windowCount: number; width: number; x: number; delay: number;
}) => (
	<motion.g
		animate={{ opacity: 1, y: 0 }}
		initial={{ opacity: 0, y: 8 }}
		transition={{ duration: 0.6, delay, ease: "easeOut" }}
	>
		<line stroke="currentColor" strokeWidth="0.6" x1={x} x2={x + width} y1={y} y2={y} />
		{Array.from({ length: windowCount }).map((_, i) => {
			const gap = width / (windowCount + 1);
			const wx = x + gap * (i + 1) - 4;
			return (
				<motion.rect key={i} animate={{ opacity: 1 }} height="10" initial={{ opacity: 0 }} transition={{ duration: 0.3, delay: delay + 0.15 + i * 0.05 }} width="8" x={wx} y={windowY} />
			);
		})}
	</motion.g>
);

const Crane = ({ baseX, baseY, delay }: { baseX: number; baseY: number; delay: number }) => (
	<motion.g animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: -6 }} transition={{ duration: 0.8, delay }}>
		<line stroke="currentColor" strokeWidth="1" x1={baseX} x2={baseX} y1={baseY} y2={baseY - 40} />
		<motion.line animate={{ x2: baseX + 55 }} initial={{ x2: baseX }} stroke="currentColor" strokeWidth="0.8" transition={{ duration: 1.2, delay: delay + 0.4 }} x1={baseX - 15} y1={baseY - 40} y2={baseY - 40} />
		<line stroke="currentColor" strokeWidth="0.8" x1={baseX} x2={baseX - 15} y1={baseY - 40} y2={baseY - 40} />
		<motion.g animate={{ y: [0, 6, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: delay + 1.5 }}>
			<line stroke="currentColor" strokeDasharray="2 1" strokeWidth="0.5" x1={baseX + 40} x2={baseX + 40} y1={baseY - 40} y2={baseY - 22} />
			<rect fill="none" height="4" stroke="currentColor" strokeWidth="0.6" width="6" x={baseX + 37} y={baseY - 22} />
		</motion.g>
	</motion.g>
);

const DriftingCloud = ({ y, delay, duration, startX }: { y: number; delay: number; duration: number; startX: number }) => (
	<motion.g animate={{ x: startX + 60 }} initial={{ x: startX }} transition={{ duration, delay, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}>
		<g transform={`translate(0,${y})`}>
			<ellipse cx="0" cy="0" fill="none" rx="12" ry="4" stroke="currentColor" strokeWidth="0.35" />
			<ellipse cx="-7" cy="1" fill="none" rx="6" ry="3" stroke="currentColor" strokeWidth="0.3" />
			<ellipse cx="8" cy="1" fill="none" rx="7" ry="3" stroke="currentColor" strokeWidth="0.3" />
		</g>
	</motion.g>
);

function BlueprintBuilding() {
	const groundY = 200;
	const mainX = 140; const mainW = 130;
	const leftX = 45; const leftW = 85;
	const rightX = 280; const rightW = 80;

	const mainFloors = [
		{ floorY: groundY - 22, windows: 5, delay: 0.2 }, { floorY: groundY - 44, windows: 5, delay: 0.6 },
		{ floorY: groundY - 66, windows: 5, delay: 1.0 }, { floorY: groundY - 88, windows: 5, delay: 1.4 },
		{ floorY: groundY - 110, windows: 5, delay: 1.8 }, { floorY: groundY - 130, windows: 5, delay: 2.2 },
	];
	const leftFloors = [
		{ floorY: groundY - 20, windows: 3, delay: 0.4 }, { floorY: groundY - 40, windows: 3, delay: 0.8 },
		{ floorY: groundY - 60, windows: 3, delay: 1.2 }, { floorY: groundY - 78, windows: 3, delay: 1.6 },
	];
	const rightFloors = [
		{ floorY: groundY - 22, windows: 3, delay: 0.5 }, { floorY: groundY - 44, windows: 3, delay: 0.9 },
		{ floorY: groundY - 66, windows: 3, delay: 1.3 }, { floorY: groundY - 85, windows: 3, delay: 1.7 },
	];

	return (
		<svg className="absolute bottom-0 left-[10%] w-[80%] h-[40%]" preserveAspectRatio="xMidYMax meet" viewBox="0 0 420 220">
			<g className="text-do-text-muted" fill="none" stroke="currentColor">
				<motion.line animate={{ pathLength: 1 }} initial={{ pathLength: 0 }} strokeWidth="1.2" transition={{ duration: 1 }} x1="10" x2="410" y1={groundY} y2={groundY} />
				<motion.line animate={{ y1: groundY - 130 }} initial={{ y1: groundY }} strokeWidth="0.8" transition={{ duration: 2.4, delay: 0.2 }} x1={mainX} x2={mainX} y2={groundY} />
				<motion.line animate={{ y1: groundY - 130 }} initial={{ y1: groundY }} strokeWidth="0.8" transition={{ duration: 2.4, delay: 0.2 }} x1={mainX + mainW} x2={mainX + mainW} y2={groundY} />
				<motion.line animate={{ y1: groundY - 78 }} initial={{ y1: groundY }} strokeWidth="0.8" transition={{ duration: 1.8, delay: 0.4 }} x1={leftX} x2={leftX} y2={groundY} />
				<motion.line animate={{ y1: groundY - 78 }} initial={{ y1: groundY }} strokeWidth="0.8" transition={{ duration: 1.8, delay: 0.4 }} x1={leftX + leftW} x2={leftX + leftW} y2={groundY} />
				<motion.line animate={{ y1: groundY - 85 }} initial={{ y1: groundY }} strokeWidth="0.8" transition={{ duration: 2.0, delay: 0.5 }} x1={rightX} x2={rightX} y2={groundY} />
				<motion.line animate={{ y1: groundY - 85 }} initial={{ y1: groundY }} strokeWidth="0.8" transition={{ duration: 2.0, delay: 0.5 }} x1={rightX + rightW} x2={rightX + rightW} y2={groundY} />
				{mainFloors.map((f, i) => <FloorRow key={`m-${i}`} delay={f.delay} width={mainW} windowCount={f.windows} windowY={f.floorY + 5} x={mainX} y={f.floorY} />)}
				{leftFloors.map((f, i) => <FloorRow key={`l-${i}`} delay={f.delay} width={leftW} windowCount={f.windows} windowY={f.floorY + 4} x={leftX} y={f.floorY} />)}
				{rightFloors.map((f, i) => <FloorRow key={`r-${i}`} delay={f.delay} width={rightW} windowCount={f.windows} windowY={f.floorY + 5} x={rightX} y={f.floorY} />)}
				<motion.line animate={{ opacity: 1 }} initial={{ opacity: 0 }} strokeWidth="1.2" transition={{ delay: 2.4 }} x1={mainX} x2={mainX + mainW} y1={groundY - 130} y2={groundY - 130} />
				<motion.line animate={{ opacity: 1 }} initial={{ opacity: 0 }} strokeWidth="1" transition={{ delay: 1.8 }} x1={leftX} x2={leftX + leftW} y1={groundY - 78} y2={groundY - 78} />
				<motion.line animate={{ opacity: 1 }} initial={{ opacity: 0 }} strokeWidth="1" transition={{ delay: 2.0 }} x1={rightX} x2={rightX + rightW} y1={groundY - 85} y2={groundY - 85} />
				<motion.rect animate={{ opacity: 1 }} fill="none" height="18" initial={{ opacity: 0 }} rx="1" strokeWidth="0.8" transition={{ delay: 0.3 }} width="14" x={mainX + mainW / 2 - 7} y={groundY - 18} />
				<Crane baseX={mainX + mainW / 2 + 10} baseY={groundY - 130} delay={2.6} />
				<DriftingCloud delay={0} duration={30} startX={30} y={22} />
				<DriftingCloud delay={2} duration={35} startX={320} y={12} />
			</g>
		</svg>
	);
}

/* ── Use case data ─────────────────────────────────────────────────── */

const useCases = [
	{
		icon: Mic,
		title: "Unified Daily Reports",
		color: "blue",
		description: "Voice notes, photos, integration data, and AI call summaries, unified into one daily log. Superintendents talk for 30 seconds, drop a photo, or get a call from our AI. Everything routes to the same timestamped record.",
		example: "Pouring Level 3 concrete today. Found unexpected rebar in the south footing. Taking photos.",
		tags: ["Multi-input", "30 sec updates", "Same-day logs"],
	},
	{
		icon: AlertTriangle,
		title: "Change Order Capture",
		color: "amber",
		description: "AI flags every 'extra work' moment the second it's spoken, unforeseen conditions, scope creep, owner-directed changes. PMs get a draft notification ready to send before the day is over.",
		example: "We won a $150K change order last month because we documented the unexpected rebar from day one.",
		tags: ["Day-one proof", "Auto-drafted", "Owner-ready"],
	},
	{
		icon: Receipt,
		title: "Bulletproof Pay Applications",
		color: "emerald",
		description: "Every pay app ships with a complete backup package, timestamped voice logs, geotagged photos, quantified scope, daily progress. Owners stop disputing. Pay cycles drop from 45 days to 7.",
		example: "Our pay apps used to take 45 days. Now they're approved in a week. Cash flow is completely different.",
		tags: ["7-day cycles", "Full backup", "First-try approval"],
	},
	{
		icon: Clock,
		title: "T&M That Doesn't Get Disputed",
		color: "violet",
		description: "Every outlet, every condition, every labor hour tracked as it happens, not reconstructed from memory three weeks later. When owners push back on T&M tickets, you have the proof, hour by hour.",
		example: "Full $41K invoice paid. Zero pushback. Every hour was timestamped with photos.",
		tags: ["Hour-by-hour", "Timestamped", "Zero pushback"],
	},
	{
		icon: AlertTriangle,
		title: "Unforeseen Conditions Log",
		color: "red",
		description: "Soil conditions, hidden utilities, structural surprises, owner-supplied material issues. AI catches the words contractors say but rarely document, and builds the day-by-day record you need to win the claim.",
		example: "Our super documented unexpected soil conditions daily. When the owner pushed back, we had 3 days of logs with photos. Approved same week.",
		tags: ["Differing site conditions", "Day-by-day", "Claim-ready"],
	},
	{
		icon: CloudRain,
		title: "Weather & Delay Documentation",
		color: "cyan",
		description: "Weather delays, schedule impacts, access issues, and standby crews, captured live from the field with timestamps. Schedule extension requests now come with proof, not memory.",
		example: "Site shut down for 4 hours, wind gusts over 40 mph, crane down. Two crews on standby.",
		tags: ["Schedule impacts", "Standby tracking", "Extension proof"],
	},
	{
		icon: UserX,
		title: "Subcontractor No-Shows",
		color: "pink",
		description: "Missed crews, undermanned trades, and trade-stacking conflicts logged the moment they happen. Back-charges, delay claims, and coordination disputes get the documentation they need.",
		example: "Electrical sub showed up at 10:30, supposed to be on site at 7. Two of our crews waiting. Coordination meeting needed.",
		tags: ["Back-charges", "Manpower tracking", "Coordination proof"],
	},
	{
		icon: PhoneCall,
		title: "AI Calls the Field for You",
		color: "orange",
		description: "End of shift? AI calls your supers and asks for their report. Missed a log day? AI follows up. Reporting stops depending on whether someone remembered to open the app, because the app calls them.",
		example: "End-of-day check-in for the Tower B project. Quick summary of pours, any issues, any extras?",
		tags: ["Outbound calls", "Reminder follow-ups", "Zero missed days"],
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

/* ── Component ─────────────────────────────────────────────────────── */

export default function UseCases() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-100px" });

	return (
		<section id="use-cases" className="relative py-32 overflow-hidden bg-do-bg">
			{/* Blueprint building background */}
			<div className="absolute inset-0 pointer-events-none select-none" style={{ opacity: "var(--do-blueprint-opacity)" }} aria-hidden="true">
				<div className="absolute top-[8%] left-[5%] font-mono text-[10px] text-do-text-muted tracking-widest uppercase rotate-[-2deg]">
					<div className="border-l-2 border-dashed border-do-text-muted/60 pl-2.5 py-1">
						<p>Section A-1</p>
						<p className="text-[8px] mt-0.5">Floor plan, Level 01</p>
					</div>
				</div>
				<div className="absolute top-[6%] right-[8%] font-mono text-[9px] text-do-text-muted tracking-wider">
					<div className="flex items-center gap-2">
						<div className="h-px w-10 bg-do-text-muted/50" />
						<span>REV. 03</span>
					</div>
				</div>
				<svg className="absolute top-[14%] left-[3%] w-[94%] h-8">
					<line stroke="currentColor" className="text-do-text-muted" strokeDasharray="4 3" strokeWidth="0.8" x1="0" x2="100%" y1="14" y2="14" />
					<line stroke="currentColor" className="text-do-text-muted" strokeWidth="0.8" x1="0" x2="0" y1="6" y2="22" />
					<line stroke="currentColor" className="text-do-text-muted" strokeWidth="0.8" x1="100%" x2="100%" y1="6" y2="22" />
				</svg>
				<div className="absolute bottom-[3%] left-[5%] font-mono text-[8px] text-do-text-muted border border-do-text-muted/30 px-3 py-1.5">
					<p className="tracking-widest">DWG: A-101</p>
					<p className="text-[7px] mt-0.5 tracking-wider">CONSTRUCTION.LIVE</p>
				</div>
				<BlueprintBuilding />
			</div>

			<div className="absolute inset-0 do-blueprint-grid pointer-events-none" />

			<div className="relative z-10 max-w-3xl mx-auto px-6" ref={ref}>
				<motion.div
					className="text-center mb-16"
					initial={{ opacity: 0, y: 30 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6 }}
				>
					<span className="do-section-label text-do-orange">Three ways you get paid faster</span>
					<h2 className="text-4xl md:text-5xl font-bold text-do-text mt-4 mb-5">
						8 Money Moments We Catch Automatically
					</h2>
					<p className="text-lg text-do-text-secondary max-w-2xl mx-auto text-balance">
						Voice notes, photos, AI calls, and integrations, unified into one
						defensible record. Here&apos;s what happens between &ldquo;something
						changed on site&rdquo; and &ldquo;the change order got approved.&rdquo;
					</p>
				</motion.div>

				{/* Single column with generous spacing */}
				<div className="flex flex-col gap-6">
					{useCases.map((uc, i) => {
						const c = colorMap[uc.color];
						return (
							<motion.div
								key={uc.title}
								className={`group relative rounded-2xl border ${c.border} bg-do-bg-card/80 backdrop-blur-sm p-8 lg:p-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
								initial={{ opacity: 0, y: 30 }}
								animate={inView ? { opacity: 1, y: 0 } : {}}
								transition={{ delay: i * 0.06, duration: 0.5, type: "spring", stiffness: 100 }}
							>
								<div className="flex items-start gap-5">
									{/* Icon */}
									<div className={`h-12 w-12 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center shrink-0`}>
										<uc.icon className={`h-6 w-6 ${c.text}`} />
									</div>

									<div className="flex-1 min-w-0">
										{/* Title */}
										<h3 className="text-xl font-semibold text-do-text mb-3">
											{uc.title}
										</h3>

										{/* Description */}
										<p className="text-[15px] text-do-text-secondary leading-relaxed mb-5">
											{uc.description}
										</p>

										{/* Example quote */}
										<div className="rounded-lg bg-do-bg/80 dark:bg-do-bg/50 border border-do-border px-5 py-4 mb-5">
											<p className="text-[10px] font-mono text-do-text-muted mb-1.5 uppercase tracking-wider">
												What gets said in the field
											</p>
											<p className="text-sm text-do-text/80 italic leading-relaxed">
												&ldquo;{uc.example}&rdquo;
											</p>
										</div>

										{/* Tags */}
										<div className="flex flex-wrap gap-2">
											{uc.tags.map((tag) => (
												<span
													key={tag}
													className={`px-3 py-1.5 rounded-lg text-xs font-mono ${c.tagBg} ${c.text} border ${c.border}`}
												>
													{tag}
												</span>
											))}
										</div>
									</div>
								</div>
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
