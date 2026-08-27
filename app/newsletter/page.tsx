import type { Metadata } from "next";
import { Mail, PenLine, Wrench, ShieldCheck } from "lucide-react";
import SiteNav from "@/components/home/SiteNav";
import SiteFooter from "@/components/home/SiteFooter";
import NewsletterSignup from "@/components/NewsletterSignup";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, graph } from "@/lib/schema";
import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

/* Unlike /contact and /pricing this page is a server component: the form is the
   only interactive part and it carries its own "use client". That means the
   metadata lives here rather than in a layout.tsx, and the copy is in the HTML
   the crawler gets.

   The metadata matters more here than on most pages. This URL is meant to be
   pasted into LinkedIn messages and posts, so og:title and og:description are
   the preview card thousands of people see before they see the page.

   ?type=emailOnly renders one field and nothing else. That is the link to send
   in a DM: someone who agreed to a newsletter mid-conversation is not going to
   fill in their trade, and every field between the click and the subscription
   is another reason to close the tab. Bare /newsletter keeps the fuller form
   for people who arrived on their own and are happy to say what they build.

   Reading searchParams makes this route render per request rather than being
   prerendered at build. That is the price of deciding on the server, and it
   buys the right thing: the correct form is in the first paint. Choosing in
   the browser instead would show the full form and then collapse it, and the
   flash lands exactly on the audience with the least patience. */

const DESCRIPTION =
	"One email a week on what AI actually does with construction paperwork: what we see working on real jobs, what it still gets wrong, and what changed in the tools. No drip sequence, no sales cadence.";

export const metadata: Metadata = {
	title: "Newsletter | construction.live",
	description: DESCRIPTION,
	alternates: {
		canonical: absoluteUrl("/newsletter"),
	},
	openGraph: {
		title: "The construction.live newsletter",
		description: DESCRIPTION,
		type: "website",
		url: absoluteUrl("/newsletter"),
		siteName: SITE_NAME,
	},
};

/* What actually lands in the inbox. Deliberately concrete: "industry insights"
   is what every newsletter box on the internet promises, and it is why nobody
   believes any of them. */
const WHAT_YOU_GET = [
	{
		icon: Wrench,
		title: "What we see on real jobs",
		body: "The paperwork failures that cost our customers money that week, and what the fix actually looked like. Anonymised, but not invented.",
	},
	{
		icon: PenLine,
		title: "Where AI helps, and where it doesn't",
		body: "Straight assessments of what these tools are good at in construction today. Including the parts we haven't solved.",
	},
	{
		icon: Mail,
		title: "About once a week",
		body: "One email. Not a sequence, not a drip campaign, and never a shared list — we don't sell or pass on your address.",
	},
];

/* Accepted spellings of the one-field mode. Hand-typed into messages as often
   as copied, so the separator and the casing are not worth being strict about
   — getting it wrong should not silently serve the wrong form. */
const EMAIL_ONLY = new Set(["emailonly", "email-only", "email_only"]);

export default async function NewsletterPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const params = await searchParams;
	const type = Array.isArray(params.type) ? params.type[0] : params.type;
	const emailOnly = EMAIL_ONLY.has((type ?? "").trim().toLowerCase());

	return (
		<main className="min-h-screen bg-do-bg">
			<JsonLd
				schema={graph(
					breadcrumbSchema([
						{ name: "Home", url: SITE_URL },
						{ name: "Newsletter", url: absoluteUrl("/newsletter") },
					]),
				)}
			/>
			<SiteNav />

			{/* Hero and form share one background layer. Two separate grids would
			    restart the 40px tiling at the section seam and read as a break. */}
			<div className="relative overflow-hidden">
				<div className="absolute inset-0 do-blueprint-grid pointer-events-none" />
				<div className="absolute top-[22rem] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-do-orange/[0.04] rounded-full blur-[150px] pointer-events-none" />

				<section className="relative pt-20 pb-8">
					<div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
						<span className="do-section-label text-do-orange">Newsletter</span>
						<h1 className="text-3xl md:text-4xl font-bold text-do-text mt-4 tracking-tight">
							What AI is actually doing to construction paperwork
						</h1>
						<p className="mt-5 text-base md:text-lg text-do-text-secondary leading-relaxed">
							One email a week, written by the team building it. What we see working
							on real jobs, what still doesn&apos;t, and what changed in the tools.
							{emailOnly ? (
								<> Your email is all we need.</>
							) : (
								<> No pitch, and one click to leave.</>
							)}
						</p>
					</div>
				</section>

				{/* They came here to subscribe, so the form gets the page rather than
				    competing with links to somewhere else. */}
				<section id="subscribe" className="relative pb-16 scroll-mt-24">
					<div className="relative z-10 max-w-3xl mx-auto px-6">
						<div className="rounded-3xl border border-do-orange/20 bg-do-bg-card/80 backdrop-blur-xl p-7 md:p-10">
							{/* Separate `location` values, so the DM link's conversion rate can
							    be read on its own rather than averaged with organic visits. */}
							<NewsletterSignup
								variant={emailOnly ? "minimal" : "card"}
								location={emailOnly ? "newsletter_page_email_only" : "newsletter_page"}
							/>
						</div>

						{/* An escape hatch, not a nudge: someone who wants to tell us what
						    they build can, and everyone else never has to look at it. */}
						{emailOnly && (
							<p className="mt-5 text-center text-sm text-do-text-secondary">
								Want the issues aimed at what you build?{" "}
								<a href="/newsletter" className="text-do-orange hover:underline">
									Tell us a bit more
								</a>
								.
							</p>
						)}
					</div>
				</section>
			</div>

			<section className="relative py-16 border-t border-do-border bg-do-bg-card">
				<div className="relative z-10 max-w-5xl mx-auto px-6">
					<p className="do-section-label text-do-text-muted text-center mb-10">
						What you get
					</p>
					<div className="grid md:grid-cols-3 gap-6">
						{WHAT_YOU_GET.map((item) => (
							<div
								key={item.title}
								className="rounded-2xl border border-do-border bg-do-bg/60 p-6"
							>
								<span className="h-10 w-10 rounded-xl bg-do-orange/[0.08] border border-do-orange/15 flex items-center justify-center mb-4">
									<item.icon className="h-4 w-4 text-do-orange" />
								</span>
								<h2 className="text-base font-semibold text-do-text mb-2">
									{item.title}
								</h2>
								<p className="text-sm text-do-text-secondary leading-relaxed">
									{item.body}
								</p>
							</div>
						))}
					</div>

					{/* The promise the form makes, kept where someone can check it before
					    they hand over an address rather than only in the privacy policy. */}
					<div className="mt-10 flex items-start justify-center gap-2.5 text-sm text-do-text-secondary">
						<ShieldCheck className="h-4 w-4 text-do-orange shrink-0 mt-0.5" />
						<p className="max-w-xl leading-relaxed">
							Your address is used for the newsletter and nothing else. We never sell
							or share it, every issue carries an unsubscribe link, and you can read
							exactly what we store in our{" "}
							<a href="/privacy" className="text-do-orange hover:underline">
								privacy policy
							</a>
							.
						</p>
					</div>
				</div>
			</section>

			<SiteFooter />
		</main>
	);
}
