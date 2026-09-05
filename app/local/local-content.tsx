"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Apple, ArrowRight, ChevronDown, Cpu, Check, Download } from "lucide-react";
import SiteNav from "@/components/home/SiteNav";
import SiteFooter from "@/components/home/SiteFooter";
import { contactHref, demoHref } from "@/components/home/nav-data";
import { trackCta } from "@/lib/analytics";
import {
	CAPABILITIES,
	INSTALL_STEPS,
	LOCAL_FAQ,
	PLATFORM,
	STATS,
	THE_LADDER,
	WHY_LOCAL,
} from "./content";
import { formatReleaseDate, formatSize, FALLBACK_DOWNLOAD_URL, type Release } from "./release";

/* Product-led, in the shape of a modern developer-tool landing page: the real
   interface as the hero rather than an illustration, the two platform buttons
   above the fold, then what it does, why local, where it sits in the ladder,
   and the objections as an FAQ.

   TODO: swap HERO_SHOT for the local-model screenshot (the composer with
   "Local · Qwen3.8-4B-Q4_K_M" in the model picker). The current image is a
   real screenshot of the same app, so the page is not broken while we wait,
   but it does not show the one thing this page exists to show. */
const HERO_SHOT = {
	src: "/images/resources/why-drawings-estimation-workspace.webp",
	width: 1680,
	height: 1009,
	alt: "The construction.live desktop app with a drawing open in the estimation workspace",
};

const SCROLL_MT = "scroll-mt-28";

const rise = {
	initial: { opacity: 0, y: 24 },
	whileInView: { opacity: 1, y: 0 },
	viewport: { once: true, margin: "-80px" },
	transition: { duration: 0.5 },
};

/* One button, because there is one build. It carries the platform requirement
   inline rather than in a footnote: an estimator on an Intel MacBook needs to
   learn that before the 600 MB starts, not after. */
function DownloadMac({
	href,
	location,
}: {
	href: string;
	location: string;
}) {
	return (
		<Link
			href={href}
			onClick={() => trackCta(location, "Download for Mac", href)}
			className="group inline-flex items-center gap-2.5 rounded-xl bg-do-orange px-7 py-4 text-base font-medium text-white shadow-[0_0_30px_rgba(249,115,22,0.25)] transition-all hover:bg-do-orange-dark hover:shadow-[0_0_45px_rgba(249,115,22,0.4)]"
		>
			<Apple className="h-4.5 w-4.5" />
			Download for Mac
			<Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
		</Link>
	);
}

/* Stated, not rendered as a button. A greyed-out Windows button still gets
   clicked, and a click that does nothing costs more than a sentence. */
function WindowsNote() {
	return (
		<p className="text-sm text-do-text-muted">
			Windows and Intel Mac:{" "}
			<Link href={contactHref} className="text-do-orange hover:underline">
				tell us and we&apos;ll let you know
			</Link>
		</p>
	);
}

export default function LocalContent({ release }: { release: Release | null }) {
	const [openFaq, setOpenFaq] = useState<number | null>(0);

	/* If the manifest could not be read we still ship a working button, just
	   without the version line — see the note in release.ts. */
	const downloadUrl = release?.downloadUrl ?? FALLBACK_DOWNLOAD_URL;
	const size = formatSize(release?.sizeBytes ?? null);
	const released = formatReleaseDate(release?.releaseDate ?? null);
	const releaseLine = release
		? [`Version ${release.version}`, size, released && `Released ${released}`]
				.filter(Boolean)
				.join(" · ")
		: null;

	return (
		<main className="min-h-screen bg-do-bg">
			<SiteNav />

			{/* ── Hero ───────────────────────────────────────────────────────── */}
			<section className="relative overflow-hidden pt-36 pb-16 md:pt-44 md:pb-20">
				<div className="do-blueprint-grid pointer-events-none absolute inset-0" />
				<div className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-do-orange/[0.05] blur-[140px]" />

				<div className="relative z-10 mx-auto max-w-6xl px-6">
					<motion.div
						className="mx-auto max-w-3xl text-center"
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<span className="do-section-label inline-flex items-center gap-2 text-do-orange">
							<Cpu className="h-3.5 w-3.5" />
							Free desktop app
						</span>

						<h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-do-text md:text-5xl lg:text-6xl">
							Construction AI that runs on your machine.
						</h1>

						<p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-do-text-secondary md:text-xl">
							A free Mac app with the model already on the disk. Read a drawing set,
							work an estimate, ask about a contract — with the site Wi-Fi down and
							nothing sent to a model vendor.
						</p>

						<div className="mt-9 flex flex-col items-center gap-3">
							<DownloadMac href={downloadUrl} location="local_hero" />
							<p className="font-mono text-xs uppercase tracking-wider text-do-text-muted">
								{PLATFORM.requirement}
							</p>
						</div>

						{releaseLine && (
							<p className="mt-4 text-xs text-do-text-muted">{releaseLine}</p>
						)}

						<div className="mt-5">
							<WindowsNote />
						</div>
					</motion.div>

					{/* The product, not an illustration. */}
					<motion.div
						className="relative mx-auto mt-14 max-w-5xl"
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7, delay: 0.15 }}
					>
						<div className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-do-orange/[0.08] blur-[70px]" />
						<Image
							src={HERO_SHOT.src}
							alt={HERO_SHOT.alt}
							width={HERO_SHOT.width}
							height={HERO_SHOT.height}
							sizes="(max-width: 1024px) 100vw, 1024px"
							priority
							className="relative w-full rounded-2xl border border-do-border shadow-2xl"
						/>
					</motion.div>

					<motion.dl
						className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-do-border bg-do-border lg:grid-cols-4"
						{...rise}
					>
						{STATS.map((stat) => (
							<div key={stat.label} className="bg-do-bg-card px-5 py-6">
								<dt className="text-2xl font-bold tracking-tight text-do-text md:text-3xl">
									{stat.value}
								</dt>
								<dd className="mt-1.5 text-xs leading-snug text-do-text-secondary">
									{stat.label}
								</dd>
							</div>
						))}
					</motion.dl>
				</div>
			</section>

			{/* ── What is in it ──────────────────────────────────────────────── */}
			<section
				id="features"
				className={`relative border-y border-do-border bg-do-bg-card py-24 md:py-28 ${SCROLL_MT}`}
			>
				<div className="relative z-10 mx-auto max-w-6xl px-6">
					<motion.div className="mb-14 max-w-2xl" {...rise}>
						<span className="do-section-label text-do-orange">What is in it</span>
						<h2 className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight text-do-text md:text-4xl lg:text-5xl">
							The whole workspace, not a chat box with a logo on it.
						</h2>
						<p className="mt-5 text-lg leading-relaxed text-do-text-secondary">
							It is the same product we build for the office, running against a model
							on your own disk instead of one in a data centre.
						</p>
					</motion.div>

					<div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
						{CAPABILITIES.map((item, i) => (
							<motion.div
								key={item.title}
								className="rounded-2xl border border-do-border bg-do-bg p-6"
								{...rise}
								transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
							>
								<div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-do-border bg-do-bg-card">
									<item.icon className="h-5 w-5 text-do-orange" />
								</div>
								<h3 className="mb-2 text-base font-semibold text-do-text">
									{item.title}
								</h3>
								<p className="text-sm leading-relaxed text-do-text-secondary">
									{item.detail}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* ── Why local ──────────────────────────────────────────────────── */}
			<section className="relative overflow-hidden py-24 md:py-32">
				<div className="do-blueprint-grid pointer-events-none absolute inset-0 opacity-60" />

				<div className="relative z-10 mx-auto max-w-6xl px-6">
					<motion.div className="mb-14 max-w-2xl" {...rise}>
						<span className="do-section-label text-do-orange">Why local</span>
						<h2 className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight text-do-text md:text-4xl lg:text-5xl">
							The weights are on your disk. That changes three things.
						</h2>
					</motion.div>

					<div className="grid gap-10 md:grid-cols-3 md:gap-12">
						{WHY_LOCAL.map((item, i) => (
							<motion.div key={item.title} {...rise} transition={{ duration: 0.5, delay: i * 0.1 }}>
								<div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-do-orange/20 bg-do-orange/10">
									<item.icon className="h-5 w-5 text-do-orange" />
								</div>
								<h3 className="mb-2.5 text-lg font-semibold text-do-text">{item.title}</h3>
								<p className="text-[15px] leading-relaxed text-do-text-secondary">
									{item.detail}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* ── Installing it ──────────────────────────────────────────────── */}
			<section id="install" className={`relative overflow-hidden py-24 md:py-28 ${SCROLL_MT}`}>
				<div className="relative z-10 mx-auto max-w-6xl px-6">
					<motion.div className="mb-12 max-w-2xl" {...rise}>
						<span className="do-section-label text-do-orange">Installing it</span>
						<h2 className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight text-do-text md:text-4xl">
							Three steps, and one thing worth knowing.
						</h2>
					</motion.div>

					<div className="grid gap-8 md:grid-cols-3 md:gap-10">
						{INSTALL_STEPS.map((step, i) => (
							<motion.div key={step.title} {...rise} transition={{ duration: 0.5, delay: i * 0.1 }}>
								<span className="font-mono text-xs text-do-orange">
									{String(i + 1).padStart(2, "0")}
								</span>
								<h3 className="mb-2 mt-3 text-base font-semibold text-do-text">
									{step.title}
								</h3>
								<p className="text-[15px] leading-relaxed text-do-text-secondary">
									{step.detail}
								</p>
							</motion.div>
						))}
					</div>

					<motion.p className="mt-10 max-w-2xl text-sm text-do-text-muted" {...rise}>
						{PLATFORM.note} Once it is installed the app keeps itself up to date, so
						this is the last time you have to think about a version number.
					</motion.p>
				</div>
			</section>

			{/* ── The ladder ─────────────────────────────────────────────────── */}
			<section
				id="ladder"
				className={`relative border-y border-do-border bg-do-bg-card py-24 md:py-32 ${SCROLL_MT}`}
			>
				<div className="relative z-10 mx-auto max-w-6xl px-6">
					<motion.div className="mb-14 max-w-2xl" {...rise}>
						<span className="do-section-label text-do-orange">Where this sits</span>
						<h2 className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight text-do-text md:text-4xl lg:text-5xl">
							Same argument, three sizes of room.
						</h2>
						<p className="mt-5 text-lg leading-relaxed text-do-text-secondary">
							Keeping your project data away from a model vendor is one idea. What
							changes is how much of the company is behind that line.
						</p>
					</motion.div>

					<div className="grid gap-6 lg:grid-cols-3">
						{THE_LADDER.map((rung, i) => (
							<motion.div
								key={rung.name}
								className={`relative flex flex-col rounded-2xl border p-7 ${
									rung.current
										? "border-do-orange/40 bg-do-bg shadow-xl"
										: "border-do-border bg-do-bg/60"
								}`}
								{...rise}
								transition={{ duration: 0.5, delay: i * 0.1 }}
							>
								{rung.current && (
									<span className="absolute -top-3 left-7 rounded-full bg-do-orange px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-white">
										You are here
									</span>
								)}

								<div className="mb-4 flex items-center gap-3">
									<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-do-orange/10">
										<rung.icon className="h-4 w-4 text-do-orange" />
									</div>
									<div className="min-w-0">
										<h3 className="text-lg font-semibold leading-tight text-do-text">
											{rung.name}
										</h3>
										<p className="truncate font-mono text-[11px] uppercase tracking-wider text-do-text-muted">
											{rung.scope}
										</p>
									</div>
								</div>

								<p className="mb-2 text-base font-medium text-do-text">{rung.headline}</p>
								<p className="mb-6 text-sm leading-relaxed text-do-text-secondary">
									{rung.detail}
								</p>

								{rung.cta ? (
									<Link
										href={rung.cta.href}
										className="group mt-auto inline-flex w-full items-center justify-center gap-2 rounded-lg border border-do-border px-5 py-3 text-sm font-medium text-do-text-secondary transition-all hover:border-do-border-accent hover:text-do-text"
									>
										{rung.cta.label}
										<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
									</Link>
								) : (
									<span className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-lg border border-do-orange/25 bg-do-orange/[0.06] px-5 py-3 text-sm font-medium text-do-orange">
										<Check className="h-3.5 w-3.5" />
										This page
									</span>
								)}
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* ── FAQ ────────────────────────────────────────────────────────── */}
			<section className="relative overflow-hidden py-24 md:py-28">
				<div className="do-blueprint-grid pointer-events-none absolute inset-0 opacity-60" />

				<div className="relative z-10 mx-auto max-w-3xl px-6">
					<motion.div className="mb-10" {...rise}>
						<span className="do-section-label text-do-orange">Questions</span>
						<h2 className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight text-do-text md:text-4xl">
							Before you download it.
						</h2>
					</motion.div>

					<div className="divide-y divide-do-border overflow-hidden rounded-2xl border border-do-border bg-do-bg-card">
						{LOCAL_FAQ.map((item, i) => (
							<div key={item.question}>
								<button
									type="button"
									className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
									onClick={() => setOpenFaq(openFaq === i ? null : i)}
									aria-expanded={openFaq === i}
								>
									<span className="text-[15px] font-medium text-do-text">
										{item.question}
									</span>
									<ChevronDown
										className={`h-4 w-4 shrink-0 text-do-text-muted transition-transform ${
											openFaq === i ? "rotate-180" : ""
										}`}
									/>
								</button>
								{openFaq === i && (
									<p className="-mt-1 px-6 pb-5 text-[15px] leading-relaxed text-do-text-secondary">
										{item.answer}
									</p>
								)}
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ── CTA ────────────────────────────────────────────────────────── */}
			<section className="relative overflow-hidden border-t border-do-border bg-do-bg-card py-20 md:py-24">
				<div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-do-orange/[0.06] blur-[120px]" />

				<div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
					<motion.div {...rise}>
						<h2 className="text-3xl font-bold leading-[1.1] tracking-tight text-do-text md:text-4xl">
							Put it on your laptop and point it at a real job.
						</h2>
						<p className="mt-5 text-lg leading-relaxed text-do-text-secondary">
							It costs nothing and it asks for nothing. If it turns out the whole
							office needs this, that conversation is a different page.
						</p>
						<div className="mt-9 flex flex-col items-center gap-3">
							<DownloadMac href={downloadUrl} location="local_footer" />
							<p className="font-mono text-xs uppercase tracking-wider text-do-text-muted">
								{PLATFORM.requirement}
							</p>
						</div>
						<p className="mt-6 text-sm text-do-text-muted">
							Want the team on it instead?{" "}
							<Link href={demoHref} className="text-do-orange hover:underline">
								Book a demo
							</Link>
						</p>
					</motion.div>
				</div>
			</section>

			<SiteFooter />
		</main>
	);
}
