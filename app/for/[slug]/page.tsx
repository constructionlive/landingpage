import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteNav from "@/components/home/SiteNav";
import SiteFooter from "@/components/home/SiteFooter";
import JsonLd from "@/components/JsonLd";
import LandingPageAnalytics from "@/components/LandingPageAnalytics";
import LandingPageCta from "@/components/LandingPageCta";
import { getLandingPageBySlug, getLandingPages } from "@/lib/convexServer";
import { SITE_NAME, absoluteUrl } from "@/lib/site";
import { ORGANIZATION_ID, WEBSITE_ID, breadcrumbSchema, graph } from "@/lib/schema";

/* Agent-authored landing pages, one per audience: /for/subcontractors,
   /for/consultants, and whatever the next campaign needs.

   These are STATIC, unlike /blog and /blog/<slug>, which are force-dynamic and
   hit Convex on every request. A landing page changes when someone deliberately
   edits it and otherwise not at all, so paying a database round trip per visitor
   buys nothing — and these are the pages ad traffic lands on, where the round
   trip is exactly what the click is paying for.

   So: generateStaticParams renders every page that exists at build time, and
   the /api/pages routes call revalidatePath after every write, which rebuilds
   the affected page within the second. `revalidate` below is only a backstop
   for a write that reached Convex some other way (the dashboard, a script);
   nothing depends on it for normal edits. dynamicParams stays on so a page
   created after the last deploy renders on first request rather than 404ing
   until someone redeploys. */

export const revalidate = 3600;
export const dynamicParams = true;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
	try {
		const pages = await getLandingPages();
		return pages.map((page) => ({ slug: page.slug }));
	} catch (error) {
		/* A Convex hiccup during a build must not fail the whole deploy. Pages
		   missed here still render on demand, they just don't ship prebuilt. */
		console.error("landing pages: could not enumerate slugs at build", error);
		return [];
	}
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
	const { slug } = await params;
	const page = await getLandingPageBySlug(slug);
	if (!page) return {};

	const title = page.metaTitle?.trim() || `${page.headline} | ${SITE_NAME}`;
	const description = page.metaDescription?.trim() || page.subheadline?.trim() || undefined;
	const url = page.canonicalUrl?.trim() || absoluteUrl(`/for/${page.slug}`);
	const image = page.ogImageUrl?.trim() || undefined;
	const twitterImage = page.twitterImageUrl?.trim() || image;

	return {
		title,
		description,
		keywords: page.metaKeywords?.trim() || undefined,
		alternates: { canonical: url },
		/* A page can opt out of search entirely — useful for a paid-traffic
		   variant that would otherwise compete with the page it was cloned from. */
		robots: page.noIndex ? { index: false, follow: true } : undefined,
		openGraph: {
			type: "website",
			url,
			title: page.ogTitle?.trim() || title,
			description: page.ogDescription?.trim() || description,
			images: image ? [image] : undefined,
		},
		twitter: {
			card: page.twitterCard ?? "summary_large_image",
			title: page.twitterTitle?.trim() || page.ogTitle?.trim() || title,
			description: page.twitterDescription?.trim() || page.ogDescription?.trim() || description,
			images: twitterImage ? [twitterImage] : undefined,
		},
	};
}

const PRIMARY_CTA_CLASS =
	"group inline-flex items-center justify-center gap-2 rounded-xl bg-do-orange px-7 py-3.5 text-sm font-medium text-white transition-all hover:bg-do-orange-dark shadow-[0_0_30px_rgba(249,115,22,0.25)] hover:shadow-[0_0_45px_rgba(249,115,22,0.45)] sm:text-base";

const SECONDARY_CTA_CLASS =
	"inline-flex items-center justify-center gap-2 rounded-xl border border-do-border bg-do-bg-card/80 px-7 py-3.5 text-sm font-medium text-do-text transition-colors hover:border-do-orange/50 hover:text-do-orange sm:text-base";

export default async function LandingPage({ params }: Params) {
	const { slug } = await params;
	const page = await getLandingPageBySlug(slug);
	if (!page) notFound();

	const breadcrumbs = breadcrumbSchema([
		{ name: "Home", url: absoluteUrl("/") },
		{ name: page.headline, url: absoluteUrl(`/for/${page.slug}`) },
	]);

	const webPage = {
		"@type": "WebPage",
		"@id": absoluteUrl(`/for/${page.slug}`),
		url: absoluteUrl(`/for/${page.slug}`),
		name: page.metaTitle?.trim() || page.headline,
		description: page.metaDescription?.trim() || page.subheadline?.trim() || undefined,
		isPartOf: { "@id": WEBSITE_ID },
		publisher: { "@id": ORGANIZATION_ID },
		datePublished: new Date(page.createdAt).toISOString(),
		dateModified: new Date(page.updatedAt).toISOString(),
	};

	return (
		<main className="min-h-screen bg-do-bg">
			<SiteNav />

			<section className="relative overflow-hidden pt-36 pb-16 sm:pt-40">
				<div className="do-blueprint-grid pointer-events-none absolute inset-0" />
				<div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-do-orange/[0.04] blur-[150px]" />

				<div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
					{page.eyebrow ? (
						<span className="do-section-label text-do-orange">{page.eyebrow}</span>
					) : null}
					{/* The one h1 on the page, from a real field rather than from
					    whatever the body HTML happens to open with. */}
					<h1 className="mt-4 text-4xl font-bold text-do-text md:text-6xl">
						{page.headline}
					</h1>
					{page.subheadline ? (
						<p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-do-text-secondary md:text-xl">
							{page.subheadline}
						</p>
					) : null}

					{page.ctaLabel && page.ctaHref ? (
						<div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
							<LandingPageCta
								slug={page.slug}
								href={page.ctaHref}
								variant="primary"
								className={PRIMARY_CTA_CLASS}
							>
								{page.ctaLabel}
							</LandingPageCta>
							{page.secondaryCtaLabel && page.secondaryCtaHref ? (
								<LandingPageCta
									slug={page.slug}
									href={page.secondaryCtaHref}
									variant="secondary"
									className={SECONDARY_CTA_CLASS}
								>
									{page.secondaryCtaLabel}
								</LandingPageCta>
							) : null}
						</div>
					) : null}
				</div>
			</section>

			<section className="relative pb-20">
				<div className="mx-auto max-w-3xl px-6">
					<div
						className="page-content"
						dangerouslySetInnerHTML={{ __html: page.content }}
					/>
				</div>
			</section>

			{/* Repeated at the bottom: someone who read the whole page shouldn't
			    have to scroll back up to act on it. */}
			{page.ctaLabel && page.ctaHref ? (
				<section className="relative pb-24">
					<div className="mx-auto max-w-3xl px-6">
						<div className="rounded-2xl border border-do-orange/20 bg-do-bg-card/90 p-8 text-center sm:p-10">
							<p className="text-xl font-semibold text-do-text sm:text-2xl">
								{page.subheadline?.trim() || page.headline}
							</p>
							<div className="mt-6">
								<LandingPageCta
									slug={page.slug}
									href={page.ctaHref}
									variant="primary"
									className={PRIMARY_CTA_CLASS}
								>
									{page.ctaLabel}
								</LandingPageCta>
							</div>
						</div>
					</div>
				</section>
			) : null}

			<SiteFooter />
			<JsonLd schema={graph(webPage, breadcrumbs)} />
			<LandingPageAnalytics slug={page.slug} />
		</main>
	);
}
