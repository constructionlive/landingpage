import type { Metadata } from "next";
import { ShieldCheck, Lock, Ban, KeyRound } from "lucide-react";
import SiteNav from "@/components/home/SiteNav";
import SiteFooter from "@/components/home/SiteFooter";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
	title: "Privacy Policy | construction.live",
	description:
		"How construction.live (operated by Neuratwin Inc., Toronto, Canada) collects, uses, and protects your data. We do not use your data for AI training without your explicit consent, and every AI model we use runs under a zero-retention policy.",
	alternates: {
		canonical: absoluteUrl("/privacy"),
	},
};

const LAST_UPDATED = "August 15, 2026";

/* ── Headline commitments ─────────────────────────────────────────────── */

const commitments = [
	{
		icon: Ban,
		title: "No training on your data without consent",
		body: "We do not store or use your data to train AI models unless you give us specific, explicit consent. Your jobsite records, voice notes, and photos are yours.",
	},
	{
		icon: ShieldCheck,
		title: "Zero data retention on every AI model",
		body: "Every large language model and AI provider we use operates under a zero-retention agreement. They do not store, log, or train on the content we send for processing.",
	},
	{
		icon: Lock,
		title: "Encrypted in transit and at rest",
		body: "Project documentation is commercially sensitive. We protect it with enterprise-grade encryption, role-based access, and audit logging.",
	},
	{
		icon: KeyRound,
		title: "You control your data",
		body: "Access, export, or delete your data at any time. When you close your account, we delete your project data on request.",
	},
];

/* ── Policy sections ──────────────────────────────────────────────────── */

const sections = [
	{
		heading: "Who we are",
		paragraphs: [
			"construction.live is operated by Neuratwin Inc., a company headquartered in Toronto, Canada. In this policy, “construction.live,” “we,” “us,” and “our” refer to Neuratwin Inc.",
			"This policy explains what information we collect, how we use it, and the choices you have. It applies to our website, mobile apps, and services.",
		],
	},
	{
		heading: "Information we collect",
		paragraphs: [
			"Account information you provide, such as your name, email address, phone number, and company details.",
			"Project content you create or upload, including voice notes, photos, daily logs, and call recordings and transcripts.",
			"Usage and device information, such as log data, app version, and general location where required for timestamping and geotagging field records.",
			"Website analytics information collected when you browse construction.live, described in “Analytics on our website” below.",
		],
	},
	{
		heading: "How we use your information",
		paragraphs: [
			"To provide the service: capturing, transcribing, organizing, and unifying your field records into documentation you can use to protect payment.",
			"To operate and improve the reliability, security, and performance of our apps.",
			"To communicate with you about your account, support requests, and service updates.",
			"We do not sell your personal information, and we do not share it with third parties for their own marketing.",
		],
	},
	{
		heading: "Analytics on our website",
		paragraphs: [
			"We use PostHog, a product analytics service, to understand how visitors use the construction.live website. This applies to our public website only. It is separate from the project content you create in our apps, which is never sent to our analytics provider.",
			"PostHog automatically records events such as the pages you view, the links and buttons you click, and how long you stay on a page. Along with each event it records technical information sent by your browser: your browser and operating system, device type and screen size, referring website, and the page address. It also derives an approximate location (typically city or region level) from your IP address.",
			"To recognize a returning browser across visits, PostHog stores a randomly generated identifier in a cookie and in your browser's local storage. This identifier is not linked to your name or email unless you choose to identify yourself to us, for example by submitting a form or signing in.",
			"We use this information only to measure traffic, understand which pages and features are useful, diagnose problems, and improve the site. We do not use it for advertising, we do not sell it, and we do not combine it with data brokers or third-party ad networks.",
			"Where the GDPR or UK GDPR applies to you, our legal basis for analytics is your consent, which we request through the cookie banner described below and which you may withdraw at any time. Elsewhere, we rely on our legitimate interest in understanding and improving our own website, subject to the opt-out described below.",
			"PostHog acts as our data processor and handles this information on our instructions. Analytics data is processed and stored on PostHog's United States cloud infrastructure, which means it may be transferred outside Canada and the European Economic Area. Where required, we rely on appropriate safeguards such as standard contractual clauses for these transfers.",
			"We retain website analytics data for up to 12 months, after which it is deleted or aggregated so that it can no longer be tied to an individual browser.",
		],
	},
	{
		heading: "Cookies and similar technologies",
		paragraphs: [
			"We use a small number of cookies and equivalent browser storage. Strictly necessary cookies keep the site working, for example by maintaining your session and remembering your cookie choice. Analytics cookies, described above, are set by PostHog to distinguish one browser from another and measure usage.",
			"If you visit from the European Economic Area or the United Kingdom, we ask for your consent before any analytics cookie is set. Until you accept, our analytics provider captures no events and writes no identifier to your browser. If you decline, none are ever set, and the website works exactly as it would otherwise.",
			"You can change your mind at any time using the “Cookie preferences” link in the footer of every page, which reopens the consent banner and lets you withdraw consent as easily as you gave it.",
			"Outside the EEA and the UK, analytics cookies are set by default. You can turn them off at any time through the same “Cookie preferences” link, your browser settings, or a Do Not Track or global privacy control setting, which we honour automatically.",
			"Blocking analytics cookies will not affect your ability to use the website. Our website does not serve advertising cookies or tracking pixels for third-party ad networks.",
		],
	},
	{
		heading: "AI processing and model providers",
		paragraphs: [
			"We use large language models and other AI services to transcribe voice notes, summarize calls, and structure your field records. When we send content to these providers for processing, we do so under agreements that require zero data retention. The providers do not store your content beyond the moment of processing, and they do not use it to train their models.",
			"We do not use your data to train or fine-tune AI models without your specific, explicit consent. If we ever offer a feature that would benefit from training on your data, it will be opt-in, clearly described, and revocable.",
		],
	},
	{
		heading: "Data retention",
		paragraphs: [
			"We retain your project content for as long as your account is active or as needed to provide the service. You can delete individual records at any time.",
			"When you close your account, we delete your project data on request, subject to any limited retention required by law (for example, billing records).",
		],
	},
	{
		heading: "Data security",
		paragraphs: [
			"We use enterprise-grade encryption in transit and at rest, role-based access controls, and audit logging. No system is perfectly secure, but we work to protect your data with industry-standard safeguards appropriate to the sensitivity of construction documentation.",
		],
	},
	{
		heading: "Your rights and choices",
		paragraphs: [
			"You can access, correct, export, or delete your personal information. Depending on where you live, you may have additional rights under applicable privacy laws, including Canada’s PIPEDA and, where relevant, the GDPR and CCPA.",
			"You can opt out of website analytics at any time by enabling your browser's “Do Not Track” or global privacy control setting, by blocking cookies for construction.live in your browser settings, or by using a browser extension that blocks analytics scripts. You can also email us and we will suppress collection for you and delete the analytics records associated with your visits.",
			"To exercise any of these rights, contact us using the details below.",
		],
	},
	{
		heading: "Changes to this policy",
		paragraphs: [
			"We may update this policy from time to time. When we make material changes, we will update the date at the top of this page and, where appropriate, notify you directly.",
		],
	},
	{
		heading: "Contact us",
		paragraphs: [
			"If you have questions about this policy or how we handle your data, contact Neuratwin Inc. at rahul@construction.live.",
			"Neuratwin Inc., Toronto, Canada.",
		],
	},
];

/* Gives every section a stable anchor, so the cookie banner and support
   replies can deep-link to a specific part of the policy. */
const slug = (heading: string) =>
	heading
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-|-$/g, "");

/* ── Page ─────────────────────────────────────────────────────────────── */

export default function PrivacyPage() {
	return (
		<main className="min-h-screen bg-do-bg">
			<SiteNav />

			{/* Hero */}
			<section className="relative pt-40 pb-16 overflow-hidden">
				<div className="absolute inset-0 do-blueprint-grid pointer-events-none" />
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-do-orange/[0.04] rounded-full blur-[150px]" />

				<div className="relative z-10 max-w-3xl mx-auto px-6">
					<span className="do-section-label text-do-orange">Privacy</span>
					<h1 className="text-4xl md:text-5xl font-bold text-do-text mt-4 mb-4">
						Privacy Policy
					</h1>
					<p className="text-base text-do-text-secondary">
						Last updated: {LAST_UPDATED}
					</p>
				</div>
			</section>

			{/* Commitments */}
			<section className="relative pb-8">
				<div className="relative z-10 max-w-3xl mx-auto px-6">
					<div className="grid sm:grid-cols-2 gap-4">
						{commitments.map((c) => (
							<div
								key={c.title}
								className="rounded-2xl border border-do-border bg-do-bg-card/80 backdrop-blur-sm p-6"
							>
								<div className="h-10 w-10 rounded-lg bg-do-orange/10 border border-do-orange/20 flex items-center justify-center mb-4">
									<c.icon className="h-5 w-5 text-do-orange" />
								</div>
								<h3 className="font-semibold text-do-text mb-2">{c.title}</h3>
								<p className="text-sm text-do-text-secondary leading-relaxed">
									{c.body}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Policy body */}
			<section className="relative py-16 overflow-hidden">
				<div className="absolute inset-0 do-blueprint-grid-dense pointer-events-none" />

				<div className="relative z-10 max-w-3xl mx-auto px-6">
					<div className="space-y-12">
						{sections.map((section) => (
							<div key={section.heading} id={slug(section.heading)} className="scroll-mt-32">
								<h2 className="text-2xl font-bold text-do-text mb-4">
									{section.heading}
								</h2>
								<div className="space-y-4">
									{section.paragraphs.map((p, i) => (
										<p
											key={i}
											className="text-base text-do-text-secondary leading-relaxed"
										>
											{p}
										</p>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			<SiteFooter />
		</main>
	);
}
