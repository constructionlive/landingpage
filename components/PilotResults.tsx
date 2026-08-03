"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { TrendingUp, TrendingDown, Clock, Target } from "lucide-react";

const results = [
	{
		icon: TrendingUp,
		value: "$1.2M",
		label: "Margin protected",
		description: "Average per-contractor revenue defended across a 90-day pilot, pay apps approved, change orders won, T&M paid in full.",
		color: "emerald",
	},
	{
		icon: TrendingDown,
		value: "38 days",
		label: "Pay app cycle drop",
		description: "From an industry-standard 45-day pay-app cycle to 7 days with auto-assembled backup. Cash flow returns within the first month.",
		color: "blue",
	},
	{
		icon: Target,
		value: "92%",
		label: "Change orders won",
		description: "Day-one documentation flips the dispute math. Up from an industry-typical 40-60% win rate to 92% across pilot contractors.",
		color: "amber",
	},
	{
		icon: Clock,
		value: "97%",
		label: "Daily-log adoption",
		description: "AI outbound calls + 30-second voice notes drive same-day reporting that typed daily-log apps could never get. Up from ~30%.",
		color: "violet",
	},
];

const colorMap: Record<string, { bg: string; text: string; border: string }> = {
	emerald: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/20" },
	blue: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/20" },
	amber: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/20" },
	violet: { bg: "bg-violet-500/10", text: "text-violet-600 dark:text-violet-400", border: "border-violet-500/20" },
};

export default function PilotResults() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-80px" });

	return (
		<section ref={ref} className="relative py-24 md:py-32 overflow-hidden bg-do-bg">
			<div className="absolute inset-0 do-blueprint-grid pointer-events-none" />
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-do-orange/[0.04] rounded-full blur-[120px]" />

			<div className="relative z-10 max-w-6xl mx-auto px-6">
				<motion.div
					className="text-center mb-16"
					initial={{ opacity: 0, y: 30 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6 }}
				>
					<span className="do-section-label text-do-orange">90-day pilot results</span>
					<h2 className="text-4xl md:text-5xl font-bold text-do-text mt-4 mb-5">
						construction.live works for your team, not the owners&apos; legal team.
					</h2>
					<p className="text-lg text-do-text-secondary max-w-2xl mx-auto text-balance">
						Real outcomes from small and mid-size commercial contractors who ran a
						90-day pilot. Pay apps approved faster, change orders won at higher
						rates, T&amp;M paid in full.
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
					{results.map((r, i) => {
						const c = colorMap[r.color];
						return (
							<motion.div
								key={r.label}
								className={`group relative rounded-2xl border ${c.border} bg-do-bg-card/80 backdrop-blur-sm p-7 md:p-8 transition-all hover:-translate-y-0.5 hover:shadow-lg`}
								initial={{ opacity: 0, y: 25 }}
								animate={inView ? { opacity: 1, y: 0 } : {}}
								transition={{ delay: i * 0.08, duration: 0.5 }}
							>
								<div className="flex items-start gap-5">
									<div className={`h-12 w-12 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center shrink-0`}>
										<r.icon className={`h-6 w-6 ${c.text}`} />
									</div>
									<div className="flex-1 min-w-0">
										<p className="text-4xl md:text-5xl font-bold text-do-text leading-none mb-2">
											{r.value}
										</p>
										<p className={`text-xs font-mono uppercase tracking-wider ${c.text} mb-3`}>
											{r.label}
										</p>
										<p className="text-sm text-do-text-secondary leading-relaxed">
											{r.description}
										</p>
									</div>
								</div>
							</motion.div>
						);
					})}
				</div>

				<motion.p
					className="mt-10 text-center text-xs font-mono text-do-text-muted uppercase tracking-wider"
					initial={{ opacity: 0 }}
					animate={inView ? { opacity: 1 } : {}}
					transition={{ delay: 0.5 }}
				>
					Across $5M–$100M commercial GCs and the subs they hire
				</motion.p>
			</div>
		</section>
	);
}
