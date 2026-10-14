"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
	Apple,
	ArrowRight,
	ArrowUpRight,
	Check,
	ChevronDown,
	Download,
	Github,
	Hammer,
} from "lucide-react";
import SiteNav from "@/components/home/SiteNav";
import SiteFooter from "@/components/home/SiteFooter";
import { contactHref, demoHref } from "@/components/home/nav-data";
import { trackCta } from "@/lib/analytics";
import { APPS, OPEN_FAQ, PRINCIPLES, type OpenApp } from "./content";
import { formatReleaseDate, formatSize, type AppRelease, type ReleaseMap } from "./releases";

/* The Open Construction project page: every free desktop app in one place.

   Shape: a hero that states the deal (local, free, on par, Windows and Mac),
   then the apps — the two you can download as full-width cards with the real
   interface and the buttons, the four still being built as a grid with a
   progress ring — then the six commitments, the objections as an FAQ, and
   a CTA that asks which app to finish first rather than asking for a demo. */

const SCROLL_MT = "scroll-mt-28";

const rise = {
	initial: { opacity: 0, y: 24 },
	whileInView: { opacity: 1, y: 0 },
	viewport: { once: true, margin: "-80px" },
	transition: { duration: 0.5 },
};

/* lucide has no Windows mark, so a four-pane glyph drawn inline. */
function WindowsMark({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" aria-hidden="true" className={className} fill="currentColor">
			<path d="M1 2.6 7.3 1.7v6H1V2.6ZM8 1.6 15 .6v7.1H8V1.6ZM1 8.4h6.3v6L1 13.5V8.4Zm7 0h7v7.1L8 14.5V8.4Z" />
		</svg>
	);
}

/* One button per platform. Carries the size inline because the gap between a
   47 MB Rust app and a 600 MB Electron one is part of the pitch, and because
   nobody should start a download of unknown size on site LTE. */
function DownloadButton({
	platform,
	href,
	size,
	app,
	primary,
}: {
	platform: "mac" | "windows";
	href: string;
	size: string | null;
	app: string;
	primary: boolean;
}) {
	const label = platform === "mac" ? "Download for Mac" : "Download for Windows";
	return (
		<Link
			href={href}
			onClick={() => trackCta(`open_${app}`, label, href)}
			className={`group inline-flex items-center gap-2.5 rounded-xl px-5 py-3.5 text-sm font-medium transition-all ${
				primary
					? "bg-do-orange text-white shadow-[0_0_30px_rgba(249,115,22,0.2)] hover:bg-do-orange-dark hover:shadow-[0_0_45px_rgba(249,115,22,0.35)]"
					: "border border-do-border bg-do-bg text-do-text hover:border-do-border-accent"
			}`}
		>
			{platform === "mac" ? <Apple className="h-4 w-4" /> : <WindowsMark className="h-4 w-4" />}
			{label}
			{size && (
				<span className={`font-mono text-[11px] ${primary ? "text-white/70" : "text-do-text-muted"}`}>
					{size}
				</span>
			)}
			<Download className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />
		</Link>
	);
}

/* A ring rather than a bar: it reads as "part way" at a glance and sits in
   the icon slot, so a building app and a shipped app share one card shape. */
function ProgressRing({ value }: { value: number }) {
	const r = 20;
	const c = 2 * Math.PI * r;
	const clamped = Math.max(0, Math.min(100, value));
	return (
		<div
			className="relative flex h-14 w-14 items-center justify-center"
			role="img"
			aria-label={`${clamped}% built`}
		>
			<svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full -rotate-90">
				<circle cx="24" cy="24" r={r} className="stroke-do-border" strokeWidth="4" fill="none" />
				<circle
					cx="24"
					cy="24"
					r={r}
					className="stroke-do-orange"
					strokeWidth="4"
					fill="none"
					strokeLinecap="round"
					strokeDasharray={c}
					strokeDashoffset={c * (1 - clamped / 100)}
				/>
			</svg>
			<span className="font-mono text-xs font-semibold text-do-text">{clamped}%</span>
		</div>
	);
}

function releaseLine(release: AppRelease | undefined) {
	if (!release?.version) return null;
	const released = formatReleaseDate(release.releaseDate);
	return [`Version ${release.version}`, released && `Released ${released}`].filter(Boolean).join(" · ");
}

/* Full-width card for an app with an installer: the interface on one side,
   the pitch and the buttons on the other. Alternates sides down the page. */
function AvailableApp({
	app,
	release,
	index,
}: {
	app: OpenApp;
	release: AppRelease | undefined;
	index: number;
}) {
	const flip = index % 2 === 1;
	const line = releaseLine(release);
	return (
		<motion.article
			id={app.slug}
			className={`relative overflow-hidden rounded-3xl border border-do-border bg-do-bg-card ${SCROLL_MT}`}
			{...rise}
		>
			<div className="grid lg:grid-cols-2">
				<div className={`flex flex-col p-7 md:p-10 ${flip ? "lg:order-2" : ""}`}>
					<div className="flex items-center gap-3">
						<div className="flex h-11 w-11 items-center justify-center rounded-xl border border-do-orange/20 bg-do-orange/10">
							<app.icon className="h-5 w-5 text-do-orange" />
						</div>
						<div className="min-w-0">
							<h3 className="text-xl font-bold leading-tight tracking-tight text-do-text">
								{app.name}
							</h3>
							<p className="font-mono text-[11px] uppercase tracking-wider text-do-text-muted">
								Stands in for {app.replaces}
							</p>
						</div>
						<span className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-emerald-500">
							<Check className="h-3 w-3" />
							Available
						</span>
					</div>

					<p className="mt-5 text-lg font-medium leading-snug text-do-text">{app.tagline}</p>
					<p className="mt-3 text-[15px] leading-relaxed text-do-text-secondary">{app.detail}</p>

					<ul className="mt-5 space-y-2">
						{app.bullets.map((bullet) => (
							<li key={bullet} className="flex gap-2.5 text-sm leading-relaxed text-do-text-secondary">
								<Check className="mt-1 h-3.5 w-3.5 shrink-0 text-do-orange" />
								<span>{bullet}</span>
							</li>
						))}
					</ul>

					<div className="mt-7 flex flex-wrap items-center gap-3">
						{app.platforms?.includes("mac") && release?.mac && (
							<DownloadButton
								platform="mac"
								href={release.mac.url}
								size={formatSize(release.mac.sizeBytes)}
								app={app.slug}
								primary
							/>
						)}
						{app.platforms?.includes("windows") && release?.windows && (
							<DownloadButton
								platform="windows"
								href={release.windows.url}
								size={formatSize(release.windows.sizeBytes)}
								app={app.slug}
								primary={false}
							/>
						)}
					</div>

					<div className="mt-4 space-y-1">
						{line && <p className="text-xs text-do-text-muted">{line}</p>}
						{app.note && <p className="text-xs text-do-text-muted">{app.note}</p>}
					</div>

					{(app.source || app.learnMore) && (
						<div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-do-border pt-5">
							{app.source && (
								<a
									href={app.source}
									target="_blank"
									rel="noopener noreferrer"
									className="group inline-flex items-center gap-1.5 text-sm font-medium text-do-text-secondary transition-colors hover:text-do-orange"
								>
									<Github className="h-4 w-4" />
									Source on GitHub, Apache 2.0
									<ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
								</a>
							)}
							{app.learnMore && (
								<Link
									href={app.learnMore.href}
									className="group inline-flex items-center gap-1.5 text-sm font-medium text-do-text-secondary transition-colors hover:text-do-orange"
								>
									{app.learnMore.label}
									<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
								</Link>
							)}
						</div>
					)}
				</div>

				{app.screenshot && (
					<div
						className={`relative flex min-h-[260px] items-center overflow-hidden border-t border-do-border bg-do-bg lg:border-t-0 ${
							flip ? "lg:order-1 lg:border-r" : "lg:border-l"
						}`}
					>
						<div className="do-blueprint-grid-dense pointer-events-none absolute inset-0 opacity-50" />
						<div className="pointer-events-none absolute -inset-10 rounded-full bg-do-orange/[0.06] blur-[80px]" />
						<div className="relative w-full p-6 md:p-8">
							<Image
								src={app.screenshot.src}
								alt={app.screenshot.alt}
								width={app.screenshot.width}
								height={app.screenshot.height}
								sizes="(max-width: 1024px) 100vw, 560px"
								priority={index === 0}
								className="w-full rounded-xl border border-do-border shadow-2xl"
							/>
						</div>
					</div>
				)}
			</div>
		</motion.article>
	);
}

/* Compact card for an app still being built. No button that does nothing:
   the ring says how far along it is and the one link asks to be told. */
function BuildingApp({ app, index }: { app: OpenApp; index: number }) {
	return (
		<motion.article
			id={app.slug}
			className={`flex flex-col rounded-2xl border border-do-border bg-do-bg p-6 ${SCROLL_MT}`}
			{...rise}
			transition={{ duration: 0.5, delay: (index % 2) * 0.08 }}
		>
			<div className="flex items-start gap-4">
				<ProgressRing value={app.progress ?? 0} />
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<app.icon className="h-4 w-4 shrink-0 text-do-orange" />
						<h3 className="text-lg font-bold leading-tight tracking-tight text-do-text">
							{app.name}
						</h3>
					</div>
					<p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-do-text-muted">
						Stands in for {app.replaces}
					</p>
					<span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-do-orange/25 bg-do-orange/[0.06] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-do-orange">
						<Hammer className="h-3 w-3" />
						Being built
					</span>
				</div>
			</div>

			<p className="mt-5 text-base font-medium leading-snug text-do-text">{app.tagline}</p>
			<p className="mt-2.5 text-sm leading-relaxed text-do-text-secondary">{app.detail}</p>

			<ul className="mt-4 space-y-1.5">
				{app.bullets.map((bullet) => (
					<li key={bullet} className="flex gap-2.5 text-sm leading-relaxed text-do-text-secondary">
						<span className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-do-orange" />
						<span>{bullet}</span>
					</li>
				))}
			</ul>

			<div className="mt-auto pt-6">
				<Link
					href={`${contactHref}?about=${app.slug}`}
					onClick={() => trackCta(`open_${app.slug}`, "Tell me when it ships")}
					className="group inline-flex items-center gap-1.5 text-sm font-medium text-do-orange hover:underline"
				>
					Tell me when it ships
					<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
				</Link>
			</div>
		</motion.article>
	);
}

export default function OpenContent({ releases }: { releases: ReleaseMap }) {
	const [openFaq, setOpenFaq] = useState<number | null>(0);
	const available = APPS.filter((app) => app.status === "available");
	const building = APPS.filter((app) => app.status === "building");

	return (
		<main className="min-h-screen bg-do-bg">
			<SiteNav />

			{/* ── Hero ───────────────────────────────────────────────────────── */}
			<section className="relative overflow-hidden pt-36 pb-14 md:pt-44 md:pb-16">
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
							<Github className="h-3.5 w-3.5" />
							The Open Construction project
						</span>

						<h1 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight text-do-text md:text-5xl lg:text-6xl">
							The construction office, as free apps that run on your own machine.
						</h1>

						<p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-do-text-secondary md:text-xl">
							Takeoff, drawing checking, contract review, scheduling and documents.
							Native Windows and Mac apps, nothing sent anywhere, each one built to
							stand in for the commercial tool it replaces.
						</p>

						<div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
							<a
								href="#apps"
								className="group inline-flex items-center gap-2.5 rounded-xl bg-do-orange px-7 py-4 text-base font-medium text-white shadow-[0_0_30px_rgba(249,115,22,0.25)] transition-all hover:bg-do-orange-dark hover:shadow-[0_0_45px_rgba(249,115,22,0.4)]"
							>
								<Download className="h-4 w-4" />
								See the apps
							</a>
							<a
								href="https://github.com/constructionlive"
								target="_blank"
								rel="noopener noreferrer"
								className="group inline-flex items-center gap-2 rounded-xl border border-do-border px-6 py-4 text-base font-medium text-do-text-secondary transition-all hover:border-do-border-accent hover:text-do-text"
							>
								<Github className="h-4 w-4" />
								GitHub
								<ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
							</a>
						</div>
					</motion.div>

					{/* The roster: every app and where it stands, before the scroll. */}
					<motion.ul
						className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-do-border bg-do-border sm:grid-cols-3 lg:grid-cols-6"
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.15 }}
					>
						{APPS.map((app) => (
							<li key={app.slug} className="bg-do-bg-card">
								<a href={`#${app.slug}`} className="group flex h-full flex-col gap-3 px-4 py-5">
									<div className="flex items-center justify-between">
										<app.icon className="h-4.5 w-4.5 text-do-orange" />
										{app.status === "available" ? (
											<span className="font-mono text-[10px] uppercase tracking-wider text-emerald-500">
												Ready
											</span>
										) : (
											<span className="font-mono text-[10px] uppercase tracking-wider text-do-text-muted">
												{app.progress}%
											</span>
										)}
									</div>
									<span className="text-sm font-semibold leading-tight text-do-text group-hover:text-do-orange">
										{app.name}
									</span>
									<span className="mt-auto h-1 w-full overflow-hidden rounded-full bg-do-border">
										<span
											className={`block h-full rounded-full ${
												app.status === "available" ? "bg-emerald-500" : "bg-do-orange"
											}`}
											style={{ width: `${app.status === "available" ? 100 : app.progress ?? 0}%` }}
										/>
									</span>
								</a>
							</li>
						))}
					</motion.ul>
				</div>
			</section>

			{/* ── Available ──────────────────────────────────────────────────── */}
			<section id="apps" className={`relative py-20 md:py-24 ${SCROLL_MT}`}>
				<div className="relative z-10 mx-auto max-w-6xl px-6">
					<motion.div className="mb-12 max-w-2xl" {...rise}>
						<span className="do-section-label text-do-orange">Download today</span>
						<h2 className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight text-do-text md:text-4xl lg:text-5xl">
							Two apps you can install this afternoon.
						</h2>
						<p className="mt-5 text-lg leading-relaxed text-do-text-secondary">
							Signed and notarized, free, no account. They update themselves, so
							this is the last version number you have to read.
						</p>
					</motion.div>

					<div className="space-y-8">
						{available.map((app, i) => (
							<AvailableApp
								key={app.slug}
								app={app}
								release={app.releaseKey ? releases[app.releaseKey] : undefined}
								index={i}
							/>
						))}
					</div>
				</div>
			</section>

			{/* ── Being built ────────────────────────────────────────────────── */}
			<section
				id="building"
				className={`relative border-y border-do-border bg-do-bg-card py-20 md:py-24 ${SCROLL_MT}`}
			>
				<div className="do-blueprint-grid pointer-events-none absolute inset-0 opacity-60" />
				<div className="relative z-10 mx-auto max-w-6xl px-6">
					<motion.div className="mb-12 max-w-2xl" {...rise}>
						<span className="do-section-label text-do-orange">Being built</span>
						<h2 className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight text-do-text md:text-4xl lg:text-5xl">
							Four more, in the order the work gets painful.
						</h2>
						<p className="mt-5 text-lg leading-relaxed text-do-text-secondary">
							The ring is how far along each one is against the list on its card.
							An app gets a download button when it can stand in for the
							commercial tool on a real job, not before.
						</p>
					</motion.div>

					<div className="grid gap-5 md:grid-cols-2">
						{building.map((app, i) => (
							<BuildingApp key={app.slug} app={app} index={i} />
						))}
					</div>
				</div>
			</section>

			{/* ── Principles ─────────────────────────────────────────────────── */}
			<section id="principles" className={`relative overflow-hidden py-20 md:py-28 ${SCROLL_MT}`}>
				<div className="relative z-10 mx-auto max-w-6xl px-6">
					<motion.div className="mb-14 max-w-2xl" {...rise}>
						<span className="do-section-label text-do-orange">What every app is held to</span>
						<h2 className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight text-do-text md:text-4xl lg:text-5xl">
							Local, native, free, and no worse than what you pay for now.
						</h2>
					</motion.div>

					<div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
						{PRINCIPLES.map((item, i) => (
							<motion.div key={item.title} {...rise} transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}>
								<div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-do-orange/20 bg-do-orange/10">
									<item.icon className="h-5 w-5 text-do-orange" />
								</div>
								<h3 className="mb-2.5 text-lg font-semibold text-do-text">{item.title}</h3>
								<p className="text-[15px] leading-relaxed text-do-text-secondary">{item.detail}</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* ── FAQ ────────────────────────────────────────────────────────── */}
			<section className="relative overflow-hidden border-t border-do-border bg-do-bg-card py-20 md:py-28">
				<div className="do-blueprint-grid pointer-events-none absolute inset-0 opacity-60" />
				<div className="relative z-10 mx-auto max-w-3xl px-6">
					<motion.div className="mb-10" {...rise}>
						<span className="do-section-label text-do-orange">Questions</span>
						<h2 className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight text-do-text md:text-4xl">
							Before you install anything.
						</h2>
					</motion.div>

					<div className="divide-y divide-do-border overflow-hidden rounded-2xl border border-do-border bg-do-bg">
						{OPEN_FAQ.map((item, i) => (
							<div key={item.question}>
								<button
									type="button"
									className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
									onClick={() => setOpenFaq(openFaq === i ? null : i)}
									aria-expanded={openFaq === i}
								>
									<span className="text-[15px] font-medium text-do-text">{item.question}</span>
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
			<section className="relative overflow-hidden border-t border-do-border py-20 md:py-24">
				<div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-do-orange/[0.06] blur-[120px]" />
				<div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
					<motion.div {...rise}>
						<h2 className="text-3xl font-bold leading-[1.1] tracking-tight text-do-text md:text-4xl">
							Tell us which one to finish first.
						</h2>
						<p className="mt-5 text-lg leading-relaxed text-do-text-secondary">
							The order above is our guess at where the pain is. If your office
							would switch tomorrow for the contract reviewer or the schedule, say
							so, and send the file formats you need it to open.
						</p>
						<div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
							<Link
								href={contactHref}
								onClick={() => trackCta("open_footer", "Tell us")}
								className="group inline-flex items-center gap-2.5 rounded-xl bg-do-orange px-7 py-4 text-base font-medium text-white transition-all hover:bg-do-orange-dark"
							>
								Tell us
								<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
							</Link>
							<Link
								href={demoHref}
								className="inline-flex items-center gap-2 rounded-xl border border-do-border px-6 py-4 text-base font-medium text-do-text-secondary transition-all hover:border-do-border-accent hover:text-do-text"
							>
								Or see the team platform
							</Link>
						</div>
					</motion.div>
				</div>
			</section>

			<SiteFooter />
		</main>
	);
}
