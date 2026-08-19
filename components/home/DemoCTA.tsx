"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Calendar, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import BookingLink from "@/components/BookingLink";
import { contactHref } from "@/components/home/nav-data";

const agenda = [
	"Where the paper trail breaks on your projects today",
	"What the AI would file, link and flag on one of your live jobs",
	"How a first project gets set up, in your templates, in days",
];

export default function DemoCTA() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-80px" });

	return (
		<section id="book-a-demo" className="relative py-24 md:py-32 overflow-hidden bg-do-bg" ref={ref}>
			<div className="absolute inset-0 do-blueprint-grid pointer-events-none" />
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-do-orange/[0.05] rounded-full blur-[150px]" />

			<div className="relative z-10 max-w-6xl mx-auto px-6">
				<div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
					{/* Closing pitch */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						animate={inView ? { opacity: 1, x: 0 } : {}}
						transition={{ duration: 0.6 }}
					>
						<span className="do-section-label text-do-orange">Book a demo</span>
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-do-text mt-4 mb-5 tracking-tight leading-[1.1]">
							Your next project builds its own paper trail.
						</h2>
						<p className="text-lg text-do-text-secondary leading-relaxed mb-8">
							Fifteen minutes, no deck. Bring one live job and we&apos;ll show you
							what the AI files, links and flags on it, and what that changes when
							the invoice goes out.
						</p>

						<div className="space-y-3.5">
							{agenda.map((item, i) => (
								<motion.div
									key={item}
									className="flex items-start gap-3"
									initial={{ opacity: 0, x: -10 }}
									animate={inView ? { opacity: 1, x: 0 } : {}}
									transition={{ delay: 0.25 + i * 0.1 }}
								>
									<CheckCircle2 className="h-5 w-5 text-do-orange shrink-0 mt-0.5" />
									<p className="text-[15px] text-do-text leading-relaxed">{item}</p>
								</motion.div>
							))}
						</div>
					</motion.div>

					{/* Booking card */}
					<motion.div
						className="rounded-3xl border border-do-orange/20 bg-do-bg-card/80 backdrop-blur-xl p-8 md:p-10"
						initial={{ opacity: 0, y: 30 }}
						animate={inView ? { opacity: 1, y: 0 } : {}}
						transition={{ duration: 0.6, delay: 0.2 }}
					>
						<div className="flex items-center gap-3 mb-6">
							<div className="h-12 w-12 rounded-xl bg-do-orange/10 border border-do-orange/20 flex items-center justify-center shrink-0">
								<Calendar className="h-5 w-5 text-do-orange" />
							</div>
							<div>
								<p className="do-section-label text-do-text-muted">Request a demo</p>
								<p className="text-base font-semibold text-do-text mt-0.5">
									Pick a time that works
								</p>
							</div>
						</div>

						<div className="space-y-2.5 mb-7">
							{[
								{ icon: Clock, label: "15 minutes, straight to your projects" },
								{ icon: CheckCircle2, label: "No deck, no sales pitch" },
								{ icon: CheckCircle2, label: "Demo runs with the founder" },
							].map((item) => (
								<div
									key={item.label}
									className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-do-bg/60 border border-do-border"
								>
									<item.icon className="h-4 w-4 text-do-orange shrink-0" />
									<span className="text-sm text-do-text-secondary">{item.label}</span>
								</div>
							))}
						</div>

						<BookingLink
							location="home_demo_cta"
							className="group w-full inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-white bg-do-orange hover:bg-do-orange-dark rounded-xl transition-all shadow-[0_0_40px_rgba(249,115,22,0.3)] hover:shadow-[0_0_60px_rgba(249,115,22,0.5)]"
						>
							<Calendar className="h-4 w-4" />
							Book a demo
							<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
						</BookingLink>

						<p className="mt-4 text-center text-xs text-do-text-muted">
							Not ready for a call?{" "}
							<a href={contactHref} className="text-do-orange hover:underline">
								Send us a message
							</a>
						</p>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
