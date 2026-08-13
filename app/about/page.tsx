"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SiteNav from "@/components/home/SiteNav";
import SiteFooter from "@/components/home/SiteFooter";


/* ── Team section ──────────────────────────────────────────────────── */

function TeamSection() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-80px" });

	return (
		<section className="relative py-24 overflow-hidden" ref={ref}>
			<div className="absolute inset-0 do-blueprint-grid pointer-events-none" />

			<div className="relative z-10 max-w-4xl mx-auto px-6">
				<motion.div
					className="text-center mb-16"
					initial={{ opacity: 0, y: 30 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6 }}
				>
					<span className="do-section-label text-do-orange">Founder</span>
					<h2 className="text-3xl md:text-4xl font-bold text-do-text mt-4 mb-4">
						Built by someone who&apos;s been on the losing side of a change-order dispute.
					</h2>
					{/* <p className="text-base text-do-text-secondary max-w-xl mx-auto">
						Construction operators and AI engineers. We know what gets disputed
						and we know how to document it before the dispute starts.
					</p> */}
				</motion.div>

				<motion.div
					className="max-w-sm mx-auto rounded-2xl border border-do-border bg-do-bg-card/80 backdrop-blur-sm p-8 text-center"
					initial={{ opacity: 0, y: 20 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ delay: 0.2, duration: 0.5 }}
				>
					<div className="relative h-28 w-28 rounded-full mx-auto mb-6 overflow-hidden border-2 border-do-orange/30 shadow-[0_0_30px_rgba(249,115,22,0.15)]">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src="/profile.jpg"
							alt="Rahul Vaishnav, founder of construction.live"
							className="h-full w-full object-cover"
							loading="lazy"
						/>
					</div>
					<h3 className="text-lg font-semibold text-do-text mb-1">
						Rahul Vaishnav
					</h3>
					<p className="text-sm text-do-orange font-medium mb-4">Founder</p>
					<p className="text-xs text-do-text-secondary leading-relaxed">
						10+ years across construction and AI. Built construction.live because
						he&apos;s been on the losing side of enough change-order disputes to
						know what the documentation gap actually costs.
					</p>
				</motion.div>
			</div>
		</section>
	);
}


/* ── Page ──────────────────────────────────────────────────────────── */

export default function AboutPage() {
	return (
		<main className="min-h-screen bg-do-bg">
			<SiteNav />

			{/* Hero */}
			<section className="relative pt-40 pb-20 overflow-hidden">
				<div className="absolute inset-0 do-blueprint-grid pointer-events-none" />
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-do-orange/[0.04] rounded-full blur-[150px]" />

				<div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<span className="do-section-label text-do-orange">About</span>
						<h1 className="text-4xl md:text-6xl font-bold text-do-text mt-4 mb-6">
							Built for small &amp; mid-size
							<br />
							<span className="text-do-text-secondary font-normal">
								commercial contractors.
							</span>
						</h1>
						<p className="text-lg md:text-xl text-do-text-secondary max-w-2xl mx-auto leading-relaxed">
							Small and mid-size commercial GCs and subcontractors. If you run
							$2M-50M projects and your margins live or die by how well the field
							gets documented, this is built for you.
						</p>
					</motion.div>
				</div>
			</section>

			{/* Our Vision */}
			<section className="relative py-24 overflow-hidden">
				<div className="absolute inset-0 do-blueprint-grid-dense pointer-events-none" />

				<div className="relative z-10 max-w-3xl mx-auto px-6">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<span className="do-section-label text-do-orange">Our vision</span>
						<h2 className="text-3xl md:text-4xl font-bold text-do-text mt-4 mb-8">
							The work is hard enough. The paperwork shouldn&apos;t decide who gets
							paid.
						</h2>
					</motion.div>

					<motion.div
						className="space-y-6"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.5 }}
					>
						<p className="text-base text-do-text-secondary leading-relaxed">
							We have watched people leave the house at 3am to beat LA traffic, park
							up at 4:30, sleep an hour in the truck, and start work at 5:30. After a
							day like that, whether they get paid comes down to a form somebody
							still has to fill in at the end of it. That is where it starts, right
							at the base.
						</p>
						<p className="text-base text-do-text-secondary leading-relaxed">
							It only gets more serious the further up you go. The site wasn&apos;t
							ready, so the work couldn&apos;t happen, but nobody wants to be the one
							to say it. Supers, owners and GCs can be hard to push back on, and no
							one wants to leave bitterness on a job they have to show up to again
							tomorrow. So it goes unsaid, and unwritten. Months later that silence
							is a delay the company swallows, or a claim nobody can prove.
						</p>
						<p className="text-base text-do-text-secondary leading-relaxed">
							They lose on every front. Report it and they catch it on site.
							Don&apos;t report it and the project manager comes down on them, or the
							money simply never arrives. The real work happens between people, and
							the record of it is the first thing to go.
						</p>
						<p className="text-base text-do-text-secondary leading-relaxed">
							Nearly all of it is avoidable if the paperwork is handed to something
							impartial, something that isn&apos;t in the room and doesn&apos;t take
							sides. What happened, when it happened, what led to it, all of it
							linked. Kept without anyone having to pick a fight to get it written
							down.
						</p>
						<p className="text-base text-do-text leading-relaxed">
							That is what we are building. In an industry this thin on margin, time
							and money are the same thing, and we want to hand both back.
						</p>
						<p className="border-l-2 border-do-orange/40 pl-5 text-lg text-do-text leading-relaxed">
							Give people their time back. Give them their money back. Give them back
							their sanity and their peace.
						</p>
					</motion.div>
				</div>
			</section>

			<TeamSection />
			<SiteFooter />
		</main>
	);
}
