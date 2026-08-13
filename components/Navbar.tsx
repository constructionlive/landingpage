"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import BrandMark from "./BrandMark";

const navLinks = [
	{ label: "Solutions", href: "/solutions" },
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
					<a href="/" className="flex items-center gap-2.5" aria-label="construction.live home">
						<BrandMark className="h-8 w-8 text-do-orange" />
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
							href="/book"
							className="group px-5 py-2.5 text-sm font-medium text-white bg-do-orange hover:bg-do-orange-dark rounded-lg transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] flex items-center gap-1.5"
						>
							Book Demo
							<ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
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
								<a
									href="/book"
									className="px-4 py-3 text-center text-white bg-do-orange rounded-lg font-medium"
									onClick={() => setMobileOpen(false)}
								>
									Book Demo
								</a>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}
