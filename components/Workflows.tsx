"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mic, Brain, ShieldCheck, ArrowDown } from "lucide-react";

const workflows = [
	{ icon: Mic, step: "01", title: "Tell us what happened", subtitle: "30 seconds, on site", description: "Walk the site. Talk to your phone. Or let our AI call you at end of shift. No forms, no app to fight with on a dirty jobsite phone, supers report the same way they call their office.", example: "Pouring Level 3 concrete today. Found unexpected rebar in the south footing, not on the drawings. Taking photos." },
	{ icon: Brain, step: "02", title: "AI catches the money moments", subtitle: "Same-day flags to PMs", description: "Construction-trained AI listens for the words that cost contractors money, extras, unforeseen conditions, weather delays, subcontractor no-shows. Flags them automatically and drafts the owner notification. PMs see them the same day, not 30 days later in pay-app review.", example: "Auto-flagged: Unforeseen condition (rebar). Drafting owner notification + change order packet." },
	{ icon: ShieldCheck, step: "03", title: "One click to approve", subtitle: "Pay apps, change orders, T&M", description: "Pay applications ship with auto-assembled backup packages instead of a PM digging through a month of emails. Change orders come with day-one documentation owners can't dispute. T&M tickets ship with hour-by-hour proof. You review, you approve, the platform sends.", example: "Pay app #6 submitted with full backup attached. Change order #12 packet assembled from day-one rebar documentation." },
];

export default function Workflows() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-80px" });

	return (
		<section id="workflows" className="relative py-32 overflow-hidden bg-do-bg-card">
			<div className="absolute inset-0 do-blueprint-grid-dense pointer-events-none" />
			<div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-do-orange/[0.03] rounded-full blur-[100px]" />

			<div className="relative z-10 max-w-5xl mx-auto px-6" ref={ref}>
				<motion.div className="text-center mb-20" initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
					<span className="do-section-label text-do-orange">How it works</span>
					<h2 className="text-4xl md:text-5xl font-bold text-do-text mt-4 mb-5">The field-to-payment platform you can talk to</h2>
					<p className="text-lg text-do-text-secondary max-w-2xl mx-auto text-balance">Three steps from a 30-second voice note to an approved pay app. No forms. No training. Built for how supers and PMs actually work.</p>
				</motion.div>

				<div className="relative">
					<div className="absolute left-[39px] top-8 bottom-8 w-px bg-gradient-to-b from-do-orange/40 via-do-orange/20 to-transparent hidden md:block" />
					<div className="space-y-6">
						{workflows.map((wf, i) => (
							<motion.div key={wf.step} className="relative" initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: i * 0.15, duration: 0.5 }}>
								<div className="flex gap-6 items-start">
									<div className="hidden md:flex flex-col items-center shrink-0">
										<div className="h-[78px] w-[78px] rounded-2xl bg-do-bg border border-do-border flex items-center justify-center relative z-10">
											<div className="h-14 w-14 rounded-xl bg-do-orange/10 border border-do-orange/20 flex items-center justify-center">
												<wf.icon className="h-6 w-6 text-do-orange" />
											</div>
										</div>
										{i < workflows.length - 1 && <ArrowDown className="h-4 w-4 text-do-orange/30 mt-2" />}
									</div>
									<div className="flex-1 rounded-2xl border border-do-border bg-do-bg/80 backdrop-blur-sm p-6 hover:border-do-border-accent transition-all">
										<div className="flex items-start justify-between mb-3">
											<div>
												<div className="flex items-center gap-3 mb-1">
													<span className="text-xs font-mono font-bold text-do-orange">STEP {wf.step}</span>
													<span className="text-[10px] font-mono text-do-text-muted px-2 py-0.5 rounded-full bg-do-bg-light border border-do-border">{wf.subtitle}</span>
												</div>
												<h3 className="text-xl font-semibold text-do-text">{wf.title}</h3>
											</div>
										</div>
										<p className="text-sm text-do-text-secondary leading-relaxed mb-4">{wf.description}</p>
										<div className="rounded-lg bg-do-bg-light/80 border border-do-border px-4 py-3">
											<p className="text-[10px] font-mono text-do-text-muted uppercase tracking-wider mb-1">Example</p>
											<p className="text-sm text-do-text/80 italic">{wf.example}</p>
										</div>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
