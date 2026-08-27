"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Check, ChevronDown, Cpu } from "lucide-react";
import SiteNav from "@/components/home/SiteNav";
import SiteFooter from "@/components/home/SiteFooter";
import { contactHref, demoHref, privateCloud, securityHref } from "@/components/home/nav-data";
import {
	ALSO_RUNS,
	ASSURANCES,
	HARDWARE_FAQ,
	HARNESS_STEPS,
	MODELS,
	PILLARS,
	PROCESS,
	SPEC_GROUPS,
	TIERS,
	WARRANTY,
} from "./content";

/* Sections are anchored so the nav and the tier cards can deep-link into them.
   Same offset the /solutions page uses, for the same reason: the nav is fixed,
   so a raw hash jump would land the heading underneath it. */
const SCROLL_MT = "scroll-mt-28";

/* Every section fades in on scroll the same way. Inlined at each call site this
   was six copies of the same three props, and they had drifted to three
   different durations. */
const rise = {
	initial: { opacity: 0, y: 24 },
	whileInView: { opacity: 1, y: 0 },
	viewport: { once: true, margin: "-80px" },
	transition: { duration: 0.5 },
};

export default function HardwarePage() {
	const [openFaq, setOpenFaq] = useState<number | null>(0);

	return (
		<main className="min-h-screen bg-do-bg">
			<SiteNav />

			{/* ── Hero ───────────────────────────────────────────────────────── */}
			<section className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden">
				<div className="absolute inset-0 do-blueprint-grid pointer-events-none" />
				<div className="absolute top-0 right-0 w-[600px] h-[600px] bg-do-orange/[0.05] rounded-full blur-[140px] pointer-events-none" />

				<div className="relative z-10 max-w-6xl mx-auto px-6">
					<motion.div
						className="max-w-3xl"
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						{/* Doubles as a breadcrumb: this page is the machine behind the
						    Private Cloud section on /solutions, and anyone who arrived from
						    there should be able to get back to the argument. */}
						<a
							href={privateCloud.href}
							className="do-section-label text-do-orange inline-flex items-center gap-2 hover:text-do-orange-dark transition-colors"
						>
							<Cpu className="h-3.5 w-3.5" />
							Private Cloud
							<span className="text-do-text-muted">/ Hardware</span>
						</a>
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-do-text mt-5 tracking-tight leading-[1.05]">
							Your project&apos;s AI, running on your own floor.
						</h1>
						<p className="text-lg md:text-xl text-do-text-secondary leading-relaxed mt-6 max-w-2xl">
							A complete system: the machine, the models and the construction.live
							harness, delivered as one thing. Your drawings, contracts, daily logs
							and voice notes are read on a box in your building — never sent to a
							model vendor, never metered by the token.
						</p>

						<div className="flex flex-wrap items-center gap-3 mt-9">
							<a
								href={contactHref}
								className="group inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-white bg-do-orange hover:bg-do-orange-dark rounded-lg transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]"
							>
								Request an allocation
								<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
							</a>
							<a
								href="#specs"
								className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-do-text-secondary hover:text-do-text border border-do-border hover:border-do-border-accent rounded-lg transition-all"
							>
								See the specifications
							</a>
						</div>
					</motion.div>

					{/* Headline numbers, per unit. */}
					<motion.dl
						className="grid grid-cols-2 lg:grid-cols-4 gap-px mt-16 rounded-2xl overflow-hidden border border-do-border bg-do-border"
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.15 }}
					>
						{[
							{ value: "128 GB", label: "Unified memory" },
							{ value: "32 GB", label: "Dedicated GDDR6" },
							{ value: "191", label: "TFLOPS at FP16" },
							{ value: "0", label: "Bytes sent to a model vendor" },
						].map((stat) => (
							<div key={stat.label} className="bg-do-bg-card px-5 py-6">
								<dt className="text-2xl md:text-3xl font-bold text-do-text tracking-tight">
									{stat.value}
								</dt>
								<dd className="text-xs text-do-text-secondary mt-1.5 leading-snug">
									{stat.label}
								</dd>
							</div>
						))}
					</motion.dl>
				</div>
			</section>

			{/* ── Why a box ──────────────────────────────────────────────────── */}
			<section className="relative py-20 md:py-24 bg-do-bg-card border-y border-do-border">
				<div className="relative z-10 max-w-6xl mx-auto px-6">
					<div className="grid md:grid-cols-3 gap-10 md:gap-12">
						{PILLARS.map((pillar, i) => (
							<motion.div key={pillar.title} {...rise} transition={{ duration: 0.5, delay: i * 0.1 }}>
								<div className="h-10 w-10 rounded-xl bg-do-orange/10 border border-do-orange/20 flex items-center justify-center mb-4">
									<pillar.icon className="h-5 w-5 text-do-orange" />
								</div>
								<h3 className="text-lg font-semibold text-do-text mb-2.5">{pillar.title}</h3>
								<p className="text-[15px] text-do-text-secondary leading-relaxed">
									{pillar.detail}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* ── Tiers ──────────────────────────────────────────────────────── */}
			<section id="configurations" className={`relative py-24 md:py-32 overflow-hidden ${SCROLL_MT}`}>
				<div className="absolute inset-0 do-blueprint-grid pointer-events-none opacity-60" />

				<div className="relative z-10 max-w-6xl mx-auto px-6">
					<motion.div className="max-w-2xl mb-14" {...rise}>
						<span className="do-section-label text-do-orange">Configurations</span>
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-do-text mt-4 tracking-tight leading-[1.1]">
							Three ways to put it in the building.
						</h2>
						<p className="text-lg text-do-text-secondary leading-relaxed mt-5">
							Every configuration ships the whole platform. What changes is where the
							box sits, how much of it there is, and how tightly it&apos;s sealed off
							from everything else.
						</p>
					</motion.div>

					<div className="grid lg:grid-cols-3 gap-6">
						{TIERS.map((tier, i) => (
							<motion.div
								key={tier.slug}
								id={tier.slug}
								className={`${SCROLL_MT} relative flex flex-col rounded-2xl border p-7 ${
									tier.featured
										? "border-do-orange/40 bg-do-bg-card shadow-xl"
										: "border-do-border bg-do-bg-card/60"
								}`}
								{...rise}
								transition={{ duration: 0.5, delay: i * 0.1 }}
							>
								{tier.featured && (
									<span className="absolute -top-3 left-7 px-3 py-1 rounded-full bg-do-orange text-white text-[10px] font-mono uppercase tracking-wider">
										Most contractors
									</span>
								)}

								<div className="flex items-center gap-3 mb-4">
									<div className="h-9 w-9 rounded-lg bg-do-orange/10 flex items-center justify-center shrink-0">
										<tier.icon className="h-4 w-4 text-do-orange" />
									</div>
									<div className="min-w-0">
										<h3 className="text-lg font-semibold text-do-text leading-tight">
											{tier.name}
										</h3>
										<p className="text-[11px] font-mono text-do-text-muted uppercase tracking-wider truncate">
											{tier.audience}
										</p>
									</div>
								</div>

								<p className="text-base font-medium text-do-text mb-2">{tier.headline}</p>
								<p className="text-sm text-do-text-secondary leading-relaxed mb-6">
									{tier.description}
								</p>

								<dl className="grid grid-cols-2 gap-px rounded-xl overflow-hidden border border-do-border bg-do-border mb-6">
									{tier.facts.map((fact) => (
										<div key={fact.label} className="bg-do-bg px-3.5 py-3">
											<dt className="text-[10px] font-mono text-do-text-muted uppercase tracking-wider">
												{fact.label}
											</dt>
											<dd className="text-[13px] font-medium text-do-text mt-0.5 leading-snug">
												{fact.value}
											</dd>
										</div>
									))}
								</dl>

								<ul className="space-y-2.5 mb-7">
									{tier.includes.map((item) => (
										<li key={item} className="flex items-start gap-2.5">
											<Check className="h-4 w-4 text-do-orange shrink-0 mt-0.5" />
											<span className="text-[13px] text-do-text-secondary leading-relaxed">
												{item}
											</span>
										</li>
									))}
								</ul>

								<a
									href={tier.cta.href}
									className={`group mt-auto inline-flex items-center justify-center gap-2 w-full px-5 py-3 text-sm font-medium rounded-lg transition-all ${
										tier.featured
											? "text-white bg-do-orange hover:bg-do-orange-dark"
											: "text-do-text-secondary hover:text-do-text border border-do-border hover:border-do-border-accent"
									}`}
								>
									{tier.cta.label}
									<ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
								</a>
							</motion.div>
						))}
					</div>

					<motion.p className="text-sm text-do-text-muted mt-8 max-w-2xl" {...rise}>
						Quoted per deployment rather than off a list, because unit count, siting
						and integration scope all move the number.{" "}
						<a href={contactHref} className="text-do-orange hover:underline">
							Tell us the shape of yours
						</a>{" "}
						and we&apos;ll come back with a figure.
					</motion.p>
				</div>
			</section>

			{/* ── Models ─────────────────────────────────────────────────────── */}
			<section id="models" className={`relative py-24 md:py-28 bg-do-bg-card border-y border-do-border ${SCROLL_MT}`}>
				<div className="relative z-10 max-w-6xl mx-auto px-6">
					<motion.div className="max-w-2xl mb-12" {...rise}>
						<span className="do-section-label text-do-orange">Pre-tuned models</span>
						<h2 className="text-3xl md:text-4xl font-bold text-do-text mt-4 tracking-tight leading-[1.1]">
							Open weights, on your disks.
						</h2>
						<p className="text-lg text-do-text-secondary leading-relaxed mt-5">
							The box arrives with two models already tuned for construction work and
							the harness already routing between them. No licence server to reach,
							no model that can be deprecated out from under a contract.
						</p>
					</motion.div>

					<div className="grid md:grid-cols-2 gap-6">
						{MODELS.map((model, i) => (
							<motion.div
								key={model.name}
								className="rounded-2xl border border-do-border bg-do-bg p-7"
								{...rise}
								transition={{ duration: 0.5, delay: i * 0.1 }}
							>
								<div className="flex items-baseline justify-between gap-4 mb-3">
									<h3 className="text-xl font-semibold text-do-text tracking-tight">
										{model.name}
									</h3>
									<span className="text-[10px] font-mono text-do-orange uppercase tracking-wider shrink-0">
										{model.role}
									</span>
								</div>
								<p className="text-[15px] text-do-text-secondary leading-relaxed">
									{model.detail}
								</p>
							</motion.div>
						))}
					</div>

					<motion.div className="flex flex-wrap items-center gap-2.5 mt-8" {...rise}>
						<span className="text-xs font-mono text-do-text-muted uppercase tracking-wider">
							Also runs
						</span>
						{ALSO_RUNS.map((name) => (
							<span
								key={name}
								className="px-3 py-1.5 rounded-full border border-do-border bg-do-bg text-[13px] text-do-text-secondary"
							>
								{name}
							</span>
						))}
					</motion.div>
				</div>
			</section>

			{/* ── The harness ────────────────────────────────────────────────── */}
			<section id="harness" className={`relative py-24 md:py-32 overflow-hidden ${SCROLL_MT}`}>
				<div className="absolute inset-0 do-blueprint-grid pointer-events-none opacity-60" />
				<div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-do-orange/[0.04] rounded-full blur-[120px] pointer-events-none" />

				<div className="relative z-10 max-w-6xl mx-auto px-6">
					<motion.div className="max-w-2xl mb-14" {...rise}>
						<span className="do-section-label text-do-orange">The harness</span>
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-do-text mt-4 tracking-tight leading-[1.1]">
							A model on its own doesn&apos;t run a project.
						</h2>
						<p className="text-lg text-do-text-secondary leading-relaxed mt-5">
							What makes it a system is the construction.live harness: the agents that
							read what arrives, file it against the right job, link it to the revision
							behind it and follow up on what&apos;s owed. That ships on the box too.
						</p>
					</motion.div>

					<div className="grid md:grid-cols-3 gap-px rounded-2xl overflow-hidden border border-do-border bg-do-border">
						{HARNESS_STEPS.map((step, i) => (
							<motion.div
								key={step.number}
								className="bg-do-bg-card p-7"
								{...rise}
								transition={{ duration: 0.5, delay: i * 0.1 }}
							>
								<span className="text-xs font-mono text-do-orange">{step.number}</span>
								<h3 className="text-lg font-semibold text-do-text mt-3 mb-2.5">
									{step.title}
								</h3>
								<p className="text-[15px] text-do-text-secondary leading-relaxed">
									{step.detail}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* ── Government ─────────────────────────────────────────────────── */}
			<section id="government" className={`relative py-24 md:py-32 bg-do-bg-card border-y border-do-border ${SCROLL_MT}`}>
				<div className="relative z-10 max-w-6xl mx-auto px-6">
					<motion.div className="max-w-2xl mb-14" {...rise}>
						<span className="do-section-label text-do-orange">Public sector</span>
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-do-text mt-4 tracking-tight leading-[1.1]">
							For government, completely local.
						</h2>
						<p className="text-lg text-do-text-secondary leading-relaxed mt-5">
							Public infrastructure work carries records that can&apos;t be handed to a
							third party: sealed bids, security-sensitive drawings, procurement
							correspondence, claims headed for litigation. The Government Enclave
							configuration answers that the only way it can actually be answered —
							by putting the whole system inside your perimeter.
						</p>
					</motion.div>

					<div className="grid md:grid-cols-2 gap-6">
						{ASSURANCES.map((item, i) => (
							<motion.div
								key={item.title}
								className="flex items-start gap-4 rounded-2xl border border-do-border bg-do-bg p-6"
								{...rise}
								transition={{ duration: 0.5, delay: i * 0.08 }}
							>
								<div className="h-10 w-10 rounded-xl bg-do-orange/10 border border-do-orange/20 flex items-center justify-center shrink-0">
									<item.icon className="h-5 w-5 text-do-orange" />
								</div>
								<div>
									<h3 className="text-base font-semibold text-do-text mb-2">{item.title}</h3>
									<p className="text-[15px] text-do-text-secondary leading-relaxed">
										{item.detail}
									</p>
								</div>
							</motion.div>
						))}
					</div>

					<motion.div className="mt-10" {...rise}>
						<div className="flex flex-wrap items-center gap-3">
							<a
								href={contactHref}
								className="group inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-white bg-do-orange hover:bg-do-orange-dark rounded-lg transition-all"
							>
								Talk to our public sector team
								<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
							</a>
							{/* Procurement reads the posture page before it reads the pitch. */}
							<a
								href={securityHref}
								className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-do-text-secondary hover:text-do-text border border-do-border hover:border-do-border-accent rounded-lg transition-all"
							>
								Our security posture
							</a>
						</div>
					</motion.div>
				</div>
			</section>

			{/* ── Specifications ─────────────────────────────────────────────── */}
			<section id="specs" className={`relative py-24 md:py-32 overflow-hidden ${SCROLL_MT}`}>
				<div className="absolute inset-0 do-blueprint-grid pointer-events-none opacity-60" />

				<div className="relative z-10 max-w-6xl mx-auto px-6">
					<motion.div className="max-w-2xl mb-14" {...rise}>
						<span className="do-section-label text-do-orange">Specifications</span>
						<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-do-text mt-4 tracking-tight leading-[1.1]">
							An aluminium chassis built for sustained load, not benchmarks.
						</h2>
						<p className="text-lg text-do-text-secondary leading-relaxed mt-5">
							Per unit. The Office Cluster and Government Enclave configurations
							multiply these.
						</p>
					</motion.div>

					<div className="grid md:grid-cols-2 gap-6">
						{SPEC_GROUPS.map((group, i) => (
							<motion.div
								key={group.label}
								className="rounded-2xl border border-do-border bg-do-bg-card overflow-hidden"
								{...rise}
								transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
							>
								<div className="flex items-center gap-3 px-6 py-4 border-b border-do-border">
									<group.icon className="h-4 w-4 text-do-orange" />
									<span className="text-xs font-mono text-do-text-secondary uppercase tracking-wider">
										{group.label}
									</span>
								</div>
								<dl className="divide-y divide-do-border">
									{group.rows.map((row) => (
										<div
											key={row.label}
											className="flex items-baseline justify-between gap-6 px-6 py-3.5"
										>
											<dt className="text-[13px] text-do-text-secondary shrink-0">
												{row.label}
											</dt>
											<dd className="text-[13px] font-medium text-do-text text-right">
												{row.value}
											</dd>
										</div>
									))}
								</dl>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* ── Process ────────────────────────────────────────────────────── */}
			<section className="relative py-24 md:py-28 bg-do-bg-card border-y border-do-border">
				<div className="relative z-10 max-w-6xl mx-auto px-6">
					<motion.div className="max-w-2xl mb-12" {...rise}>
						<span className="do-section-label text-do-orange">Getting one</span>
						<h2 className="text-3xl md:text-4xl font-bold text-do-text mt-4 tracking-tight leading-[1.1]">
							Built to order, in limited numbers.
						</h2>
					</motion.div>

					<div className="grid md:grid-cols-3 gap-8 md:gap-10">
						{PROCESS.map((step, i) => (
							<motion.div key={step.title} {...rise} transition={{ duration: 0.5, delay: i * 0.1 }}>
								<span className="text-xs font-mono text-do-orange">
									{String(i + 1).padStart(2, "0")}
								</span>
								<h3 className="text-base font-semibold text-do-text mt-3 mb-2">{step.title}</h3>
								<p className="text-[15px] text-do-text-secondary leading-relaxed">
									{step.detail}
								</p>
							</motion.div>
						))}
					</div>

					<motion.dl
						className="grid grid-cols-3 gap-px mt-14 rounded-2xl overflow-hidden border border-do-border bg-do-border"
						{...rise}
					>
						{WARRANTY.map((item) => (
							<div key={item.label} className="bg-do-bg px-5 py-6 text-center">
								<dt className="text-xl md:text-2xl font-bold text-do-text tracking-tight">
									{item.value}
								</dt>
								<dd className="text-xs text-do-text-secondary mt-1.5">{item.label}</dd>
							</div>
						))}
					</motion.dl>
				</div>
			</section>

			{/* ── FAQ ────────────────────────────────────────────────────────── */}
			<section className="relative py-24 md:py-28 overflow-hidden">
				<div className="absolute inset-0 do-blueprint-grid pointer-events-none opacity-60" />

				<div className="relative z-10 max-w-3xl mx-auto px-6">
					<motion.div className="mb-10" {...rise}>
						<span className="do-section-label text-do-orange">Questions</span>
						<h2 className="text-3xl md:text-4xl font-bold text-do-text mt-4 tracking-tight leading-[1.1]">
							Before you ask us for a number.
						</h2>
					</motion.div>

					<div className="rounded-2xl border border-do-border bg-do-bg-card divide-y divide-do-border overflow-hidden">
						{HARDWARE_FAQ.map((item, i) => (
							<div key={item.question}>
								<button
									type="button"
									className="flex items-center justify-between gap-4 w-full px-6 py-5 text-left"
									onClick={() => setOpenFaq(openFaq === i ? null : i)}
									aria-expanded={openFaq === i}
								>
									<span className="text-[15px] font-medium text-do-text">
										{item.question}
									</span>
									<ChevronDown
										className={`h-4 w-4 text-do-text-muted shrink-0 transition-transform ${
											openFaq === i ? "rotate-180" : ""
										}`}
									/>
								</button>
								{openFaq === i && (
									<p className="px-6 pb-5 -mt-1 text-[15px] text-do-text-secondary leading-relaxed">
										{item.answer}
									</p>
								)}
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ── CTA ────────────────────────────────────────────────────────── */}
			<section className="relative py-20 md:py-24 bg-do-bg-card border-t border-do-border overflow-hidden">
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-do-orange/[0.06] rounded-full blur-[120px] pointer-events-none" />

				<div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
					<motion.div {...rise}>
						<h2 className="text-3xl md:text-4xl font-bold text-do-text tracking-tight leading-[1.1]">
							Tell us where the box goes.
						</h2>
						<p className="text-lg text-do-text-secondary leading-relaxed mt-5">
							Trailer, server room or secure facility. We&apos;ll size it, quote it
							and tell you honestly if the cloud version would serve you better.
						</p>
						<div className="flex flex-wrap items-center justify-center gap-3 mt-9">
							<a
								href={contactHref}
								className="group inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-white bg-do-orange hover:bg-do-orange-dark rounded-lg transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]"
							>
								Request an allocation
								<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
							</a>
							<a
								href={demoHref}
								className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-do-text-secondary hover:text-do-text border border-do-border hover:border-do-border-accent rounded-lg transition-all"
							>
								Book a demo first
							</a>
						</div>
					</motion.div>
				</div>
			</section>

			<SiteFooter />
		</main>
	);
}
