"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { contactHref, pricingHref, tryHref } from "@/components/home/nav-data";

/* Two ways to start, straight from the pitch. The full programme price is a
   floor, scoped per project after a discovery visit. */
const plans = [
	{
		key: "software",
		label: "Software stack",
		title: "Run it yourself",
		price: "$100",
		unit: "per user, per month",
		includes: "Includes the complete agent stack",
		items: [
			"Field app, voice-first and bilingual",
			"Meeting platform",
			"Drawing intelligence and takeoff",
			"Project register",
			"Knowledge graph",
			"Connectors to the tools you already use",
		],
		cta: { label: "Try it now", href: tryHref },
		highlight: false,
	},
	{
		key: "programme",
		label: "In-house AI experts",
		title: "Our experts on your site, plus training",
		price: "from $5,000",
		unit: "per project, per year",
		includes: "Includes the complete software stack and AI usage for your team",
		items: [
			"Everything in the software stack",
			"AI usage for your whole team, no per-seat metering",
			"Our experts on your site, building around how you work",
			"Custom tools and workflows for your use case",
			"Training: what to load, which tool, which route",
			"Advanced training: learn to build the tools yourself",
		],
		cta: { label: "Talk to us", href: contactHref },
		highlight: true,
	},
];

export default function PricingBand() {
	return (
		<section id="pricing" className="relative py-24 md:py-32 bg-do-bg do-blueprint-grid">
			<div className="max-w-6xl mx-auto px-6">
				<span className="do-section-label text-do-orange">Pricing</span>
				<h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-do-text mt-4 mb-10 tracking-tight leading-[1.1]">
					Two ways to start.
				</h2>
				<div className="grid md:grid-cols-2 gap-5">
					{plans.map((p) => (
						<div
							key={p.key}
							className={`rounded-2xl border bg-do-bg-card p-7 md:p-9 flex flex-col gap-3 ${
								p.highlight
									? "border-do-orange shadow-[0_0_0_1px_#f97316,0_0_48px_rgba(249,115,22,0.18)]"
									: "border-do-border"
							}`}
						>
							<span
								className={`do-section-label ${p.highlight ? "text-do-orange" : ""}`}
							>
								{p.label}
							</span>
							<h3 className="text-xl md:text-2xl font-semibold text-do-text leading-tight">
								{p.title}
							</h3>
							<div className="mt-2">
								<span className="text-4xl md:text-5xl font-semibold text-do-orange tracking-tight">
									{p.price}
								</span>
								<span className="ml-2 text-do-text-secondary">{p.unit}</span>
							</div>
							<p className="text-do-text">{p.includes}</p>
							<ul className="mt-1 space-y-1.5 text-do-text-secondary list-disc pl-5 leading-relaxed">
								{p.items.map((it) => (
									<li key={it}>{it}</li>
								))}
							</ul>
							<Link
								href={p.cta.href}
								className={`mt-auto inline-flex items-center gap-2 self-start rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
									p.highlight
										? "bg-do-orange text-white hover:bg-do-orange-dark"
										: "border border-do-border-accent text-do-text hover:bg-do-bg-light"
								}`}
							>
								{p.cta.label}
								<ArrowRight className="h-4 w-4" />
							</Link>
						</div>
					))}
				</div>
				<p className="mt-6 text-sm text-do-text-muted">
					Full plan details on the{" "}
					<Link href={pricingHref} className="underline hover:text-do-text">
						pricing page
					</Link>
					.
				</p>
			</div>
		</section>
	);
}
