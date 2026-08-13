"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { HardHat, Building2, ClipboardList, Users, CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Persona {
	key: string;
	icon: LucideIcon;
	headline: string;
	problem: string;
	wins: string[];
}

const personas: Persona[] = [
	{
		key: "Subcontractor",
		icon: HardHat,
		headline: "Small back office, everything riding on getting paid right.",
		problem:
			"Subs don't have a GC's back office, yet getting paid right depends on a paper trail of everything. One platform for all of it, no extra headcount.",
		wins: [
			"One paper trail, emails, logs, meetings, site events",
			"T&M and billing backed by evidence, paid faster",
			"Delay and not-ready events flagged for claims",
			"Bid and respond from email, no extra headcount",
		],
	},
	{
		key: "General Contractor",
		icon: Building2,
		headline: "Every RFI, invoice and change order, reconciled, not just received.",
		problem:
			"RFIs, invoices and bids pour in from subs. An invoice that doesn't match its RFI, a change order that doesn't match the drawing, easy to miss, flagged automatically.",
		wins: [
			"Invoice to RFI mismatches flagged automatically",
			"Change order to drawing update mismatches caught",
			"Bid leveling across subcontractors",
			"Emails auto-linked to schedule, submittal, RFI, budget",
		],
	},
	{
		key: "Project Manager",
		icon: ClipboardList,
		headline: "The paperwork never stops, and it all lands on one person.",
		problem:
			"Hundreds of submittals across Excel tabs, daily logs, a report to the GC every day, and every schedule revision to merge and redistribute. Miss one email and the repercussions are real.",
		wins: [
			"Daily logs to reports, generated and sent automatically",
			"Submittals tracked in one place, not 100 tabs",
			"Schedule revisions merged and distributed for you",
			"AI email tracking so nothing slips through",
		],
	},
	{
		key: "Site Super",
		icon: Users,
		headline: "Do the hard work all day, then still have forms to fill out.",
		problem:
			"Carry printed drawings, work tough conditions all day, then still fill out forms and send them in, or the paycheck's at risk.",
		wins: [
			"A field app as simple as sending a WhatsApp message",
			"Just talk, audio recorded and transcribed automatically",
			"No forms to fill, no physical copies to track",
			"Reports generated for them, sent to their manager",
		],
	},
];

export default function Personas() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-80px" });
	const [activeKey, setActiveKey] = useState(personas[0].key);
	const active = personas.find((p) => p.key === activeKey) ?? personas[0];

	/* Cycle through the roles on its own until someone picks one, then leave it alone. */
	const [picked, setPicked] = useState(false);

	useEffect(() => {
		if (picked || !inView) return;
		const id = setInterval(() => {
			setActiveKey((current) => {
				const next = personas.findIndex((p) => p.key === current) + 1;
				return personas[next % personas.length].key;
			});
		}, 4000);
		return () => clearInterval(id);
	}, [picked, inView]);

	return (
		<section id="who-its-for" className="relative py-24 md:py-32 overflow-hidden bg-do-bg-card">
			<div className="absolute inset-0 do-blueprint-grid-dense pointer-events-none" />
			<div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-do-orange/[0.03] rounded-full blur-[100px]" />

			<div className="relative z-10 max-w-6xl mx-auto px-6" ref={ref}>
				<motion.div
					className="text-center mb-12"
					initial={{ opacity: 0, y: 30 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6 }}
				>
					<span className="do-section-label text-do-orange">Who is it for</span>
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-do-text mt-4 mb-5 tracking-tight">
						Commercial GCs & Subcontractors
					</h2>
					<p className="text-lg text-do-text-secondary max-w-2xl mx-auto text-balance">
						construction.live provides unified field intelligence for the $2M-50M commercial GC and the electrical, mechanical, and specialty subcontractors.
						
					</p>
				</motion.div>

				{/* Role tabs */}
				<motion.div
					className="flex flex-wrap justify-center gap-2.5 mb-10"
					initial={{ opacity: 0, y: 20 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ delay: 0.2, duration: 0.5 }}
				>
					{personas.map((persona) => {
						const isActive = persona.key === activeKey;
						return (
							<button
								key={persona.key}
								type="button"
								onClick={() => {
									setPicked(true);
									setActiveKey(persona.key);
								}}
								className={`relative flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-medium transition-colors ${
									isActive
										? "border-do-orange/40 text-do-orange bg-do-orange/[0.07]"
										: "border-do-border text-do-text-secondary hover:text-do-text hover:border-do-border-accent bg-do-bg/60"
								}`}
							>
								<persona.icon className="h-4 w-4" />
								{persona.key}
								{isActive && (
									<motion.span
										layoutId="persona-pill"
										className="absolute inset-0 rounded-full border border-do-orange/40"
										transition={{ type: "spring", stiffness: 320, damping: 30 }}
									/>
								)}
							</button>
						);
					})}
				</motion.div>

				{/* Active persona panel */}
				<motion.div
					className="rounded-2xl border border-do-border bg-do-bg/80 backdrop-blur-sm overflow-hidden"
					initial={{ opacity: 0, y: 25 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ delay: 0.3, duration: 0.6 }}
				>
					<AnimatePresence mode="wait">
						<motion.div
							key={active.key}
							initial={{ opacity: 0, y: 14, filter: "blur(4px)" }}
							animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
							exit={{ opacity: 0, y: -14, filter: "blur(4px)" }}
							transition={{ duration: 0.3 }}
							className="grid md:grid-cols-2"
						>
							<div className="p-7 md:p-10">
								<div className="flex items-center gap-3 mb-5">
									<div className="h-11 w-11 rounded-xl bg-do-orange/10 border border-do-orange/20 flex items-center justify-center">
										<active.icon className="h-5 w-5 text-do-orange" />
									</div>
									<span className="do-section-label text-do-text-muted">{active.key}</span>
								</div>
								<h3 className="text-xl md:text-2xl font-bold text-do-text leading-snug mb-4">
									{active.headline}
								</h3>
								<p className="text-[15px] text-do-text-secondary leading-relaxed">
									{active.problem}
								</p>
							</div>

							<div className="p-7 md:p-10 border-t md:border-t-0 md:border-l border-do-border bg-do-bg-card/60">
								<p className="text-sm font-semibold text-do-text mb-5">
									With construction.live:
								</p>
								<div className="space-y-3.5">
									{active.wins.map((win, i) => (
										<motion.div
											key={win}
											className="flex items-start gap-3"
											initial={{ opacity: 0, x: -10 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: i * 0.08 }}
										>
											<CheckCircle2 className="h-[18px] w-[18px] text-do-orange shrink-0 mt-0.5" />
											<p className="text-[15px] text-do-text leading-relaxed">{win}</p>
										</motion.div>
									))}
								</div>
							</div>
						</motion.div>
					</AnimatePresence>
				</motion.div>
			</div>
		</section>
	);
}
