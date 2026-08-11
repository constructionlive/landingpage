"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

/* Homepage, section order follows the homepage wireframe:
   nav, hero, logo strip, meet the platform, personas, features,
   success stories, blog teaser, FAQs, book a demo, footer.
   The previous homepage is preserved at /home. */

import SiteNav from "@components/home/SiteNav";
import Hero from "@components/Hero";
import IntegrationsBar from "@components/IntegrationsBar";
import PlatformOverview from "@components/home/PlatformOverview";
import Personas from "@components/home/Personas";
import FeatureGrid from "@components/home/FeatureGrid";
import SuccessStories from "@components/home/SuccessStories";
import BlogTeaser from "@components/home/BlogTeaser";
import FAQ from "@components/home/FAQ";
import DemoCTA from "@components/home/DemoCTA";
import SiteFooter from "@components/home/SiteFooter";
import BlogCarouselSection from "@components/BlogCarouselSection";

export default function HomeContent() {
	const posts = useQuery(api.posts.listPublished) ?? [];
	return (
		<main className="min-h-screen bg-do-bg">
			<SiteNav />
			<Hero />
			{/* <IntegrationsBar /> */}
			<PlatformOverview />
			<Personas />
			<FeatureGrid />
			<SuccessStories />
			{/* <BlogTeaser /> */}
			{posts.length > 0 && <BlogCarouselSection posts={posts} />}
			<FAQ />
			<DemoCTA />
			<SiteFooter />
		</main>
	);
}
