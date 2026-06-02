"use client";

import { Mic, Clock, WifiOff, Plug, MapPin, Brain } from "lucide-react";

const trustBuilders = [
	{ icon: Mic, label: "Voice, photos, AI calls — unified into one record" },
	{ icon: Clock, label: "30 seconds per update (not 15 minutes)" },
	{ icon: WifiOff, label: "Works offline (jobsites have bad reception)" },
	{ icon: Plug, label: "Integrates with Procore, Autodesk, Fieldwire" },
	{ icon: MapPin, label: "Timestamped & geotagged for disputes" },
	{ icon: Brain, label: "Construction-trained AI (understands jargon)" },
];

export default function Footer() {
	return (
		<footer className="relative border-t border-do-border bg-do-bg">
			{/* Trust builders strip */}
			<div className="border-b border-do-border bg-do-bg-card/40">
				<div className="max-w-6xl mx-auto px-6 py-8">
					<p className="text-xs font-mono text-do-orange uppercase tracking-wider text-center mb-5">
						Built for the way superintendents actually work
					</p>
					<div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl mx-auto">
						{trustBuilders.map((item) => (
							<div key={item.label} className="flex items-center gap-2.5 text-sm text-do-text-secondary">
								<item.icon className="h-4 w-4 text-do-orange shrink-0" />
								<span className="leading-snug">{item.label}</span>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Main footer row */}
			<div className="max-w-7xl mx-auto px-6 py-10">
				<div className="flex flex-col md:flex-row items-center justify-between gap-6">
					<div className="flex items-center gap-2.5">
						<a href="/" className="flex items-center gap-2.5">
							<div className="h-7 w-7 rounded-lg bg-do-orange flex items-center justify-center">
								<svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M2 20h20M4 20V10l8-6 8 6v10M9 20v-6h6v6" />
								</svg>
							</div>
							<span className="text-do-text font-semibold tracking-tight">
								construction<span className="text-do-orange">.live</span>
							</span>
						</a>
					</div>
					<div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-do-text-secondary">
						<a href="/features" className="hover:text-do-text transition-colors">Features</a>
						<a href="/use-cases" className="hover:text-do-text transition-colors">Use Cases</a>
						<a href="/how-it-works" className="hover:text-do-text transition-colors">How It Works</a>
						<a href="/about" className="hover:text-do-text transition-colors">About</a>
						<a href="/book" className="hover:text-do-text transition-colors">Book Demo</a>
						<a href="/" className="hover:text-do-text transition-colors">Privacy</a>
						<a href="/" className="hover:text-do-text transition-colors">Terms</a>
						<a href="mailto:rahul@construction.live" className="hover:text-do-text transition-colors">Contact</a>
					</div>
					<p className="text-xs text-do-text-muted font-mono">&copy; {new Date().getFullYear()} construction.live</p>
				</div>
			</div>
		</footer>
	);
}
