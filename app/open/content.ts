import {
	Bot,
	Ruler,
	ScanSearch,
	FileSignature,
	CalendarRange,
	FileText,
	Lock,
	HardDrive,
	Github,
	Gauge,
	Wallet,
	Layers,
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
		name: "Takeoff Desk",
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
		],
		status: "available",
		platforms: ["mac", "windows"],
		note: "Apple Silicon (macOS 12+) and Windows 10/11 x64. Signed and notarized.",
		screenshot: {
			src: "/images/open/takeoff-desk.png",
			width: 1440,
			height: 900,
			alt: "Takeoff Desk with a drawing sheet open, a takeoff in progress and the markups list below",
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

/* ── Principles ───────────────────────────────────────────────────────────
   What every app on the page is held to. Written as commitments rather than
   features because they are the thing a buyer is actually weighing against
   the commercial tool: not "does it do takeoff" but "will my data leave, will
   it be worse, and what happens when you change your mind about free". */
export interface Principle {
	icon: LucideIcon;
	title: string;
	detail: string;
}

export const PRINCIPLES: Principle[] = [
	{
		icon: Lock,
		title: "100% local",
		detail:
			"The app, the files and the model run on your machine. No account to use it, no telemetry of your documents, nothing sent to a model vendor unless you flip to a cloud model yourself.",
	},
	{
		icon: Gauge,
		title: "On par with the commercial tool",
		detail:
			"Each app has a named incumbent and ships when it can stand in for it on a real job. Takeoff Desk opens a 708 MB set in 21 milliseconds; that is the bar, not a demo.",
	},
	{
		icon: HardDrive,
		title: "Plain files, native apps",
		detail:
			"Rust, not Electron, where it counts. Your takeoff is a JSON file next to the PDF, your documents are .docx and .xlsx. Uninstall us and you keep everything.",
	},
	{
		icon: Github,
		title: "Open where it can be",
		detail:
			"Takeoff Desk is Apache 2.0 on GitHub. Read it, build it, fork it. The apps that follow go the same way as they mature.",
	},
	{
		icon: Wallet,
		title: "Free, not free for now",
		detail:
			"It runs on your electricity, so there is nothing for us to meter. The paid product is the shared platform for a team, which these apps connect to if you want them to.",
	},
	{
		icon: Layers,
		title: "Windows and Mac",
		detail:
			"Every app targets both. Takeoff Desk ships for both today; the desktop workspace is Apple Silicon first with Windows underway.",
	},
];

/* ── FAQ ────────────────────────────────────────────────────────────────── */
export const OPEN_FAQ = [
	{
		question: "What is the Open Construction project?",
		answer:
			"A set of free desktop apps for the work a small or mid-sized contractor does every day: takeoff, drawing review, contracts, scheduling and documents. Each one runs entirely on your own computer and is built to replace the commercial tool it sits next to, not to be a lighter version of it.",
	},
	{
		question: "Why give this away?",
		answer:
			"Because the paid product is the shared project record for a team, and these apps are how one person meets the work before the team does. An estimator who has used Takeoff Desk for a month knows exactly what the platform adds. We would rather earn that than gate a PDF viewer.",
	},
	{
		question: "Does anything leave my machine?",
		answer:
			"Not unless you ask it to. The apps run offline, the local model runs on your disk, and your files stay where you put them. Signing in to construction.live to use cloud models is a deliberate switch, and the app says which model you are on.",
	},
	{
		question: "Is the code public?",
		answer:
			"Takeoff Desk is, under Apache 2.0, at github.com/constructionlive/takeoffbeam. The desktop workspace is not open source today. The apps still being built will be published as they reach a state worth reading.",
	},
	{
		question: "What does the progress percentage mean?",
		answer:
			"A rough share of the work done against the feature list on the card. It is not a date. When an app crosses the line where it can stand in for the commercial tool on a real job, it gets a download button.",
	},
	{
		question: "Can I use these with the full platform?",
		answer:
			"Yes. Takeoff Desk writes the same takeoff file the platform reads, and the desktop workspace is the platform running against a local model. Start on one laptop, and if the whole office needs the shared record, nothing has to be redone.",
	},
	{
		question: "Which machines?",
		answer:
			"Mac with Apple Silicon (M1 or newer, macOS 12+), and Windows 10 or 11 on x64 for Takeoff Desk. The construction.live desktop workspace is Apple Silicon today; a Windows build is in progress.",
	},
];
