"use client";

/* The original homepage composition, kept intact at /home for reference while
   the new wireframe-driven homepage lives at /. */

import Navbar from "@components/Navbar";
import Hero from "@components/Hero";
import IntegrationsBar from "@components/IntegrationsBar";
import Workflows from "@components/Workflows";
import Metrics from "@components/Metrics";
import FeatureDeepDives from "@components/FeatureDeepDives";
import Industries from "@components/Industries";
import CTA from "@components/CTA";
import Footer from "@components/Footer";
import SiteNav from "@/components/home/SiteNav";

export default function LegacyHomeContent() {
	return (
		<main className="min-h-screen bg-do-bg">
			<SiteNav />
			<Hero />
			<IntegrationsBar />
			<Workflows />
			{/* Hidden until we have real pilot data to attribute here. <PilotResults /> */}
			<Metrics />
			<FeatureDeepDives />
			<Industries />
			{/* Blog carousel is wired to Convex, restore once the client is re-enabled. */}
			<CTA />
			<Footer />
		</main>
	);
}
