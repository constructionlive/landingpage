import type { Metadata } from "next";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import { ShieldCheck, Lock, Ban, KeyRound } from "lucide-react";

export const metadata: Metadata = {
	title: "Privacy Policy | construction.live",
	description:
		"How construction.live (operated by Neuratwin Inc., Toronto, Canada) collects, uses, and protects your data. We do not use your data for AI training without your explicit consent, and every AI model we use runs under a zero-retention policy.",
	alternates: {
		canonical: "https://www.construction.live/privacy",
	},
};

const LAST_UPDATED = "July 16, 2026";

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
		heading: "AI processing and model providers",
		paragraphs: [
			"We use large language models and other AI services to transcribe voice notes, summarize calls, and structure your field records. When we send content to these providers for processing, we do so under agreements that require zero data retention — the providers do not store your content beyond the moment of processing, and they do not use it to train their models.",
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
			"If you have questions about this policy or how we handle your data, contact Neuratwin Inc. at privacy@construction.live.",
			"Neuratwin Inc., Toronto, Canada.",
		],
	},
];

/* ── Page ─────────────────────────────────────────────────────────────── */

export default function PrivacyPage() {
	return (
		<main className="min-h-screen bg-do-bg">
			<Navbar />

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
							<div key={section.heading}>
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

			<Footer />
		</main>
	);
}
