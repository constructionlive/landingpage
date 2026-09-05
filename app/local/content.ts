import {
	WifiOff,
	Lock,
	Wallet,
	MessagesSquare,
	FileSearch,
	Mic,
	Ruler,
	FolderTree,
	BookOpen,
	Blocks,
	Laptop,
	Users,
	Server,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* Content model for /local — the free desktop app.

   The page argues the same thing /hardware argues (your project data never
   reaches a model vendor) at the bottom rung of the ladder: one person, one
   laptop, free. THE_LADDER below is what keeps the two pages from competing
   for the same reader.

   Capabilities listed here are the ones visible in the app itself. Anything
   we cannot see in the product does not get claimed on this page. */

/* ── Platforms ───────────────────────────────────────────────────────────
   Apple Silicon only today. Windows is shown as a stated "coming soon" rather
   than a button, so nobody clicks something that cannot deliver — and rather
   than omitting it, because a PC-heavy office needs to know it is coming. */
export const PLATFORM = {
	requirement: "Apple Silicon · macOS 12 or newer",
	note: "M1 or newer. No Intel, Windows or Linux build yet.",
};

/* ── Headline numbers ─────────────────────────────────────────────────────
   Deliberately not a speed claim. We have not benchmarked the desktop build
   on a range of laptops, and a number we cannot stand behind on a customer's
   five-year-old ThinkPad is worse than no number. */
export const STATS = [
	{ value: "Free", label: "No seat, no trial, no card" },
	{ value: "0", label: "Bytes sent to a model vendor" },
	{ value: "Offline", label: "Works with the site Wi-Fi down" },
	{ value: "Apple\u00a0Silicon", label: "macOS 12 or newer, M1 and up" },
];

/* ── What is in it ────────────────────────────────────────────────────────
   Every item here is visible in the app: the sidebar, the composer and the
   model picker. */
export interface Capability {
	icon: LucideIcon;
	title: string;
	detail: string;
}

export const CAPABILITIES: Capability[] = [
	{
		icon: MessagesSquare,
		title: "Ask it about the job",
		detail:
			"A chat that answers from your project rather than from the internet. Runs against the model on your own disk, so the question and the answer both stay on the machine.",
	},
	{
		icon: FileSearch,
		title: "Hand it your documents",
		detail:
			"Attach drawings, contracts, specs and correspondence and have the agent read them. The files are parsed locally — nothing is uploaded to be understood.",
	},
	{
		icon: Ruler,
		title: "An estimation bench",
		detail:
			"A dedicated workspace for estimating work rather than a general chat window with a drawing pasted into it. Estimates live as their own records.",
	},
	{
		icon: Mic,
		title: "Talk instead of typing",
		detail:
			"Voice input on the composer, for the notes nobody is going to sit and type up after a day on site.",
	},
	{
		icon: FolderTree,
		title: "Drive and chat history",
		detail:
			"Your files and every previous run in one place, so a question you asked last month is still there when the same problem comes back.",
	},
	{
		icon: BookOpen,
		title: "A project wiki",
		detail:
			"What the work taught you, kept as knowledge you can search — not scattered across chats that reset every time you close them.",
	},
	{
		icon: Blocks,
		title: "Apps",
		detail:
			"The same extensibility the platform has: focused tools for the workflows that make your company different.",
	},
];

/* ── Why local ────────────────────────────────────────────────────────────── */
export const WHY_LOCAL: Capability[] = [
	{
		icon: Lock,
		title: "Nothing leaves the laptop",
		detail:
			"Sealed bids, claims headed for litigation, drawings under an NDA. The model reads them on your disk, because there is no model vendor in the path to send them to.",
	},
	{
		icon: WifiOff,
		title: "It works where the signal does not",
		detail:
			"A basement, a lift shaft, a rural site, a plane. The weights are already on the machine, so losing connectivity costs you nothing.",
	},
	{
		icon: Wallet,
		title: "No meter running",
		detail:
			"No tokens, no per-seat licence, no usage tier to think about before asking a second question. Use it as hard as the machine will take.",
	},
];

/* ── The ladder ───────────────────────────────────────────────────────────
   Three rungs of the same argument. This is the section that stops /local and
   /hardware selling against each other: they are the same product with the
   weights in a different room, and the reader picks the room. */
export interface Rung {
	icon: LucideIcon;
	name: string;
	scope: string;
	headline: string;
	detail: string;
	cta: { label: string; href: string } | null;
	current?: boolean;
}

export const THE_LADDER: Rung[] = [
	{
		icon: Laptop,
		name: "Desktop",
		scope: "One person, one machine",
		headline: "Free, on your laptop.",
		detail:
			"A local model on your own disk. Best for an estimator or a PM who wants the work done privately, and for anyone who wants to see whether this is real before involving IT.",
		cta: null,
		current: true,
	},
	{
		icon: Users,
		name: "Platform",
		scope: "The team, the shared record",
		headline: "One record the whole job writes to.",
		detail:
			"The field app, email, drawings and approvals feeding one connected project record — the part a single laptop cannot do, because the record has to be shared to be worth anything.",
		cta: { label: "See the platform", href: "/solutions" },
	},
	{
		icon: Server,
		name: "Hardware",
		scope: "The whole office, in your building",
		headline: "The big models, on your own floor.",
		detail:
			"Everything above running on a box in your building on far larger weights than a laptop holds, air-gapped if the work demands it. For public owners, defence and anyone under a residency clause.",
		cta: { label: "See the hardware", href: "/hardware" },
	},
];

/* ── Installing it ───────────────────────────────────────────────────────
   Three steps and one warning. The warning matters more than the steps: the
   .dmg is only the shell, and someone who launches it on site LTE and watches
   a multi-gigabyte model crawl in will decide the app is broken. */
export const INSTALL_STEPS = [
	{
		title: "Open the .dmg",
		detail:
			"It is signed and notarized by Neuratwin Inc., the company behind construction.live, so macOS opens it normally. No Gatekeeper warning to click past.",
	},
	{
		title: "Drag it to Applications",
		detail: "The usual drag across. Then eject the disk image.",
	},
	{
		title: "Launch it on a good connection",
		detail:
			"First launch downloads the AI model itself — several gigabytes. Do that once on office Wi-Fi rather than on site, and everything after it runs locally.",
	},
];

/* ── FAQ ────────────────────────────────────────────────────────────────── */
export const LOCAL_FAQ = [
	{
		question: "Is it actually free, or free for now?",
		answer:
			"Free. There is no seat, no trial clock and no card. It runs on your machine using your electricity, so there is nothing for us to meter — which is also why we can leave it free rather than promising to.",
	},
	{
		question: "Does anything at all leave my computer?",
		answer:
			"The model runs on your disk, so your prompts, your drawings and the answers are not sent to a model vendor. If you choose to point it at a cloud model instead, that is a deliberate switch in the model picker and it tells you which one you are on.",
	},
	{
		question: "Which model does it use?",
		answer:
			"It ships with Qwen3.8-4B quantised to Q4_K_M — small enough for a normal laptop, and the same family as the Qwen3.8-27B our hardware runs. You can point it at other local models, so a better open release is a file you download, not a contract change.",
	},
	{
		question: "What kind of machine do I need?",
		answer:
			"A Mac with Apple Silicon — M1 or newer — running macOS 12 or later. The model is a quantised 4B, chosen to run on the laptop an estimator already has rather than on a workstation.",
	},
	{
		question: "How is this different from the full platform?",
		answer:
			"Scope, not quality. The desktop app is one person on one machine. The platform is the shared project record that the field app, your email and your approvals all write into — which by definition cannot live on a single laptop.",
	},
	{
		question: "How do updates work?",
		answer:
			"They install themselves. The app updates in place, so the version you download today is the last one you have to think about.",
	},
	{
		question: "Do I need the hardware box as well?",
		answer:
			"Only if you want the whole office on private AI rather than one person. The box is this same argument at office scale, with much larger models and an air-gapped option. Most companies start here and never need one.",
	},
	{
		question: "Is there a Windows version?",
		answer:
			"Not yet. Today the app is Apple Silicon only — M1 or newer, macOS 12 and up. There is no Intel Mac, Windows or Linux build. If your office is on PCs, tell us and we will let you know when there is something to install.",
	},
	{
		question: "Will macOS complain when I open it?",
		answer:
			"No. The app is signed and notarized by Neuratwin Inc., the company behind construction.live, so it opens the normal way. No right-click-to-open, no Gatekeeper override.",
	},
	{
		question: "Why is the download so large, and why does it download more on first launch?",
		answer:
			"The installer is around 600 MB because it carries the whole workspace, not a web wrapper. The first time you open it, it fetches the AI model itself — several more gigabytes. Do that once on a decent connection and everything after it runs locally.",
	},
];
