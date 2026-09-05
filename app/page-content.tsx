"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

/* Homepage, section order follows the homepage wireframe:
   nav, hero, logo strip, meet the platform, personas, features, hardware, trust,
   success stories, blog teaser, FAQs, tool comparisons, the free desktop app,
   book a demo, training, footer.

   Comparisons sit between the FAQs and the demo CTA: by that point the visitor
   has stopped asking what this is and started asking what else they could buy
   instead, which is exactly the question that section answers. The free
   desktop app follows it for the same reason: the strongest reply to "which of
   these is worth my time" is the one that costs nothing and runs tonight.

   Training sits after the demo CTA rather than before it, because it answers
   the question booking a demo raises — whether the crew will actually use this
   — and putting that answer ahead of the ask would invite the doubt early. */

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
import CompareTools from "@components/home/CompareTools";
import LocalAppBand from "@components/home/LocalAppBand";
import TrainingBand from "@components/home/TrainingBand";
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
			<CompareTools />
			<LocalAppBand />
			<PhotoBand
				image={deckImage}
				alt="A finished concrete floor plate in a high-rise under construction, columns running to the open edge"
				label="What you are left with"
				headline="A finished floor, and the paper trail that proves every hour of it."
			/>
			<DemoCTA />
			<TrainingBand />
			<SiteFooter />
		</main>
	);
}
