"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Plus, ArrowRight } from "lucide-react";
import SiteNav from "./SiteNav";
import { faqs } from "./faq-data";

export default function FAQ({faqPage = false}: {faqPage?: boolean}) {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-80px" });
	const [openIndex, setOpenIndex] = useState<number | null>(0);
	const visibleFaqs = faqPage ? faqs : faqs.slice(0, 5);

	return (
		<section id="faqs" className="relative py-24 md:py-32 overflow-hidden bg-do-bg-card scroll-mt-20">
			<div className="absolute inset-0 do-blueprint-grid-dense pointer-events-none" />

			<div className="relative z-10 max-w-4xl mx-auto px-6" ref={ref}>
				{!faqPage && (

				<motion.div
					className="flex flex-wrap items-end justify-between gap-4 mb-10"
					initial={{ opacity: 0, y: 25 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6 }}
				>
					<div>
						<span className="do-section-label text-do-orange">FAQs</span>
						<h2 className="text-3xl md:text-4xl font-bold text-do-text mt-4 tracking-tight">
							Before you book a demo
						</h2>
					</div>
					<a
						href="/faqs"
						className="group inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-do-text-secondary hover:text-do-text border border-do-border hover:border-do-border-accent rounded-xl transition-all"
					>
						See all
						<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
					</a>
				</motion.div>
				)}
				{faqPage && (
					<motion.div
						className="flex flex-wrap items-end justify-between gap-4 mb-10"
						initial={{ opacity: 0, y: 25 }}
						animate={inView ? { opacity: 1, y: 0 } : {}}
						transition={{ duration: 0.6 }}
					>
						<div>
							<span className="do-section-label text-do-orange">FAQs</span>
							{/* h1 here, h2 on the homepage branch above. /faqs renders only
							    this component, so without it the page had no h1 at all. */}
							<h1 className="text-3xl md:text-4xl font-bold text-do-text mt-4 tracking-tight">
								Frequently asked questions
							</h1>
						</div>

					</motion.div>

				)}

				<div className="grid md:grid-cols-1 gap-x-6 gap-y-3">
					{visibleFaqs.map((faq, i) => {
						const isOpen = openIndex === i;
						return (
							<motion.div
								key={faq.q}
								className={`rounded-2xl border transition-colors h-fit ${
									isOpen
										? "border-do-orange/25 bg-do-bg"
										: "border-do-border bg-do-bg/60 hover:border-do-border-accent"
								}`}
								initial={{ opacity: 0, y: 18 }}
								animate={inView ? { opacity: 1, y: 0 } : {}}
								transition={{ delay: i * 0.05, duration: 0.4 }}
							>
								<button
									type="button"
									className="w-full flex items-start justify-between gap-4 text-left px-5 py-4"
									onClick={() => setOpenIndex(isOpen ? null : i)}
									aria-expanded={isOpen}
								>
									<span className="text-[15px] font-medium text-do-text leading-snug">
										{faq.q}
									</span>
									<Plus
										className={`h-4 w-4 shrink-0 mt-0.5 transition-transform duration-300 ${
											isOpen ? "rotate-45 text-do-orange" : "text-do-text-muted"
										}`}
									/>
								</button>
								<AnimatePresence initial={false}>
									{isOpen && (
										<motion.div
											initial={{ height: 0, opacity: 0 }}
											animate={{ height: "auto", opacity: 1 }}
											exit={{ height: 0, opacity: 0 }}
											transition={{ duration: 0.25 }}
											className="overflow-hidden"
										>
											<p className="px-5 pb-5 text-sm text-do-text-secondary leading-relaxed">
												{faq.a}
											</p>
										</motion.div>
									)}
								</AnimatePresence>
							</motion.div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
