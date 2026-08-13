import { ArrowRight, Mail, Radar } from "lucide-react";
import SiteNav from "@/components/home/SiteNav";
import SiteFooter from "@/components/home/SiteFooter";
import { contactHref, solutionsHref, pricingHref, demoHref } from "@/components/home/nav-data";

/* Next renders this for any unmatched route. It is a server component, so the
   nav and footer come along as the client islands they already are. */

const ELSEWHERE = [
	{ label: "Solutions", href: solutionsHref },
	{ label: "Pricing", href: pricingHref },
	{ label: "Blog", href: "/blog" },
	{ label: "Book a demo", href: demoHref },
];

export default function NotFound() {
	/* pt-16 clears the fixed nav. Without it the centred content overflows
	   upward on short viewports and slides under the bar. */
	return (
		<main className="min-h-screen bg-do-bg flex flex-col pt-16">
			<SiteNav />

			<section className="relative flex-1 flex items-start sm:items-center overflow-hidden py-16 sm:py-20">
				<div className="absolute inset-0 do-blueprint-grid pointer-events-none" />
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-do-orange/[0.05] rounded-full blur-[150px] pointer-events-none" />

				<div className="relative z-10 w-full max-w-2xl mx-auto px-6 text-center">
					<p className="do-section-label text-do-orange mb-5 flex items-center justify-center gap-2">
						<Radar className="h-3.5 w-3.5" />
						Page not found
					</p>

					{/* block + pb-1 keeps the gradient clip off the glyph bottoms. */}
					<span className="block pb-1 font-bold tracking-tight leading-[0.95] text-6xl sm:text-7xl md:text-8xl bg-gradient-to-r from-do-orange via-orange-400 to-amber-400 bg-clip-text text-transparent">
						404
					</span>

					<h1 className="mt-7 text-2xl sm:text-3xl md:text-4xl font-bold text-do-text tracking-tight text-balance leading-[1.15]">
						Oh no. Our AI couldn&apos;t trace this page.
					</h1>

					<p className="mt-5 text-base sm:text-lg text-do-text-secondary leading-relaxed text-balance">
						It read every drawing, chased every RFI and still came back empty
						handed. Either this page moved, or somebody typed the link the way a
						super types on a dusty phone.
					</p>

					<p className="mt-3 text-base sm:text-lg text-do-text-secondary leading-relaxed text-balance">
						If you think this page should exist, tell us. We will chase it down
						like a late pay app.
					</p>

					<div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
						<a
							href="/"
							className="group w-full sm:w-auto px-6 py-3 text-sm font-medium text-white bg-do-orange hover:bg-do-orange-dark rounded-lg transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] flex items-center justify-center gap-2"
						>
							Go to the homepage
							<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
						</a>
						<a
							href={contactHref}
							className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-do-text-secondary hover:text-do-text border border-do-border hover:border-do-border-accent rounded-lg transition-all flex items-center justify-center gap-2"
						>
							<Mail className="h-4 w-4" />
							Tell us we got it wrong
						</a>
					</div>

					<div className="mt-12 pt-8 border-t border-do-border">
						<p className="do-section-label text-do-text-muted mb-4">
							Or try one of these
						</p>
						<div className="flex flex-wrap items-center justify-center gap-2.5">
							{ELSEWHERE.map((link) => (
								<a
									key={link.label}
									href={link.href}
									className="px-4 py-2 rounded-full border border-do-border text-sm text-do-text-secondary hover:text-do-orange hover:border-do-orange/40 bg-do-bg/60 transition-colors"
								>
									{link.label}
								</a>
							))}
						</div>
					</div>
				</div>
			</section>

			<SiteFooter />
		</main>
	);
}
