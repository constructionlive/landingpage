"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
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
	ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface FeatureCard {
	icon: LucideIcon;
	title: string;
	description: string;
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

/* The eight tests from /resources/8-things-construction-ai-must-do, in the
   article's order, each linking to its own section.

   The grid above says what we built. This says why it had to be built that way
   — which is the question a buyer comparing us to a chat subscription is
   actually asking, and the one the homepage otherwise never answered. */
const MUST_DO = [
	{ label: "Understand the drawings", hash: "drawings" },
	{ label: "Work where the work is", hash: "field" },
	{ label: "Carry the authorization", hash: "authorization" },
	{ label: "Come with real support", hash: "support" },
	{ label: "Bend to your company", hash: "extensibility" },
	{ label: "Stay model-independent", hash: "models" },
	{ label: "Keep your knowledge yours", hash: "knowledge" },
	{ label: "Get itself adopted", hash: "adoption" },
];

const MUST_DO_HREF = "/resources/8-things-construction-ai-must-do";

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
							className="group rounded-2xl border border-do-border bg-do-bg-card/60 p-6 backdrop-blur-sm transition-all hover:-translate-y-1 hover:border-do-orange/40 hover:bg-do-orange/[0.04]"
							initial={{ opacity: 0, y: 25 }}
							animate={inView ? { opacity: 1, y: 0 } : {}}
							transition={{ delay: i * 0.07, duration: 0.5 }}
						>
							<div className="h-11 w-11 rounded-xl border border-do-border bg-do-bg-light flex items-center justify-center mb-4 transition-colors group-hover:border-do-orange/25 group-hover:bg-do-orange/15">
								<feature.icon className="h-5 w-5 text-do-text-secondary transition-colors group-hover:text-do-orange" />
							</div>
							<h3 className="text-base font-semibold text-do-text mb-2">{feature.title}</h3>
							<p className="text-sm text-do-text-secondary leading-relaxed">
								{feature.description}
							</p>
						</motion.div>
					))}
				</div>

				{/* Why it is one system, rather than another nine features. */}
				<motion.div
					className="mt-6 rounded-2xl border border-do-border bg-do-bg-card/60 p-6 backdrop-blur-sm sm:p-8"
					initial={{ opacity: 0, y: 25 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ delay: 0.35, duration: 0.5 }}
				>
					<div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-12">
						<div>
							<span className="do-section-label text-do-orange">Why it is built this way</span>
							<h3 className="mt-3 text-2xl font-bold tracking-tight text-do-text sm:text-[1.75rem] sm:leading-tight">
								8 things construction AI must do
							</h3>
							<p className="mt-3 text-[15px] leading-relaxed text-do-text-secondary">
								A chat subscription can draft an email about your project. It cannot
								measure a plan set, collect the daily record on site, route a
								submittal through the people who have to sign it, or remember what
								your company learned last job. Those are the eight tests we built
								against.
							</p>
							<Link
								href={MUST_DO_HREF}
								className="group mt-5 inline-flex items-center gap-2 text-sm font-medium text-do-orange hover:opacity-80"
							>
								Read the full argument
								<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
							</Link>
						</div>

						<ol className="grid gap-x-6 gap-y-px self-start overflow-hidden rounded-xl border border-do-border bg-do-border sm:grid-cols-2 sm:gap-x-px">
							{MUST_DO.map((item, i) => (
								<li key={item.hash}>
									<Link
										href={`${MUST_DO_HREF}#${item.hash}`}
										className="group flex h-full items-center gap-3 bg-do-bg px-4 py-3 transition-colors hover:bg-do-orange/[0.05]"
									>
										<span className="font-mono text-[11px] text-do-orange">
											{String(i + 1).padStart(2, "0")}
										</span>
										<span className="text-[13px] leading-snug text-do-text-secondary transition-colors group-hover:text-do-text">
											{item.label}
										</span>
									</Link>
								</li>
							))}
						</ol>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
