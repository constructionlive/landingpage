import {
	Cpu,
	MemoryStick,
	HardDrive,
	Zap,
	Box,
	Network,
	Terminal,
	ShieldCheck,
	Building2,
	Landmark,
	Truck,
	WifiOff,
	FileLock2,
	Infinity as InfinityIcon,
	Gauge,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* Content model for /hardware.

   The argument on this page runs in one direction: the platform is the same
   product everywhere, and the only thing that changes between an office and a
   ministry is *where the weights run*. So the tiers below are deliberately not
   feature tiers — every tier ships the whole platform. They differ on siting,
   scale and how tightly the box is sealed off from the network.

   Kept as data rather than JSX because the same three tiers feed the tier
   cards, the comparison column headers and the spec table, and they used to
   drift apart when they were three separate blocks of markup. */

/* ── Why a box at all ─────────────────────────────────────────────────────── */

export interface Pillar {
	icon: LucideIcon;
	title: string;
	detail: string;
}

export const PILLARS: Pillar[] = [
	{
		icon: Gauge,
		title: "Built for inference",
		detail:
			"128 GB of unified memory holds a long-context model resident, and a dedicated 32 GB GDDR6 card carries the decode. Big enough for a full drawing set in one prompt, fast enough that a super isn't waiting on it.",
	},
	{
		icon: Zap,
		title: "Ready in an afternoon",
		detail:
			"It arrives with the engine, the models and the construction.live harness already on it. Power, network, pair, and your projects are indexing before the crew goes home.",
	},
	{
		icon: ShieldCheck,
		title: "Private by default",
		detail:
			"Every drawing, contract, daily log and voice note is read on the box in your building. Nothing is sent to a model vendor, because there is no model vendor in the path.",
	},
];

/* ── Tiers ────────────────────────────────────────────────────────────────── */

export interface Tier {
	slug: string;
	icon: LucideIcon;
	name: string;
	audience: string;
	headline: string;
	description: string;
	/* Rendered as the card's spec strip. Short enough to scan in a column. */
	facts: { label: string; value: string }[];
	includes: string[];
	/* One tier carries the visual weight. Three highlighted cards is no
	   highlight at all. */
	featured?: boolean;
	cta: { label: string; href: string };
}

export const TIERS: Tier[] = [
	{
		slug: "site",
		icon: Truck,
		name: "Site Box",
		audience: "Jobsite trailer or a single office",
		headline: "One box, one job.",
		description:
			"The base unit, sized to sit under a desk in the trailer. It runs the whole platform for the crew on that job — voice notes, daily logs, drawing revisions, submittals — without a line out to anything.",
		facts: [
			{ label: "Units", value: "1" },
			{ label: "Unified memory", value: "128 GB" },
			{ label: "Dedicated VRAM", value: "32 GB" },
			{ label: "Draw", value: "~500 W sustained" },
		],
		includes: [
			"Full construction.live platform, on-box",
			"DeepSeek V4 and Qwen3.8-27B pre-tuned",
			"Unlimited seats on that project",
			"Wi-Fi 7, 5 GbE, runs off a standard 15 A circuit",
		],
		cta: { label: "Request an allocation", href: "/contact" },
	},
	{
		slug: "office",
		icon: Building2,
		name: "Office Cluster",
		audience: "A contractor running a portfolio",
		headline: "Unlimited use, flat cost.",
		description:
			"Four units racked together in your own server room, serving every project and every seat in the company. You stop paying per token and start paying for a machine, so nobody in the office has a reason to ration what they ask it.",
		facts: [
			{ label: "Units", value: "4, clustered" },
			{ label: "Unified memory", value: "512 GB aggregate" },
			{ label: "Dedicated VRAM", value: "128 GB aggregate" },
			{ label: "Draw", value: "~2 kW sustained" },
		],
		includes: [
			"Everything in Site Box, across every live project",
			"Unlimited seats, unlimited usage, no per-token metering",
			"OpenAI- and Anthropic-compatible endpoints for your own tools",
			"Procore, Autodesk, Bluebeam and email connectors run on-box",
		],
		featured: true,
		cta: { label: "Request an allocation", href: "/contact" },
	},
	{
		slug: "government",
		icon: Landmark,
		name: "Government Enclave",
		audience: "Public owners, defence and infrastructure",
		headline: "Completely self-hosted. No egress.",
		description:
			"The same platform, delivered air-gapped. It is installed inside your perimeter, the weights are on your disks, and the box has no route to the public internet — not a restricted one, none. Updates arrive the way anything else arrives in a secure facility: on media you inspect first.",
		facts: [
			{ label: "Units", value: "4 to 16, rack-mounted" },
			{ label: "Unified memory", value: "Up to 2 TB aggregate" },
			{ label: "Dedicated VRAM", value: "Up to 512 GB aggregate" },
			{ label: "Egress", value: "None" },
		],
		includes: [
			"Air-gapped install, offline model and platform updates",
			"Data residency by construction: nothing leaves the facility",
			"Full audit log of every prompt, retrieval and generation",
			"SSO, role-based access and per-project compartments",
		],
		cta: { label: "Talk to our public sector team", href: "/contact" },
	},
];

/* ── Specifications ───────────────────────────────────────────────────────── */

export interface SpecGroup {
	icon: LucideIcon;
	label: string;
	rows: { label: string; value: string }[];
}

/* Per unit, not per cluster. The tiers above multiply these; stating them once
   here keeps the two from contradicting each other. */
export const SPEC_GROUPS: SpecGroup[] = [
	{
		icon: Cpu,
		label: "Compute",
		rows: [
			{ label: "Processor", value: "AMD Ryzen AI MAX+ 395" },
			{ label: "Integrated GPU", value: "40 cores, up to 60 TFLOPS" },
			{ label: "Dedicated GPU", value: "AMD Radeon AI PRO R9700, 64 CUs" },
			{ label: "GPU performance", value: "Up to 191 TFLOPS at FP16" },
		],
	},
	{
		icon: MemoryStick,
		label: "Memory",
		rows: [
			{ label: "Unified memory", value: "128 GB LPDDR5X-8000" },
			{ label: "Unified bandwidth", value: "256 GB/s" },
			{ label: "Video memory", value: "32 GB GDDR6" },
			{ label: "Video bandwidth", value: "640 GB/s" },
		],
	},
	{
		icon: HardDrive,
		label: "Storage",
		rows: [
			{ label: "Capacity", value: "2 TB NVMe 1.4" },
			{ label: "Drive", value: "KingSpec XG7000" },
			{ label: "Sequential read", value: "Up to 7,400 MB/s" },
			{ label: "Sequential write", value: "Up to 6,600 MB/s" },
		],
	},
	{
		icon: Zap,
		label: "Power",
		rows: [
			{ label: "Supply", value: "1,000 W Corsair SF1000, 80 PLUS Platinum" },
			{ label: "Sustained load", value: "~500 W" },
			{ label: "Idle", value: "~40 W" },
			{ label: "Circuit", value: "Standard 15 A office outlet" },
		],
	},
	{
		icon: Box,
		label: "Chassis",
		rows: [
			{ label: "Dimensions", value: "340 × 110 × 320 mm (13.4 × 4.3 × 12.6 in)" },
			{ label: "Volume", value: "11.97 L (~730 in³)" },
			{ label: "Weight", value: "6 kg (13.2 lb)" },
			{ label: "Build", value: "Machined aluminium, air-cooled for low noise" },
		],
	},
	{
		icon: Network,
		label: "Connectivity",
		rows: [
			{ label: "Networking", value: "5 GbE Ethernet, Wi-Fi 7, Bluetooth" },
			{ label: "Data ports", value: "2× USB4, 2× USB-A" },
			{ label: "Display", value: "HDMI 2.1, 2× DisplayPort 2.1, 4 GPU outputs" },
			{ label: "Air-gap option", value: "Radios disabled in firmware on request" },
		],
	},
	{
		icon: Terminal,
		label: "Software",
		rows: [
			{ label: "Operating system", value: "Ubuntu" },
			{ label: "API", value: "OpenAI- and Anthropic-compatible" },
			{ label: "Pre-installed", value: "Inference engine, models, construction.live harness" },
			{ label: "Pre-ship testing", value: "72-hour burn-in" },
		],
	},
];

/* ── Models ───────────────────────────────────────────────────────────────── */

export interface ModelCard {
	name: string;
	role: string;
	detail: string;
}

/* The two the box is actually tuned around. Everything else in
   ALSO_RUNS is supported, not optimised, and the page says so. */
export const MODELS: ModelCard[] = [
	{
		name: "DeepSeek V4",
		role: "Long-context reasoning",
		detail:
			"Carries the work that needs the whole file in view at once: reading a drawing set against a schedule, tracing a change order back through the revisions that caused it, reconciling an invoice with what the daily logs say happened.",
	},
	{
		name: "Qwen3.8-27B",
		role: "High-throughput field work",
		detail:
			"The model that answers while a super is still standing in the stairwell. Voice note transcription and filing, daily log drafting, submittal classification, search across everything on the job.",
	},
];

export const ALSO_RUNS = ["GLM-4.6", "Llama 4 family", "DeepSeek V4-Flash", "Your own fine-tunes"];

/* ── The harness ──────────────────────────────────────────────────────────── */

export interface HarnessStep {
	number: string;
	title: string;
	detail: string;
}

export const HARNESS_STEPS: HarnessStep[] = [
	{
		number: "01",
		title: "It reads what arrives",
		detail:
			"Email threads, attachments, drawings, voice notes and photos land on the box and are parsed there. The agents that do the reading never leave the machine.",
	},
	{
		number: "02",
		title: "It files against the right job",
		detail:
			"Every artefact is matched to the project, the drawing revision and the schedule behind it, so the connected record builds itself as the job runs.",
	},
	{
		number: "03",
		title: "It answers on your endpoints",
		detail:
			"The same OpenAI- and Anthropic-compatible API your own tools already speak. Point an internal script, a BI tool or a coding agent at it and it just works.",
	},
];

/* ── Government / privacy ─────────────────────────────────────────────────── */

export interface Assurance {
	icon: LucideIcon;
	title: string;
	detail: string;
}

export const ASSURANCES: Assurance[] = [
	{
		icon: WifiOff,
		title: "Nothing leaves the building",
		detail:
			"In the air-gapped configuration the box has no route off your network. There is no telemetry channel, no phone-home, no vendor-side inference. Privacy here is a property of the wiring, not a clause in a contract.",
	},
	{
		icon: FileLock2,
		title: "The weights are yours",
		detail:
			"Open-weight models on your own disks. No licence server to reach, no deprecation notice that retires the model your procurement was written around, no vendor able to change the terms after award.",
	},
	{
		icon: ShieldCheck,
		title: "Auditable end to end",
		detail:
			"Every prompt, retrieval and generation is logged on-box with the record it touched, so an FOI request, an inquiry or an internal review can be answered from your own logs.",
	},
	{
		icon: InfinityIcon,
		title: "Priced as a capital asset",
		detail:
			"One machine, one purchase order, unlimited use. Nobody has to forecast token spend, and departmental usage never becomes a budget conversation.",
	},
];

/* ── Getting one ──────────────────────────────────────────────────────────── */

export const PROCESS = [
	{
		title: "Tell us the deployment",
		detail: "Trailer, server room or secure facility, and how many projects and people it has to carry.",
	},
	{
		title: "We size and quote it",
		detail: "Unit count, siting and integration scope, with the connectors you already run costed in.",
	},
	{
		title: "We build, burn in and install",
		detail: "72 hours of load testing before it ships, then installed and indexing your projects on site.",
	},
];

export const WARRANTY = [
	{ value: "1 year", label: "Parts and labour" },
	{ value: "72 hours", label: "Burn-in before it ships" },
	{ value: "On site", label: "Installed and handed over" },
];

/* ── FAQ ──────────────────────────────────────────────────────────────────── */

export const HARDWARE_FAQ = [
	{
		question: "Do we still need the cloud version if we buy a box?",
		answer:
			"No. The box runs the whole platform. Cloud and on-premise are the same product with the weights in a different room, and projects can move between them.",
	},
	{
		question: "What does it cost?",
		answer:
			"It's quoted per deployment, because unit count, siting and integration scope all move the number. Tell us the shape of the deployment on the contact form and we'll come back with a figure.",
	},
	{
		question: "Can it really run with no internet connection at all?",
		answer:
			"Yes. The Government Enclave configuration ships with the radios disabled in firmware and no route off your network. Model and platform updates are delivered on media your team inspects before it goes anywhere near the machine.",
	},
	{
		question: "What happens when a better model comes out?",
		answer:
			"You load it. The engine is model-agnostic and the weights are open, so a new DeepSeek or Qwen release is a file you copy onto the box, not a contract renegotiation.",
	},
	{
		question: "How much power does it draw?",
		answer:
			"About 500 W under sustained load and around 40 W idle, off a standard office circuit. A four-unit cluster wants a dedicated circuit and ordinary server-room airflow.",
	},
	{
		question: "Can our own engineers use it for other things?",
		answer:
			"Yes. It exposes OpenAI- and Anthropic-compatible endpoints, so any internal tool, script or coding agent that speaks those APIs can point at it. That capacity is included, not metered.",
	},
];
