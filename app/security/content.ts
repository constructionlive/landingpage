import {
	WifiOff,
	FileLock2,
	ScrollText,
	KeyRound,
	Server,
	Database,
	Users,
	History,
	Fingerprint,
	Trash2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* Content model for /security.

   The organising idea: every claim on this page carries a status, and the
   statuses are honest about who checked the work. A trust page that lists
   "SOC 2" next to "air-gapped deployment" with the same visual weight is
   telling the reader those two claims are equally verified. They are not —
   one is a property of the wiring a customer can confirm themselves in an
   afternoon, the other is a report we don't have yet.

   Security reviewers check registries. Listing a certification we haven't
   earned is a two-minute thing to catch and it costs the whole page its
   credibility, so nothing here claims more than it can survive.

   To promote an item: change its status, fill in `evidence`, and add the
   registry link. That's the whole edit. */

export const LAST_REVIEWED = "19 August 2026";

/* Routed to a real inbox before this page shipped. If that ever stops being
   true, take the disclosure section down rather than leaving a dead address
   on a security page. */
export const SECURITY_EMAIL = "dev@construction.live";

export type Status = "guaranteed" | "attested" | "in-progress" | "planned";

export const STATUS_META: Record<
	Status,
	{ label: string; short: string; explanation: string }
> = {
	guaranteed: {
		label: "Verifiable by you",
		short: "Verifiable",
		explanation:
			"A property of how the system is built, not a promise we make about it. Your own team can confirm it without taking our word for anything.",
	},
	attested: {
		label: "Self-attested",
		short: "Self-attested",
		explanation:
			"We assert this and stand behind it contractually. No independent third party has audited it. Read it as our word, not an auditor's.",
	},
	"in-progress": {
		label: "In progress",
		short: "In progress",
		explanation:
			"Actively underway. Listed here so you can see what's coming, with the honest status attached. Not yet something you should rely on.",
	},
	planned: {
		label: "Planned",
		short: "Planned",
		explanation:
			"On the roadmap, not started. Listed so you can ask us about timing rather than guess.",
	},
};

/* ── Architectural guarantees ─────────────────────────────────────────────── */

export interface Guarantee {
	icon: LucideIcon;
	title: string;
	detail: string;
	/* What a sceptical customer would actually do to check it. A guarantee
	   nobody can test is just an assertion with better formatting. */
	verify: string;
}

export const GUARANTEES: Guarantee[] = [
	{
		icon: WifiOff,
		title: "No network path off the box",
		detail:
			"In the air-gapped configuration the hardware has no route to the public internet. Radios are disabled in firmware, there is no telemetry channel and no phone-home. Model and platform updates arrive on media your team inspects first.",
		verify:
			"Put it on a monitored segment and watch. There is nothing to see, and that's the point — this is testable in an afternoon with tools you already own.",
	},
	{
		icon: Server,
		title: "Inference happens on your hardware",
		detail:
			"Every drawing, contract, daily log and voice note is read by a model running on the machine in your building. There is no vendor-side inference in the path because there is no vendor in the path.",
		verify:
			"Pull the uplink and keep working. The platform doesn't degrade, because nothing it needs was ever on the other end of that cable.",
	},
	{
		icon: FileLock2,
		title: "The weights sit on your disks",
		detail:
			"Open-weight models, installed locally. No licence server to reach, no entitlement check, and no vendor able to deprecate the model your procurement was written around.",
		verify:
			"Inspect the filesystem. The weights are files. Copy them, hash them, hold them in escrow if your contract calls for it.",
	},
	{
		icon: ScrollText,
		title: "The audit log is yours and it's local",
		detail:
			"Every prompt, retrieval and generation is written to an on-box log alongside the project record it touched. An access-to-information request, an inquiry or an internal review can be answered from your own logs without asking us for anything.",
		verify:
			"Read it directly. It's on your storage, in your facility, under your retention policy — not exported from a vendor dashboard.",
	},
];

/* ── Certifications ───────────────────────────────────────────────────────── */

export interface Certification {
	name: string;
	body: string;
	status: Status;
	description: string;
	/* Registry entry, report request or similar. Absent until there's something
	   real to point at — a "coming soon" link is worse than none. */
	evidence?: { label: string; href: string };
	note?: string;
}

export const CERTIFICATIONS: Certification[] = [
	{
		name: "CSA STAR Level 1",
		body: "Cloud Security Alliance",
		status: "in-progress",
		description:
			"A self-assessment against the Consensus Assessments Initiative Questionnaire, published to the CSA's public STAR registry. Level 1 is self-attested by design: the CSA publishes what we submit, it does not audit it.",
		note: "Our registry entry will be linked here once it is live. Until you can click through to it, treat this as not yet done.",
	},
	{
		name: "CyberSecure Canada",
		body: "Innovation, Science and Economic Development Canada",
		status: "in-progress",
		description:
			"The federal certification for Canadian small and medium businesses, covering thirteen control areas from patching and backups to incident response and access control. Self-assessment first, then confirmation by an accredited certification body.",
		note: "Relevant to Canadian public sector procurement specifically, which is why it's ahead of the heavier international standards on our list.",
	},
	{
		name: "SOC 2 Type II",
		body: "Independent CPA firm, AICPA standards",
		status: "planned",
		description:
			"An attestation report produced by a licensed CPA firm covering a continuous observation window, typically three to twelve months. It cannot be self-issued and there is no such thing as a SOC 2 certificate.",
		note: "We are not SOC 2 audited and we don't describe ourselves as SOC 2 ready, aligned or equivalent. When we have a report, this line will say so and we'll share it under NDA.",
	},
	{
		name: "ISO/IEC 27001",
		body: "Accredited certification body",
		status: "planned",
		description:
			"Certification of an information security management system by an accredited body. Like SOC 2, it requires an external auditor and cannot be self-declared.",
	},
	{
		name: "NIST SP 800-171 self-assessment",
		body: "Self-assessed, scored in SPRS",
		status: "planned",
		description:
			"The control set for handling Controlled Unclassified Information in the US federal supply chain. Contractors self-assess and post a score. Being genuinely self-attested does not make it low-stakes: a false score is a False Claims Act exposure.",
		note: "Sequenced behind the Canadian items because it only matters once we pursue US federal work.",
	},
];

/* ── Cloud platform ───────────────────────────────────────────────────────── */

export interface Practice {
	icon: LucideIcon;
	title: string;
	detail: string;
	status: Status;
}

/* The self-hosted box removes most of this by construction. These describe the
   hosted product, where the honest answer is "we hold your data and here is
   what we do with it". */
export const CLOUD_PRACTICES: Practice[] = [
	{
		icon: Database,
		title: "Zero retention with every AI provider",
		detail:
			"Content sent to a model provider for processing is covered by a zero-retention agreement. Providers do not store it beyond the moment of processing and do not train on it.",
		status: "attested",
	},
	{
		icon: KeyRound,
		title: "Encrypted in transit and at rest",
		detail:
			"Project documentation is commercially sensitive and is encrypted both on the wire and in storage.",
		status: "attested",
	},
	{
		icon: Users,
		title: "Role-based access control",
		detail:
			"Access to project records is scoped by role, so a subcontractor seat cannot read what an owner's rep can.",
		status: "attested",
	},
	{
		icon: History,
		title: "Audit logging",
		detail:
			"Access to and changes against project records are logged, which is also what makes the revision chain and the delay evidence work.",
		status: "attested",
	},
	{
		icon: Fingerprint,
		title: "No training on your data without consent",
		detail:
			"We do not use your project content to train models, and we will not without your explicit, separately obtained agreement.",
		status: "attested",
	},
	{
		icon: Trash2,
		title: "Deletion on request",
		detail:
			"Close your account and we delete your project data on request, subject only to limited retention the law requires of us, such as billing records.",
		status: "attested",
	},
];

/* ── Disclosure ───────────────────────────────────────────────────────────── */

export const DISCLOSURE = {
	commitment: [
		"We acknowledge reports within two business days.",
		"We will not pursue legal action against good-faith research that respects the boundaries below.",
		"We'll tell you when the issue is fixed, and credit you publicly if you'd like us to.",
	],
	boundaries: [
		"Test only against your own account or a deployment you're authorised to touch.",
		"No denial of service, no social engineering, no physical attempts against our staff or offices.",
		"Don't access, modify or retain another customer's project data. If you reach it by accident, stop and tell us.",
	],
};
