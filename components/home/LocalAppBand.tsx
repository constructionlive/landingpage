"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Apple, ArrowRight, WifiOff, Lock, Wallet } from "lucide-react";
import { localHref } from "./nav-data";

/* The free Mac app, placed straight after the tool comparisons.

   That is the point on the page where someone is weighing us against Copilot,
   Claude or Procore — and the strongest answer to "which of these is worth my
   time" is that one of them costs nothing and runs tonight. It catches the
   reader who will never book a call.

   It links to /local rather than firing the 629 MB download from here. The
   button on this page cannot state the version, size and Apple Silicon
   requirement, and starting a two-thirds-of-a-gigabyte download on someone who
   has not been told any of that is a bad first impression of the product. */
const POINTS = [
	{ icon: Lock, label: "Nothing sent to a model vendor" },
	{ icon: WifiOff, label: "Works with the Wi-Fi down" },
	{ icon: Wallet, label: "Free, no account" },
];

export default function LocalAppBand() {
	return (
		<section
			id="local-app"
			className="relative scroll-mt-24 overflow-hidden border-t border-do-border bg-do-bg py-20 md:py-24"
		>
			<div className="do-blueprint-grid pointer-events-none absolute inset-0" />
			<div className="pointer-events-none absolute left-0 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-do-orange/[0.04] blur-[120px]" />

			<div className="relative z-10 mx-auto max-w-6xl px-6">
				<div className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] md:gap-14">
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-80px" }}
						transition={{ duration: 0.5 }}
					>
						<span className="do-section-label text-do-orange">Free desktop app</span>
						<h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-do-text md:text-3xl lg:text-4xl">
							Or stop comparing and just run it.
						</h2>
						<p className="mt-5 max-w-xl text-[17px] leading-relaxed text-do-text-secondary">
							There is a free Mac app with the AI model already on the disk. Open a
							drawing set, work an estimate, ask it about a contract — on your own
							laptop, with nothing leaving it. No call, no account, no card.
						</p>

						<ul className="mt-6 space-y-2.5">
							{POINTS.map((point) => (
								<li key={point.label} className="flex items-center gap-2.5">
									<point.icon className="h-4 w-4 shrink-0 text-do-orange" />
									<span className="text-[15px] text-do-text-secondary">
										{point.label}
									</span>
								</li>
							))}
						</ul>

						<div className="mt-8 flex flex-wrap items-center gap-4">
							<Link
								href={localHref}
								className="group inline-flex items-center gap-2.5 rounded-xl bg-do-orange px-6 py-3.5 text-sm font-medium text-white transition-all hover:bg-do-orange-dark"
							>
								<Apple className="h-4 w-4" />
								Get the Mac app
								<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
							</Link>
							<span className="font-mono text-[11px] uppercase tracking-wider text-do-text-muted">
								Apple Silicon · macOS 12+
							</span>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-80px" }}
						transition={{ duration: 0.5, delay: 0.1 }}
					>
						{/* TODO: swap for the local-model screenshot once we have the file —
						    the composer showing "Local · Qwen3.8-4B-Q4_K_M" is the thing this
						    band is actually claiming. */}
						<Image
							src="/images/resources/why-drawings-estimation-workspace.webp"
							alt="The construction.live desktop app with a drawing open in the estimation workspace"
							width={1680}
							height={1009}
							sizes="(max-width: 768px) 100vw, 560px"
							loading="lazy"
							className="w-full rounded-2xl border border-do-border shadow-xl"
						/>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
