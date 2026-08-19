"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Cpu, Landmark, ShieldCheck, InfinityIcon } from "lucide-react";
import { hardwareHref } from "./nav-data";

/* Homepage teaser for /hardware. Deliberately thin: three claims and a link.

   The full argument lives on the page, and duplicating it here would mean two
   copies of the spec numbers drifting apart the first time we change a part.
   The only numbers repeated are the two headline ones, which are also what
   somebody scanning the homepage is trying to find out. */

const claims = [
	{
		icon: ShieldCheck,
		title: "Nothing leaves the building",
		detail: "Drawings, contracts and daily logs read on your box, not a model vendor's.",
	},
	{
		icon: InfinityIcon,
		title: "Unlimited use for the office",
		detail: "One machine, one purchase order. Nobody rations what they ask it.",
	},
	{
		icon: Landmark,
		title: "Air-gapped for government",
		detail: "The whole system inside your perimeter, with no route to the internet.",
	},
];

export default function HardwareTeaser() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-80px" });

	return (
		<section className="relative py-24 md:py-28 overflow-hidden bg-do-bg-card border-y border-do-border">
			<div className="absolute inset-0 do-blueprint-grid pointer-events-none opacity-50" />
			<div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-do-orange/[0.04] rounded-full blur-[120px] pointer-events-none" />

			<div className="relative z-10 max-w-6xl mx-auto px-6" ref={ref}>
				<div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
					<motion.div
						className="flex-1"
						initial={{ opacity: 0, y: 24 }}
						animate={inView ? { opacity: 1, y: 0 } : {}}
						transition={{ duration: 0.6 }}
					>
						<span className="do-section-label text-do-orange inline-flex items-center gap-2">
							<Cpu className="h-3.5 w-3.5" />
							Run it on your own hardware
						</span>
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-do-text mt-4 tracking-tight leading-[1.1]">
							The same platform, on a box in your building.
						</h2>
						<p className="text-lg text-do-text-secondary leading-relaxed mt-5 max-w-xl">
							Machine, models and the construction.live harness delivered as one
							system, with DeepSeek V4 and Qwen3.8-27B already tuned on it. For
							contractors who want flat-cost unlimited use, and for public owners
							who can&apos;t send a drawing set anywhere at all.
						</p>

						<div className="flex flex-wrap items-center gap-3 mt-8">
							<a
								href={hardwareHref}
								className="group inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-white bg-do-orange hover:bg-do-orange-dark rounded-lg transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]"
							>
								See the hardware
								<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
							</a>
							<a
								href={`${hardwareHref}#government`}
								className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-do-text-secondary hover:text-do-text border border-do-border hover:border-do-border-accent rounded-lg transition-all"
							>
								For government
							</a>
						</div>
					</motion.div>

					<motion.div
						className="flex-1 w-full"
						initial={{ opacity: 0, x: 30 }}
						animate={inView ? { opacity: 1, x: 0 } : {}}
						transition={{ duration: 0.6, delay: 0.15 }}
					>
						<div className="rounded-2xl border border-do-border bg-do-bg overflow-hidden">
							<dl className="grid grid-cols-2 gap-px bg-do-border">
								{[
									{ value: "128 GB", label: "Unified memory" },
									{ value: "32 GB", label: "Dedicated GDDR6" },
								].map((stat) => (
									<div key={stat.label} className="bg-do-bg px-5 py-5">
										<dt className="text-2xl font-bold text-do-text tracking-tight">
											{stat.value}
										</dt>
										<dd className="text-xs text-do-text-secondary mt-1">{stat.label}</dd>
									</div>
								))}
							</dl>

							<div className="divide-y divide-do-border border-t border-do-border">
								{claims.map((claim, i) => (
									<motion.div
										key={claim.title}
										className="flex items-start gap-3.5 px-5 py-4"
										initial={{ opacity: 0, y: 12 }}
										animate={inView ? { opacity: 1, y: 0 } : {}}
										transition={{ delay: 0.35 + i * 0.1 }}
									>
										<div className="h-8 w-8 rounded-lg bg-do-orange/10 flex items-center justify-center shrink-0">
											<claim.icon className="h-4 w-4 text-do-orange" />
										</div>
										<div>
											<p className="text-sm font-semibold text-do-text">{claim.title}</p>
											<p className="text-[13px] text-do-text-secondary leading-relaxed mt-0.5">
												{claim.detail}
											</p>
										</div>
									</motion.div>
								))}
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
