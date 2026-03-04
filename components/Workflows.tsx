"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Upload, Search, Lightbulb, FileOutput, ArrowDown } from "lucide-react";

const workflows = [
	{ icon: Upload, step: "01", title: "Upload & Analyze", subtitle: "Most common pattern", description: "Upload project documents — specs, drawings, contracts, submittals, field reports. The AI parses everything and builds a working understanding of your project context.", example: "Upload a 200-page specification and ask: \"What are the key structural requirements in Division 03?\"" },
	{ icon: Search, step: "02", title: "Ask & Understand", subtitle: "Exploration workflow", description: "Ask questions about your documents, compare sections across files, or get the AI to explain complex technical requirements in plain language. Great for onboarding new team members to a project.", example: "Compare the mechanical schedule in the drawings against what's specified in Section 23 00 00" },
	{ icon: Lightbulb, step: "03", title: "Calculate & Solve", subtitle: "Engineering workflow", description: "Run quantities, generate formulas, convert units, and get engineering calculations validated. From material takeoffs to load calculations — fast and accurate.", example: "How many linear feet of 4-inch DWV pipe do I need based on these floor plans?" },
	{ icon: FileOutput, step: "04", title: "Generate & Deliver", subtitle: "Output workflow", description: "Transform your analysis into professional deliverables — reports, proposals, bid comparisons, RFI responses, and client presentations. From raw data to polished output.", example: "Generate a bid levelling summary comparing these three mechanical sub-bids" },
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
					<span className="do-section-label text-do-orange">Real workflows</span>
					<h2 className="text-4xl md:text-5xl font-bold text-do-text mt-4 mb-5">How the Work Gets Done</h2>
					<p className="text-lg text-do-text-secondary max-w-2xl mx-auto text-balance">Four patterns that define how construction teams work with construction.live every day.</p>
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
