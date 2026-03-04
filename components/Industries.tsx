"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Building2, Factory, HardHat, Landmark, ShoppingBag, Home } from "lucide-react";

const industries = [
	{ icon: Building2, name: "Commercial Construction", border: "border-blue-500/20", iconColor: "text-blue-600 dark:text-blue-400", iconBg: "bg-blue-500/10", description: "Office towers, mixed-use developments, tenant fit-outs, and commercial renovations" },
	{ icon: Factory, name: "Industrial & Manufacturing", border: "border-amber-500/20", iconColor: "text-amber-600 dark:text-amber-400", iconBg: "bg-amber-500/10", description: "Process facilities, warehouses, distribution centers, and plant expansions" },
	{ icon: Landmark, name: "Institutional & Government", border: "border-violet-500/20", iconColor: "text-violet-600 dark:text-violet-400", iconBg: "bg-violet-500/10", description: "Schools, hospitals, government buildings, and public infrastructure" },
	{ icon: HardHat, name: "Heavy Civil & Infrastructure", border: "border-emerald-500/20", iconColor: "text-emerald-600 dark:text-emerald-400", iconBg: "bg-emerald-500/10", description: "Roads, bridges, utilities, site development, and municipal projects" },
	{ icon: Home, name: "Residential & Multi-Family", border: "border-pink-500/20", iconColor: "text-pink-600 dark:text-pink-400", iconBg: "bg-pink-500/10", description: "Custom homes, condo developments, townhouse complexes, and renovations" },
	{ icon: ShoppingBag, name: "Retail & Hospitality", border: "border-cyan-500/20", iconColor: "text-cyan-600 dark:text-cyan-400", iconBg: "bg-cyan-500/10", description: "Retail build-outs, restaurants, hotels, and entertainment venues" },
];

export default function Industries() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-80px" });

	return (
		<section id="industries" className="relative py-32 overflow-hidden bg-do-bg-card">
			<div className="absolute inset-0 do-blueprint-grid-dense pointer-events-none" />
			<div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] bg-do-orange/[0.03] rounded-full blur-[100px]" />

			<div className="relative z-10 max-w-6xl mx-auto px-6" ref={ref}>
				<motion.div className="text-center mb-16" initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
					<span className="do-section-label text-do-orange">Industry verticals</span>
					<h2 className="text-4xl md:text-5xl font-bold text-do-text mt-4 mb-5">Built for Every Sector</h2>
					<p className="text-lg text-do-text-secondary max-w-2xl mx-auto text-balance">Whether you&apos;re building high-rises or highways, construction.live adapts to your project type with AI that understands your domain.</p>
				</motion.div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
					{industries.map((ind, i) => (
						<motion.div key={ind.name} className={`group relative rounded-2xl border ${ind.border} bg-do-bg/80 backdrop-blur-sm p-6 hover:bg-do-bg transition-all hover:-translate-y-1`} initial={{ opacity: 0, y: 25 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1, duration: 0.5 }}>
							<div className={`h-11 w-11 rounded-xl ${ind.iconBg} border ${ind.border} flex items-center justify-center mb-4`}>
								<ind.icon className={`h-5 w-5 ${ind.iconColor}`} />
							</div>
							<h3 className="text-base font-semibold text-do-text mb-2">{ind.name}</h3>
							<p className="text-sm text-do-text-secondary leading-relaxed">{ind.description}</p>
						</motion.div>
					))}
				</div>

				<motion.div className="mt-12 rounded-2xl border border-do-orange/20 bg-do-orange/[0.04] p-6 md:p-8" initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.7 }}>
					<div className="flex flex-col md:flex-row items-start md:items-center gap-4">
						<div className="h-12 w-12 rounded-xl bg-do-orange/10 border border-do-orange/20 flex items-center justify-center shrink-0">
							<svg viewBox="0 0 24 24" className="h-6 w-6 text-do-orange" fill="none" stroke="currentColor" strokeWidth={1.5}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
							</svg>
						</div>
						<div>
							<p className="text-sm font-semibold text-do-orange font-mono uppercase tracking-wider mb-1">Domain-Aware AI</p>
							<p className="text-do-text">construction.live doesn&apos;t just process text — it understands construction context. Upload a spec and it knows the difference between a structural section and a mechanical schedule. Ask about code compliance and it references the right jurisdiction.</p>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
