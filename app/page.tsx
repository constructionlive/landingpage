"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import Navbar from "@components/Navbar";
import Hero from "@components/Hero";
import UseCases from "@components/UseCases";
import Industries from "@components/Industries";
import Systems from "@components/Systems";
import Workflows from "@components/Workflows";
import Metrics from "@components/Metrics";
import BlogCarouselSection from "@components/BlogCarouselSection";
import CTA from "@components/CTA";
import Footer from "@components/Footer";

export default function Home() {
	const posts = useQuery(api.posts.listPublished) ?? [];

	return (
		<main className="min-h-screen bg-do-bg">
			<Navbar />
			<Hero />
			<UseCases />
			<Industries />
			<Systems />
			<Workflows />
			<Metrics />
			{posts.length > 0 && <BlogCarouselSection posts={posts} />}
			<CTA />
			<Footer />
		</main>
	);
}
