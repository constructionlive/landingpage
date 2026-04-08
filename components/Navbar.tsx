"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
	{ label: "Features", href: "/features" },
	{ label: "Use Cases", href: "/use-cases" },
	{ label: "How It Works", href: "/how-it-works" },
	{ label: "About", href: "/about" },
	{ label: "Blog", href: "/blog" },
];

export default function Navbar() {
	const [scrolled, setScrolled] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 40);
		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<>
			<motion.nav
				className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
					scrolled
						? "bg-do-bg/90 backdrop-blur-xl border-b border-do-border"
						: "bg-transparent"
				}`}
				initial={{ y: -80 }}
				animate={{ y: 0 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
			>
				<div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
					<a href="#" className="flex items-center gap-2.5">
						<div className="h-8 w-8 rounded-lg bg-do-orange flex items-center justify-center">
							<svg viewBox="0 0 24 24" className="h-4 w-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.5}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M2 20h20M4 20V10l8-6 8 6v10M9 20v-6h6v6" />
							</svg>
						</div>
						<span className="text-do-text font-semibold text-lg tracking-tight">
							construction<span className="text-do-orange">.live</span>
						</span>
					</a>

					<div className="hidden md:flex items-center gap-1">
						{navLinks.map((link) => (
							<a
								key={link.href}
								href={link.href}
								className="px-3.5 py-2 text-sm text-do-text-secondary hover:text-do-text transition-colors rounded-lg hover:bg-do-bg-light/50"
							>
								{link.label}
							</a>
						))}
					</div>

					<div className="hidden md:flex items-center gap-3">
						<ThemeToggle />
						<a
							href="https://app.construction.live"
							className="px-5 py-2.5 text-sm font-medium text-white bg-do-orange hover:bg-do-orange-dark rounded-lg transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]"
						>
							Get Started
						</a>
					</div>

					<div className="flex md:hidden items-center gap-2">
						<ThemeToggle />
						<button
							className="p-2 text-do-text-secondary hover:text-do-text"
							onClick={() => setMobileOpen(!mobileOpen)}
						>
							{mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
						</button>
					</div>
				</div>
			</motion.nav>

			<AnimatePresence>
				{mobileOpen && (
					<motion.div
						className="fixed inset-0 z-40 bg-do-bg/98 backdrop-blur-xl pt-20 px-6"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<div className="flex flex-col gap-2">
							{navLinks.map((link) => (
								<a
									key={link.href}
									href={link.href}
									className="px-4 py-3 text-lg text-do-text hover:text-do-orange transition-colors border-b border-do-border"
									onClick={() => setMobileOpen(false)}
								>
									{link.label}
								</a>
							))}
							<div className="flex flex-col gap-3 mt-6">
								<a href="https://app.construction.live" className="px-4 py-3 text-center text-white bg-do-orange rounded-lg font-medium">
									Get Started
								</a>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
