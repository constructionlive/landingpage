"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

/* Homepage: construction.live as an AI engineering team for construction tech
   companies.

   EngineeringHome carries the hero, why AI features stall, who we build for,
   the five engineering disciplines, how we engage, the team, deployments and
   the call to action. The blog teaser
   and footer follow, so the rest of the site is reached the same way as
   before. Contractor pricing and the contractor demo CTA are left off this page
   because they sell a different offer; both components still exist, as does the
   scroll-driven DeckHome this page replaced. */

import SiteNav from "@components/home/SiteNav";
import EngineeringHome from "@components/home/EngineeringHome";
import SiteFooter from "@components/home/SiteFooter";
import BlogCarouselSection from "@components/BlogCarouselSection";

export default function HomeContent() {
	const posts = useQuery(api.posts.listPublished) ?? [];
	/* The homepage stays in the dark theme so the hero's wireframe panel sits
	   on the same navy as the rest of the page. Other pages keep the visitor's
	   theme choice. */
	return (
		<main className="dark min-h-screen bg-do-bg">
			<SiteNav />
			<EngineeringHome />
			{posts.length > 0 && <BlogCarouselSection posts={posts} />}
			<SiteFooter />
		</main>
	);
}
