"use client";

export default function Footer() {
	return (
		<footer className="relative border-t border-do-border py-12 bg-do-bg">
			<div className="max-w-7xl mx-auto px-6">
				<div className="flex flex-col md:flex-row items-center justify-between gap-6">
					<div className="flex items-center gap-2.5">
						<div className="h-7 w-7 rounded-lg bg-do-orange flex items-center justify-center">
							<svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={2.5}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M2 20h20M4 20V10l8-6 8 6v10M9 20v-6h6v6" />
							</svg>
						</div>
						<span className="text-do-text font-semibold tracking-tight">
							construction<span className="text-do-orange">.live</span>
						</span>
					</div>
					<div className="flex items-center gap-6 text-sm text-do-text-secondary">
						<a href="/features" className="hover:text-do-text transition-colors">Features</a>
						<a href="/use-cases" className="hover:text-do-text transition-colors">Use Cases</a>
						<a href="/how-it-works" className="hover:text-do-text transition-colors">How It Works</a>
						<a href="/about" className="hover:text-do-text transition-colors">About</a>
						<a href="#" className="hover:text-do-text transition-colors">Privacy</a>
						<a href="#" className="hover:text-do-text transition-colors">Terms</a>
						<a href="#" className="hover:text-do-text transition-colors">Contact</a>
					</div>
					<p className="text-xs text-do-text-muted font-mono">&copy; {new Date().getFullYear()} construction.live</p>
				</div>
			</div>
		</footer>
	);
}
