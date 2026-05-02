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
					<a href="/" className="flex items-center gap-2.5">
						<svg
							width="32"
							height="32"
							viewBox="0 0 32 32"
							xmlns="http://www.w3.org/2000/svg"
							className="dark:rounded-lg"
						>
							<defs>
								<linearGradient id="nav-bg" x1="0" y1="0" x2="0" y2="32" gradientUnits="userSpaceOnUse">
									<stop offset="0" stopColor="var(--do-bg)" />
									<stop offset="1" stopColor="var(--do-bg)" />
								</linearGradient>
								<linearGradient id="nav-orange" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
									<stop offset="0" stopColor="#FF8458" />
									<stop offset="1" stopColor="#FF6B35" />
								</linearGradient>
							</defs>
							<rect width="32" height="32" rx="6" fill="url(#nav-bg)" stroke="var(--do-border)" strokeWidth="1" />
							<path
								d="M 11 10 L 21 16 L 11 22 Z"
								fill="url(#nav-orange)"
								stroke="#FF6B35"
								strokeWidth="1.5"
								strokeLinejoin="round"
								strokeLinecap="round"
							/>
						</svg>
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
