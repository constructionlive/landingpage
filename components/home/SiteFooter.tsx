"use client";

import { ArrowRight } from "lucide-react";
import BrandMark from "@components/BrandMark";
import {
	solutionGroups,
	resourceLinks,
	companyLinks,
	pricingHref,
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
						<a href="/" className="flex items-center gap-2.5 mb-4" aria-label="construction.live home">
							<BrandMark className="h-8 w-8 text-do-orange" />
							<span className="text-do-text font-semibold text-lg tracking-tight">
								construction<span className="text-do-orange">.live</span>
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
					<div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8">
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
