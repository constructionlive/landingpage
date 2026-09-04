import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import SiteNav from "@components/home/SiteNav";
import SiteFooter from "@components/home/SiteFooter";
import JsonLd from "@/components/JsonLd";
import { absoluteUrl } from "@/lib/site";
import { ORGANIZATION_ID, WEBSITE_ID, breadcrumbSchema, graph } from "@/lib/schema";

/* Shell for the long-form articles at /resources/… and /compare/….

   A server component on purpose. These pages are the ones we want indexed, so
   the h1, the standfirst and the whole body ship in the HTML rather than
   arriving after hydration — and none of it is interactive, so there is
   nothing here that a client component would buy.

   The hero, the call to action and the related-reading card are rendered as
   JSX rather than left inside `body`. The source documents each carried their
   own versions styled for a light-themed standalone page, and those are the
   three blocks that most need to match the rest of the site: the headline that
   ranks, the button that converts, and the link that keeps someone reading. */

export interface ArticleFigure {
	src: string;
	alt: string;
	caption: string;
	width: number;
	height: number;
}

export interface ArticleShellProps {
	eyebrow: string;
	/* Section this article belongs to, rendered as a breadcrumb beside the
	   eyebrow and fed to the BreadcrumbList schema. */
	section: { label: string; href: string };
	title: string;
	/* One bold line under the h1. Optional: only one of the two articles has one. */
	standfirst?: string;
	intro: string;
	/* The "short answer" box, for articles that lead with their conclusion. */
	verdict?: string;
	hero: ArticleFigure;
	/** Article body as HTML. Styled by `.article-body` in app/globals.css. */
	body: string;
	cta: { heading: string; body: string; label: string; href: string };
	related?: { eyebrow: string; title: string; blurb: string; href: string };
	/* For the Article schema. */
	slug: string;
	description: string;
	datePublished: string;
	dateModified: string;
}

export default function ArticleShell({
	eyebrow,
	section,
	title,
	standfirst,
	intro,
	verdict,
	hero,
	body,
	cta,
	related,
	slug,
	description,
	datePublished,
	dateModified,
}: ArticleShellProps) {
	const url = absoluteUrl(slug);

	const articleSchema = {
		"@type": "Article",
		headline: title,
		description,
		image: [absoluteUrl(hero.src)],
		datePublished,
		dateModified,
		author: { "@id": ORGANIZATION_ID },
		publisher: { "@id": ORGANIZATION_ID },
		isPartOf: { "@id": WEBSITE_ID },
		mainEntityOfPage: url,
	};

	const breadcrumbs = breadcrumbSchema([
		{ name: "Home", url: absoluteUrl("/") },
		{ name: section.label, url: absoluteUrl(section.href) },
		{ name: title, url },
	]);

	return (
		<main className="min-h-screen bg-do-bg">
			<SiteNav />

			{/* ── Hero ───────────────────────────────────────────────────────── */}
			<section className="relative pt-36 pb-12 md:pt-44 md:pb-16 overflow-hidden">
				<div className="absolute inset-0 do-blueprint-grid pointer-events-none" />
				<div className="absolute top-0 right-0 w-[600px] h-[600px] bg-do-orange/[0.05] rounded-full blur-[140px] pointer-events-none" />

				<div className="relative z-10 max-w-5xl mx-auto px-6">
					<Link
						href={section.href}
						className="do-section-label text-do-orange inline-flex items-center gap-2 hover:text-do-orange-dark transition-colors"
					>
						<ArrowLeft className="h-3.5 w-3.5" />
						{section.label}
						<span className="text-do-text-muted">/ {eyebrow}</span>
					</Link>

					<h1 className="text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-do-text mt-5 tracking-tight leading-[1.08]">
						{title}
					</h1>

					{standfirst && (
						<p className="text-lg md:text-xl font-medium text-do-text mt-5 max-w-3xl leading-snug">
							{standfirst}
						</p>
					)}

					<p className="text-lg text-do-text-secondary leading-relaxed mt-5 max-w-3xl">
						{intro}
					</p>

					{verdict && (
						<p className="mt-7 max-w-3xl rounded-2xl border border-do-border bg-do-bg-card px-6 py-5 text-[17px] leading-relaxed text-do-text">
							{verdict}
						</p>
					)}

					<figure className="mt-10">
						{/* The article's LCP element. Eager, and sized for the 1024px column. */}
						<Image
							src={hero.src}
							alt={hero.alt}
							width={hero.width}
							height={hero.height}
							sizes="(max-width: 1024px) 100vw, 1024px"
							priority
							className="w-full rounded-xl border border-do-border object-cover aspect-video"
						/>
						<figcaption className="mt-2.5 text-sm leading-relaxed text-do-text-muted">
							{hero.caption}
						</figcaption>
					</figure>
				</div>
			</section>

			{/* ── Body ───────────────────────────────────────────────────────── */}
			{/* Full-bleed on purpose. Each <section> in the body is a band that
			    paints its own background edge to edge and constrains its own
			    contents to 64rem — the same width as the hero above — so the page
			    reads as a stack of blocks rather than one long column of prose.
			    Wrapping this in a max-width container would collapse that back
			    into an article. */}
			<article className="relative pb-8">
				<div className="article-body" dangerouslySetInnerHTML={{ __html: body }} />
			</article>

			{/* ── Related reading ────────────────────────────────────────────── */}
			{related && (
				<section className="relative max-w-5xl mx-auto px-6 pb-4">
					<Link
						href={related.href}
						className="group block rounded-2xl border border-do-border bg-do-bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-do-orange/40 sm:p-7"
					>
						<span className="do-section-label text-do-orange">{related.eyebrow}</span>
						<h2 className="mt-3 text-xl font-semibold text-do-text sm:text-2xl">
							{related.title}
						</h2>
						<p className="mt-2.5 max-w-2xl text-[15px] leading-relaxed text-do-text-secondary">
							{related.blurb}
						</p>
						<span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-do-orange">
							Read it
							<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
						</span>
					</Link>
				</section>
			)}

			{/* ── CTA ────────────────────────────────────────────────────────── */}
			<section className="relative mt-12 overflow-hidden border-t border-do-border bg-do-bg-card py-20 md:py-24">
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-do-orange/[0.06] rounded-full blur-[120px] pointer-events-none" />

				<div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
					<h2 className="text-3xl md:text-4xl font-bold text-do-text tracking-tight leading-[1.1]">
						{cta.heading}
					</h2>
					<p className="text-lg text-do-text-secondary leading-relaxed mt-5">{cta.body}</p>
					<div className="flex flex-wrap items-center justify-center gap-3 mt-9">
						<Link
							href={cta.href}
							className="group inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-white bg-do-orange hover:bg-do-orange-dark rounded-lg transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]"
						>
							{cta.label}
							<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
						</Link>
						<Link
							href={section.href}
							className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-do-text-secondary hover:text-do-text border border-do-border hover:border-do-border-accent rounded-lg transition-all"
						>
							More from {section.label}
						</Link>
					</div>
				</div>
			</section>

			<JsonLd schema={graph(articleSchema, breadcrumbs)} />
			<SiteFooter />
		</main>
	);
}
