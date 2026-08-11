"use client";

import { motion } from "framer-motion";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import {
	Calendar,
	ArrowRight,
	Clock,
	CheckCircle2,
	DollarSign,
	Receipt,
	AlertTriangle,
} from "lucide-react";
import SiteNav from "@/components/home/SiteNav";
import SiteFooter from "@/components/home/SiteFooter";

const CALENDAR_URL = "https://calendar.app.google/Eb7GFYUJNLDof5oz6";

const agenda = [
	{
		icon: AlertTriangle,
		title: "Where you're losing margin today",
		description:
			"Disputed pay apps, denied change orders, T&M pushback, we'll ask which one is bleeding the most right now.",
	},
	{
		icon: Receipt,
		title: "What a typical pay app looks like for you",
		description:
			"Cycle time, dispute rate, how your supers document day-to-day. We listen, you talk.",
	},
	{
		icon: DollarSign,
		title: "What protecting $1M a year would look like",
		description:
			"How voice notes + AI calls + integrations would change your specific cash-flow picture, with the math.",
	},
];

export default function BookPage() {
	return (
		<main className="min-h-screen bg-do-bg">
			<SiteNav />

			{/* Hero */}
			<section className="relative pt-40 pb-12 overflow-hidden">
				<div className="absolute inset-0 do-blueprint-grid pointer-events-none" />
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-do-orange/[0.04] rounded-full blur-[150px]" />

				<div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<span className="do-section-label text-do-orange">Book a demo</span>
						<h1 className="text-4xl md:text-6xl font-bold text-do-text mt-4 mb-6">
							A 15-minute call.
							<br />
							<span className="text-do-text-secondary font-normal">
								See how we&apos;d protect your margins.
							</span>
						</h1>
						<p className="text-lg text-do-text-secondary max-w-2xl mx-auto leading-relaxed mb-2">
							We&apos;ll ask about your current pain points, disputed pay apps,
							lost change orders, T&amp;M pushback and show you exactly how
							we&apos;d solve them.
						</p>
						<p className="text-sm text-do-text-muted">
							Built for small &amp; mid-size commercial GCs and subcontractors.
						</p>
					</motion.div>
				</div>
			</section>

			{/* Booking card */}
			<section className="relative pb-16 overflow-hidden">
				<div className="relative z-10 max-w-3xl mx-auto px-6">
					<motion.div
						className="rounded-3xl border border-do-orange/20 bg-do-bg-card/80 backdrop-blur-xl p-10 md:p-12"
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.15 }}
					>
						<div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
							<div className="h-14 w-14 rounded-xl bg-do-orange/10 border border-do-orange/20 flex items-center justify-center shrink-0">
								<Calendar className="h-7 w-7 text-do-orange" />
							</div>
							<div className="flex-1">
								<h2 className="text-2xl md:text-3xl font-bold text-do-text mb-2">
									Book on Google Calendar
								</h2>
								<p className="text-base text-do-text-secondary leading-relaxed">
									Pick a time that works. 15 minutes. No deck, no sales pitch,
									just a short conversation about how your projects actually
									document day-to-day.
								</p>
							</div>
						</div>

						<div className="grid sm:grid-cols-3 gap-3 mb-8">
							<div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-do-bg/60 border border-do-border">
								<Clock className="h-4 w-4 text-do-orange shrink-0" />
								<span className="text-sm text-do-text-secondary">15 minutes</span>
							</div>
							<div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-do-bg/60 border border-do-border">
								<CheckCircle2 className="h-4 w-4 text-do-orange shrink-0" />
								<span className="text-sm text-do-text-secondary">No deck</span>
							</div>
							<div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-do-bg/60 border border-do-border">
								<CheckCircle2 className="h-4 w-4 text-do-orange shrink-0" />
								<span className="text-sm text-do-text-secondary">No commitment</span>
							</div>
						</div>

						<a
							href={CALENDAR_URL}
							target="_blank"
							rel="noopener noreferrer"
							className="group w-full inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-medium text-white bg-do-orange hover:bg-do-orange-dark rounded-xl transition-all shadow-[0_0_40px_rgba(249,115,22,0.3)] hover:shadow-[0_0_60px_rgba(249,115,22,0.5)]"
						>
							<Calendar className="h-4 w-4" />
							Pick a Time
							<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
						</a>

						<p className="mt-4 text-center text-xs text-do-text-muted">
							Opens Google Calendar in a new tab.
						</p>
					</motion.div>
				</div>
			</section>

			{/* Agenda */}
			<section className="relative py-16 overflow-hidden bg-do-bg-card">
				<div className="absolute inset-0 do-blueprint-grid-dense pointer-events-none" />
				<div className="relative z-10 max-w-4xl mx-auto px-6">
					<motion.div
						className="text-center mb-12"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<span className="do-section-label text-do-orange">What we&apos;ll cover</span>
						<h2 className="text-3xl font-bold text-do-text mt-4">
							Three things in 15 minutes
						</h2>
					</motion.div>

					<div className="grid md:grid-cols-3 gap-5">
						{agenda.map((item, i) => (
							<motion.div
								key={item.title}
								className="rounded-2xl border border-do-border bg-do-bg/60 backdrop-blur-sm p-6"
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: i * 0.1, duration: 0.5 }}
							>
								<div className="h-10 w-10 rounded-xl bg-do-orange/10 border border-do-orange/20 flex items-center justify-center mb-4">
									<item.icon className="h-5 w-5 text-do-orange" />
								</div>
								<h3 className="text-base font-semibold text-do-text mb-2">
									{item.title}
								</h3>
								<p className="text-sm text-do-text-secondary leading-relaxed">
									{item.description}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			<SiteFooter />
		</main>
	);
}
