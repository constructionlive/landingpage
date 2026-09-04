import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SiteNav from "@components/home/SiteNav";
import SiteFooter from "@components/home/SiteFooter";
import ArticleCardList from "@/components/ArticleCardList";
import JsonLd from "@/components/JsonLd";
import { RESOURCE_ARTICLES, COMPARISONS } from "@/lib/articles";
import { otherResourceLinks } from "@components/home/nav-data";
import { absoluteUrl } from "@/lib/site";
import { breadcrumbSchema, graph } from "@/lib/schema";

const DESCRIPTION =
	"Long-form writing on what AI actually has to do on a construction project — drawings, field capture, authorization and adoption — plus the blog, the newsletter and the FAQs.";

export const metadata: Metadata = {
	title: "Resources | construction.live",
	description: DESCRIPTION,
	alternates: { canonical: absoluteUrl("/resources") },
	openGraph: {
		title: "Resources | construction.live",
		description: DESCRIPTION,
		url: absoluteUrl("/resources"),
	},
};

export default function ResourcesPage() {
	const breadcrumbs = breadcrumbSchema([
		{ name: "Home", url: absoluteUrl("/") },
		{ name: "Resources", url: absoluteUrl("/resources") },
	]);

	return (
		<main className="min-h-screen bg-do-bg">
			<SiteNav />

			<section className="relative pt-36 pb-16 md:pt-44 md:pb-20 overflow-hidden">
				<div className="absolute inset-0 do-blueprint-grid pointer-events-none" />
				<div className="absolute top-0 right-0 w-[600px] h-[600px] bg-do-orange/[0.05] rounded-full blur-[140px] pointer-events-none" />

				<div className="relative z-10 max-w-5xl mx-auto px-6">
					<span className="do-section-label text-do-orange">Resources</span>
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-do-text mt-5 tracking-tight leading-[1.05]">
						What AI has to do before it earns a place on the job.
					</h1>
					<p className="text-lg md:text-xl text-do-text-secondary leading-relaxed mt-6 max-w-2xl">
						Written for the people who have to run the rollout, not the people who
						have to approve the invoice. No benchmarks, no roadmap slides — what the
						work actually asks of a system, and what happens after the AI produces a
						draft.
					</p>
				</div>
			</section>

			<section className="relative max-w-5xl mx-auto px-6 pb-16">
				<ArticleCardList articles={RESOURCE_ARTICLES} />
			</section>

			{/* Comparisons live under /compare, but someone who came looking for
			    "resources" is looking for reading, and that is reading. */}
			<section className="relative max-w-5xl mx-auto px-6 pb-16">
				<div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
					<h2 className="text-2xl font-bold text-do-text tracking-tight">
						Compare with other tools
					</h2>
					<Link
						href="/compare"
						className="inline-flex items-center gap-1.5 text-sm font-medium text-do-orange hover:opacity-80"
					>
						All comparisons
						<ArrowRight className="h-3.5 w-3.5" />
					</Link>
				</div>
				<ArticleCardList articles={COMPARISONS} />
			</section>

			{/* The rest of the Resources menu, so this page is the hub the nav
			    implies rather than a second, competing list of two articles. */}
			<section className="relative border-t border-do-border bg-do-bg-card py-16 md:py-20">
				<div className="max-w-5xl mx-auto px-6">
					<span className="do-section-label text-do-orange">Also here</span>
					<div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-do-border bg-do-border sm:grid-cols-3">
						{otherResourceLinks.map((link) => (
							<Link
								key={link.label}
								href={link.href}
								className="group flex items-center justify-between gap-3 bg-do-bg px-6 py-5 transition-colors hover:bg-do-orange/[0.04]"
							>
								<span className="text-base font-medium text-do-text">{link.label}</span>
								<ArrowRight className="h-4 w-4 text-do-text-muted transition-all group-hover:translate-x-0.5 group-hover:text-do-orange" />
							</Link>
						))}
					</div>
				</div>
			</section>

			<JsonLd schema={graph(breadcrumbs)} />
			<SiteFooter />
		</main>
	);
}
