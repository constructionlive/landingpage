"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
	Mail,
	HardHat,
	FileText,
	ClipboardList,
	Layers,
	CheckCircle2,
	GitBranch,
	Calendar,
	Receipt,
} from "lucide-react";

const inputs = [
	{ icon: Mail, label: "Email", detail: "Threads, attachments, approvals" },
	{ icon: HardHat, label: "Field", detail: "Voice notes, photos, daily logs" },
	{ icon: FileText, label: "Documents", detail: "Drawings, submittals, RFIs" },
	{ icon: ClipboardList, label: "Reports", detail: "Schedules, invoices, T&M" },
];

const linked = [
	{ icon: GitBranch, label: "Drawing rev 6" },
	{ icon: Calendar, label: "Schedule rev 3" },
	{ icon: Receipt, label: "Invoice #114" },
];

const benefits = [
	{
		title: "AI does the filing",
		detail: "Submittals and documents prepared in your company's own templates",
	},
	{
		title: "AI keeps track, so you don't",
		detail: "Every deadline, response and open item followed up",
	},
	{
		title: "AI catches what doesn't add up",
		detail: "Mismatched invoices, orders and missed days flagged",
	},
	{
		title: "No work goes unpaid",
		detail: "Every job carries its proof",
	},
	{
		title: "Never carry someone else's delay",
		detail: "Flagged and evidenced the day it happens",
	},
];

function ConnectedRecordDiagram({ inView }: { inView: boolean }) {
	return (
		<div className="rounded-2xl border border-do-border bg-do-bg-card/80 backdrop-blur-sm shadow-xl overflow-hidden">
			<div className="flex items-center gap-3 px-5 py-3 border-b border-do-border">
				<div className="h-7 w-7 rounded-lg bg-do-orange/10 flex items-center justify-center">
					<Layers className="h-4 w-4 text-do-orange" />
				</div>
				<span className="text-xs font-mono text-do-text-secondary uppercase tracking-wider">
					Tower B, one connected record
				</span>
				<div className="ml-auto flex items-center gap-1.5">
					<motion.div
						className="h-2 w-2 rounded-full bg-emerald-500"
						animate={{ opacity: [0.4, 1, 0.4] }}
						transition={{ duration: 2, repeat: Infinity }}
					/>
					<span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">Linking</span>
				</div>
			</div>

			<div className="p-5">
				{/* Scattered inputs */}
				<div className="grid grid-cols-2 gap-2">
					{inputs.map((input, i) => (
						<motion.div
							key={input.label}
							className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-do-bg/50 border border-do-border/60"
							initial={{ opacity: 0, y: -12 }}
							animate={inView ? { opacity: 1, y: 0 } : {}}
							transition={{ delay: i * 0.12, duration: 0.4, type: "spring" }}
						>
							<div className="h-8 w-8 rounded-lg bg-do-bg-light border border-do-border flex items-center justify-center shrink-0">
								<input.icon className="h-4 w-4 text-do-text-secondary" />
							</div>
							<div className="min-w-0">
								<p className="text-xs font-medium text-do-text">{input.label}</p>
								<p className="text-[10px] text-do-text-muted truncate">{input.detail}</p>
							</div>
						</motion.div>
					))}
				</div>

				{/* Converging lines */}
				<div className="relative h-14">
					{/* viewBox units, path data can't take percentages. Stretched to the
					    container width, with a non-scaling stroke so it stays hairline. */}
					<svg
						className="absolute inset-0 w-full h-full"
						viewBox="0 0 400 56"
						preserveAspectRatio="none"
					>
						{[100, 168, 232, 300].map((x, i) => (
							<motion.path
								key={x}
								d={`M ${x} 0 C ${x} 34, 200 22, 200 56`}
								fill="none"
								stroke="#f97316"
								strokeWidth="1"
								strokeDasharray="4 3"
								vectorEffect="non-scaling-stroke"
								className="opacity-40"
								initial={{ pathLength: 0 }}
								animate={inView ? { pathLength: 1 } : {}}
								transition={{ delay: 0.5 + i * 0.1, duration: 0.7 }}
							/>
						))}
					</svg>
					<motion.div
						className="absolute left-1/2 -translate-x-1/2 bottom-0 h-1.5 w-1.5 rounded-full bg-do-orange"
						animate={{ opacity: [0.3, 1, 0.3] }}
						transition={{ duration: 2, repeat: Infinity }}
					/>
				</div>

				{/* The record */}
				<motion.div
					className="rounded-xl border border-do-orange/20 bg-do-orange/[0.05] p-4"
					initial={{ opacity: 0, y: 16 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ delay: 1, duration: 0.5, type: "spring" }}
				>
					<p className="text-[10px] font-mono text-do-orange uppercase tracking-wider mb-2">
						Project record, built as you build
					</p>
					<p className="text-sm text-do-text leading-relaxed mb-3">
						Level 3 pour, unexpected rebar in the south footing. Filed to Tower B,
						linked to the revision and schedule behind it.
					</p>
					<div className="flex flex-wrap gap-1.5">
						{linked.map((item, i) => (
							<motion.span
								key={item.label}
								className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-do-bg/70 border border-do-border text-[11px] text-do-text-secondary"
								initial={{ opacity: 0, scale: 0.9 }}
								animate={inView ? { opacity: 1, scale: 1 } : {}}
								transition={{ delay: 1.25 + i * 0.12 }}
							>
								<item.icon className="h-3 w-3 text-do-orange" />
								{item.label}
							</motion.span>
						))}
					</div>
				</motion.div>
			</div>
		</div>
	);
}

export default function PlatformOverview() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-80px" });

	return (
		<section id="platform" className="relative py-24 md:py-32 overflow-hidden bg-do-bg">
			<div className="absolute inset-0 do-blueprint-grid pointer-events-none opacity-60" />
			<div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-do-orange/[0.04] rounded-full blur-[120px]" />

			<div className="relative z-10 max-w-6xl mx-auto px-6" ref={ref}>
				<motion.div
					className="max-w-2xl mb-14"
					initial={{ opacity: 0, y: 30 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6 }}
				>
					<span className="do-section-label text-do-orange">Meet the platform</span>
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-do-text mt-4 tracking-tight leading-[1.1]">
						One connected record for everything on your project.
					</h2>
				</motion.div>

				<div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
					<motion.div
						className="flex-1 w-full"
						initial={{ opacity: 0, x: -30 }}
						animate={inView ? { opacity: 1, x: 0 } : {}}
						transition={{ duration: 0.6, delay: 0.1 }}
					>
						<ConnectedRecordDiagram inView={inView} />
					</motion.div>

					<motion.div
						className="flex-1"
						initial={{ opacity: 0, x: 30 }}
						animate={inView ? { opacity: 1, x: 0 } : {}}
						transition={{ duration: 0.6, delay: 0.2 }}
					>
						<p className="text-lg text-do-text-secondary leading-relaxed mb-8">
							AI agents read everything coming off your project, file it, link it,
							and keep track, so one connected record gets created itself while you build.
						</p>

						<div className="space-y-4">
							{benefits.map((benefit, i) => (
								<motion.div
									key={benefit.title}
									className="flex items-start gap-3"
									initial={{ opacity: 0, y: 12 }}
									animate={inView ? { opacity: 1, y: 0 } : {}}
									transition={{ delay: 0.35 + i * 0.09 }}
								>
									<CheckCircle2 className="h-5 w-5 text-do-orange shrink-0 mt-0.5" />
									<p className="text-[15px] leading-relaxed">
										<span className="font-semibold text-do-text">{benefit.title}</span>
										<span className="text-do-text-secondary">, {benefit.detail}</span>
									</p>
								</motion.div>
							))}
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
