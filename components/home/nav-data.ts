import {
	Smartphone,
	ClipboardList,
	Video,
	Search,
	Mail,
	Ruler,
	FileText,
	Scale,
	Users,
	Timer,
	Layers,
	GitBranch,
	FileCheck,
	HelpCircle,
	BarChart3,
	Calendar,
	AlertTriangle,
	RefreshCw,
	ShieldAlert,
	Wallet,
	Plug,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* Shared nav model for the mega menu, the footer and the /solutions page.
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
	items: NavItem[];
	footerLink?: NavItem;
}

export const solutionsHref = "/solutions";

const at = (slug: string) => `${solutionsHref}#${slug}`;

export const solutionGroups: NavGroup[] = [
	{
		label: "Capture & Field",
		slug: "capture-field",
		items: [
			{ label: "Field App", slug: "field-app", href: at("field-app"), icon: Smartphone },
			{
				label: "Daily Reporting",
				slug: "daily-reporting",
				href: at("daily-reporting"),
				icon: ClipboardList,
			},
			{ label: "Meetings", slug: "meetings", href: at("meetings"), icon: Video },
			{
				label: "Document Search",
				slug: "document-search",
				href: at("document-search"),
				icon: Search,
			},
			{
				label: "Email Management",
				slug: "email-management",
				href: at("email-management"),
				icon: Mail,
			},
		],
	},
	{
		label: "Preconstruction & Bidding",
		slug: "preconstruction-bidding",
		items: [
			{
				label: "Takeoff & Estimates",
				slug: "takeoff-estimates",
				href: at("takeoff-estimates"),
				icon: Ruler,
			},
			{
				label: "Bid Proposal",
				slug: "bid-proposal",
				href: at("bid-proposal"),
				icon: FileText,
			},
			{ label: "Bid Leveling", slug: "bid-leveling", href: at("bid-leveling"), icon: Scale },
			{
				label: "Subcontractor Management",
				slug: "subcontractor-management",
				href: at("subcontractor-management"),
				icon: Users,
			},
			{
				label: "Time & Material",
				slug: "time-and-material",
				href: at("time-and-material"),
				icon: Timer,
			},
		],
	},
	{
		label: "Documents & Revisions",
		slug: "documents-revisions",
		items: [
			{
				label: "Drawing Manager",
				slug: "drawing-manager",
				href: at("drawing-manager"),
				icon: Layers,
			},
			{
				label: "Revision Tracking",
				slug: "revision-tracking",
				href: at("revision-tracking"),
				icon: GitBranch,
			},
			{
				label: "Submittal Tracking",
				slug: "submittal-tracking",
				href: at("submittal-tracking"),
				icon: FileCheck,
			},
			{ label: "RFI Tracking", slug: "rfi-tracking", href: at("rfi-tracking"), icon: HelpCircle },
			{
				label: "Report Generator",
				slug: "report-generator",
				href: at("report-generator"),
				icon: BarChart3,
			},
		],
	},
	{
		label: "Controls & Finance",
		slug: "controls-finance",
		items: [
			{
				label: "Auto Scheduling",
				slug: "auto-scheduling",
				href: at("auto-scheduling"),
				icon: Calendar,
			},
			{
				label: "Issue Tracker",
				slug: "issue-tracker",
				href: at("issue-tracker"),
				icon: AlertTriangle,
			},
			{ label: "Change Order", slug: "change-order", href: at("change-order"), icon: RefreshCw },
			{
				label: "Delay & Claims",
				slug: "delay-claims",
				href: at("delay-claims"),
				icon: ShieldAlert,
			},
			{ label: "Finance Diary", slug: "finance-diary", href: at("finance-diary"), icon: Wallet },
		],
	},
	{
		label: "Integrations",
		slug: "integrations",
		items: [
			{ label: "Procore", slug: "procore", href: at("procore"), icon: Plug },
			{
				label: "Autodesk Construction Cloud",
				slug: "autodesk-construction-cloud",
				href: at("autodesk-construction-cloud"),
				icon: Plug,
			},
			{ label: "Outlook & Gmail", slug: "outlook-gmail", href: at("outlook-gmail"), icon: Plug },
			{
				label: "QuickBooks & Sage",
				slug: "quickbooks-sage",
				href: at("quickbooks-sage"),
				icon: Plug,
			},
			{ label: "Bluebeam", slug: "bluebeam", href: at("bluebeam"), icon: Plug },
		],
		footerLink: {
			label: "All integrations",
			slug: "integrations",
			href: at("integrations"),
			icon: Plug,
		},
	},
];

export const resourceLinks = [
	{ label: "Blog", href: "/blog" },
	{ label: "FAQs", href: "/faqs" },
];

export const companyLinks = [
	{ label: "About Us", href: "/about" },
	{ label: "Contact Us", href: "mailto:rahul@construction.live" },
];

/* No pricing page yet, pricing conversations happen on the demo call. */
export const pricingHref = "/pricing";
export const contactHref = "mailto:rahul@construction.live";
export const demoHref = "/book";
