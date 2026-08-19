"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import SiteNav from "@/components/home/SiteNav";
import SiteFooter from "@/components/home/SiteFooter";
import { contactHref, hardwareHref } from "@/components/home/nav-data";
import {
	CERTIFICATIONS,
	CLOUD_PRACTICES,
	DISCLOSURE,
	GUARANTEES,
	LAST_REVIEWED,
	SECURITY_EMAIL,
	STATUS_META,
	SUBPROCESSORS,
	type Status,
} from "./content";

const rise = {
	initial: { opacity: 0, y: 24 },
	whileInView: { opacity: 1, y: 0 },
	viewport: { once: true, margin: "-80px" },
	transition: { duration: 0.5 },
};

/* Status colours carry meaning, so they can't be decorative. Verifiable is the
   only one that gets green: it's the only tier where the reader doesn't have to
   trust us. Self-attested is amber rather than green precisely because a lot of
   trust pages colour it green and that's the lie this page is trying not to
   tell. */
const STATUS_CLASS: Record<Status, string> = {
	guaranteed:
		"bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25",
	attested: "bg-do-orange/10 text-do-orange border-do-orange/25",
	"in-progress": "bg-do-bg-light text-do-text-secondary border-do-border-accent",
	planned: "bg-do-bg-light text-do-text-muted border-do-border",
};

function StatusPill({ status, short }: { status: Status; short?: boolean }) {
	return (
		<span
			className={`inline-flex items-center shrink-0 px-2.5 py-1 rounded-full border text-[11px] font-medium ${STATUS_CLASS[status]}`}
		>
			{short ? STATUS_META[status].short : STATUS_META[status].label}
		</span>
	);
}

export default function SecurityPage() {
	return (
		<main className="min-h-screen bg-do-bg">
			<SiteNav />

			{/* ── Hero ───────────────────────────────────────────────────────── */}
			<section className="relative pt-36 pb-16 md:pt-44 md:pb-20 overflow-hidden">
				<div className="absolute inset-0 do-blueprint-grid pointer-events-none" />
				<div className="absolute top-0 right-0 w-[600px] h-[600px] bg-do-orange/[0.05] rounded-full blur-[140px] pointer-events-none" />

				<div className="relative z-10 max-w-4xl mx-auto px-6">
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<span className="do-section-label text-do-orange inline-flex items-center gap-2">
							<ShieldCheck className="h-3.5 w-3.5" />
							Security &amp; Trust
						</span>
						<h1 className="text-4xl md:text-5xl font-bold text-do-text mt-5 tracking-tight leading-[1.05]">
							What we can prove, and what we can&apos;t yet.
						</h1>
						<p className="text-lg text-do-text-secondary leading-relaxed mt-6">
							Most trust pages print a row of badges and let you assume somebody
							checked them. This one puts a status on every claim instead, because
							the difference between &ldquo;an auditor verified this&rdquo; and
							&ldquo;we say so&rdquo; is the entire question you came here to answer.
						</p>
						<p className="text-sm text-do-text-muted font-mono mt-6">
							Last reviewed {LAST_REVIEWED}
						</p>
					</motion.div>
				</div>
			</section>

			{/* ── Legend ─────────────────────────────────────────────────────── */}
			<section className="relative py-12 bg-do-bg-card border-y border-do-border">
				<div className="relative z-10 max-w-4xl mx-auto px-6">
					<div className="grid sm:grid-cols-2 gap-5">
						{(Object.keys(STATUS_META) as Status[]).map((status, i) => (
							<motion.div
								key={status}
								className="flex items-start gap-3"
								{...rise}
								transition={{ duration: 0.4, delay: i * 0.06 }}
							>
								<StatusPill status={status} />
								<p className="text-[13px] text-do-text-secondary leading-relaxed">
									{STATUS_META[status].explanation}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* ── Guarantees ─────────────────────────────────────────────────── */}
			<section id="self-hosted" className="relative py-20 md:py-24 scroll-mt-28 overflow-hidden">
				<div className="absolute inset-0 do-blueprint-grid pointer-events-none opacity-60" />

				<div className="relative z-10 max-w-4xl mx-auto px-6">
					<motion.div className="mb-12" {...rise}>
						<span className="do-section-label text-do-orange">Self-hosted deployments</span>
						<h2 className="text-3xl md:text-4xl font-bold text-do-text mt-4 tracking-tight leading-[1.1]">
							Four things you don&apos;t have to take our word for.
						</h2>
						<p className="text-lg text-do-text-secondary leading-relaxed mt-5">
							These hold because of how the system is built, not because we promise
							them. Each one lists how to check it yourself.
						</p>
					</motion.div>

					<div className="space-y-5">
						{GUARANTEES.map((item, i) => (
							<motion.div
								key={item.title}
								className="rounded-2xl border border-do-border bg-do-bg-card p-6 md:p-7"
								{...rise}
								transition={{ duration: 0.5, delay: i * 0.07 }}
							>
								<div className="flex items-start gap-4">
									<div className="h-10 w-10 rounded-xl bg-do-orange/10 border border-do-orange/20 flex items-center justify-center shrink-0">
										<item.icon className="h-5 w-5 text-do-orange" />
									</div>
									<div className="min-w-0 flex-1">
										<div className="flex flex-wrap items-center gap-3 mb-2.5">
											<h3 className="text-lg font-semibold text-do-text">{item.title}</h3>
											<StatusPill status="guaranteed" short />
										</div>
										<p className="text-[15px] text-do-text-secondary leading-relaxed">
											{item.detail}
										</p>
										<div className="mt-4 pt-4 border-t border-do-border">
											<p className="text-[10px] font-mono text-do-text-muted uppercase tracking-wider mb-1.5">
												How to verify
											</p>
											<p className="text-[14px] text-do-text-secondary leading-relaxed">
												{item.verify}
											</p>
										</div>
									</div>
								</div>
							</motion.div>
						))}
					</div>

					<motion.p className="text-sm text-do-text-muted mt-8" {...rise}>
						These apply to the on-premise and air-gapped configurations described on{" "}
						<a href={hardwareHref} className="text-do-orange hover:underline">
							the hardware page
						</a>
						.
					</motion.p>
				</div>
			</section>

			{/* ── Certifications ─────────────────────────────────────────────── */}
			<section
				id="certifications"
				className="relative py-20 md:py-24 scroll-mt-28 bg-do-bg-card border-y border-do-border"
			>
				<div className="relative z-10 max-w-4xl mx-auto px-6">
					<motion.div className="mb-12" {...rise}>
						<span className="do-section-label text-do-orange">Certifications</span>
						<h2 className="text-3xl md:text-4xl font-bold text-do-text mt-4 tracking-tight leading-[1.1]">
							Where we actually stand.
						</h2>
						<p className="text-lg text-do-text-secondary leading-relaxed mt-5">
							Including the ones we don&apos;t have. A certification you can&apos;t
							click through to verify is one we haven&apos;t earned yet, and
							we&apos;d rather you read that here than find it out in a registry
							search during procurement.
						</p>
					</motion.div>

					<div className="space-y-4">
						{CERTIFICATIONS.map((cert, i) => (
							<motion.div
								key={cert.name}
								className="rounded-2xl border border-do-border bg-do-bg p-6"
								{...rise}
								transition={{ duration: 0.5, delay: i * 0.06 }}
							>
								<div className="flex flex-wrap items-start justify-between gap-3 mb-3">
									<div className="min-w-0">
										<h3 className="text-lg font-semibold text-do-text leading-tight">
											{cert.name}
										</h3>
										<p className="text-[11px] font-mono text-do-text-muted uppercase tracking-wider mt-1">
											{cert.body}
										</p>
									</div>
									<StatusPill status={cert.status} />
								</div>

								<p className="text-[15px] text-do-text-secondary leading-relaxed">
									{cert.description}
								</p>

								{cert.note && (
									<p className="text-[14px] text-do-text-muted leading-relaxed mt-3 pl-3.5 border-l-2 border-do-border">
										{cert.note}
									</p>
								)}

								{cert.evidence && (
									<a
										href={cert.evidence.href}
										className="group inline-flex items-center gap-1.5 text-sm font-medium text-do-orange hover:underline mt-4"
									>
										{cert.evidence.label}
										<ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
									</a>
								)}
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* ── Cloud practices ────────────────────────────────────────────── */}
			<section id="cloud" className="relative py-20 md:py-24 scroll-mt-28 overflow-hidden">
				<div className="absolute inset-0 do-blueprint-grid pointer-events-none opacity-60" />

				<div className="relative z-10 max-w-4xl mx-auto px-6">
					<motion.div className="mb-12" {...rise}>
						<span className="do-section-label text-do-orange">Hosted platform</span>
						<h2 className="text-3xl md:text-4xl font-bold text-do-text mt-4 tracking-tight leading-[1.1]">
							If we hold your data, here&apos;s what we do with it.
						</h2>
						<p className="text-lg text-do-text-secondary leading-relaxed mt-5">
							Everything below is self-attested. We stand behind it contractually,
							but no external auditor has tested it, and this page is not going to
							pretend otherwise.
						</p>
					</motion.div>

					<div className="grid md:grid-cols-2 gap-5">
						{CLOUD_PRACTICES.map((item, i) => (
							<motion.div
								key={item.title}
								className="rounded-2xl border border-do-border bg-do-bg-card p-6"
								{...rise}
								transition={{ duration: 0.5, delay: (i % 2) * 0.08 }}
							>
								<div className="flex items-start gap-3.5">
									<div className="h-9 w-9 rounded-lg bg-do-orange/10 flex items-center justify-center shrink-0">
										<item.icon className="h-4 w-4 text-do-orange" />
									</div>
									<div className="min-w-0">
										<div className="flex flex-wrap items-center gap-2 mb-2">
											<h3 className="text-base font-semibold text-do-text">{item.title}</h3>
											<StatusPill status={item.status} short />
										</div>
										<p className="text-[14px] text-do-text-secondary leading-relaxed">
											{item.detail}
										</p>
									</div>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* ── Subprocessors ──────────────────────────────────────────────── */}
			<section
				id="subprocessors"
				className="relative py-20 md:py-24 scroll-mt-28 bg-do-bg-card border-y border-do-border"
			>
				<div className="relative z-10 max-w-4xl mx-auto px-6">
					<motion.div className="mb-10" {...rise}>
						<span className="do-section-label text-do-orange">Subprocessors</span>
						<h2 className="text-3xl md:text-4xl font-bold text-do-text mt-4 tracking-tight leading-[1.1]">
							Who else touches the data.
						</h2>
						<p className="text-lg text-do-text-secondary leading-relaxed mt-5">
							For the hosted product only. On an air-gapped deployment this table is
							empty, which is the entire argument for buying one.
						</p>
					</motion.div>

					<motion.div
						className="rounded-2xl border border-do-border bg-do-bg overflow-hidden"
						{...rise}
					>
						{SUBPROCESSORS.map((sub) => (
							<div
								key={sub.name}
								className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 px-6 py-5 border-b border-do-border last:border-b-0"
							>
								<div className="flex items-center gap-3 sm:w-44 shrink-0">
									<div className="h-8 w-8 rounded-lg bg-do-orange/10 flex items-center justify-center shrink-0">
										<sub.icon className="h-4 w-4 text-do-orange" />
									</div>
									<span className="text-[15px] font-semibold text-do-text">{sub.name}</span>
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-[14px] text-do-text">{sub.purpose}</p>
									<p className="text-[13px] text-do-text-secondary mt-0.5">{sub.data}</p>
								</div>
								<span className="text-[11px] font-mono text-do-text-muted uppercase tracking-wider shrink-0">
									{sub.region}
								</span>
							</div>
						))}
					</motion.div>

					<motion.p className="text-sm text-do-text-muted mt-6" {...rise}>
						Data handling, your rights under PIPEDA, the GDPR and the CCPA, and how to
						exercise them are set out in full in our{" "}
						<a href="/privacy" className="text-do-orange hover:underline">
							privacy policy
						</a>
						.
					</motion.p>
				</div>
			</section>

			{/* ── Disclosure ─────────────────────────────────────────────────── */}
			<section id="disclosure" className="relative py-20 md:py-24 scroll-mt-28 overflow-hidden">
				<div className="absolute inset-0 do-blueprint-grid pointer-events-none opacity-60" />

				<div className="relative z-10 max-w-4xl mx-auto px-6">
					<motion.div className="mb-10" {...rise}>
						<span className="do-section-label text-do-orange">Responsible disclosure</span>
						<h2 className="text-3xl md:text-4xl font-bold text-do-text mt-4 tracking-tight leading-[1.1]">
							Found something? Tell us.
						</h2>
						<p className="text-lg text-do-text-secondary leading-relaxed mt-5">
							Email{" "}
							<a
								href={`mailto:${SECURITY_EMAIL}`}
								className="text-do-orange hover:underline font-medium"
							>
								{SECURITY_EMAIL}
							</a>
							. A real person reads it.
						</p>
					</motion.div>

					<div className="grid md:grid-cols-2 gap-6">
						<motion.div
							className="rounded-2xl border border-do-border bg-do-bg-card p-6"
							{...rise}
						>
							<h3 className="text-base font-semibold text-do-text mb-4">
								What we commit to
							</h3>
							<ul className="space-y-3">
								{DISCLOSURE.commitment.map((line) => (
									<li key={line} className="flex items-start gap-2.5">
										<Check className="h-4 w-4 text-do-orange shrink-0 mt-0.5" />
										<span className="text-[14px] text-do-text-secondary leading-relaxed">
											{line}
										</span>
									</li>
								))}
							</ul>
						</motion.div>

						<motion.div
							className="rounded-2xl border border-do-border bg-do-bg-card p-6"
							{...rise}
							transition={{ duration: 0.5, delay: 0.08 }}
						>
							<h3 className="text-base font-semibold text-do-text mb-4">
								What we ask of you
							</h3>
							<ul className="space-y-3">
								{DISCLOSURE.boundaries.map((line) => (
									<li key={line} className="flex items-start gap-2.5">
										<span className="h-1.5 w-1.5 rounded-full bg-do-text-muted shrink-0 mt-2" />
										<span className="text-[14px] text-do-text-secondary leading-relaxed">
											{line}
										</span>
									</li>
								))}
							</ul>
						</motion.div>
					</div>
				</div>
			</section>

			{/* ── CTA ────────────────────────────────────────────────────────── */}
			<section className="relative py-20 bg-do-bg-card border-t border-do-border overflow-hidden">
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-do-orange/[0.06] rounded-full blur-[120px] pointer-events-none" />

				<div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
					<motion.div {...rise}>
						<h2 className="text-3xl md:text-4xl font-bold text-do-text tracking-tight leading-[1.1]">
							Got a security questionnaire?
						</h2>
						<p className="text-lg text-do-text-secondary leading-relaxed mt-5">
							Send it over. We&apos;ll fill it in properly, and we&apos;ll write
							&ldquo;no&rdquo; where the answer is no.
						</p>
						<div className="flex flex-wrap items-center justify-center gap-3 mt-9">
							<a
								href={contactHref}
								className="group inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-white bg-do-orange hover:bg-do-orange-dark rounded-lg transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]"
							>
								Send it to us
								<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
							</a>
							<a
								href={hardwareHref}
								className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-do-text-secondary hover:text-do-text border border-do-border hover:border-do-border-accent rounded-lg transition-all"
							>
								See the self-hosted option
							</a>
						</div>
					</motion.div>
				</div>
			</section>

			<SiteFooter />
		</main>
	);
}
