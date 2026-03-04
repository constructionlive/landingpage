"use client";

import Navbar from "@components/Navbar";
import Hero from "@components/Hero";
import UseCases from "@components/UseCases";
import Industries from "@components/Industries";
import Systems from "@components/Systems";
import Workflows from "@components/Workflows";
import Metrics from "@components/Metrics";
import CTA from "@components/CTA";
import Footer from "@components/Footer";

export default function Home() {
	return (
		<main className="min-h-screen bg-do-bg">
			<Navbar />
			<Hero />
			<UseCases />
			<Industries />
			<Systems />
			<Workflows />
			<Metrics />
			<CTA />
			<Footer />
		</main>
	);
}
