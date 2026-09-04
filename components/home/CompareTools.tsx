"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import ArticleCardList from "@/components/ArticleCardList";
import { COMPARISONS } from "@/lib/articles";
import { compareHref } from "./nav-data";

/* "Compare with other tools", low on the homepage.

   Placed after the FAQs on purpose: this is for the visitor who has already
   decided the category is worth buying and is now building a shortlist. Put it
   higher and it invites a comparison from someone who does not yet know what
   they would be comparing.

   Renders whatever is in COMPARISONS, so the next product — Procore, Autodesk,
   Bluebeam — appears here by being written, with no edit to this file. Nothing
   unwritten is listed: a row of greyed-out logos promises a page that does not
   exist and dates the homepage the moment a quarter passes without one.

   Uses the same card as the /compare index rather than its own. That card is
   full-width and stacks, so this section reads the same whether the list holds
   one comparison or six — a two-across grid holding a single card reads as a
   layout that failed. */
export default function CompareTools() {
	if (COMPARISONS.length === 0) return null;

	return (
		<section
			id="compare"
			className="relative scroll-mt-28 overflow-hidden border-t border-do-border bg-do-bg-card py-20 md:py-24"
		>
			<div className="absolute inset-0 do-blueprint-grid pointer-events-none opacity-60" />

			<div className="relative z-10 mx-auto max-w-5xl px-6">
				<motion.div
					className="mb-10 flex flex-wrap items-end justify-between gap-4"
					initial={{ opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-80px" }}
					transition={{ duration: 0.5 }}
				>
					<div className="max-w-2xl">
						<span className="do-section-label text-do-orange">Compare with other tools</span>
						<h2 className="mt-4 text-3xl font-bold tracking-tight text-do-text md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
							You are probably weighing us against something.
						</h2>
						<p className="mt-5 text-lg leading-relaxed text-do-text-secondary">
							So we wrote the comparisons ourselves, against each vendor&apos;s own
							documentation — and left in the parts where the other tool wins.
						</p>
					</div>

					<Link
						href={compareHref}
						className="group inline-flex shrink-0 items-center gap-2 rounded-lg border border-do-border px-5 py-3 text-sm font-medium text-do-text-secondary transition-all hover:border-do-border-accent hover:text-do-text"
					>
						All comparisons
						<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
					</Link>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 24 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, margin: "-80px" }}
					transition={{ duration: 0.5, delay: 0.1 }}
				>
					<ArticleCardList articles={COMPARISONS} eagerFirstImage={false} />
				</motion.div>
			</div>
		</section>
	);
}
