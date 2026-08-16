"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, ChevronDown } from "lucide-react";
import ThemeToggle from "@components/ThemeToggle";
import BrandMark from "@components/BrandMark";
import {
	solutionGroups,
	solutionsHref,
	resourceLinks,
	companyLinks,
	pricingHref,
	contactHref,
	demoHref,
} from "./nav-data";

type MenuKey = "solutions" | "resources" | "company";

export default function SiteNav() {
	const [scrolled, setScrolled] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
	const [mobileSection, setMobileSection] = useState<MenuKey | null>("solutions");
	const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 40);
		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpenMenu(null);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	/* Small grace period so the pointer can travel from the trigger to the panel. */
	const open = (key: MenuKey) => {
		if (closeTimer.current) clearTimeout(closeTimer.current);
		setOpenMenu(key);
	};
	const scheduleClose = () => {
		if (closeTimer.current) clearTimeout(closeTimer.current);
		closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
	};

	const trigger = (key: MenuKey, label: string) => (
		<button
			type="button"
			className={`flex items-center gap-1 px-3.5 py-2 text-sm rounded-lg transition-colors ${
				openMenu === key
					? "text-do-text bg-do-bg-light"
					: "text-do-text-secondary hover:text-do-text hover:bg-do-bg-light"
			}`}
			onMouseEnter={() => open(key)}
			onFocus={() => open(key)}
			onClick={() => setOpenMenu(openMenu === key ? null : key)}
			aria-expanded={openMenu === key}
		>
			{label}
			<ChevronDown
				className={`h-3.5 w-3.5 transition-transform ${openMenu === key ? "rotate-180" : ""}`}
			/>
		</button>
	);

	return (
		<>
			<motion.nav
				/* The do-* tokens are bare CSS vars, so Tailwind's `/90` alpha syntax
				   compiles to nothing on them. color-mix gets real translucency;
				   an open menu goes fully solid so nav and panel read as one surface. */
				className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
					openMenu === "solutions"
						? "bg-do-bg border-b border-do-border"
						: scrolled
							? "bg-[color-mix(in_srgb,var(--do-bg)_88%,transparent)] backdrop-blur-xl border-b border-do-border"
							: "bg-transparent"
				}`}
				initial={{ y: -80 }}
				animate={{ y: 0 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
				onMouseLeave={scheduleClose}
			>
				<div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
					{/* The mark stands as the word's own c, so the text picks up at
					    "onstruction" — same lockup as public/logo.svg. It only reads as a
					    letter if it stays tucked against the o (hence -ml-px, no gap) and
					    sized off the cap height, not the icon slot. The link's aria-label
					    keeps the accessible name whole. */}
					<a href="/" className="flex items-center" aria-label="construction.live home">
						<BrandMark className="h-6 w-6 text-do-orange" />
						<span className="-ml-px text-do-text font-semibold text-lg tracking-tight">
							onstruction<span className="text-do-orange">.live</span>
						</span>
					</a>

					<div className="hidden lg:flex items-center gap-1">
						{trigger("solutions", "Solutions")}
						<a
							href={pricingHref}
							className="px-3.5 py-2 text-sm text-do-text-secondary hover:text-do-text transition-colors rounded-lg hover:bg-do-bg-light"
							onMouseEnter={() => setOpenMenu(null)}
						>
							Pricing
						</a>
						{/* Only Solutions needs the full-width mega menu; these two have a
						    handful of links each, so they hang off their own trigger and
						    take exactly the width their labels need. */}
						<div className="relative">
							{trigger("resources", "Resources")}
							<AnimatePresence>
								{openMenu === "resources" && (
									<CompactMenu
										links={resourceLinks}
										onNavigate={() => setOpenMenu(null)}
										onHoverIn={() => open("resources")}
										onHoverOut={scheduleClose}
									/>
								)}
							</AnimatePresence>
						</div>
						<div className="relative">
							{trigger("company", "Company")}
							<AnimatePresence>
								{openMenu === "company" && (
									<CompactMenu
										links={companyLinks}
										onNavigate={() => setOpenMenu(null)}
										onHoverIn={() => open("company")}
										onHoverOut={scheduleClose}
									/>
								)}
							</AnimatePresence>
						</div>
					</div>

					<div className="hidden lg:flex items-center gap-3">
						<ThemeToggle />
						<a
							href={contactHref}
							className="px-4 py-2.5 text-sm font-medium text-do-text-secondary hover:text-do-text border border-do-border hover:border-do-border-accent rounded-lg transition-all"
						>
							Contact
						</a>
						<a
							href={demoHref}
							className="group px-5 py-2.5 text-sm font-medium text-white bg-do-orange hover:bg-do-orange-dark rounded-lg transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] flex items-center gap-1.5"
						>
							Book a demo
							<ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
						</a>
					</div>

					<div className="flex lg:hidden items-center gap-2">
						<ThemeToggle />
						<button
							className="p-2 text-do-text-secondary hover:text-do-text"
							onClick={() => setMobileOpen(!mobileOpen)}
							aria-label="Toggle navigation"
						>
							{mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
						</button>
					</div>
				</div>

				{/* Desktop mega menu */}
				<AnimatePresence>
					{openMenu === "solutions" && (
						<motion.div
							className="hidden lg:block absolute left-0 right-0 top-16 border-t border-do-border bg-do-bg shadow-2xl"
							initial={{ opacity: 0, y: -8 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -8 }}
							transition={{ duration: 0.18 }}
							onMouseEnter={() => open("solutions")}
							onMouseLeave={scheduleClose}
						>
							<div className="max-w-7xl mx-auto px-6 py-8">
								<div className="grid grid-cols-4 gap-8">
										{solutionGroups.map((group) => (
											<div key={group.label}>
												<a
													href={`${solutionsHref}#${group.slug}`}
													className="do-section-label text-do-text-muted hover:text-do-text-secondary flex items-baseline gap-1.5 mb-4"
													onClick={() => setOpenMenu(null)}
												>
													<span className="text-do-orange">{group.number}</span>
													{group.label}
												</a>
												<div className="flex flex-col gap-1">
													{group.items.map((item) => (
														<a
															key={item.label}
															href={item.href}
															className="group flex items-center gap-2.5 px-2 py-1.5 -mx-2 rounded-lg hover:bg-do-bg-light transition-colors"
															onClick={() => setOpenMenu(null)}
														>
															<span className="h-7 w-7 rounded-lg bg-do-orange/[0.08] border border-do-orange/15 flex items-center justify-center shrink-0">
																<item.icon className="h-3.5 w-3.5 text-do-orange" />
															</span>
															<span className="text-[13px] text-do-text-secondary group-hover:text-do-text leading-snug">
																{item.label}
															</span>
														</a>
													))}
													{group.footerLink && (
														<a
															href={group.footerLink.href}
															className="mt-2 inline-flex items-center gap-1 text-[13px] font-medium text-do-orange hover:text-do-orange-dark"
															onClick={() => setOpenMenu(null)}
														>
															{group.footerLink.label}
															<ArrowRight className="h-3.5 w-3.5" />
														</a>
													)}
												</div>
											</div>
										))}
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.nav>

			{/* Mobile drawer */}
			<AnimatePresence>
				{mobileOpen && (
					<motion.div
						className="fixed inset-0 z-40 bg-do-bg pt-20 px-6 pb-10 overflow-y-auto lg:hidden"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
					>
						<MobileSection
							label="Solutions"
							isOpen={mobileSection === "solutions"}
							onToggle={() => setMobileSection(mobileSection === "solutions" ? null : "solutions")}
						>
							<div className="flex flex-col gap-5 pb-2">
								{solutionGroups.map((group) => (
									<div key={group.label}>
										<p className="do-section-label text-do-text-muted mb-2">
											<span className="text-do-orange">{group.number}</span> {group.label}
										</p>
										<div className="flex flex-col">
											{group.items.map((item) => (
												<a
													key={item.label}
													href={item.href}
													className="flex items-center gap-2.5 py-2 text-sm text-do-text-secondary"
													onClick={() => setMobileOpen(false)}
												>
													<item.icon className="h-4 w-4 text-do-orange shrink-0" />
													{item.label}
												</a>
											))}
											{group.footerLink && (
												<a
													href={group.footerLink.href}
													className="py-2 text-sm font-medium text-do-orange"
													onClick={() => setMobileOpen(false)}
												>
													{group.footerLink.label} →
												</a>
											)}
										</div>
									</div>
								))}
							</div>
						</MobileSection>

						<a
							href={pricingHref}
							className="block py-3.5 text-lg text-do-text border-b border-do-border"
							onClick={() => setMobileOpen(false)}
						>
							Pricing
						</a>

						<MobileSection
							label="Resources"
							isOpen={mobileSection === "resources"}
							onToggle={() => setMobileSection(mobileSection === "resources" ? null : "resources")}
						>
							<div className="flex flex-col pb-2">
								{resourceLinks.map((link) => (
									<a
										key={link.label}
										href={link.href}
										className="py-2 text-sm text-do-text-secondary"
										onClick={() => setMobileOpen(false)}
									>
										{link.label}
									</a>
								))}
							</div>
						</MobileSection>

						<MobileSection
							label="Company"
							isOpen={mobileSection === "company"}
							onToggle={() => setMobileSection(mobileSection === "company" ? null : "company")}
						>
							<div className="flex flex-col pb-2">
								{companyLinks.map((link) => (
									<a
										key={link.label}
										href={link.href}
										className="py-2 text-sm text-do-text-secondary"
										onClick={() => setMobileOpen(false)}
									>
										{link.label}
									</a>
								))}
							</div>
						</MobileSection>

						<div className="flex flex-col gap-3 mt-8">
							<a
								href={demoHref}
								className="px-4 py-3 text-center text-white bg-do-orange rounded-lg font-medium"
								onClick={() => setMobileOpen(false)}
							>
								Book a demo
							</a>
							<a
								href={contactHref}
								className="px-4 py-3 text-center text-do-text border border-do-border rounded-lg font-medium"
								onClick={() => setMobileOpen(false)}
							>
								Contact
							</a>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
}

/* Anchored to its trigger and sized to its longest label — `w-max` keeps the
   panel off the full-bleed grid the Solutions mega menu uses. */
function CompactMenu({
	links,
	onNavigate,
	onHoverIn,
	onHoverOut,
}: {
	links: { label: string; href: string }[];
	onNavigate: () => void;
	onHoverIn: () => void;
	onHoverOut: () => void;
}) {
	return (
		<motion.div
			className="absolute left-0 top-full mt-2 w-max min-w-[10rem] max-w-xs rounded-xl border border-do-border bg-do-bg p-1.5 shadow-2xl"
			initial={{ opacity: 0, y: -6 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -6 }}
			transition={{ duration: 0.16 }}
			onMouseEnter={onHoverIn}
			onMouseLeave={onHoverOut}
		>
			<div className="flex flex-col">
				{links.map((link) => (
					<a
						key={link.label}
						href={link.href}
						className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-do-text-secondary hover:text-do-text hover:bg-do-bg-light transition-colors"
						onClick={onNavigate}
					>
						{link.label}
					</a>
				))}
			</div>
		</motion.div>
	);
}

function MobileSection({
	label,
	isOpen,
	onToggle,
	children,
}: {
	label: string;
	isOpen: boolean;
	onToggle: () => void;
	children: React.ReactNode;
}) {
	return (
		<div className="border-b border-do-border">
			<button
				type="button"
				className="w-full flex items-center justify-between py-3.5 text-lg text-do-text"
				onClick={onToggle}
				aria-expanded={isOpen}
			>
				{label}
				<ChevronDown className={`h-4 w-4 text-do-text-muted transition-transform ${isOpen ? "rotate-180" : ""}`} />
			</button>
			<AnimatePresence initial={false}>
				{isOpen && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.25 }}
						className="overflow-hidden"
					>
						{children}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
