"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Plus, ArrowRight } from "lucide-react";

/* Draft answers, written against the objections that come up on demo calls.
   Worth a read-through before these go in front of customers. */
const faqs = [
	{
		q: "Do my crews have to learn new software?",
		a: "No. The field app works like sending a message, talk, snap a photo, or type a line. If a crew never opens it, the AI can call them at shift change and capture the same update by voice.",
	},
	{
		q: "Can I keep working from email?",
		a: "Yes. Forward or copy construction.live and the AI files it, links it to the right job, and replies with what you asked for. One subcontractor runs their entire bidding process this way without ever logging in.",
	},
	{
		q: "Does it replace our current PM tool?",
		a: "It doesn't have to. We connect to Procore, Autodesk Construction Cloud, Bluebeam, Outlook and Gmail, QuickBooks and Sage. Run us as the connected record on top of what you already have, or as the whole platform.",
	},
	{
		q: "Will reports use our own templates?",
		a: "Yes. Submittals, daily reports and T&M packages generate in your company's templates. Send us the ones you use today and we set them up during onboarding.",
	},
	{
		q: "How long does setup take?",
		a: "Connect email and your document folders and the first project is running in days, not months. There's no migration to finish before you get value, the record starts building from the next email and the next site visit.",
	},
	{
		q: "Who owns our data, and is it secure?",
		a: "You own it. Your project data is encrypted in transit and at rest, it isn't used to train models for anyone else, and you can export it whenever you want.",
	},
	{
		q: "Does the field app work offline?",
		a: "Yes. Voice notes and photos queue on the device when there's no service and sync as soon as reception comes back, which is most of what a jobsite day looks like.",
	},
	{
		q: "How is it priced?",
		a: "By project and team size. We're still shaping plans with early customers, so pricing is a five-minute conversation on the demo call rather than a table on a page.",
	},
];

export default function FAQ() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-80px" });
	const [openIndex, setOpenIndex] = useState<number | null>(0);

	return (
		<section id="faqs" className="relative py-24 md:py-32 overflow-hidden bg-do-bg-card scroll-mt-20">
			<div className="absolute inset-0 do-blueprint-grid-dense pointer-events-none" />

			<div className="relative z-10 max-w-5xl mx-auto px-6" ref={ref}>
				<motion.div
					className="flex flex-wrap items-end justify-between gap-4 mb-10"
					initial={{ opacity: 0, y: 25 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6 }}
				>
					<div>
						<span className="do-section-label text-do-orange">Questions</span>
						<h2 className="text-3xl md:text-4xl font-bold text-do-text mt-4 tracking-tight">
							Before you book a demo
						</h2>
					</div>
					<a
						href="/book"
						className="group inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-do-text-secondary hover:text-do-text border border-do-border hover:border-do-border-accent rounded-xl transition-all"
					>
						Ask us anything else
						<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
					</a>
				</motion.div>

				<div className="grid md:grid-cols-2 gap-x-6 gap-y-3">
					{faqs.map((faq, i) => {
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
