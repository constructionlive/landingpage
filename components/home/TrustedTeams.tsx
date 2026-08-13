"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const partners = [
	{ name: "Procore", subtitle: "Project management" },
	{ name: "Autodesk", subtitle: "Construction Cloud" },
	{ name: "Fieldwire", subtitle: "Field management" },
	{ name: "Microsoft 365", subtitle: "Email + calendar" },
	{ name: "QuickBooks", subtitle: "Accounting" },
];

const clients = [
	{ name: "First Light", subtitle: " " },
	{ name: "Pano Concrete Inc", subtitle: "" },
	{ name: "Sierra West", subtitle: "" },
	{ name: "Setu Projects", subtitle: "" },
	{ name: "Build Scale", subtitle: "" },
];

export default function TrustedTeams() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-40px" });

	return (
		<section
			ref={ref}
			className="relative py-12 md:py-16 border-y border-do-border bg-do-bg-card/40 overflow-hidden"
		>
			<div className="absolute inset-0 do-blueprint-grid pointer-events-none opacity-50" />

			<div className="relative z-10 max-w-6xl mx-auto px-6">
				<motion.p
					className="text-center text-xs font-mono text-do-text-muted uppercase tracking-[0.2em] mb-8"
					initial={{ opacity: 0, y: 10 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.5 }}
				>
					Trusted by teams building construction projects
				</motion.p>

				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
					{clients.map((partner, i) => (
						<motion.div
							key={partner.name}
							className="group flex flex-col items-center justify-center text-center rounded-xl border border-do-border bg-do-bg/40 px-3 py-5 hover:border-do-border-accent transition-colors"
							initial={{ opacity: 0, y: 15 }}
							animate={inView ? { opacity: 1, y: 0 } : {}}
							transition={{ delay: i * 0.08, duration: 0.4 }}
						>
							{/* <p className="text-base md:text-lg font-semibold text-do-text tracking-tight">
								{partner.name}
							</p> */}
							<p className="text-base font-mono text-do-text mt-0.5">
								{partner.name}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
