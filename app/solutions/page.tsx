"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, Calendar, ChevronDown, Image as ImageIcon, Play } from "lucide-react";
import SiteNav from "@/components/home/SiteNav";
import SiteFooter from "@/components/home/SiteFooter";
import { solutionGroups, demoHref, pricingHref } from "@/components/home/nav-data";
import { GROUP_INTROS, SOLUTION_DETAILS, type SolutionMedia } from "./content";

/* Anchor targets have to clear the fixed nav, and on mobile the jump bar sits
   under it too. Native hash navigation respects scroll-margin-top, so linking
   in from the mega menu lands in the right place without any JS. */
const SCROLL_MT = "scroll-mt-32 lg:scroll-mt-24";

export default function SolutionsPage() {
	const slugs = useMemo(
		() => solutionGroups.flatMap((group) => group.items.map((item) => item.slug)),
		[],
	);
	const [activeSlug, setActiveSlug] = useState(slugs[0]);
	const [jumpOpen, setJumpOpen] = useState(false);

	/* Scroll spy. We keep the set of on-screen sections and highlight the first
	   one in document order, so the sidebar tracks what you're reading rather
	   than flickering between whatever crossed the line last. */
	const visible = useRef<Set<string>>(new Set());
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					const id = entry.target.id;
					if (entry.isIntersecting) visible.current.add(id);
					else visible.current.delete(id);
				}
				const first = slugs.find((slug) => visible.current.has(slug));
				if (first) setActiveSlug(first);
			},
			{ rootMargin: "-120px 0px -55% 0px" },
		);

		for (const slug of slugs) {
			const el = document.getElementById(slug);
			if (el) observer.observe(el);
		}
		return () => observer.disconnect();
	}, [slugs]);

	const activeGroup = solutionGroups.find((group) =>
		group.items.some((item) => item.slug === activeSlug),
	);
	const activeLabel = activeGroup?.items.find((item) => item.slug === activeSlug)?.label;

	return (
		<main className="min-h-screen bg-do-bg">
			<SiteNav />

			{/* Hero */}
			<section className="relative pt-28 pb-12 overflow-hidden">
				<div className="absolute inset-0 do-blueprint-grid pointer-events-none" />
				<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-do-orange/[0.05] rounded-full blur-[150px]" />

				<div className="relative z-10 max-w-7xl mx-auto px-6">
					<motion.div
						initial={{ opacity: 0, y: 24 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="max-w-3xl"
					>
						<span className="do-section-label text-do-orange">Solutions</span>
						<h1 className="text-4xl md:text-5xl font-bold text-do-text mt-4 tracking-tight">
							Your drawings, your email and your daily log finally know about
							each other
						</h1>
						{/* <p className="mt-5 text-lg text-do-text-secondary leading-relaxed">
							The field captures on voice. The owner&apos;s email updates the drawing
							and the schedule. The change order builds itself from both, because it
							is all one record, not four tools pointed at the same job.
						</p> */}
						<div className="flex flex-wrap gap-3 mt-8">
							<a
								href={demoHref}
								className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-do-orange hover:bg-do-orange-dark rounded-xl transition-all shadow-[0_0_30px_rgba(249,115,22,0.25)] hover:shadow-[0_0_45px_rgba(249,115,22,0.45)]"
							>
								<Calendar className="h-4 w-4" />
								Book a demo
								<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
							</a>
							<a
								href={pricingHref}
								className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-do-text-secondary hover:text-do-text border border-do-border hover:border-do-border-accent rounded-xl transition-all"
							>
								Get a quote
							</a>
						</div>
					</motion.div>

					{/* The argument at a glance. 04 is drawn as the result of the first
					    three rather than a fourth item beside them. */}
					<motion.div
						className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-14"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.15 }}
					>
						{solutionGroups.map((group) => {
							const isResult = group.slug === "linked-record";
							return (
								<a
									key={group.slug}
									href={`#${group.slug}`}
									className={`group rounded-2xl border p-5 transition-colors ${
										isResult
											? "border-do-orange/30 bg-do-orange/[0.04] hover:border-do-orange/50"
											: "border-do-border bg-do-bg-card/60 hover:border-do-border-accent"
									}`}
								>
									<div className="flex items-center gap-2">
										<span className="do-section-label text-do-orange">
											{group.number}
										</span>
										{isResult && (
											<span className="text-[10px] uppercase tracking-wider text-do-text-muted">
												because of 01–03
											</span>
										)}
									</div>
									<h2 className="text-base font-semibold text-do-text mt-2.5 group-hover:text-do-orange transition-colors">
										{group.label}
									</h2>
									{GROUP_INTROS[group.slug] && (
										<p className="mt-2 text-sm text-do-text-secondary leading-relaxed">
											{GROUP_INTROS[group.slug].kicker}
										</p>
									)}
								</a>
							);
						})}
					</motion.div>
				</div>
			</section>

			{/* Mobile jump menu. The sidebar is the whole nav structure, which is far
			    too tall for a phone, so it collapses to the section you're in. */}
			<div className="lg:hidden sticky top-16 z-30 bg-[color-mix(in_srgb,var(--do-bg)_92%,transparent)] backdrop-blur-xl border-y border-do-border">
				<button
					type="button"
					onClick={() => setJumpOpen(!jumpOpen)}
					aria-expanded={jumpOpen}
					className="w-full flex items-center justify-between px-6 py-3.5 text-sm"
				>
					<span className="flex items-center gap-2 min-w-0">
						<span className="do-section-label text-do-text-muted shrink-0">Jump to</span>
						<span className="text-do-text truncate">{activeLabel}</span>
					</span>
					<ChevronDown
						className={`h-4 w-4 text-do-text-muted shrink-0 transition-transform ${
							jumpOpen ? "rotate-180" : ""
						}`}
					/>
				</button>

				{jumpOpen && (
					<div className="max-h-[60vh] overflow-y-auto px-6 pb-5 border-t border-do-border">
						{solutionGroups.map((group) => (
							<div key={group.slug} className="mt-4">
								<p className="do-section-label text-do-text-muted mb-1.5">
									<span className="text-do-orange">{group.number}</span>{" "}
									{group.label}
								</p>
								{group.items.map((item) => (
									<a
										key={item.slug}
										href={`#${item.slug}`}
										onClick={() => setJumpOpen(false)}
										className={`flex items-center gap-2.5 py-2 text-sm ${
											activeSlug === item.slug
												? "text-do-orange"
												: "text-do-text-secondary"
										}`}
									>
										<item.icon className="h-4 w-4 shrink-0" />
										{item.label}
									</a>
								))}
							</div>
						))}
					</div>
				)}
			</div>

			{/* Sidebar + sections */}
			<div className="relative max-w-7xl mx-auto px-6 pb-24">
				<div className="flex gap-12">
					<aside className="hidden lg:block w-64 shrink-0">
						<nav
							aria-label="Solutions"
							className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-2 pb-6"
						>
							{solutionGroups.map((group) => (
								<div key={group.slug} className="mb-6">
									<a
										href={`#${group.slug}`}
										className="do-section-label text-do-text-muted hover:text-do-text-secondary flex items-baseline gap-1.5 mb-2"
									>
										<span className="text-do-orange">{group.number}</span>
										{group.label}
									</a>
									<div className="flex flex-col border-l border-do-border">
										{group.items.map((item) => {
											const isActive = activeSlug === item.slug;
											return (
												<a
													key={item.slug}
													href={`#${item.slug}`}
													aria-current={isActive ? "true" : undefined}
													className={`-ml-px pl-3 py-1.5 border-l text-[13px] leading-snug transition-colors ${
														isActive
															? "border-do-orange text-do-orange font-medium"
															: "border-transparent text-do-text-secondary hover:text-do-text hover:border-do-border-accent"
													}`}
												>
													{item.label}
												</a>
											);
										})}
									</div>
								</div>
							))}
						</nav>
					</aside>

					<div className="min-w-0 flex-1">
						{solutionGroups.map((group) => (
							<section
								key={group.slug}
								id={group.slug}
								className={`pt-14 first:pt-2 ${SCROLL_MT}`}
							>
								<div className="pb-3 border-b border-do-border">
									<span className="do-section-label text-do-orange">
										{group.number}
									</span>
									<h2 className="text-2xl md:text-3xl font-bold text-do-text tracking-tight mt-3">
										{group.label}
									</h2>
									{GROUP_INTROS[group.slug] && (
										<>
											<p className="mt-3 text-do-text font-medium leading-relaxed max-w-2xl">
												{GROUP_INTROS[group.slug].kicker}
											</p>
											<p className="mt-2 mb-4 text-do-text-secondary leading-relaxed max-w-2xl">
												{GROUP_INTROS[group.slug].body}
											</p>
										</>
									)}
								</div>

								{group.items.map((item) => {
									const detail = SOLUTION_DETAILS[item.slug];
									return (
										<motion.article
											key={item.slug}
											id={item.slug}
											className={`py-9 border-b border-do-border/60 last:border-0 ${SCROLL_MT}`}
											initial={{ opacity: 0, y: 16 }}
											whileInView={{ opacity: 1, y: 0 }}
											viewport={{ once: true, margin: "-80px" }}
											transition={{ duration: 0.4 }}
										>
											<div className="flex items-start gap-4">
												<span className="h-10 w-10 rounded-xl bg-do-orange/[0.08] border border-do-orange/15 flex items-center justify-center shrink-0">
													<item.icon className="h-5 w-5 text-do-orange" />
												</span>
												<div className="min-w-0">
													<h3 className="text-xl font-semibold text-do-text">
														{item.label}
													</h3>
													{detail && (
														<p className="mt-1 text-sm text-do-orange">
															{detail.tagline}
														</p>
													)}
												</div>
											</div>

											{detail && (
												<p className="mt-4 text-do-text-secondary leading-relaxed max-w-2xl">
													{detail.body}
												</p>
											)}

											{/* Carries the capabilities that don't get their
											    own nav line, set back from the main claim. */}
											{detail?.extra && (
												<p className="mt-3.5 pl-4 border-l-2 border-do-border text-sm text-do-text-secondary leading-relaxed max-w-2xl">
													{detail.extra}
												</p>
											)}

											{detail?.media && (
												<MediaSlot media={detail.media} label={item.label} />
											)}
										</motion.article>
									);
								})}
							</section>
						))}

						{/* Closing CTA */}
						<div className="mt-14 rounded-2xl border border-do-orange/20 bg-do-bg-card/80 p-8 text-center">
							<h2 className="text-2xl font-bold text-do-text">
								Want to see it on your own project?
							</h2>
							<p className="mt-3 text-do-text-secondary leading-relaxed max-w-xl mx-auto">
								Fifteen minutes, no deck. Bring a set of drawings or a pay app you are
								still arguing about and we will show you what we would do with it.
							</p>
							<div className="flex flex-wrap justify-center gap-3 mt-6">
								<a
									href={demoHref}
									className="group inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-do-orange hover:bg-do-orange-dark rounded-xl transition-all shadow-[0_0_30px_rgba(249,115,22,0.25)] hover:shadow-[0_0_45px_rgba(249,115,22,0.45)]"
								>
									<Calendar className="h-4 w-4" />
									Book a demo
									<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
								</a>
								<a
									href="mailto:rahul@construction.live"
									className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-do-text-secondary hover:text-do-text border border-do-border hover:border-do-border-accent rounded-xl transition-all"
								>
									Email us instead
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>

			<SiteFooter />
		</main>
	);
}

/* Renders the real asset once `src` is filled in, and a labelled frame of the
   same size until then, so a section can claim its media slot before the
   footage exists. */
function MediaSlot({ media, label }: { media: SolutionMedia; label: string }) {
	const isVideo = media.kind === "video";

	return (
		<figure className="mt-6 max-w-2xl">
			<div className="rounded-2xl border border-do-border bg-do-bg-card overflow-hidden">
				{media.src ? (
					isVideo ? (
						<video
							src={media.src}
							poster={media.poster}
							controls
							preload="none"
							className="w-full aspect-video bg-black"
						/>
					) : (
						/* eslint-disable-next-line @next/next/no-img-element */
						<img
							src={media.src}
							alt={media.alt ?? `${label} in construction.live`}
							loading="lazy"
							className="w-full"
						/>
					)
				) : (
					<div className="relative aspect-video flex flex-col items-center justify-center gap-3 do-blueprint-grid-dense">
						<span className="h-12 w-12 rounded-full bg-do-orange/[0.08] border border-do-orange/20 flex items-center justify-center">
							{isVideo ? (
								<Play className="h-5 w-5 text-do-orange" />
							) : (
								<ImageIcon className="h-5 w-5 text-do-orange" />
							)}
						</span>
						<span className="do-section-label text-do-text-muted">
							{isVideo ? "Video" : "Screenshot"} coming soon
						</span>
					</div>
				)}
			</div>
			<figcaption className="mt-2.5 text-xs text-do-text-muted">{media.caption}</figcaption>
		</figure>
	);
}
