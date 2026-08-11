
/* ── Page ──────────────────────────────────────────────────────────── */

import FAQ from "@/components/home/FAQ";
import SiteFooter from "@/components/home/SiteFooter";
import SiteNav from "@/components/home/SiteNav";

export default function FaqPage() {
	return (
		<main className="min-h-screen bg-do-bg">
			<SiteNav />

			<FAQ faqPage />
			<SiteFooter />
		</main>
	);
}
