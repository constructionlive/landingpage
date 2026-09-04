import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ArticleCard } from "@/lib/articles";

/* The card used by the /resources and /compare indexes.

   One card per row rather than a grid: there are two articles between the two
   sections today, and three-across cards holding one item each look like a
   page that failed to load. It also lets the blurb run long enough to actually
   sell the click. Revisit when either list passes about six. */
export default function ArticleCardList({
	articles,
	/* Whether the first card's image is the page's LCP element. True on the
	   index pages, where it sits above the fold; false on the homepage, where
	   this list is the second-to-last section and preloading it would compete
	   with the hero. */
	eagerFirstImage = true,
}: {
	articles: ArticleCard[];
	eagerFirstImage?: boolean;
}) {
	return (
		<div className="space-y-5">
			{articles.map((article, i) => (
				<Link
					key={article.href}
					href={article.href}
					className="group grid gap-6 rounded-2xl border border-do-border bg-do-bg-card/60 p-5 transition-all hover:-translate-y-0.5 hover:border-do-orange/40 hover:bg-do-orange/[0.03] sm:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] sm:p-6"
				>
					<Image
						src={article.image}
						alt={article.imageAlt}
						width={1680}
						height={945}
						sizes="(max-width: 640px) 100vw, 288px"
						priority={eagerFirstImage && i === 0}
						loading={eagerFirstImage && i === 0 ? undefined : "lazy"}
						className="aspect-video w-full rounded-xl border border-do-border object-cover"
					/>

					<div className="min-w-0">
						<div className="flex flex-wrap items-center gap-x-3 gap-y-1">
							<span className="do-section-label text-do-orange">{article.eyebrow}</span>
							<span className="font-mono text-[11px] uppercase tracking-wider text-do-text-muted">
								{article.readingTime}
							</span>
						</div>

						<h2 className="mt-3 text-xl font-semibold leading-snug text-do-text sm:text-2xl">
							{article.title}
						</h2>

						<p className="mt-2.5 text-[15px] leading-relaxed text-do-text-secondary">
							{article.blurb}
						</p>

						<span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-do-orange">
							Read it
							<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
						</span>
					</div>
				</Link>
			))}
		</div>
	);
}
