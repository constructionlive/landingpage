"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Calendar, CheckCircle2 } from "lucide-react";

const CALENDAR_URL = "https://calendar.app.google/Eb7GFYUJNLDof5oz6";

const agenda = [
	"Where you're losing margin today, disputed pay apps, denied change orders, T&M pushback",
	"What 30 days of voice-first field reporting would change for your specific projects",
	"A walkthrough of how we'd run a 90-day pilot at your business, no commitment, just the math",
];

export default function CTA() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-80px" });

	return (
		<section className="relative py-32 overflow-hidden bg-do-bg-card" ref={ref}>
			<div className="absolute inset-0 do-blueprint-grid-dense pointer-events-none" />
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-do-orange/[0.04] rounded-full blur-[150px]" />

			<div className="relative z-10 max-w-5xl mx-auto px-6">
				<motion.div
					className="rounded-3xl border border-do-orange/20 bg-do-bg/80 backdrop-blur-xl p-8 md:p-14"
					initial={{ opacity: 0, y: 30 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.7 }}
				>
					<div className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-start">
						{/* Left, pitch + agenda (3 cols) */}
						<div className="lg:col-span-3">
							<motion.div
								className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-do-orange/10 border border-do-orange/20 mb-6"
								initial={{ opacity: 0, scale: 0.9 }}
								animate={inView ? { opacity: 1, scale: 1 } : {}}
								transition={{ delay: 0.2 }}
							>
								<span className="h-1.5 w-1.5 rounded-full bg-do-orange animate-glow-pulse" />
								<span className="text-xs font-mono text-do-orange uppercase tracking-wider">
									Book a 15-minute demo
								</span>
							</motion.div>

							<h2 className="text-3xl md:text-5xl font-bold text-do-text mb-5 tracking-tight leading-[1.05]">
								Win one $50K change order.
								<br />
								<span className="bg-gradient-to-r from-do-orange via-orange-400 to-amber-400 bg-clip-text text-transparent">
									The platform pays for itself.
								</span>
							</h2>

							<p className="text-base md:text-lg text-do-text-secondary mb-8 leading-relaxed">
								15 minutes. No deck. No sales pitch. We&apos;ll ask about your
								current projects and show you exactly how we&apos;d protect those
								margins.
							</p>

							{/* Agenda */}
							<div className="space-y-3 mb-8">
								<p className="text-xs font-mono text-do-text-muted uppercase tracking-wider">
									What we&apos;ll cover
								</p>
								{agenda.map((item, i) => (
									<motion.div
										key={i}
										className="flex items-start gap-3"
										initial={{ opacity: 0, x: -10 }}
										animate={inView ? { opacity: 1, x: 0 } : {}}
										transition={{ delay: 0.3 + i * 0.1 }}
									>
										<CheckCircle2 className="h-5 w-5 text-do-orange shrink-0 mt-0.5" />
										<p className="text-sm md:text-[15px] text-do-text leading-relaxed">
											{item}
										</p>
									</motion.div>
								))}
							</div>

							{/* CTAs */}
							<motion.div
								className="flex flex-col sm:flex-row gap-3"
								initial={{ opacity: 0, y: 15 }}
								animate={inView ? { opacity: 1, y: 0 } : {}}
								transition={{ delay: 0.6 }}
							>
								<a
									href={CALENDAR_URL}
									target="_blank"
									rel="noopener noreferrer"
									className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 text-base font-medium text-white bg-do-orange hover:bg-do-orange-dark rounded-xl transition-all shadow-[0_0_30px_rgba(249,115,22,0.3)] hover:shadow-[0_0_50px_rgba(249,115,22,0.5)]"
								>
									<Calendar className="h-4 w-4" />
									Book a 15-Min Demo
									<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
								</a>
							</motion.div>
						</div>

						{/* Right, founder card (2 cols) */}
						<motion.div
							className="lg:col-span-2"
							initial={{ opacity: 0, y: 20 }}
							animate={inView ? { opacity: 1, y: 0 } : {}}
							transition={{ delay: 0.4, duration: 0.5 }}
						>
							<div className="rounded-2xl border border-do-border bg-do-bg-card/80 backdrop-blur-sm p-7 text-center">
								<p className="text-[10px] font-mono text-do-text-muted uppercase tracking-wider mb-5">
									Demo with the founder
								</p>

								<div className="relative h-24 w-24 rounded-full mx-auto mb-5 overflow-hidden border-2 border-do-orange/30 shadow-[0_0_30px_rgba(249,115,22,0.15)]">
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										src="/profile.jpg"
										alt="Rahul Vaishnav, founder of construction.live"
										className="h-full w-full object-cover"
										loading="lazy"
									/>
								</div>

								<h3 className="text-lg font-semibold text-do-text mb-1">
									Rahul Vaishnav
								</h3>
								<p className="text-sm text-do-orange font-medium mb-4">
									Founder, construction.live
								</p>
								<p className="text-xs text-do-text-secondary leading-relaxed mb-5">
									10+ years across construction and AI. Has been on the losing
									side of enough change-order disputes to know what the
									documentation gap costs.
								</p>

								<div className="pt-5 border-t border-do-border space-y-2">
									<div className="flex items-center justify-center gap-2 text-xs text-do-text-secondary">
										<CheckCircle2 className="h-3.5 w-3.5 text-do-orange" />
										<span>No deck, no sales pitch</span>
									</div>
									<div className="flex items-center justify-center gap-2 text-xs text-do-text-secondary">
										<CheckCircle2 className="h-3.5 w-3.5 text-do-orange" />
										<span>Built for small &amp; mid-size commercial</span>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
