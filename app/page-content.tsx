"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

/* Homepage, section order follows the homepage wireframe:
   nav, hero, logo strip, meet the platform, personas, features, hardware, trust,
   success stories, blog teaser, FAQs, book a demo, footer.
   The previous homepage is preserved at /home. */

import SiteNav from "@components/home/SiteNav";
import Hero from "@components/Hero";
import TrustedTeams from "@/components/home/TrustedTeams";
import PlatformOverview from "@components/home/PlatformOverview";
import Personas from "@components/home/Personas";
import FeatureGrid from "@components/home/FeatureGrid";
import TrustStrip from "@components/home/TrustStrip";
import SuccessStories from "@components/home/SuccessStories";
import FAQ from "@components/home/FAQ";
import DemoCTA from "@components/home/DemoCTA";
import SiteFooter from "@components/home/SiteFooter";
import BlogCarouselSection from "@components/BlogCarouselSection";
import PhotoBand from "@components/home/PhotoBand";
import foundationImage from "@/public/images/foundation-dawn.jpg";
import deckImage from "@/public/images/concrete-deck.jpg";

export default function HomeContent() {
	const posts = useQuery(api.posts.listPublished) ?? [];
	return (
		<main className="min-h-screen bg-do-bg">
			<SiteNav />
			<Hero />
			{/* <TrustedTeams /> */}
			<PlatformOverview />
			{/* Photo breaks between sections. Two, deliberately: enough to stop the
			    page reading as an unbroken wall of cards, few enough that neither
			    one is scrolled past as decoration. */}
			<PhotoBand
				image={foundationImage}
				alt="Rebar and formwork laid out on a building foundation at first light, with a concrete core wall behind it"
				label="From day one"
				headline="The record starts with the first pour, not the first dispute."
				focus="center 55%"
			/>
			<Personas />
			<FeatureGrid />
			<TrustStrip />
			<SuccessStories />
			{posts.length > 0 && <BlogCarouselSection posts={posts} />}
			<FAQ />
			<PhotoBand
				image={deckImage}
				alt="A finished concrete floor plate in a high-rise under construction, columns running to the open edge"
				label="What you are left with"
				headline="A finished floor, and the paper trail that proves every hour of it."
			/>
			<DemoCTA />
			<SiteFooter />
		</main>
	);
}
