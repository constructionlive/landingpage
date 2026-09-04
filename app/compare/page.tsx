import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SiteNav from "@components/home/SiteNav";
import SiteFooter from "@components/home/SiteFooter";
import ArticleCardList from "@/components/ArticleCardList";
import JsonLd from "@/components/JsonLd";
import { COMPARISONS } from "@/lib/articles";
import { contactHref, demoHref, resourcesHref } from "@components/home/nav-data";
import { absoluteUrl } from "@/lib/site";
import { breadcrumbSchema, graph } from "@/lib/schema";

const DESCRIPTION =
	"Honest head-to-head comparisons between construction.live and the other tools construction teams evaluate — including where the other tool is the right answer.";

export const metadata: Metadata = {
	title: "Compare construction AI tools | construction.live",
	description: DESCRIPTION,
	alternates: { canonical: absoluteUrl("/compare") },
	openGraph: {
		title: "Compare construction AI tools | construction.live",
		description: DESCRIPTION,
		url: absoluteUrl("/compare"),
	},
};

export default function ComparePage() {
	const breadcrumbs = breadcrumbSchema([
		{ name: "Home", url: absoluteUrl("/") },
		{ name: "Compare", url: absoluteUrl("/compare") },
	]);

	return (
		<main className="min-h-screen bg-do-bg">
			<SiteNav />

			<section className="relative pt-36 pb-16 md:pt-44 md:pb-20 overflow-hidden">
				<div className="absolute inset-0 do-blueprint-grid pointer-events-none" />
				<div className="absolute top-0 right-0 w-[600px] h-[600px] bg-do-orange/[0.05] rounded-full blur-[140px] pointer-events-none" />

				<div className="relative z-10 max-w-5xl mx-auto px-6">
					<span className="do-section-label text-do-orange">Compare</span>
					<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-do-text mt-5 tracking-tight leading-[1.05]">
						Compare with the other tools on the shortlist.
					</h1>
					<p className="text-lg md:text-xl text-do-text-secondary leading-relaxed mt-6 max-w-2xl">
						Written against each vendor&apos;s own published documentation, with the
						cases where the other tool is the better answer left in. If a comparison
						only ever concludes one thing, it is not a comparison.
					</p>
				</div>
			</section>

			<section className="relative max-w-5xl mx-auto px-6 pb-20">
				<ArticleCardList articles={COMPARISONS} />
			</section>

			<section className="relative border-t border-do-border bg-do-bg-card py-16 md:py-20">
				<div className="max-w-3xl mx-auto px-6 text-center">
					<h2 className="text-2xl md:text-3xl font-bold text-do-text tracking-tight leading-[1.15]">
						Weighing us against something not listed here?
					</h2>
					<p className="text-lg text-do-text-secondary leading-relaxed mt-4">
						Tell us what else is on the shortlist and we will walk both tools through
						one of your real workflows — or read the argument behind every comparison
						on this page first.
					</p>
					<div className="flex flex-wrap items-center justify-center gap-3 mt-8">
						<Link
							href={demoHref}
							className="group inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-white bg-do-orange hover:bg-do-orange-dark rounded-lg transition-all"
						>
							Book a demo
							<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
						</Link>
						<Link
							href={`${resourcesHref}/8-things-construction-ai-must-do`}
							className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-medium text-do-text-secondary hover:text-do-text border border-do-border hover:border-do-border-accent rounded-lg transition-all"
						>
							8 things construction AI must do
						</Link>
					</div>
					<p className="mt-6 text-sm text-do-text-muted">
						Think we have a comparison wrong?{" "}
						<Link href={contactHref} className="text-do-orange hover:underline">
							Tell us where
						</Link>
						.
					</p>
				</div>
			</section>

			<JsonLd schema={graph(breadcrumbs)} />
			<SiteFooter />
		</main>
	);
}
