"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { AlertTriangle, DollarSign, CloudRain, UserX, FileWarning, Wrench, Clock, MessageSquareWarning } from "lucide-react";

const capabilities = [
	{ icon: DollarSign, name: "Extra work not in contract", description: "AI flags every 'extra' the second it's spoken in the field", color: "emerald" },
	{ icon: AlertTriangle, name: "Unforeseen conditions", description: "Hidden utilities, soil surprises, undisclosed structure, documented day one", color: "amber" },
	{ icon: CloudRain, name: "Weather & schedule delays", description: "Wind, rain, heat, access issues, with quantified schedule impact", color: "cyan" },
	{ icon: UserX, name: "Subcontractor no-shows", description: "Missing trades, undermanned crews, late starts, back-charge ready", color: "violet" },
	{ icon: FileWarning, name: "Owner-supplied issues", description: "Late finishes, design changes, owner-direct decisions captured as said", color: "red" },
	{ icon: Wrench, name: "Coordination conflicts", description: "Trade stacking, RFI delays, sequencing disputes flagged automatically", color: "pink" },
	{ icon: Clock, name: "T&M hours & standby", description: "Every labor hour, every standby crew, timestamped as it happens", color: "blue" },
	{ icon: MessageSquareWarning, name: "Owner-directed changes", description: "Verbal direction in the field becomes written record with audio proof", color: "orange" },
];

const colorClasses: Record<string, { iconBg: string; iconText: string; border: string }> = {
	blue: { iconBg: "bg-blue-500/10", iconText: "text-blue-600 dark:text-blue-400", border: "border-blue-500/20" },
	red: { iconBg: "bg-red-500/10", iconText: "text-red-600 dark:text-red-400", border: "border-red-500/20" },
	cyan: { iconBg: "bg-cyan-500/10", iconText: "text-cyan-600 dark:text-cyan-400", border: "border-cyan-500/20" },
	emerald: { iconBg: "bg-emerald-500/10", iconText: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/20" },
	violet: { iconBg: "bg-violet-500/10", iconText: "text-violet-600 dark:text-violet-400", border: "border-violet-500/20" },
	amber: { iconBg: "bg-amber-500/10", iconText: "text-amber-600 dark:text-amber-400", border: "border-amber-500/20" },
	pink: { iconBg: "bg-pink-500/10", iconText: "text-pink-600 dark:text-pink-400", border: "border-pink-500/20" },
	orange: { iconBg: "bg-orange-500/10", iconText: "text-orange-600 dark:text-orange-400", border: "border-orange-500/20" },
};

export default function Systems() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-80px" });

	return (
		<section id="systems" className="relative py-32 overflow-hidden bg-do-bg">
			<div className="absolute inset-0 do-blueprint-grid pointer-events-none" />
			<div className="relative z-10 max-w-6xl mx-auto px-6" ref={ref}>
				<motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
					<span className="do-section-label text-do-orange">The money moments AI catches</span>
					<h2 className="text-4xl md:text-5xl font-bold text-do-text mt-4 mb-5">PMs Get Alerts the Same Day</h2>
					<p className="text-lg text-do-text-secondary max-w-2xl mx-auto text-balance">Eight categories that buried in old daily logs cost contractors $1M a year. Our AI flags them the moment they&apos;re mentioned in the field, not 30 days later in a pay-app meeting.</p>
				</motion.div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{capabilities.map((cap, i) => {
						const c = colorClasses[cap.color];
						return (
							<motion.div key={cap.name} className={`relative rounded-xl border ${c.border} bg-do-bg-card/80 backdrop-blur-sm p-5 hover:bg-do-bg-card transition-all group`} initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: i * 0.07, duration: 0.4, type: "spring", stiffness: 120 }}>
								<div className={`h-10 w-10 rounded-xl ${c.iconBg} border ${c.border} flex items-center justify-center mb-4`}>
									<cap.icon className={`h-5 w-5 ${c.iconText}`} />
								</div>
								<h3 className="text-sm font-semibold text-do-text mb-1.5">{cap.name}</h3>
								<p className="text-xs text-do-text-secondary leading-relaxed">{cap.description}</p>
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
