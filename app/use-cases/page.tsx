"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Navbar from "@components/Navbar";
import Footer from "@components/Footer";
import {
	FileSearch,
	Calculator,
	Settings2,
	GraduationCap,
	Bug,
	FileText,
	Table2,
	Code2,
	ArrowRight,
	Users,
	ArrowLeft,
} from "lucide-react";

/* ── Use case data ─────────────────────────────────────────────────── */

const useCases = [
	{
		number: "01",
		icon: FileSearch,
		badge: "Most used",
		title: "Document Analysis and Review",
		roles: ["Project managers", "Estimators", "Site engineers"],
		tagline: "Stop reading every page. Start knowing what matters.",
		description:
			"Construction document analysis is the review of project specifications, submittals, contracts, RFIs, and drawings to extract requirements, identify conflicts, and flag risks. Traditionally done manually, this process can take several hours per document package. AI-powered analysis completes the same review in minutes.",
		detail:
			"Every project runs on documents. Specs, submittals, RFIs, change orders, field reports, meeting minutes. The problem is the volume. A single specification package can run to 300 pages. Reviewing it properly before a bid takes time most teams do not have.",
		context:
			"Upload any document to construction.live and it reads with full construction context. It knows the difference between a structural section and a mechanical schedule. It knows that Division 03 covers concrete work and that an item flagged in an RFI response has implications for the change order log. It surfaces what matters so you do not have to read every page yourself.",
		before: "4 to 6 hours reviewing a spec package manually. Key exclusions missed. Conflicts found after the bid is awarded.",
		after: "Upload the spec, get a full review in minutes. Every requirement, conflict, and ambiguity already flagged before you start bidding.",
		capabilities: [
			"Spec review",
			"Submittal analysis",
			"Contract parsing",
			"RFI drafting",
			"Issue flagging",
			"Cross-file reference",
		],
		example:
			"Review this submittal package and flag anything that does not match the spec, especially waterproofing requirements in Division 07.",
	},
	{
		number: "02",
		icon: Calculator,
		badge: "",
		title: "Engineering Calculations",
		roles: ["Site engineers", "Estimators", "Project managers"],
		tagline: "Get the right number with a method you can check.",
		description:
			"Engineering calculations in construction cover quantity takeoffs, material sizing, unit conversions, structural load analysis, and formula generation for cost estimating and procurement. These calculations are required at every stage of a project and need to be traceable and accurate enough to present to clients and engineers.",
		detail:
			"Over 50% of construction.live sessions involve formulas or data calculations. From concrete volume with waste factors to rebar density to pipe quantities from floor plans, the AI runs the numbers and shows its full working. You get an Excel-ready formula, the unit logic, and the assumptions, all written out clearly.",
		context:
			"You do not need to know the formula going in. You need the right answer with a method your team can verify. That is what construction.live delivers, fast enough to use in the middle of an estimate.",
		before: "Manually building takeoff spreadsheets. Errors from wrong unit conversions. Calculations that take 30 minutes and cannot be easily checked.",
		after: "Ask a question, get a traceable calculation with the full formula ready to paste into Excel. Done in under two minutes.",
		capabilities: [
			"Quantity takeoffs",
			"Material calculations",
			"Excel formula generation",
			"Unit conversions",
			"Load calculations",
			"Waste factor analysis",
		],
		example:
			"Calculate concrete volume for this foundation drawing with a 10% waste factor and give me a cost breakdown at $185 per cubic meter supply and place.",
	},
	{
		number: "03",
		icon: Settings2,
		badge: "",
		title: "Project Optimization",
		roles: ["Project managers", "GCs", "Owners"],
		tagline: "Compare your options and pick the one that actually saves money.",
		description:
			"Project optimization in construction is the structured comparison of methods, materials, or approaches to identify the option that delivers the best outcome across cost, schedule, and risk. It moves decisions away from gut feel and toward evidence-based recommendations with clear trade-offs spelled out.",
		detail:
			"Every project has decision points where one choice leads to a different cost or schedule outcome. Framing systems. Mechanical approaches. Procurement strategies. Most teams make these calls based on experience and available time. construction.live gives you a structured comparison on demand.",
		context:
			"Describe the options you are considering. Upload any supporting documents. Ask construction.live to rank them by cost, schedule impact, and risk. You get a clear recommendation with the reasoning laid out, ready to take to the team or the client.",
		before: "Decisions made on experience alone. No time to formally compare alternatives. Cost saving opportunities missed at the design stage.",
		after: "Upload three options, get a ranked comparison by cost, schedule, and risk with clear reasoning. Decision-ready in minutes.",
		capabilities: [
			"Cost saving analysis",
			"Alternative comparisons",
			"ROI analysis",
			"Risk ranking",
			"Value engineering",
		],
		example:
			"Compare these three framing approaches and rank them by cost, schedule, and risk. Flag any constructability issues.",
	},
	{
		number: "04",
		icon: GraduationCap,
		badge: "",
		title: "Code and Standards Lookup",
		roles: ["Site engineers", "Project managers", "GCs"],
		tagline: "Get the code answer in seconds. Not after lunch.",
		description:
			"Building code and standards lookup is the process of finding and interpreting relevant requirements from building codes, fire codes, energy standards, and industry regulations for a specific project type, occupancy, and jurisdiction. This process is required at every stage of design and construction to confirm compliance and avoid costly rework.",
		detail:
			"Code questions come up constantly on site and in the office. Fire separation requirements. Occupancy classifications. ASHRAE energy compliance. CSA material standards. OBC structural requirements. The answers are buried in reference manuals that take time to navigate and are updated regularly.",
		context:
			"Ask construction.live a code question and it pulls the right requirement for your jurisdiction, occupancy type, and project context. More than 30% of sessions involve technical document analysis including code lookups. It is one of the most consistent time-savers on the platform.",
		before: "Digging through reference manuals for 20 minutes. Calling a colleague to double-check. Uncertainty about which edition of the code applies.",
		after: "Ask the question and get the relevant code section with the requirement stated clearly. Right jurisdiction, right occupancy, right answer.",
		capabilities: [
			"Building codes",
			"ASHRAE standards",
			"CSA requirements",
			"OBC compliance",
			"Fire code lookup",
			"Permit requirements",
		],
		example:
			"What are the fire separation requirements for this occupancy type under the Ontario Building Code? We have a Group A2 assembly space adjacent to Group B.",
	},
	{
		number: "05",
		icon: Bug,
		badge: "",
		title: "Troubleshooting and Diagnostics",
		roles: ["Site engineers", "Project managers", "GCs"],
		tagline: "Find out what went wrong and what to do about it. Fast.",
		description:
			"Construction troubleshooting and diagnostics is the process of identifying the root cause of a field issue, material failure, or system problem and developing a remediation plan. Getting this right quickly reduces downtime, avoids rework costs, and prevents small problems from becoming claim events.",
		detail:
			"Something goes wrong on site. Concrete showing early-age cracking. A mechanical system not performing to spec. A waterproofing failure showing up during inspection. The normal process is to stop work, call a specialist, wait for a site visit, and wait again for a report.",
		context:
			"Upload the field report, the photos, the spec section, or the system logs. Ask construction.live what went wrong, why it happened, and what the remediation plan should be. You get a structured diagnosis with root cause and next steps, without waiting for a specialist callback.",
		before: "Stop work. Call a specialist. Wait 24 to 48 hours for a response. Crew standing by. Cost clock running.",
		after: "Upload the evidence, get a diagnosis with root cause and remediation steps in minutes. Specialist call becomes a confirmation, not a starting point.",
		capabilities: [
			"Root cause analysis",
			"Remediation planning",
			"Field report review",
			"Photo analysis",
			"System diagnostics",
		],
		example:
			"Why is this concrete showing early-age cracking? Here is the mix design, the pour log, and photos from this morning. What is the remediation plan?",
	},
	{
		number: "06",
		icon: FileText,
		badge: "",
		title: "Report and Proposal Generation",
		roles: ["Project managers", "GCs", "Owners"],
		tagline: "Turn site notes into a client-ready report in minutes.",
		description:
			"Construction report and proposal generation is the process of converting raw project data including inspection notes, meeting summaries, field observations, and progress updates into structured, professional documents suitable for owner reporting, project records, and business development.",
		detail:
			"Writing reports takes time that most project teams do not budget for. Inspection notes sit in a notebook. Meeting summaries stay informal. Progress updates get sent as bullet points in an email. The information exists but the polished deliverable does not.",
		context:
			"Feed construction.live your raw notes, site data, or meeting recordings and tell it what format you need. Progress report for the owner. Deficiency report after an inspection. Proposal for a new scope. RFI response for the consultant. The output is structured, professional, and ready to send.",
		before: "45 minutes writing up a progress report from field notes. Formatting takes longer than the writing. Reports go out late or not at all.",
		after: "Paste in your notes, specify the format, get a polished report ready to review and send. Done before you leave the site office.",
		capabilities: [
			"Progress reports",
			"Inspection reports",
			"RFI responses",
			"Proposals",
			"Meeting summaries",
			"Client presentations",
		],
		example:
			"Turn these inspection notes into a formal deficiency report for the owner. Include a summary, a numbered deficiency list with locations, and a recommended action for each item.",
	},
	{
		number: "07",
		icon: Table2,
		badge: "",
		title: "Data Processing and Spreadsheets",
		roles: ["Estimators", "Project managers", "GCs"],
		tagline: "Build the spreadsheet you need without being an Excel expert.",
		description:
			"Construction data processing involves building and maintaining project tracking models, cost breakdowns, schedule analysis tools, bid comparison templates, and other structured data workflows. These are typically created in Excel and require significant time and formula knowledge to build correctly from scratch.",
		detail:
			"Construction runs on spreadsheets. Cost trackers. Bid comparison matrices. Schedule analysis models. Change order logs. The problem is that building a good spreadsheet from scratch takes time, and most people on a project team are not Excel specialists.",
		context:
			"Tell construction.live what you need and it builds the structure, writes the formulas, and sets up the logic. Upload an existing spreadsheet and ask it to add a summary tab, fix a formula that breaks on multi-phase projects, or add a scoring system across six criteria. You get a working model without spending an afternoon on it.",
		before: "Two hours building a bid comparison template. Formulas that break. No time to build the summary dashboard you actually want.",
		after: "Describe what you need. Get a working spreadsheet with formulas, scoring logic, and a summary dashboard. Ready in minutes.",
		capabilities: [
			"Bid comparison models",
			"Cost trackers",
			"Schedule analysis",
			"Change order logs",
			"Scoring templates",
			"Dashboard builds",
		],
		example:
			"Build me a bid comparison spreadsheet that scores four bids across six criteria including price, schedule, exclusions, experience, bonding, and local content. Include a weighted scoring summary tab.",
	},
	{
		number: "08",
		icon: Code2,
		badge: "",
		title: "VBA and Code Analysis",
		roles: ["Estimators", "Project managers", "GCs"],
		tagline: "Fix your broken macro. Build a new one. No coding required.",
		description:
			"VBA and code analysis in construction involves reviewing, debugging, and improving Excel macros, automation scripts, and custom templates used for project management tasks such as change order processing, cost reporting, and schedule tracking. It also covers building new automation tools from scratch without requiring coding knowledge.",
		detail:
			"A lot of construction teams run on custom Excel macros built by someone who has since left the company. The macro works until it does not. It breaks on multi-phase projects, or throws an error when the data format changes slightly, or just produces wrong numbers that nobody notices until the report goes to the client.",
		context:
			"Upload the macro. Tell construction.live what it is supposed to do and what it is actually doing. It reads the code, finds the issue, fixes it, and explains what was wrong. You can also build new macros from scratch, automate change order processing, generate report outputs, and add summary dashboards without writing a single line of code yourself.",
		before: "A broken macro nobody knows how to fix. Manual workarounds that eat an hour every week. Automation that stopped working six months ago.",
		after: "Upload the broken macro, get it fixed with a clear explanation of what changed. Or build a new one from a plain-language description.",
		capabilities: [
			"VBA debugging",
			"Macro analysis",
			"New macro builds",
			"Change order automation",
			"Report generation scripts",
			"Dashboard automation",
		],
		example:
			"Here is my cost tracking macro. It breaks on multi-phase projects and the totals are wrong after phase 2. Fix it and add a summary dashboard output by phase and cost category.",
	},
];

const colorMap: Record<string, { bg: string; border: string; text: string; tagBg: string }> = {
	blue: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-600 dark:text-blue-400", tagBg: "bg-blue-500/10" },
	emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-600 dark:text-emerald-400", tagBg: "bg-emerald-500/10" },
	amber: { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-600 dark:text-amber-400", tagBg: "bg-amber-500/10" },
	violet: { bg: "bg-violet-500/10", border: "border-violet-500/20", text: "text-violet-600 dark:text-violet-400", tagBg: "bg-violet-500/10" },
	red: { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-600 dark:text-red-400", tagBg: "bg-red-500/10" },
	cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/20", text: "text-cyan-600 dark:text-cyan-400", tagBg: "bg-cyan-500/10" },
	pink: { bg: "bg-pink-500/10", border: "border-pink-500/20", text: "text-pink-600 dark:text-pink-400", tagBg: "bg-pink-500/10" },
	orange: { bg: "bg-orange-500/10", border: "border-orange-500/20", text: "text-orange-600 dark:text-orange-400", tagBg: "bg-orange-500/10" },
};

const colors = ["blue", "emerald", "amber", "violet", "red", "cyan", "pink", "orange"];

/* ── Use case card ─────────────────────────────────────────────────── */

function UseCaseCard({
	uc,
	index,
	onClick,
}: {
	uc: (typeof useCases)[0];
	index: number;
	onClick: () => void;
}) {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-50px" });
	const color = colorMap[colors[index % colors.length]];

	return (
		<motion.div
			ref={ref}
			className={`group relative rounded-2xl border ${color.border} bg-do-bg-card/80 backdrop-blur-sm p-8 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg`}
			initial={{ opacity: 0, y: 30 }}
			animate={inView ? { opacity: 1, y: 0 } : {}}
			transition={{ delay: index * 0.05, duration: 0.5 }}
			onClick={onClick}
		>
			<div className="flex items-start gap-5">
				<div
					className={`h-12 w-12 rounded-xl ${color.bg} border ${color.border} flex items-center justify-center shrink-0`}
				>
					<uc.icon className={`h-6 w-6 ${color.text}`} />
				</div>

				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-1">
						<span className="text-xs font-mono font-bold text-do-orange">
							{uc.number}
						</span>
						{uc.badge && (
							<span className="text-[10px] font-mono text-do-orange bg-do-orange/10 px-2 py-0.5 rounded-full">
								{uc.badge}
							</span>
						)}
					</div>

					<h3 className="text-lg font-semibold text-do-text mb-2">{uc.title}</h3>

					<p className="text-[14px] text-do-text-secondary leading-relaxed line-clamp-2 mb-4">
						{uc.description}
					</p>

					<div className="flex flex-wrap gap-2">
						{uc.roles.map((role) => (
							<span
								key={role}
								className="text-[11px] text-do-text-muted bg-do-bg-light border border-do-border px-2 py-1 rounded-md"
							>
								{role}
							</span>
						))}
					</div>

					<div className="mt-4 flex items-center gap-1 text-sm text-do-orange opacity-0 group-hover:opacity-100 transition-opacity">
						<span>View details</span>
						<ArrowRight className="h-4 w-4" />
					</div>
				</div>
			</div>
		</motion.div>
	);
}

/* ── Use case detail modal ────────────────────────────────────────── */

function UseCaseDetail({
	uc,
	color,
	onClose,
	onPrev,
	onNext,
	hasPrev,
	hasNext,
}: {
	uc: (typeof useCases)[0];
	color: (typeof colorMap)[string];
	onClose: () => void;
	onPrev: () => void;
	onNext: () => void;
	hasPrev: boolean;
	hasNext: boolean;
}) {
	return (
		<motion.div
			className="fixed inset-0 z-50 bg-do-bg/95 backdrop-blur-xl overflow-y-auto"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
		>
			<div className="min-h-screen max-w-4xl mx-auto px-6 py-24">
				{/* Close button */}
				<button
					onClick={onClose}
					className="fixed top-6 right-6 p-3 rounded-xl bg-do-bg-card border border-do-border hover:border-do-border-accent transition-colors"
				>
					<ArrowLeft className="h-5 w-5 text-do-text" />
				</button>

				<div className="space-y-10">
					{/* Header */}
					<div>
						<div className="flex items-center gap-3 mb-4">
							<span className="text-xs font-mono font-bold text-do-orange">
								{uc.number}
							</span>
							<span
								className={`text-[10px] font-mono px-2.5 py-1 rounded-full ${color.bg} ${color.text} border ${color.border}`}
							>
								{uc.badge || "Use case"}
							</span>
						</div>

						<h1 className="text-3xl md:text-4xl font-bold text-do-text mb-4">
							{uc.title}
						</h1>

						<p className="text-xl text-do-orange font-medium mb-6">
							{uc.tagline}
						</p>

						{/* Roles */}
						<div className="flex items-center gap-2 mb-8">
							<Users className="h-4 w-4 text-do-text-muted" />
							<div className="flex flex-wrap gap-2">
								{uc.roles.map((role) => (
									<span
										key={role}
										className="text-sm text-do-text-secondary bg-do-bg-card border border-do-border px-3 py-1 rounded-full"
									>
										{role}
									</span>
								))}
							</div>
						</div>
					</div>

					{/* Main content */}
					<div className="grid lg:grid-cols-5 gap-10">
						<div className="lg:col-span-3 space-y-8">
							<div>
								<p className="text-base text-do-text-secondary leading-relaxed">
									{uc.description}
								</p>
							</div>

							<div>
								<p className="text-base text-do-text leading-relaxed">
									{uc.detail}
								</p>
							</div>

							<div>
								<p className="text-base text-do-text leading-relaxed">
									{uc.context}
								</p>
							</div>

							{/* Before/After */}
							<div className="grid sm:grid-cols-2 gap-4">
								<div className="rounded-xl border border-do-border bg-do-bg-card p-5">
									<p className="text-[10px] font-mono text-do-text-muted uppercase tracking-wider mb-3">
										Before
									</p>
									<p className="text-sm text-do-text-secondary leading-relaxed">
										{uc.before}
									</p>
								</div>
								<div className="rounded-xl border border-do-orange/20 bg-do-orange/5 p-5">
									<p className="text-[10px] font-mono text-do-orange uppercase tracking-wider mb-3">
										After
									</p>
									<p className="text-sm text-do-text leading-relaxed">
										{uc.after}
									</p>
								</div>
							</div>
						</div>

						<div className="lg:col-span-2 space-y-6">
							{/* Example prompt */}
							<div className="rounded-xl bg-do-bg-card border border-do-border p-6">
								<div className="flex items-center gap-2 mb-4">
									<div className="h-2 w-2 rounded-full bg-do-orange animate-glow-pulse" />
									<span className="text-[10px] font-mono text-do-text-muted uppercase tracking-wider">
										Example prompt
									</span>
								</div>
								<p className="text-sm text-do-text/80 italic leading-relaxed">
									&quot;{uc.example}&quot;
								</p>
							</div>

							{/* Capabilities */}
							<div className="rounded-xl bg-do-bg-card border border-do-border p-6">
								<p className="text-[10px] font-mono text-do-text-muted uppercase tracking-wider mb-4">
									Capabilities
								</p>
								<div className="space-y-3">
									{uc.capabilities.map((cap) => (
										<div key={cap} className="flex items-center gap-3">
											<div
												className={`h-6 w-6 rounded-md ${color.bg} border ${color.border} flex items-center justify-center`}
											>
												<uc.icon
													className={`h-3.5 w-3.5 ${color.text}`}
												/>
											</div>
											<span className="text-sm text-do-text">{cap}</span>
										</div>
									))}
								</div>
							</div>
						</div>
					</div>

					{/* Navigation */}
					<div className="flex items-center justify-between pt-8 border-t border-do-border">
						<button
							onClick={onPrev}
							disabled={!hasPrev}
							className="flex items-center gap-2 px-4 py-2 text-sm text-do-text-secondary hover:text-do-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
						>
							<ArrowLeft className="h-4 w-4" />
							Previous
						</button>
						<button
							onClick={onNext}
							disabled={!hasNext}
							className="flex items-center gap-2 px-4 py-2 text-sm text-do-text-secondary hover:text-do-text disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
						>
							Next
							<ArrowRight className="h-4 w-4" />
						</button>
					</div>
				</div>
			</div>
		</motion.div>
	);
}

/* ── CTA section ───────────────────────────────────────────────────── */

function UseCasesCTA() {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-80px" });

	return (
		<section className="relative py-24 overflow-hidden" ref={ref}>
			<div className="absolute inset-0 do-blueprint-grid pointer-events-none" />
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-do-orange/[0.04] rounded-full blur-[150px]" />

			<div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6 }}
				>
					<h2 className="text-3xl md:text-4xl font-bold text-do-text mb-5">
						Pick a use case and try it on your next project.
					</h2>
					<p className="text-lg text-do-text-secondary mb-8">
						No setup. No onboarding. Just upload a document and ask a question.
					</p>

					<a
						href="https://app.construction.live"
						className="group inline-flex items-center gap-2 px-8 py-4 text-base font-medium text-white bg-do-orange hover:bg-do-orange-dark rounded-xl transition-all shadow-[0_0_40px_rgba(249,115,22,0.3)] hover:shadow-[0_0_60px_rgba(249,115,22,0.5)]"
					>
						Get Started Free
						<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
					</a>
				</motion.div>
			</div>
		</section>
	);
}

/* ── Page ──────────────────────────────────────────────────────────── */

export default function UseCasesPage() {
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

	const selectedUseCase = selectedIndex !== null ? useCases[selectedIndex] : null;
	const selectedColor = selectedIndex !== null ? colorMap[colors[selectedIndex % colors.length]] : colorMap.blue;

	return (
		<main className="min-h-screen bg-do-bg">
			<Navbar />

			{/* Hero */}
			<section className="relative pt-40 pb-20 overflow-hidden">
				<div className="absolute inset-0 do-blueprint-grid pointer-events-none" />
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-do-orange/[0.04] rounded-full blur-[150px]" />

				<div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<span className="do-section-label text-do-orange">Use Cases</span>
						<h1 className="text-4xl md:text-6xl font-bold text-do-text mt-4 mb-6">
							8 ways construction teams use AI to get more done.
						</h1>
						<p className="text-lg md:text-xl text-do-text-secondary max-w-2xl mx-auto leading-relaxed">
							From reviewing a 300-page spec to building a bid comparison spreadsheet
							in minutes, here is how project managers, estimators, and site
							engineers use construction.live every day.
						</p>
					</motion.div>

					{/* Stats */}
					<motion.div
						className="flex flex-wrap justify-center gap-8 mt-12"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.5 }}
					>
						<div className="text-center">
							<p className="text-3xl font-bold text-do-orange">8</p>
							<p className="text-sm text-do-text-muted">core use cases</p>
						</div>
						<div className="text-center">
							<p className="text-3xl font-bold text-do-orange">58%</p>
							<p className="text-sm text-do-text-muted">include document uploads</p>
						</div>
						<div className="text-center">
							<p className="text-3xl font-bold text-do-orange">50%+</p>
							<p className="text-sm text-do-text-muted">involve formulas and data</p>
						</div>
						<div className="text-center">
							<p className="text-3xl font-bold text-do-orange">30%+</p>
							<p className="text-sm text-do-text-muted">technical document analysis</p>
						</div>
					</motion.div>
				</div>
			</section>

			{/* Role filter */}
			<section className="relative py-8 overflow-hidden border-y border-do-border bg-do-bg-card/50">
				<div className="max-w-6xl mx-auto px-6">
					<div className="flex flex-wrap items-center justify-center gap-3">
						<span className="text-xs font-mono text-do-text-muted uppercase tracking-wider">
							Used by
						</span>
						<div className="flex flex-wrap justify-center gap-2">
							<span className="px-3 py-1.5 text-xs bg-do-orange/10 text-do-orange border border-do-orange/20 rounded-full">
								All roles
							</span>
							<span className="px-3 py-1.5 text-xs text-do-text-secondary bg-do-bg border border-do-border rounded-full">
								Project managers
							</span>
							<span className="px-3 py-1.5 text-xs text-do-text-secondary bg-do-bg border border-do-border rounded-full">
								Estimators
							</span>
							<span className="px-3 py-1.5 text-xs text-do-text-secondary bg-do-bg border border-do-border rounded-full">
								Site engineers
							</span>
							<span className="px-3 py-1.5 text-xs text-do-text-secondary bg-do-bg border border-do-border rounded-full">
								GCs
							</span>
							<span className="px-3 py-1.5 text-xs text-do-text-secondary bg-do-bg border border-do-border rounded-full">
								Owners
							</span>
						</div>
					</div>
				</div>
			</section>

			{/* Use case cards */}
			<section className="relative py-16 overflow-hidden">
				<div className="absolute inset-0 do-blueprint-grid pointer-events-none" />

				<div className="relative z-10 max-w-6xl mx-auto px-6">
					<div className="grid md:grid-cols-2 gap-6">
						{useCases.map((uc, i) => (
							<UseCaseCard
								key={uc.number}
								uc={uc}
								index={i}
								onClick={() => setSelectedIndex(i)}
							/>
						))}
					</div>
				</div>
			</section>

			<UseCasesCTA />
			<Footer />

			{/* Detail modal */}
			{selectedUseCase && (
				<UseCaseDetail
					uc={selectedUseCase}
					color={selectedColor}
					onClose={() => setSelectedIndex(null)}
					onPrev={() => setSelectedIndex(selectedIndex !== null ? Math.max(0, selectedIndex - 1) : 0)}
					onNext={() => setSelectedIndex(selectedIndex !== null ? Math.min(useCases.length - 1, selectedIndex + 1) : 0)}
					hasPrev={selectedIndex !== null && selectedIndex > 0}
					hasNext={selectedIndex !== null && selectedIndex < useCases.length - 1}
				/>
			)}
		</main>
	);
}
