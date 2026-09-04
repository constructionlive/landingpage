"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { trainingHref } from "./nav-data";

/* Sits directly after the demo CTA, and is deliberately the quietest section
   on the page.

   It answers the question booking a demo actually raises — "fine, but will my
   crew use it?" — which the demo card above cannot answer without diluting its
   own ask. So this is a text link on a flat band rather than a second filled
   orange button: two competing calls to action next to each other means the
   page has no call to action. */
export default function TrainingBand() {
	return (
		<section
			id="training"
			className="relative scroll-mt-24 border-t border-do-border bg-do-bg-card py-16 md:py-20"
		>
			<div className="relative z-10 mx-auto max-w-6xl px-6">
				<div className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:gap-14">
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-80px" }}
						transition={{ duration: 0.5 }}
					>
						<Image
							src="/images/resources/why-ai-training-jobsite.webp"
							alt="A crew in hard hats gathered around a laptop on a cart, being shown the app on an active jobsite"
							width={1600}
							height={900}
							sizes="(max-width: 768px) 100vw, 480px"
							loading="lazy"
							className="aspect-video w-full rounded-2xl border border-do-border object-cover"
						/>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 24 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-80px" }}
						transition={{ duration: 0.5, delay: 0.1 }}
					>
						<span className="do-section-label text-do-orange">After the demo</span>
						<h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-do-text md:text-3xl lg:text-4xl">
							Then we train your team ourselves.
						</h2>
						<p className="mt-5 max-w-xl text-[17px] leading-relaxed text-do-text-secondary">
							A licence does not create adoption. People do. We run the training on
							site or online, on your drawings and your daily logs rather than a demo
							account — and our engineers stay through the rollout, because the
							problems that stall one turn up in week three.
						</p>
						<Link
							href={trainingHref}
							className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-do-orange hover:opacity-80"
						>
							How training works
							<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
						</Link>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
