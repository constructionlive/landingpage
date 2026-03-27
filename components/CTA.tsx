"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Shield, Zap, Clock } from "lucide-react";
import WaitlistForm from "./WaitlistForm";

export default function CTA() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-80px" });

	return (
		<section className="relative py-32 overflow-hidden bg-do-bg-card" ref={ref}>
			<div className="absolute inset-0 do-blueprint-grid-dense pointer-events-none" />
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-do-orange/[0.04] rounded-full blur-[150px]" />

			<div className="relative z-10 max-w-4xl mx-auto px-6">
				<motion.div className="rounded-3xl border border-do-orange/20 bg-do-bg/80 backdrop-blur-xl p-10 md:p-16 text-center" initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }}>
					<motion.div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-do-orange/10 border border-do-orange/20 mb-6" initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 0.2 }}>
						<span className="h-1.5 w-1.5 rounded-full bg-do-orange animate-glow-pulse" />
						<span className="text-xs font-mono text-do-orange uppercase tracking-wider">Built for professionals</span>
					</motion.div>

					<h2 className="text-3xl md:text-5xl font-bold text-do-text mb-5 text-balance">
						Your Buildings Deserve
						<br />
						<span className="bg-gradient-to-r from-do-orange via-orange-400 to-amber-400 bg-clip-text text-transparent">Expert-Level Intelligence</span>
					</h2>

					<p className="text-lg text-do-text-secondary max-w-xl mx-auto mb-10 text-balance">
						Join the construction teams who are already building faster, analyzing deeper, and delivering better results with AI that never sleeps.
					</p>

					<motion.div className="flex flex-col items-center gap-6 mb-10" initial={{ opacity: 0, y: 15 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.4 }}>
						<div className="relative w-full flex justify-center">
							<WaitlistForm />
						</div>
						<a href="https://app.construction.live" className="group px-8 py-4 text-base font-medium text-white bg-do-orange hover:bg-do-orange-dark rounded-xl transition-all shadow-[0_0_40px_rgba(249,115,22,0.3)] hover:shadow-[0_0_60px_rgba(249,115,22,0.5)] flex items-center gap-2">
							Get Started Free
							<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
						</a>
					</motion.div>

					<div className="flex flex-wrap items-center justify-center gap-6 text-sm text-do-text-secondary">
						<div className="flex items-center gap-2"><Clock className="h-4 w-4 text-do-orange" /><span>Setup in minutes</span></div>
						<div className="flex items-center gap-2"><Shield className="h-4 w-4 text-do-orange" /><span>Enterprise-grade security</span></div>
						<div className="flex items-center gap-2"><Zap className="h-4 w-4 text-do-orange" /><span>AI that never sleeps</span></div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
