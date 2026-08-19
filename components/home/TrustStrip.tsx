"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, ShieldCheck, WifiOff, Server, FileLock2 } from "lucide-react";
import { securityHref } from "./nav-data";

/* Homepage trust strip.

   Deliberately splits into two rows, and the split is the point. The top row is
   what holds architecturally — a customer can confirm all three themselves. The
   bottom row is certifications we are pursuing but do not yet have, and it says
   "in progress" in the markup rather than in a footnote nobody reads.

   Printing "CSA STAR" and "CyberSecure Canada" as bare badges here would be a
   false claim, and a security reviewer checking the CSA registry catches it in
   about two minutes. Status stays attached to the name everywhere it appears.
   When either completes, move it into `verifiable` framing on /security first —
   this component reads the honest list, not a marketing one. */

const verifiable = [
	{ icon: WifiOff, label: "No network path off the box" },
	{ icon: Server, label: "Inference on your hardware" },
	{ icon: FileLock2, label: "Open weights, on your disks" },
];

const pursuing = ["CSA STAR Level 1", "CyberSecure Canada"];

export default function TrustStrip() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-80px" });

	return (
		<section className="relative py-16 md:py-20 overflow-hidden bg-do-bg">
			<div className="absolute inset-0 do-blueprint-grid pointer-events-none opacity-40" />

			<div className="relative z-10 max-w-6xl mx-auto px-6" ref={ref}>
				<motion.div
					className="rounded-2xl border border-do-border bg-do-bg-card p-7 md:p-9"
					initial={{ opacity: 0, y: 24 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6 }}
				>
					<div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
						<div className="lg:w-72 shrink-0">
							<span className="do-section-label text-do-orange inline-flex items-center gap-2">
								<ShieldCheck className="h-3.5 w-3.5" />
								Security
							</span>
							<h2 className="text-xl md:text-2xl font-bold text-do-text mt-3 tracking-tight leading-tight">
								Claims you can check yourself.
							</h2>
						</div>

						<div className="flex-1 min-w-0">
							<div className="grid sm:grid-cols-3 gap-4">
								{verifiable.map((item, i) => (
									<motion.div
										key={item.label}
										className="flex items-start gap-2.5"
										initial={{ opacity: 0, y: 12 }}
										animate={inView ? { opacity: 1, y: 0 } : {}}
										transition={{ delay: 0.2 + i * 0.08 }}
									>
										<item.icon className="h-4 w-4 text-do-orange shrink-0 mt-0.5" />
										<span className="text-[14px] text-do-text-secondary leading-snug">
											{item.label}
										</span>
									</motion.div>
								))}
							</div>

							<div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-6 pt-5 border-t border-do-border">
								<span className="text-[10px] font-mono text-do-text-muted uppercase tracking-wider">
									Certification in progress
								</span>
								{pursuing.map((name) => (
									<span
										key={name}
										className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-do-border-accent bg-do-bg text-[12px] text-do-text-secondary"
									>
										<span className="h-1.5 w-1.5 rounded-full bg-do-text-muted" />
										{name}
									</span>
								))}
								<a
									href={securityHref}
									className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-do-orange hover:underline ml-auto"
								>
									Full security posture
									<ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
								</a>
							</div>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
