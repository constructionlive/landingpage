"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
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
	Pause,
	Play,
	Volume2,
	VolumeX,
} from "lucide-react";
import SiteNav from "@/components/home/SiteNav";
import SiteFooter from "@/components/home/SiteFooter";
import { contactHref } from "@/components/home/nav-data";
import { trackCta } from "@/lib/analytics";
import DownloadPrompt, { type DownloadInfo } from "./DownloadPrompt";
import { APPS, FILM, MANIFESTO, OPEN_FAQ, ROAD, STATS, type OpenApp } from "./content";
import { formatReleaseDate, formatSize, type AppRelease, type ReleaseMap } from "./releases";

/* The Open Construction project.

   This page leads with a position, not a product: construction software
   should be free, open and run on your own machine, and we are building the
   whole office that way. The order follows that argument. The claim and the
   film first, then the measured numbers that make it credible, then the four
   beliefs as a manifesto, then the road (six apps, where each one stands),
   then the two you can install, the four being built, and the questions.

   It uses the house language (Inter, JetBrains Mono labels, the orange, the
   blueprint grid) but at a larger scale and with more air than the product
   pages, because a manifesto read at feature-grid density is a feature grid. */

const SCROLL_MT = "scroll-mt-28";
const PLAY_EVENT = "open:play-film";

const rise = {
	initial: { opacity: 0, y: 24 },
	whileInView: { opacity: 1, y: 0 },
	viewport: { once: true, margin: "-80px" },
	transition: { duration: 0.6 },
};

/* lucide has no Windows mark, so a four-pane glyph drawn inline. */
function WindowsMark({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 16 16" aria-hidden="true" className={className} fill="currentColor">
			<path d="M1 2.6 7.3 1.7v6H1V2.6ZM8 1.6 15 .6v7.1H8V1.6ZM1 8.4h6.3v6L1 13.5V8.4Zm7 0h7v7.1L8 14.5V8.4Z" />
		</svg>
	);
}

/* ── The film ──────────────────────────────────────────────────────────────
   Autoplays muted and looping, the way a launch film on a product page is
   expected to. One overlay button starts it from the top with sound; the hero
   button does the same from a distance through a window event, so a reader
   who clicks "Watch the film" gets the film, not a scroll to a silent loop. */
function Film() {
	const video = useRef<HTMLVideoElement>(null);
	const [muted, setMuted] = useState(true);
	const [paused, setPaused] = useState(false);
	const [watching, setWatching] = useState(false);

	const watchWithSound = () => {
		const el = video.current;
		if (!el) return;
		el.currentTime = 0;
		el.muted = false;
		el.loop = false;
		setMuted(false);
		setWatching(true);
		void el.play();
		trackCta("open_film", "Watch the film");
	};

	useEffect(() => {
		const onPlay = () => {
			document.getElementById("film")?.scrollIntoView({ behavior: "smooth", block: "center" });
			watchWithSound();
		};
		window.addEventListener(PLAY_EVENT, onPlay);
		return () => window.removeEventListener(PLAY_EVENT, onPlay);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const toggleMute = () => {
		const el = video.current;
		if (!el) return;
		el.muted = !el.muted;
		setMuted(el.muted);
	};

	const togglePause = () => {
		const el = video.current;
		if (!el) return;
		if (el.paused) void el.play();
		else el.pause();
	};

	return (
		<div id="film" className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#07090f] shadow-[0_40px_120px_-30px_rgba(0,0,0,0.7)] md:rounded-3xl">
			<video
				ref={video}
				src={FILM.src}
				poster={FILM.poster}
				autoPlay
				muted
				loop
				playsInline
				preload="metadata"
				onPlay={() => setPaused(false)}
				onPause={() => setPaused(true)}
				onEnded={() => {
					setWatching(false);
					const el = video.current;
					if (el) {
						el.loop = true;
						el.muted = true;
						setMuted(true);
						void el.play();
					}
				}}
				className="aspect-video w-full"
				aria-label={FILM.title}
			/>

			{!watching && (
				<button
					type="button"
					onClick={watchWithSound}
					className="absolute inset-0 flex items-end justify-start p-4 md:p-6"
					aria-label="Watch the film with sound"
				>
					<span className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-black/50 py-3 pl-3 pr-6 text-sm font-medium text-white backdrop-blur-md transition-all group-hover:border-do-orange/60 group-hover:bg-black/70">
						<span className="flex h-10 w-10 items-center justify-center rounded-full bg-do-orange">
							<Play className="ml-0.5 h-4 w-4 fill-white text-white" />
						</span>
						Watch the film
						<span className="font-mono text-xs text-white/60">{FILM.duration}</span>
					</span>
				</button>
			)}

			<div className="absolute bottom-3 right-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
				<button
					type="button"
					onClick={togglePause}
					className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md"
					aria-label={paused ? "Play" : "Pause"}
				>
					{paused ? <Play className="ml-0.5 h-4 w-4" /> : <Pause className="h-4 w-4" />}
				</button>
				<button
					type="button"
					onClick={toggleMute}
					className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-md"
					aria-label={muted ? "Unmute" : "Mute"}
				>
					{muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
				</button>
			</div>
		</div>
	);
}

/* One button per platform, size inline, because the gap between a 47 MB Rust
   app and a 600 MB Electron one is part of the pitch, and nobody should start
   a download of unknown size on site LTE. */
function DownloadButton({
	platform,
	href,
	size,
	app,
	primary,
	onStart,
}: {
	platform: "mac" | "windows";
	href: string;
	size: string | null;
	app: OpenApp;
	primary: boolean;
	onStart: (info: DownloadInfo) => void;
}) {
	const label = platform === "mac" ? "Download for Mac" : "Download for Windows";
	return (
		<Link
			href={href}
			/* The browser follows the link and starts the file; the prompt opens
			   beside it. Not preventDefault: the download must never depend on
			   the prompt. */
			onClick={() => {
				trackCta(`open_${app.slug}`, label, href);
				onStart({ app: app.name, platform });
			}}
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
   the icon slot, so a building app and a shipped app share one shape. */
function ProgressRing({ value, size = 56 }: { value: number; size?: number }) {
	const r = 20;
	const c = 2 * Math.PI * r;
	const clamped = Math.max(0, Math.min(100, value));
	return (
		<div
			className="relative flex shrink-0 items-center justify-center"
			style={{ width: size, height: size }}
			role="img"
			aria-label={`${clamped}% built`}
		>
			<svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full -rotate-90">
				<circle cx="24" cy="24" r={r} className="stroke-do-border" strokeWidth="3.5" fill="none" />
				<circle
					cx="24"
					cy="24"
					r={r}
					className="stroke-do-orange"
					strokeWidth="3.5"
					fill="none"
					strokeLinecap="round"
					strokeDasharray={c}
					strokeDashoffset={c * (1 - clamped / 100)}
				/>
			</svg>
			<span className="font-mono text-[11px] font-semibold text-do-text">{clamped}%</span>
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
	onStart,
}: {
	app: OpenApp;
	release: AppRelease | undefined;
	index: number;
	onStart: (info: DownloadInfo) => void;
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
					<div className="flex items-start gap-3">
						<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-do-orange/20 bg-do-orange/10">
							<app.icon className="h-5 w-5 text-do-orange" />
						</div>
						<div className="min-w-0">
							<h3 className="text-2xl font-bold leading-tight tracking-tight text-do-text">
								{app.name}
							</h3>
							<p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-do-text-muted">
								Stands in for {app.replaces}
							</p>
						</div>
						<span className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-emerald-500">
							<Check className="h-3 w-3" />
							Shipped
						</span>
					</div>

					<p className="mt-6 text-lg font-medium leading-snug text-do-text">{app.tagline}</p>
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
								app={app}
								primary
								onStart={onStart}
							/>
						)}
						{app.platforms?.includes("windows") && release?.windows && (
							<DownloadButton
								platform="windows"
								href={release.windows.url}
								size={formatSize(release.windows.sizeBytes)}
								app={app}
								primary={false}
								onStart={onStart}
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
			className={`flex flex-col rounded-2xl border border-do-border bg-do-bg p-6 md:p-7 ${SCROLL_MT}`}
			{...rise}
			transition={{ duration: 0.5, delay: (index % 2) * 0.08 }}
		>
			<div className="flex items-start gap-4">
				<ProgressRing value={app.progress ?? 0} />
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<app.icon className="h-4 w-4 shrink-0 text-do-orange" />
						<h3 className="text-xl font-bold leading-tight tracking-tight text-do-text">
							{app.name}
						</h3>
					</div>
					<p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-do-text-muted">
						Stands in for {app.replaces}
					</p>
					<span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-do-orange/25 bg-do-orange/[0.06] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-do-orange">
						<Hammer className="h-3 w-3" />
						In the open
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

/* ── The road ──────────────────────────────────────────────────────────────
   Six stations on one rail. Shipped apps are solid orange stops; the rest are
   rings showing how far along they are. The rail itself fills to the last
   shipped app, so the eye reads "this far, and heading that way". */
function Road() {
	const shipped = APPS.filter((app) => app.status === "available").length;
	const fill = ((shipped - 0.5) / (APPS.length - 1)) * 100;
	return (
		<div className="relative">
			{/* The rail, desktop only. On mobile the stations stack and the rail runs down the left. */}
			<div className="absolute left-0 right-0 top-[27px] hidden h-px bg-do-border lg:block" />
			<motion.div
				className="absolute left-0 top-[27px] hidden h-px bg-do-orange lg:block"
				initial={{ width: 0 }}
				whileInView={{ width: `${fill}%` }}
				viewport={{ once: true }}
				transition={{ duration: 1.2, ease: "easeOut" }}
			/>
			<div className="absolute bottom-6 left-[27px] top-6 w-px bg-do-border lg:hidden" />

			<ol className="relative grid gap-8 lg:grid-cols-6 lg:gap-4">
				{APPS.map((app, i) => (
					<motion.li
						key={app.slug}
						{...rise}
						transition={{ duration: 0.5, delay: i * 0.08 }}
					>
						<a href={`#${app.slug}`} className="group flex items-start gap-4 lg:flex-col lg:gap-5">
							{app.status === "available" ? (
								<span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-do-bg bg-do-orange shadow-[0_0_0_1px_rgba(249,115,22,0.4),0_0_30px_rgba(249,115,22,0.35)]">
									<app.icon className="h-5 w-5 text-white" />
								</span>
							) : (
								<span className="rounded-full border-4 border-do-bg bg-do-bg-card">
									<ProgressRing value={app.progress ?? 0} size={48} />
								</span>
							)}
							<span className="min-w-0 pt-1 lg:pt-0">
								<span className="block font-mono text-[10px] uppercase tracking-wider text-do-text-muted">
									{String(i + 1).padStart(2, "0")} ·{" "}
									{app.status === "available" ? "Shipped" : "Building"}
								</span>
								<span className="mt-1 block text-base font-semibold leading-tight text-do-text transition-colors group-hover:text-do-orange">
									{app.name}
								</span>
								<span className="mt-1 block text-[13px] leading-snug text-do-text-secondary">
									{app.replaces}
								</span>
							</span>
						</a>
					</motion.li>
				))}
			</ol>
		</div>
	);
}

export default function OpenContent({ releases }: { releases: ReleaseMap }) {
	const [openFaq, setOpenFaq] = useState<number | null>(0);
	const [download, setDownload] = useState<DownloadInfo | null>(null);
	const closePrompt = useCallback(() => setDownload(null), []);
	const available = APPS.filter((app) => app.status === "available");
	const building = APPS.filter((app) => app.status === "building");
	const takeoff = releases.takeoff;

	return (
		<main className="min-h-screen bg-do-bg">
			<SiteNav />

			{/* ── The claim, and the film ───────────────────────────────────── */}
			<section className="relative overflow-hidden pt-36 pb-10 md:pt-48 md:pb-14">
				<div className="do-blueprint-grid pointer-events-none absolute inset-0" />
				<div className="pointer-events-none absolute left-1/2 top-[-200px] h-[700px] w-[900px] -translate-x-1/2 rounded-full bg-do-orange/[0.07] blur-[160px]" />

				<div className="relative z-10 mx-auto max-w-6xl px-6">
					<motion.div
						className="max-w-4xl"
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7 }}
					>
						<span className="do-section-label inline-flex items-center gap-2 text-do-orange">
							<span className="h-px w-8 bg-do-orange" />
							The Open Construction project
						</span>

						<h1 className="mt-6 text-[2.75rem] font-bold leading-[1.02] tracking-[-0.03em] text-do-text sm:text-6xl md:text-7xl lg:text-[5.25rem]">
							Construction software should be free, open, and{" "}
							<span className="text-do-orange">yours.</span>
						</h1>

						<p className="mt-8 max-w-2xl text-lg leading-relaxed text-do-text-secondary md:text-[1.35rem] md:leading-relaxed">
							We are building the whole construction office as native apps that run
							on your own machine. No seat, no server, no vendor between you and your
							drawings. One app at a time, in the open, until the office is done.
						</p>

						<div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
							{takeoff.mac && (
								<Link
									href="#takeoff"
									onClick={() => trackCta("open_hero", "Get Takeoff Beam", "#takeoff")}
									className="group inline-flex items-center justify-center gap-2.5 rounded-xl bg-do-orange px-7 py-4 text-base font-medium text-white shadow-[0_0_30px_rgba(249,115,22,0.25)] transition-all hover:bg-do-orange-dark hover:shadow-[0_0_45px_rgba(249,115,22,0.4)]"
								>
									<Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
									Get Takeoff Beam
									<span className="font-mono text-xs text-white/70">Mac · Windows</span>
								</Link>
							)}
							<button
								type="button"
								onClick={() => window.dispatchEvent(new Event(PLAY_EVENT))}
								className="group inline-flex items-center justify-center gap-2.5 rounded-xl border border-do-border px-6 py-4 text-base font-medium text-do-text-secondary transition-all hover:border-do-border-accent hover:text-do-text"
							>
								<Play className="h-4 w-4 fill-current" />
								Watch the film
								<span className="font-mono text-xs text-do-text-muted">{FILM.duration}</span>
							</button>
						</div>
					</motion.div>

					<motion.div
						className="relative mt-16 md:mt-20"
						initial={{ opacity: 0, y: 40 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
					>
						<div className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-do-orange/[0.1] blur-[90px]" />
						<Film />
						<p className="mt-4 text-center font-mono text-[11px] uppercase tracking-wider text-do-text-muted">
							The Takeoff Beam launch film. Rendered from code and the real app, no screen recording.
						</p>
					</motion.div>
				</div>
			</section>

			{/* ── Measured numbers ───────────────────────────────────────────── */}
			<section className="relative py-10 md:py-14">
				<div className="mx-auto max-w-6xl px-6">
					<motion.dl
						className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-do-border bg-do-border lg:grid-cols-4"
						{...rise}
					>
						{STATS.map((stat) => (
							<div key={stat.label} className="bg-do-bg-card px-6 py-7">
								<dt className="font-mono text-3xl font-bold tracking-tight text-do-text md:text-4xl">
									{stat.value}
								</dt>
								<dd className="mt-2 text-sm leading-snug text-do-text-secondary">{stat.label}</dd>
							</div>
						))}
					</motion.dl>
					<p className="mt-3 text-right font-mono text-[11px] uppercase tracking-wider text-do-text-muted">
						Every number measured on Takeoff Beam. None projected.
					</p>
				</div>
			</section>

			{/* ── Manifesto ──────────────────────────────────────────────────── */}
			<section id="manifesto" className={`relative overflow-hidden py-24 md:py-32 ${SCROLL_MT}`}>
				<div className="do-blueprint-grid pointer-events-none absolute inset-0 opacity-50" />
				<div className="relative z-10 mx-auto max-w-6xl px-6">
					<motion.div className="mb-16 max-w-3xl md:mb-20" {...rise}>
						<span className="do-section-label text-do-orange">What we believe</span>
						<h2 className="mt-5 text-4xl font-bold leading-[1.05] tracking-[-0.02em] text-do-text md:text-5xl lg:text-6xl">
							Four things the industry got backwards.
						</h2>
					</motion.div>

					<ol className="divide-y divide-do-border border-y border-do-border">
						{MANIFESTO.map((belief, i) => (
							<motion.li
								key={belief.numeral}
								className="grid gap-5 py-10 md:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1fr)] md:gap-10 md:py-14"
								{...rise}
								transition={{ duration: 0.6, delay: i * 0.05 }}
							>
								<span className="font-mono text-sm text-do-orange md:pt-2">{belief.numeral}</span>
								<h3 className="text-2xl font-bold leading-[1.15] tracking-tight text-do-text md:text-[2.1rem]">
									{belief.statement}
								</h3>
								<p className="text-[17px] leading-relaxed text-do-text-secondary md:pt-1">
									{belief.detail}
								</p>
							</motion.li>
						))}
					</ol>
				</div>
			</section>

			{/* ── The road ───────────────────────────────────────────────────── */}
			<section
				id="road"
				className={`relative border-y border-do-border bg-do-bg-card py-24 md:py-32 ${SCROLL_MT}`}
			>
				<div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-do-orange/[0.05] blur-[140px]" />
				<div className="relative z-10 mx-auto max-w-6xl px-6">
					<motion.div className="mb-16 max-w-3xl md:mb-20" {...rise}>
						<span className="do-section-label text-do-orange">{ROAD.label}</span>
						<h2 className="mt-5 text-4xl font-bold leading-[1.05] tracking-[-0.02em] text-do-text md:text-5xl lg:text-6xl">
							{ROAD.headline}
						</h2>
						<p className="mt-6 text-lg leading-relaxed text-do-text-secondary md:text-xl">
							{ROAD.detail}
						</p>
					</motion.div>

					<Road />
				</div>
			</section>

			{/* ── Shipped ────────────────────────────────────────────────────── */}
			<section id="apps" className={`relative py-24 md:py-32 ${SCROLL_MT}`}>
				<div className="relative z-10 mx-auto max-w-6xl px-6">
					<motion.div className="mb-12 max-w-2xl" {...rise}>
						<span className="do-section-label text-do-orange">Shipped</span>
						<h2 className="mt-5 text-3xl font-bold leading-[1.1] tracking-tight text-do-text md:text-4xl lg:text-5xl">
							Two apps you can install this afternoon.
						</h2>
						<p className="mt-5 text-lg leading-relaxed text-do-text-secondary">
							Signed and notarized, free, no account. They update themselves, so this
							is the last version number you have to read.
						</p>
					</motion.div>

					<div className="space-y-8">
						{available.map((app, i) => (
							<AvailableApp
								key={app.slug}
								app={app}
								release={app.releaseKey ? releases[app.releaseKey] : undefined}
								index={i}
								onStart={setDownload}
							/>
						))}
					</div>
				</div>
			</section>

			{/* ── In the open ────────────────────────────────────────────────── */}
			<section
				id="building"
				className={`relative border-y border-do-border bg-do-bg-card py-24 md:py-32 ${SCROLL_MT}`}
			>
				<div className="do-blueprint-grid pointer-events-none absolute inset-0 opacity-60" />
				<div className="relative z-10 mx-auto max-w-6xl px-6">
					<motion.div className="mb-12 max-w-2xl" {...rise}>
						<span className="do-section-label text-do-orange">Being built, in the open</span>
						<h2 className="mt-5 text-3xl font-bold leading-[1.1] tracking-tight text-do-text md:text-4xl lg:text-5xl">
							Four more, in the order the paperwork arrives.
						</h2>
						<p className="mt-5 text-lg leading-relaxed text-do-text-secondary">
							The ring is how far along each one is against the list on its card. An
							app gets a download button when it can stand in for the commercial tool
							on a real job, not before.
						</p>
					</motion.div>

					<div className="grid gap-5 md:grid-cols-2">
						{building.map((app, i) => (
							<BuildingApp key={app.slug} app={app} index={i} />
						))}
					</div>
				</div>
			</section>

			{/* ── FAQ ────────────────────────────────────────────────────────── */}
			<section className="relative overflow-hidden py-24 md:py-28">
				<div className="relative z-10 mx-auto max-w-3xl px-6">
					<motion.div className="mb-10" {...rise}>
						<span className="do-section-label text-do-orange">Questions</span>
						<h2 className="mt-5 text-3xl font-bold leading-[1.1] tracking-tight text-do-text md:text-4xl">
							Before you install anything.
						</h2>
					</motion.div>

					<div className="divide-y divide-do-border overflow-hidden rounded-2xl border border-do-border bg-do-bg-card">
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

			{/* ── Closing ────────────────────────────────────────────────────── */}
			<section className="relative overflow-hidden border-t border-do-border bg-do-bg-card py-24 md:py-32">
				<div className="do-blueprint-grid pointer-events-none absolute inset-0 opacity-60" />
				<div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-do-orange/[0.08] blur-[120px]" />
				<div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
					<motion.div {...rise}>
						<span className="do-section-label text-do-orange">Come build it</span>
						<h2 className="mt-5 text-4xl font-bold leading-[1.05] tracking-[-0.02em] text-do-text md:text-5xl lg:text-6xl">
							The office is not finished. That is the point.
						</h2>
						<p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-do-text-secondary md:text-xl">
							Install what is shipped, read what is being built, and tell us which
							tool your office would drop tomorrow. The order above is our best guess
							at where the pain is. You know better.
						</p>
						<div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
							<a
								href="https://github.com/constructionlive/takeoffbeam"
								target="_blank"
								rel="noopener noreferrer"
								onClick={() => trackCta("open_footer", "GitHub")}
								className="group inline-flex items-center gap-2.5 rounded-xl bg-do-orange px-7 py-4 text-base font-medium text-white shadow-[0_0_30px_rgba(249,115,22,0.25)] transition-all hover:bg-do-orange-dark"
							>
								<Github className="h-4 w-4" />
								Read the source
								<ArrowUpRight className="h-4 w-4 opacity-70" />
							</a>
							<Link
								href={contactHref}
								onClick={() => trackCta("open_footer", "Tell us")}
								className="group inline-flex items-center gap-2 rounded-xl border border-do-border px-6 py-4 text-base font-medium text-do-text-secondary transition-all hover:border-do-border-accent hover:text-do-text"
							>
								Tell us what to build next
								<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
							</Link>
						</div>
					</motion.div>
				</div>
			</section>

			<SiteFooter />
			<DownloadPrompt info={download} onClose={closePrompt} />
		</main>
	);
}
