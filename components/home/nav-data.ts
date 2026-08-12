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

/* Shared nav model for the mega menu and the footer, so both stay in sync.
   Individual solution pages don't exist yet, so everything points at
   /features for now. Swap `href` here when the detail pages land. */

export interface NavItem {
	label: string;
	href: string;
	icon: LucideIcon;
}

export interface NavGroup {
	label: string;
	items: NavItem[];
	footerLink?: NavItem;
}

const SOLUTIONS_HREF = "/features";

export const solutionGroups: NavGroup[] = [
	{
		label: "Capture & Field",
		items: [
			{ label: "Field App", href: SOLUTIONS_HREF, icon: Smartphone },
			{ label: "Daily Reporting", href: SOLUTIONS_HREF, icon: ClipboardList },
			{ label: "Meetings", href: SOLUTIONS_HREF, icon: Video },
			{ label: "Document Search", href: SOLUTIONS_HREF, icon: Search },
			{ label: "Email Management", href: SOLUTIONS_HREF, icon: Mail },
		],
	},
	{
		label: "Preconstruction & Bidding",
		items: [
			{ label: "Takeoff & Estimates", href: SOLUTIONS_HREF, icon: Ruler },
			{ label: "Bid Proposal", href: SOLUTIONS_HREF, icon: FileText },
			{ label: "Bid Leveling", href: SOLUTIONS_HREF, icon: Scale },
			{ label: "Subcontractor Management", href: SOLUTIONS_HREF, icon: Users },
			{ label: "Time & Material", href: SOLUTIONS_HREF, icon: Timer },
		],
	},
	{
		label: "Documents & Revisions",
		items: [
			{ label: "Drawing Manager", href: SOLUTIONS_HREF, icon: Layers },
			{ label: "Revision Tracking", href: SOLUTIONS_HREF, icon: GitBranch },
			{ label: "Submittal Tracking", href: SOLUTIONS_HREF, icon: FileCheck },
			{ label: "RFI Tracking", href: SOLUTIONS_HREF, icon: HelpCircle },
			{ label: "Report Generator", href: SOLUTIONS_HREF, icon: BarChart3 },
		],
	},
	{
		label: "Controls & Finance",
		items: [
			{ label: "Auto Scheduling", href: SOLUTIONS_HREF, icon: Calendar },
			{ label: "Issue Tracker", href: SOLUTIONS_HREF, icon: AlertTriangle },
			{ label: "Change Order", href: SOLUTIONS_HREF, icon: RefreshCw },
			{ label: "Delay & Claims", href: SOLUTIONS_HREF, icon: ShieldAlert },
			{ label: "Finance Diary", href: SOLUTIONS_HREF, icon: Wallet },
		],
	},
	{
		label: "Integrations",
		items: [
			{ label: "Procore", href: SOLUTIONS_HREF, icon: Plug },
			{ label: "Autodesk Construction Cloud", href: SOLUTIONS_HREF, icon: Plug },
			{ label: "Outlook & Gmail", href: SOLUTIONS_HREF, icon: Plug },
			{ label: "QuickBooks & Sage", href: SOLUTIONS_HREF, icon: Plug },
			{ label: "Bluebeam", href: SOLUTIONS_HREF, icon: Plug },
		],
		footerLink: { label: "All integrations", href: SOLUTIONS_HREF, icon: Plug },
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
