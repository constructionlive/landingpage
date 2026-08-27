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
	Server,
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

/* Deployment, not a fifth capability, which is why it hangs off the bottom of
   the Solutions menu instead of taking a column beside the four pillars: it is
   everything above, run inside your own perimeter. Public owners, defence and
   anyone under a residency clause come looking for exactly this, so it stays
   one click from every page — as a solution we offer, not as a box we sell.
   The section on /solutions makes the argument and links on to /hardware. */
export const privateCloud: NavItem & { blurb: string } = {
	label: "Private Cloud",
	slug: "private-cloud",
	href: at("private-cloud"),
	icon: Server,
	blurb: "The whole platform on hardware in your building. Air-gapped for government.",
};

export const resourceLinks = [
	{ label: "Blog", href: "/blog" },
	{ label: "Newsletter", href: "/newsletter" },
	{ label: "FAQs", href: "/faqs" },
];

export const companyLinks = [
	{ label: "About Us", href: "/about" },
	{ label: "Security", href: "/security" },
	{ label: "Contact Us", href: "/contact" },
];

/* No pricing page yet, pricing conversations happen on the demo call. */
export const pricingHref = "/pricing";
/* The on-premise box. Reached through Private Cloud rather than from the top
   bar: we sell software, and a Hardware tab beside Pricing reads like we sell
   machines. The page still carries the specs, the tiers and the air-gapped
   configuration for whoever arrives looking for them by name. */
export const hardwareHref = "/hardware";
/* Security posture and claim statuses. Also listed in companyLinks so
   the nav and footer pick it up; this constant is for the pages that link to it
   directly. */
export const securityHref = "/security";
/* A form, not a mailto: a message we can answer, file and reply to from one
   place, rather than one that dies in whichever client the browser opens. */
export const contactHref = "/contact";
/* The subscribe page. Listed in resourceLinks so the nav and footer pick it up;
   this constant is for the pages and components that link to it directly.

   It gets its own page rather than only a footer box because the link is meant
   to be pasted into a LinkedIn message, where it has to stand on its own and
   explain what someone is signing up for. */
export const newsletterHref = "/newsletter";
export const demoHref = "/book";
