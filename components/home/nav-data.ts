import {
	Mic,
	Video,
	ClipboardList,
	CalendarClock,
	Mail,
	RefreshCw,
	Plug,
	HardDrive,
	Ruler,
	GitBranch,
	FileCheck,
	FileStack,
	BarChart3,
	Search,
	ArrowLeftRight,
	Waypoints,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* Shared nav model for the mega menu, the footer and the /solutions page.

   The four groups are the product argument, in order: we capture what happens
   in the field (01), we read everything that arrives from the owner, the GC
   and the systems you already run (02), we generate and track what you send
   back out (03) — and because all three run on one record, everything links
   to whatever caused it (04). The fourth group only exists because the first
   three do, so it always reads last.

   The list is deliberately short. Capabilities that don't earn their own line
   are explained inside the section that carries them on /solutions, rather
   than becoming a nav item nobody clicks.

   Every solution is a section on /solutions, so `slug` is the single source
   of truth: it's the anchor id on that page and the hash in every link here.
   When a solution earns its own page, swap that item's `href` and leave the
   slug alone so the section keeps working. */

export interface NavItem {
	label: string;
	slug: string;
	href: string;
	icon: LucideIcon;
}

export interface NavGroup {
	label: string;
	slug: string;
	/* Shown on /solutions as the pillar number, 01 through 04. */
	number: string;
	items: NavItem[];
	footerLink?: NavItem;
}

export const solutionsHref = "/solutions";

const at = (slug: string) => `${solutionsHref}#${slug}`;

export const solutionGroups: NavGroup[] = [
	{
		label: "Capture in the field",
		slug: "capture",
		number: "01",
		items: [
			{ label: "Voice Notes", slug: "voice-notes", href: at("voice-notes"), icon: Mic },
			{
				label: "Meeting Recording",
				slug: "meeting-recording",
				href: at("meeting-recording"),
				icon: Video,
			},
			{
				label: "Daily Reporting",
				slug: "daily-reporting",
				href: at("daily-reporting"),
				icon: ClipboardList,
			},
			{
				label: "Live Schedule in Hand",
				slug: "live-schedule",
				href: at("live-schedule"),
				icon: CalendarClock,
			},
		],
	},
	{
		label: "Everything that arrives",
		slug: "inbound",
		number: "02",
		items: [
			{ label: "Email Tracking", slug: "email-tracking", href: at("email-tracking"), icon: Mail },
			{
				label: "Auto-Updates",
				slug: "auto-updates",
				href: at("auto-updates"),
				icon: RefreshCw,
			},
			{ label: "Procore", slug: "procore", href: at("procore"), icon: Plug },
			{
				label: "Drive & SharePoint",
				slug: "cloud-storage",
				href: at("cloud-storage"),
				icon: HardDrive,
			},
		],
	},
	{
		label: "What goes back out",
		slug: "outbound",
		number: "03",
		items: [
			{
				label: "Takeoff & Estimates",
				slug: "takeoff-estimates",
				href: at("takeoff-estimates"),
				icon: Ruler,
			},
			{
				label: "Submittal Tracking",
				slug: "submittal-tracking",
				href: at("submittal-tracking"),
				icon: FileCheck,
			},
			{
				label: "Change Orders",
				slug: "change-order",
				href: at("change-order"),
				icon: FileStack,
			},
			{
				label: "Report Generator",
				slug: "report-generator",
				href: at("report-generator"),
				icon: BarChart3,
			},
		],
	},
	{
		label: "One linked record",
		slug: "linked-record",
		number: "04",
		items: [
			{
				label: "Revision Chain",
				slug: "revision-chain",
				href: at("revision-chain"),
				icon: GitBranch,
			},
			{
				label: "Daily Log to Change Order",
				slug: "log-to-change-order",
				href: at("log-to-change-order"),
				icon: ArrowLeftRight,
			},
			{
				label: "Search Across Everything",
				slug: "search-everything",
				href: at("search-everything"),
				icon: Search,
			},
		],
		footerLink: {
			label: "How it all connects",
			slug: "linked-record",
			href: at("linked-record"),
			icon: Waypoints,
		},
	},
];

export const resourceLinks = [
	{ label: "Blog", href: "/blog" },
	{ label: "FAQs", href: "/faqs" },
];

export const companyLinks = [
	{ label: "About Us", href: "/about" },
	{ label: "Contact Us", href: "/contact" },
];

/* No pricing page yet, pricing conversations happen on the demo call. */
export const pricingHref = "/pricing";
/* The on-premise box. Sits next to Pricing in the nav rather than inside
   Solutions: it isn't another capability, it's the same platform bought a
   different way, and the people who need it arrive looking for it by name. */
export const hardwareHref = "/hardware";
/* A form, not a mailto: a message we can answer, file and reply to from one
   place, rather than one that dies in whichever client the browser opens. */
export const contactHref = "/contact";
export const demoHref = "/book";
