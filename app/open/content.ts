import {
	Bot,
	Ruler,
	ScanSearch,
	FileSignature,
	CalendarRange,
	FileText,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* Content model for /open — the Open Construction project.

   One page for every desktop app we give away: the ones you can download
   today and the ones still being built. The argument is the same on every
   card: a native app on your own machine, your files stay your files, and it
   has to be at least as good as the commercial tool it stands in for or it
   does not ship.

   Two things keep this honest. A `status: "available"` app must have a real
   installer behind it (the release manifests in releases.ts), and a
   `progress` number on a coming app is a rough share of the work done, not a
   date — we do not put dates on this page. */

export type Platform = "mac" | "windows";

export interface OpenApp {
	/** Also the anchor id on the page. */
	slug: string;
	/** Key into the release map, for apps with an installer. */
	releaseKey?: "agent" | "takeoff";
	icon: LucideIcon;
	name: string;
	/** What it stands in for. */
	replaces: string;
	tagline: string;
	detail: string;
	bullets: string[];
	status: "available" | "building";
	/** 0–100 for a building app. Ignored for available ones. */
	progress?: number;
	/** Which platforms have a build, for available apps. */
	platforms?: Platform[];
	/** Shown under the buttons. */
	note?: string;
	screenshot?: { src: string; width: number; height: number; alt: string };
	/** Public source, if any. */
	source?: string;
	/** A longer page about this app. */
	learnMore?: { label: string; href: string };
}

export const APPS: OpenApp[] = [
	{
		slug: "takeoff",
		releaseKey: "takeoff",
		icon: Ruler,
		name: "Takeoff Beam",
		replaces: "Bluebeam Revu",
		tagline: "PDF viewer, markups and quantity takeoff, with an agent that works the sheet.",
		detail:
			"Open a drawing set, then count, measure and mark it up. Ask the agent to do the same on the sheet in front of you: it sets the scale, counts symbols, measures runs and reads title blocks, and you review everything it adds.",
		bullets: [
			"Counts, lengths, areas with cutouts, volumes, angles. Scale presets, calibration, snapping, Follow Line.",
			"Text, callouts, clouds, stamps, and a Markups List with custom columns and CSV export.",
			"Split, merge, rotate, reorder, compare revisions, layers, search, flattened export.",
			"Native Rust, not a browser. An 859-page, 708 MB set opens in 21 ms. A 47 MB download.",
			"The takeoff is a plain JSON file next to the PDF. A CLI and an MCP server for other tools.",
			"Works from Claude Code: /plugin marketplace add constructionlive/takeoffbeam, then ask it to count the receptacles.",
		],
		status: "available",
		platforms: ["mac", "windows"],
		note: "Apple Silicon (macOS 12+) and Windows 10/11 x64. Signed and notarized.",
		screenshot: {
			src: "/images/open/takeoff-desk.png",
			width: 1440,
			height: 900,
			alt: "Takeoff Beam with a drawing sheet open, a takeoff in progress and the markups list below",
		},
		source: "https://github.com/constructionlive/takeoffbeam",
	},
	{
		slug: "agent",
		releaseKey: "agent",
		icon: Bot,
		name: "construction.live Desktop",
		replaces: "ChatGPT, Copilot and a shared drive",
		tagline: "The full agentic workspace, with the model on your own disk.",
		detail:
			"A chat that answers from your project rather than from the internet, a drive, an estimation bench, voice input and a project wiki. The model ships with the app, so a question about a sealed bid never leaves the laptop.",
		bullets: [
			"Attach drawings, contracts, specs and correspondence. They are parsed on the machine.",
			"An estimation bench and a project wiki, so the work compounds instead of resetting per chat.",
			"Ships with Qwen3.8-4B quantised for a normal laptop. Point it at any other local model.",
			"Switch to a cloud model on purpose, in the picker, and it tells you which one you are on.",
		],
		status: "available",
		platforms: ["mac"],
		note: "Apple Silicon, macOS 12 or newer. Windows is being built.",
		screenshot: {
			src: "/images/resources/why-drawings-estimation-workspace.webp",
			width: 1680,
			height: 1009,
			alt: "The construction.live desktop app with a drawing open in the estimation workspace",
		},
		learnMore: { label: "Read more about the desktop app", href: "/local" },
	},
	{
		slug: "drawing-checker",
		icon: ScanSearch,
		name: "Drawing Checker",
		replaces: "A week of coordination review",
		tagline: "Finds the conflicts in a drawing set before the site does.",
		detail:
			"Reads the architectural, structural and MEP sheets as one set and flags where they disagree: a beam through a duct run, a door that moved on A-201 but not on the schedule, a grid line that drifted between revisions.",
		bullets: [
			"Cross-discipline clash finding on 2D sheets, no model required.",
			"Revision-to-revision diff that explains the change, not just the pixels.",
			"Every finding links back to the exact spot on each sheet.",
		],
		status: "building",
		progress: 50,
	},
	{
		slug: "contract-reviewer",
		icon: FileSignature,
		name: "Contract Reviewer",
		replaces: "The first pass you pay a lawyer for",
		tagline: "Reads a subcontract and tells you where it bites.",
		detail:
			"Pay-when-paid, no-damages-for-delay, flow-down clauses, indemnity that runs one way. It reads the contract on your machine, marks the clauses that shift risk to you and shows how they compare to a standard form.",
		bullets: [
			"Clause-by-clause risk flags with the plain-English reason.",
			"Compare against AIA, ConsensusDocs or your own paper.",
			"Nothing uploaded, which matters when the contract is the thing under NDA.",
		],
		status: "building",
		progress: 35,
	},
	{
		slug: "scheduling",
		icon: CalendarRange,
		name: "Schedule",
		replaces: "Primavera P6 and MS Project",
		tagline: "CPM scheduling that a superintendent will actually open.",
		detail:
			"A Gantt with real critical-path logic, lookaheads, and a daily log that updates progress without a scheduler re-keying it. Reads and writes the file formats the GC already sends.",
		bullets: [
			"Critical path, float, constraints, calendars and baselines.",
			"Three-week lookahead as a first-class view, not an export.",
			"Imports XER and MPP, so the owner's schedule is a starting point, not a retype.",
		],
		status: "building",
		progress: 20,
	},
	{
		slug: "office",
		icon: FileText,
		name: "Office",
		replaces: "Word and Excel, for construction documents",
		tagline: "Documents and sheets that know what an RFI, a submittal and a change order are.",
		detail:
			"A writer and a spreadsheet with construction templates built in, so a change order carries its backup, a daily report carries its weather and crew, and a letter cites the clause it is relying on.",
		bullets: [
			"RFIs, submittals, change orders, daily reports, meeting minutes, notices.",
			"Opens and saves .docx and .xlsx, so nobody downstream has to install anything.",
			"The same local model drafts, summarises and checks, on the machine.",
		],
		status: "building",
		progress: 15,
	},
];

/* ── The film ───────────────────────────────────────────────────────────
   The Takeoff Beam launch film, 74 seconds at 1080p, rendered entirely from
   code and the real app (takeoff-desk/marketing). Served from the same R2
   `latest/` path as the installers, so a re-rendered film ships with the
   next release and never through this repo. The poster is the opening title
   card. */
export const FILM = {
	src: "https://pub-061018a047d54079b309fb16a26a1ce0.r2.dev/takeoff-desk/latest/Takeoff-Desk-launch.mp4",
	poster: "/images/open/launch-poster.jpg",
	title: "Takeoff Beam launch film",
	duration: "1:14",
};

/* ── Headline numbers ───────────────────────────────────────────────────
   Every one is measured, on Takeoff Beam, and appears in the film. Nothing
   here is a projection. */
export const STATS = [
	{ value: "21 ms", label: "to open an 859-page, 708 MB drawing set" },
	{ value: "47 MB", label: "the whole app, native Rust, no browser" },
	{ value: "0 bytes", label: "sent to a model vendor by default" },
	{ value: "$0", label: "now, and not just for now" },
];

/* ── Manifesto ──────────────────────────────────────────────────────────
   Four beliefs, in the order a contractor would object to them. Written as
   positions, not features: the reader is weighing whether to trust free
   software with sealed bids, and a feature list does not answer that. */
export interface Belief {
	numeral: string;
	statement: string;
	detail: string;
}

export const MANIFESTO: Belief[] = [
	{
		numeral: "01",
		statement: "Your drawings are yours.",
		detail:
			"They were yours before software existed, and a subscription should not change that. Every Open Construction app runs on your own machine. The files stay where you put them, the model reads them on your disk, and uninstalling us costs you nothing you made.",
	},
	{
		numeral: "02",
		statement: "Local is the default, not the upgrade.",
		detail:
			"The industry sells privacy as an enterprise tier. We think a two-person sub deserves the same guarantee as a public owner. So the apps work offline, need no account, and only reach a cloud model when you flip the switch yourself.",
	},
	{
		numeral: "03",
		statement: "Free has to be at least as good.",
		detail:
			"Free software that is worse is a tax on the people who cannot afford the real thing. Each app here has a named commercial incumbent, and it does not ship until it can stand in for that tool on a real job. The numbers in the film are the bar.",
	},
	{
		numeral: "04",
		statement: "Build it in the open.",
		detail:
			"Takeoff Beam is Apache 2.0 on GitHub, down to the film you are about to watch. Read it, fork it, file the bug. The apps that follow go the same way as they mature, because software a trade relies on should not be able to disappear.",
	},
];

/* ── The road ───────────────────────────────────────────────────────────
   Where the project is going, stated once: the whole construction office.
   The six apps on the page are the stations on that road, in the order
   they are being built. */
export const ROAD = {
	label: "Where this is going",
	headline: "The whole construction office, one app at a time.",
	detail:
		"Takeoff shipped first because an estimator opens a drawing before anyone else touches a job. The full agentic workspace came with it. The next four follow the paperwork downstream: check the set, read the contract, build the schedule, write the documents.",
};

/* ── FAQ ────────────────────────────────────────────────────────────────── */
/* Where the people using and building these apps talk. Discord for the
   threads and the build log, WhatsApp for the ones who live on their phone. */
export const COMMUNITY = [
	{
		key: "discord",
		name: "Discord",
		href: "https://discord.gg/3QuS2s933",
		detail: "Bug reports, feature requests, early builds and the build log, in threads you can search later.",
		cta: "Join the Discord",
	},
	{
		key: "whatsapp",
		name: "WhatsApp",
		href: "https://chat.whatsapp.com/Bn5I2SThexaBiLjnvnSHcU",
		detail: "Release notes and quick questions, on the phone you already carry on site.",
		cta: "Join the WhatsApp group",
	},
] as const;

export const OPEN_FAQ = [
	{
		question: "What is the Open Construction project?",
		answer:
			"A set of free desktop apps for the work a small or mid-sized contractor does every day: takeoff, drawing review, contracts, scheduling and documents. Each one runs entirely on your own computer and is built to replace the commercial tool it sits next to, not to be a lighter version of it.",
	},
	{
		question: "Why give this away?",
		answer:
			"Because the paid product is the shared project record for a team, and these apps are how one person meets the work before the team does. An estimator who has used Takeoff Beam for a month knows exactly what the platform adds. We would rather earn that than gate a PDF viewer.",
	},
	{
		question: "Does anything leave my machine?",
		answer:
			"Not unless you ask it to. The apps run offline, the local model runs on your disk, and your files stay where you put them. Signing in to construction.live to use cloud models is a deliberate switch, and the app says which model you are on.",
	},
	{
		question: "Is the code public?",
		answer:
			"Takeoff Beam is, under Apache 2.0, at github.com/constructionlive/takeoffbeam. The desktop workspace is not open source today. The apps still being built will be published as they reach a state worth reading.",
	},
	{
		question: "What does the progress percentage mean?",
		answer:
			"A rough share of the work done against the feature list on the card. It is not a date. When an app crosses the line where it can stand in for the commercial tool on a real job, it gets a download button.",
	},
	{
		question: "Can I use these with the full platform?",
		answer:
			"Yes. Takeoff Beam writes the same takeoff file the platform reads, and the desktop workspace is the platform running against a local model. Start on one laptop, and if the whole office needs the shared record, nothing has to be redone.",
	},
	{
		question: "Which machines?",
		answer:
			"Mac with Apple Silicon (M1 or newer, macOS 12+), and Windows 10 or 11 on x64 for Takeoff Beam. The construction.live desktop workspace is Apple Silicon today; a Windows build is in progress.",
	},
];
