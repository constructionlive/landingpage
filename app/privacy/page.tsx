import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ShieldCheck, Lock, Ban, KeyRound } from "lucide-react";
import SiteNav from "@/components/home/SiteNav";
import SiteFooter from "@/components/home/SiteFooter";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
	title: "Privacy Policy | construction.live",
	description:
		"How construction.live (operated by Neuratwin Inc., Toronto, Canada) collects, uses, shares, and protects personal information across our website, web app, and iOS and Android apps. We do not train AI models on your data, and we do not sell it.",
	alternates: {
		canonical: absoluteUrl("/privacy"),
	},
};

const EFFECTIVE_DATE = "September 23, 2026";
const PRIVACY_EMAIL = "rahul@construction.live";

/* ── Headline commitments (Section 1) ─────────────────────────────────── */

const commitments = [
	{
		icon: Ban,
		title: "No training on your data",
		body: "We do not use your project content to train AI models, and we do not allow our AI providers to do so.",
	},
	{
		icon: ShieldCheck,
		title: "No selling or advertising",
		body: "We do not sell personal information, share it for cross-context behavioral advertising, or track you across other companies' apps and websites.",
	},
	{
		icon: Lock,
		title: "Encrypted in transit and at rest",
		body: "Your information is encrypted while it travels and while it is stored.",
	},
	{
		icon: KeyRound,
		title: "You control your data",
		body: "You can access, export, or delete it. See “Your rights and choices” below.",
	},
];

/* ── Policy sections ──────────────────────────────────────────────────── */

/* Body copy is plain strings with two inline marks, **bold** and
   [label](href), so the policy text stays readable in this file. */
type Block =
	| { p: string }
	| { ul: string[] }
	| { h3: string }
	| { table: { head: string[]; rows: string[][] } };

type Section = { heading: string; blocks: Block[] };

const sections: Section[] = [
	{
		heading: "Our commitments",
		blocks: [
			{
				ul: [
					"**No training on your data.** We do not use your project content to train AI models, and we do not allow our AI providers to do so.",
					"**No selling or advertising.** We do not sell personal information, share it for cross-context behavioral advertising, or track you across other companies' apps and websites.",
					"**Encrypted in transit and at rest.**",
					"**You control your data.** You can access, export, or delete it (see Section 9).",
				],
			},
		],
	},
	{
		heading: "Who this policy applies to",
		blocks: [
			{
				p: "Most people use construction.live because their employer or a project team invited them. In that case your organization is usually the **controller** of project content (drawings, reports, recordings, messages), and we process it on the organization's behalf under our agreement with them. We act as the controller for account, device, and usage information we need to run the Service. If you have a question about project content, you can contact your organization or us.",
			},
		],
	},
	{
		heading: "Information we collect",
		blocks: [
			{ h3: "3.1 Information you provide" },
			{
				ul: [
					"**Account information:** name, email address, password (stored only as a salted hash), phone number (if you enable SMS features or phone verification), company, role, and profile photo.",
					"**Project content:** daily logs, reports, time-and-material sheets, schedules, inspections and markups, drawings, documents and files you upload, messages and chats with the AI assistant, meeting recordings, transcripts, and minutes.",
					"**Communications:** support requests, feedback, and emails you send to or through the Service.",
					"**Billing information:** if you purchase a subscription, payment is processed by Stripe; we receive the billing name, email, and limited card details (such as brand and last four digits), never the full card number.",
				],
			},
			{ h3: "3.2 Information from the mobile app's device features" },
			{
				p: "The app only uses these features when you choose to, and asks for iOS/Android permission first. You can turn permissions off at any time in your phone's settings.",
			},
			{
				table: {
					head: ["Permission", "What we use it for"],
					rows: [
						[
							"**Microphone**",
							"Recording site meetings and voice notes that you start. Recording can continue while the screen is locked or the app is in the background until you stop it; iOS shows a recording indicator the whole time.",
						],
						[
							"**Camera**",
							"Taking photos of site conditions for daily logs, inspections, and messages to the AI assistant.",
						],
						["**Photo library**", "Attaching photos you pick. We only receive the photos you select."],
						["**Files**", "Attaching documents you pick from the Files app or cloud drives."],
					],
				},
			},
			{
				ul: [
					"**Photo metadata:** photos can contain embedded metadata (EXIF), such as the time taken and, if location tagging is on for your camera, GPS coordinates. We use the capture time to put photos in the right place in a report. The original file, including its metadata, is stored with your project. The app does **not** request access to your device's location.",
					"**On-device storage:** the app keeps your sign-in token in the device's secure keychain, and caches project data, pending recordings, and photos locally so field capture works offline. This data is removed when you delete the app.",
					"**Home-screen widget:** the recording widget stores only the name of the last project you recorded to.",
				],
			},
			{ h3: "3.3 Information collected automatically" },
			{
				ul: [
					"**Usage and device data:** IP address, device model, operating system and app version, crash and error diagnostics, and log data such as feature usage and timestamps. We use this to keep the Service secure and reliable.",
					"**App updates:** the mobile app checks for updates through Expo's update service, which receives your IP address, platform, and app version to deliver the correct update.",
					"**Website analytics:** on our website we use PostHog to understand how visitors use the site (see Section 8). The mobile app does not include advertising or third-party analytics SDKs.",
				],
			},
			{ h3: "3.4 Information from connected services" },
			{
				p: "If you or your organization connect a third-party account, we access it only to provide the features you turn on:",
			},
			{
				ul: [
					"**Microsoft 365 / Outlook / OneDrive / Teams** and **Google Workspace / Gmail / Google Drive / Google Calendar:** email, calendar events, contacts, and files you authorize, used for features like email drafting and filing, meeting scheduling and notetaking, and document search.",
					"**Procore:** project, document, and record data from the Procore projects you connect.",
					"**Video meeting platforms (such as Microsoft Teams and Google Meet):** when you invite or schedule the construction.live notetaker, it joins the meeting and records audio, video, participant names, and the transcript.",
					"**API connections you add:** credentials you provide are encrypted and used only to make requests you or your AI assistant initiate.",
				],
			},
			{ p: "You can disconnect any integration at any time, which stops further access." },
		],
	},
	{
		heading: "How we use information",
		blocks: [
			{
				ul: [
					"Provide, operate, and maintain the Service, including syncing your work across web and mobile.",
					"Transcribe recordings, generate meeting minutes, daily reports, and summaries, and answer your requests through AI features.",
					"Send the emails, text messages, and notifications you or your team request, and service messages (such as sign-in codes, invitations, and security alerts).",
					"Secure the Service: authentication, two-factor verification, fraud and abuse prevention, and audit logging.",
					"Troubleshoot, measure performance, and improve reliability.",
					"Process payments and manage subscriptions.",
					"Send product news and newsletters **only with your consent**; you can unsubscribe at any time.",
					"Comply with legal obligations and enforce our terms.",
				],
			},
			{
				p: "We do **not** use your project content for advertising, and we do not make decisions with legal or similarly significant effects about you based solely on automated processing.",
			},
		],
	},
	{
		heading: "AI features and third-party AI services",
		blocks: [
			{
				p: "construction.live uses third-party AI services to power its AI features. This section explains exactly what is sent, who receives it, why, and the choice you have.",
			},
			{ h3: "5.1 What data is sent, and why" },
			{
				p: "Data is sent only when you, or a colleague on your project, use a feature that needs it, and only the material that feature needs:",
			},
			{
				table: {
					head: ["Data", "When it is sent", "Why"],
					rows: [
						[
							"Voice memos and meeting recordings",
							"When you add a voice memo to a daily log or inspection, or process a meeting",
							"To transcribe speech into text",
						],
						[
							"Photos",
							"When a photo is added to a daily log or inspection and the report or the AI agent reads it",
							"To describe site conditions in reports",
						],
						[
							"Notes, daily-log entries and inspection findings",
							"When a daily report or meeting minutes are written",
							"To write daily reports, minutes and summaries",
						],
						[
							"Messages to the AI agent, files you attach, and project documents the agent opens",
							"When you use the AI agent",
							"To answer your question or carry out the task you asked for",
						],
					],
				},
			},
			{ p: "We do not send your password, payment details or device identifiers to AI services." },
			{ h3: "5.2 Who receives it" },
			{
				ul: [
					"**OpenRouter, Inc.** (United States), an AI gateway that routes each request to a model provider.",
					"**The model provider for that request:** Google (Gemini models), xAI (Grok models), OpenAI, or, in the AI agent, the provider of the model you choose in the model picker.",
				],
			},
			{ h3: "5.3 How it is protected" },
			{
				ul: [
					"**Zero data retention.** Our OpenRouter account only routes requests to providers with a zero data retention policy. Those providers process a request to produce a result and do not keep your data afterwards.",
					"**No training.** Your data is never used to train AI models, by us or by these providers.",
					"**Encryption.** Requests are sent over encrypted (TLS) connections.",
					"**What we keep.** The results (transcripts, reports, minutes, answers) are stored in your construction.live workspace under the same protections as the rest of your content, and are deleted with it.",
					"**Equal protection.** We only use AI services whose terms protect your data at least as well as this policy does.",
				],
			},
			{ h3: "5.4 Your permission and how to change it" },
			{
				ul: [
					"**In the mobile app, we ask before anything is sent.** After you sign in, the app explains what is sent and to whom, and asks whether you allow AI data sharing. Nothing is sent to an AI service on your behalf until you answer.",
					"**You can change your answer at any time** in the app under **Settings > AI data sharing**. The change takes effect immediately.",
					"**If you don't allow it (or turn it off),** your voice memos, photos, notes and recordings are still saved to your project, but they are not transcribed, summarised or included in AI-written reports, and the AI agent is unavailable to you.",
					"On the web, AI features run only when you use them, for example when you send a message to the AI agent or process a meeting.",
					"Your choice covers AI features you use and your entries in AI-written reports. Content you add to a **shared project** can still be read by the AI agent when a colleague who has AI data sharing turned on asks it about that project, because that content belongs to the project your organization controls.",
				],
			},
			{ h3: "5.5 Accuracy" },
			{
				p: "AI output can be inaccurate. Review generated reports, minutes and emails before relying on them.",
			},
		],
	},
	{
		heading: "How we share information",
		blocks: [
			{ p: "We share personal information only as described here:" },
			{
				ul: [
					"**Your organization and project team:** content you add to a shared project is visible to the members of that project, according to the permissions your organization sets.",
					"**People you choose to contact:** for example, when you send an email, share a report, or share a link.",
					"**Service providers (sub-processors)** who process data on our behalf under contracts that require confidentiality and security:",
				],
			},
			{
				table: {
					head: ["Provider", "Purpose"],
					rows: [
						["Convex", "Application database, file storage, and backend hosting"],
						["Vercel", "Web application hosting"],
						[
							"OpenRouter and the AI model providers it routes to (such as Google, OpenAI, and xAI)",
							"AI processing, transcription, and generation, with zero data retention",
						],
						["E2B", "Secure, isolated sandboxes for AI file and code tasks"],
						["Browser Use", "Browser automation performed at your request"],
						["Recall.ai", "Meeting notetaker bots, recordings, and transcripts"],
						["Resend", "Transactional email delivery"],
						["Twilio", "SMS messages and phone verification"],
						["Vapi", "AI voice calls, if you use them"],
						["Stripe", "Payment processing"],
						["PostHog", "Website analytics"],
						["Expo (650 Industries)", "Mobile app builds and over-the-air updates"],
						["Apple and Google", "App distribution and, where enabled, push notifications"],
					],
				},
			},
			{
				ul: [
					"**Legal and safety:** when required by law, subpoena, or court order, or to protect the rights, property, or safety of our users, the public, or us.",
					"**Business transfers:** in connection with a merger, acquisition, or sale of assets, subject to this policy.",
				],
			},
			{ p: "We do not sell personal information or share it for cross-context behavioral advertising." },
		],
	},
	{
		heading: "Google user data",
		blocks: [
			{
				p: "construction.live's use and transfer of information received from Google APIs adheres to the [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy), including the Limited Use requirements. Specifically, Google user data is used only to provide the features you enabled, is not used for advertising, is not sold, is not used to train generalized AI models, and is not read by humans except with your consent, for security purposes, or as required by law.",
			},
		],
	},
	{
		heading: "Cookies and analytics",
		blocks: [
			{
				ul: [
					"**Strictly necessary cookies** keep you signed in and secure the Service. They are always active.",
					"**Analytics cookies** (PostHog) help us understand website usage and are retained for up to 12 months. In the EEA, UK, and Switzerland we set them only with your consent; elsewhere they are set by default and you can opt out through your browser controls or by contacting us.",
					"The mobile app does not use advertising identifiers and does not track you across other companies' apps or websites.",
				],
			},
		],
	},
	{
		heading: "Your rights and choices",
		blocks: [
			{
				p: "Depending on where you live (including under Canada's PIPEDA and provincial laws, the EU/UK GDPR, and US state laws such as the California Consumer Privacy Act), you may have the right to:",
			},
			{
				ul: [
					"**Access** the personal information we hold about you and receive a copy (**portability**).",
					"**Correct** inaccurate information.",
					"**Delete** your account and personal information.",
					"**Object to or restrict** certain processing, and **withdraw consent** where processing is based on consent.",
					"**Turn off AI data sharing** at any time in the mobile app under Settings > AI data sharing (see Section 5.4).",
					"**Opt out** of marketing emails (use the unsubscribe link) and SMS (reply STOP).",
					"**Not be discriminated against** for exercising these rights.",
				],
			},
			{
				p: "**Deleting your account.** In the mobile app, go to **Settings → Delete account**, type DELETE to confirm, and your account is deleted immediately — there is nothing to email and nothing else to complete. Deleted at once: your sign-in credentials and every active session, two-factor enrolment, profile and settings, AI data sharing choice, personal workspace and files, any email or calendar accounts you connected, notifications, and your access to every project and organization. The account cannot be recovered or reactivated, and that email can no longer sign in.",
			},
			{
				p: `If you use construction.live only on the web, email **${PRIVACY_EMAIL}** from the address on your account and we will delete it within 30 days, and confirm when it's done.`,
			},
			{
				p: "**What remains after deletion.** If your account belongs to an organization, the material you filed into its shared projects — daily reports, photos, meeting recordings, inspections and time records — stays with those projects as the organization's construction records, which it is required to keep. Those records are de-identified: your name and contact details are removed, and nothing in them identifies you. We also keep a single dated record that the account was deleted.",
			},
			{
				p: `To exercise any other right, email **${PRIVACY_EMAIL}**. We respond within 30 days. You may also complain to your local data protection authority, including the Office of the Privacy Commissioner of Canada.`,
			},
		],
	},
	{
		heading: "Data retention",
		blocks: [
			{
				ul: [
					"**Account and project content:** kept while your account or your organization's subscription is active, and deleted or de-identified within 30 days after closure, unless we must keep it longer to meet legal, tax, or accounting obligations or resolve disputes.",
					"**Recordings and transcripts:** kept with the project they belong to and deleted along with it, or earlier if you remove them.",
					"**Security and diagnostic logs:** kept for a limited period, typically no longer than 12 months.",
					"**Backups:** deleted data may persist in encrypted backups for a limited period until they are overwritten.",
				],
			},
		],
	},
	{
		heading: "Security",
		blocks: [
			{
				p: "We use encryption in transit (TLS) and at rest, role-based access controls, two-factor authentication, encrypted storage of integration credentials, isolated sandboxes for AI tasks, and audit logging. No method of transmission or storage is completely secure, but we work to protect your information and will notify you and the appropriate authorities of a data breach as required by law.",
			},
		],
	},
	{
		heading: "International transfers",
		blocks: [
			{
				p: "We are based in Canada, and our service providers process data in the United States and other countries. When we transfer personal information across borders, we protect it with contractual safeguards, including Standard Contractual Clauses where required. Information processed in another country may be accessible to that country's authorities under its laws.",
			},
		],
	},
	{
		heading: "Children",
		blocks: [
			{
				p: "The Service is intended for professional use and is not directed to children under 16. We do not knowingly collect personal information from children. If you believe a child has provided us information, contact us and we will delete it.",
			},
		],
	},
	{
		heading: "Changes to this policy",
		blocks: [
			{
				p: "We may update this policy from time to time. We will post the updated version here with a new effective date and, for material changes, notify you by email or in the Service before the changes take effect.",
			},
		],
	},
	{
		heading: "Contact us",
		blocks: [
			{ p: "Neuratwin Inc. (construction.live)" },
			{ p: "Toronto, Ontario, Canada" },
			{ p: `**Privacy Officer:** ${PRIVACY_EMAIL}` },
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

/* Renders the two inline marks used in the policy copy. */
function rich(text: string): ReactNode[] {
	return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
		const bold = part.match(/^\*\*([^*]+)\*\*$/);
		if (bold) {
			return (
				<strong key={i} className="font-semibold text-do-text">
					{bold[1]}
				</strong>
			);
		}
		const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
		if (link) {
			return (
				<a
					key={i}
					href={link[2]}
					target="_blank"
					rel="noopener noreferrer"
					className="text-do-orange hover:underline"
				>
					{link[1]}
				</a>
			);
		}
		return part;
	});
}

function renderBlock(block: Block, i: number) {
	if ("h3" in block) {
		return (
			<h3 key={i} className="text-lg font-semibold text-do-text pt-2">
				{block.h3}
			</h3>
		);
	}
	if ("ul" in block) {
		return (
			<ul
				key={i}
				className="list-disc pl-5 space-y-2 text-base text-do-text-secondary leading-relaxed marker:text-do-orange"
			>
				{block.ul.map((item, j) => (
					<li key={j}>{rich(item)}</li>
				))}
			</ul>
		);
	}
	if ("table" in block) {
		return (
			<div key={i} className="overflow-x-auto rounded-xl border border-do-border">
				<table className="w-full text-left text-sm">
					<thead className="bg-do-bg-card/80">
						<tr>
							{block.table.head.map((h) => (
								<th key={h} className="px-4 py-3 font-semibold text-do-text">
									{h}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{block.table.rows.map((cells, j) => (
							<tr key={j} className="border-t border-do-border align-top">
								{cells.map((cell, k) => (
									<td
										key={k}
										className={`px-4 py-3 text-do-text-secondary leading-relaxed${
											k === 0 && cells.length === 2 ? " sm:w-1/3" : ""
										}`}
									>
										{rich(cell)}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		);
	}
	return (
		<p key={i} className="text-base text-do-text-secondary leading-relaxed">
			{rich(block.p)}
		</p>
	);
}

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
					<div className="space-y-1 text-base text-do-text-secondary">
						<p>
							<strong className="font-semibold text-do-text">Effective date:</strong> {EFFECTIVE_DATE}
						</p>
						<p>
							<strong className="font-semibold text-do-text">Operator:</strong> Neuratwin Inc.
							(“construction.live”, “we”, “us”), Toronto, Ontario, Canada
						</p>
						<p>
							<strong className="font-semibold text-do-text">Contact / Privacy Officer:</strong>{" "}
							<a href={`mailto:${PRIVACY_EMAIL}`} className="text-do-orange hover:underline">
								{PRIVACY_EMAIL}
							</a>
						</p>
					</div>
					<p className="mt-6 text-base text-do-text-secondary leading-relaxed">
						This policy explains what personal information we collect when you use the
						construction.live website, web application, and the construction.live mobile app for
						iOS and Android (together, the “Service”), how we use and share it, and the choices
						you have.
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
						{sections.map((section, n) => (
							<div key={section.heading} id={slug(section.heading)} className="scroll-mt-32">
								<h2 className="text-2xl font-bold text-do-text mb-4">
									{n + 1}. {section.heading}
								</h2>
								<div className="space-y-4">{section.blocks.map(renderBlock)}</div>
							</div>
						))}
					</div>
				</div>
			</section>

			<SiteFooter />
		</main>
	);
}
