"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
	Layers,
	GitBranch,
	ShieldAlert,
	Smartphone,
	Users,
	Ruler,
	Mail,
	BarChart3,
	Search,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface FeatureCard {
	icon: LucideIcon;
	title: string;
	description: string;
	featured?: boolean;
}

/* Ordered the way the story runs: the connected platform first, then revision
   tracking, delays, field app, subcontractor management, takeoff and finance,
   then the rest. */
const features: FeatureCard[] = [
	{
		icon: Layers,
		title: "One Connected Platform",
		description:
			"Field app, email and your team all feed one place. Every record, submittals, permits, equipment, finance, in context and connected.",
		featured: true,
	},
	{
		icon: GitBranch,
		title: "Revision Tracking",
		description:
			"The whole chain, linked: a daily log tied to schedule rev 3, on drawing rev 6.",
	},
	{
		icon: ShieldAlert,
		title: "Delay Flagging & Claims",
		description: "Flags delays as they happen and builds the paper trail for claims.",
	},
	{
		icon: Smartphone,
		title: "Field App, Capture",
		description: "Daily logs by voice, chat, or photo, online or off, no forms.",
	},
	{
		icon: Users,
		title: "Subcontractor Management",
		description: "Subs bid, you level them, correspondence stays tracked.",
	},
	{
		icon: Ruler,
		title: "Takeoff, Estimates & Finance Diary",
		description:
			"Takeoff assistance and estimate automation, plus a finance diary for the job.",
	},
	{
		icon: Mail,
		title: "Email Management",
		description: "Connects your email and brings it all into one context.",
	},
	{
		icon: BarChart3,
		title: "Report Generator",
		description: "Any report from your records, our templates or yours.",
	},
	{
		icon: Search,
		title: "Document Search",
		description: "Drawings, schedules and docs at your fingertips, platform or field.",
	},
];

export default function FeatureGrid() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-80px" });

	return (
		<section id="features" className="relative py-24 md:py-32 overflow-hidden bg-do-bg">
			<div className="absolute inset-0 do-blueprint-grid pointer-events-none" />
			<div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-do-orange/[0.03] rounded-full blur-[100px]" />

			<div className="relative z-10 max-w-6xl mx-auto px-6" ref={ref}>
				<motion.div
					className="text-center mb-14"
					initial={{ opacity: 0, y: 30 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6 }}
				>
					<span className="do-section-label text-do-orange">Everything in the platform</span>
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-do-text mt-4 mb-5 tracking-tight">
						Built as one system, not nine tools
					</h2>
					{/* <p className="text-lg text-do-text-secondary max-w-2xl mx-auto text-balance">
						Each capability writes to the same record, so the paper trail is a
						by-product of the work instead of a job someone has to do after it.
					</p> */}
				</motion.div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
					{features.map((feature, i) => (
						<motion.div
							key={feature.title}
							className={`group rounded-2xl border p-6 backdrop-blur-sm transition-all hover:-translate-y-1 ${
								feature.featured
									? "border-do-orange/25 bg-do-orange/[0.04] hover:border-do-orange/40"
									: "border-do-border bg-do-bg-card/60 hover:border-do-border-accent"
							}`}
							initial={{ opacity: 0, y: 25 }}
							animate={inView ? { opacity: 1, y: 0 } : {}}
							transition={{ delay: i * 0.07, duration: 0.5 }}
						>
							<div
								className={`h-11 w-11 rounded-xl border flex items-center justify-center mb-4 ${
									feature.featured
										? "bg-do-orange/15 border-do-orange/25"
										: "bg-do-bg-light border-do-border"
								}`}
							>
								<feature.icon
									className={`h-5 w-5 ${feature.featured ? "text-do-orange" : "text-do-text-secondary group-hover:text-do-orange transition-colors"}`}
								/>
							</div>
							<h3 className="text-base font-semibold text-do-text mb-2">{feature.title}</h3>
							<p className="text-sm text-do-text-secondary leading-relaxed">
								{feature.description}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
