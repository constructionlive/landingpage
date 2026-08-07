"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import Navbar from "@components/Navbar";
import Hero from "@components/Hero";
import IntegrationsBar from "@components/IntegrationsBar";
import Workflows from "@components/Workflows";
import PilotResults from "@components/PilotResults";
import Metrics from "@components/Metrics";
import FeatureDeepDives from "@components/FeatureDeepDives";
import Industries from "@components/Industries";
import BlogCarouselSection from "@components/BlogCarouselSection";
import CTA from "@components/CTA";
import Footer from "@components/Footer";

export default function HomeContent() {
	const posts = useQuery(api.posts.listPublished) ?? [];

	return (
		<main className="min-h-screen bg-do-bg">
			<Navbar />
			<Hero />
			<IntegrationsBar />
			<Workflows />
			{/* Hidden until we have real pilot data to attribute here. <PilotResults /> */}
			<Metrics />
			<FeatureDeepDives />
			<Industries />
			{posts.length > 0 && <BlogCarouselSection posts={posts} />}
			<CTA />
			<Footer />
		</main>
	);
}
