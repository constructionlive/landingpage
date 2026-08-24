"use client";

import { ArrowRight } from "lucide-react";
import BrandMark from "@components/BrandMark";
import { OPEN_PREFERENCES_EVENT } from "@/lib/consent";
import {
	solutionGroups,
	resourceLinks,
	companyLinks,
	pricingHref,
	privateCloud,
	demoHref,
} from "./nav-data";

export default function SiteFooter() {
	return (
		<footer className="relative border-t border-do-border bg-do-bg-card">
			<div className="absolute inset-0 do-blueprint-grid pointer-events-none opacity-50" />

			<div className="relative z-10 max-w-7xl mx-auto px-6 py-14 md:py-16">
				<div className="grid lg:grid-cols-4 gap-10 lg:gap-12">
					{/* Brand */}
					<div className="lg:col-span-1">
						{/* Mark-as-c lockup, matching SiteNav and public/logo.svg: the text
						    starts at "onstruction" and stays tucked against the mark. */}
						<a href="/" className="flex items-center mb-4" aria-label="construction.live home">
							<BrandMark className="h-6 w-6 text-do-orange" />
							<span className="-ml-px text-do-text font-semibold text-lg tracking-tight">
								onstruction<span className="text-do-orange">.live</span>
							</span>
						</a>
						<p className="text-sm text-do-text-secondary leading-relaxed mb-6 max-w-xs">
							Agentic AI for construction. One connected record for everything on
							your project, built while you build.
						</p>
						<a
							href={demoHref}
							className="group inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-do-orange hover:bg-do-orange-dark rounded-lg transition-all"
						>
							Book a demo
							<ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
						</a>
					</div>

					{/* Solutions, expanded the same way the nav groups them */}
					<div className="lg:col-span-3">
						<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
							{solutionGroups.map((group) => (
								<div key={group.label}>
									<p className="do-section-label text-do-text-muted mb-3.5">
										<span className="text-do-orange">{group.number}</span> {group.label}
									</p>
									<ul className="space-y-2">
										{group.items.map((item) => (
											<li key={item.label}>
												<a
													href={item.href}
													className="text-[13px] text-do-text-secondary hover:text-do-orange transition-colors leading-snug"
												>
													{item.label}
												</a>
											</li>
										))}
										{group.footerLink && (
											<li>
												<a
													href={group.footerLink.href}
													className="text-[13px] font-medium text-do-orange hover:underline"
												>
													{group.footerLink.label} →
												</a>
											</li>
										)}
									</ul>
								</div>
							))}
						</div>

						{/* Same placement as the mega menu: deployment sits under the four
						    pillars, not as a fifth one. */}
						<a
							href={privateCloud.href}
							className="group mt-8 pt-5 border-t border-do-border flex items-center gap-2.5"
						>
							<privateCloud.icon className="h-4 w-4 text-do-orange shrink-0" />
							<span className="text-[13px] font-medium text-do-text group-hover:text-do-orange transition-colors">
								{privateCloud.label}
							</span>
							<span className="hidden sm:inline text-[13px] text-do-text-secondary">
								{privateCloud.blurb}
							</span>
						</a>
					</div>
				</div>

				{/* Resources + Company + legal */}
				<div className="mt-12 pt-8 border-t border-do-border grid md:grid-cols-3 gap-8">
					<div>
						<p className="do-section-label text-do-text-muted mb-3">Resources</p>
						<div className="flex flex-wrap gap-x-5 gap-y-2">
							{resourceLinks.map((link) => (
								<a
									key={link.label}
									href={link.href}
									className="text-sm text-do-text-secondary hover:text-do-orange transition-colors"
								>
									{link.label}
								</a>
							))}
							<a
								href={pricingHref}
								className="text-sm text-do-text-secondary hover:text-do-orange transition-colors"
							>
								Pricing
							</a>
						</div>
					</div>

					<div>
						<p className="do-section-label text-do-text-muted mb-3">Company</p>
						<div className="flex flex-wrap gap-x-5 gap-y-2">
							{companyLinks.map((link) => (
								<a
									key={link.label}
									href={link.href}
									className="text-sm text-do-text-secondary hover:text-do-orange transition-colors"
								>
									{link.label}
								</a>
							))}
							<a
								href="/privacy"
								className="text-sm text-do-text-secondary hover:text-do-orange transition-colors"
							>
								Privacy
							</a>
							{/* Reopens the consent banner. Withdrawing consent has to be as
							    easy as giving it, so this stays reachable from every page. */}
							<button
								type="button"
								onClick={() =>
									window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT))
								}
								className="text-sm text-do-text-secondary hover:text-do-orange transition-colors"
							>
								Cookie preferences
							</button>
						</div>
					</div>

					<div className="md:text-right">
						<p className="text-xs text-do-text-muted font-mono">
							&copy; {new Date().getFullYear()} Neuratwin Inc.
						</p>
						<p className="text-xs text-do-text-muted font-mono mt-1">Toronto, Canada</p>
					</div>
				</div>
			</div>
		</footer>
	);
}
