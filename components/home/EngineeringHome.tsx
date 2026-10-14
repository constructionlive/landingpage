"use client";

/* The homepage: construction.live as an AI engineering team for construction
   tech companies and enterprise contractors.

   A plain, readable page on purpose. The scroll-driven deck (DeckHome) told a
   story to contractors; this page has to let a technical buyer scan what we
   build, so it reads top to bottom with no scroll hijacking. The one moving
   piece is the hero's wireframe stack, a single calm scene from
   lib/deck/scenes.js, loaded on the client after mount and paused off screen.

   Order: hero, who we build for, the five engineering disciplines (harness,
   memory, cost, human in the loop, tooling), the team, past deployments, and
   the call to action. */

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import BookingLink from "@/components/BookingLink";
import { contactHref, openHref } from "@/components/home/nav-data";

const disciplines = [
	{ id: "harness", n: "01", short: "Harness" },
	{ id: "memory", n: "02", short: "Memory" },
	{ id: "cost", n: "03", short: "Cost" },
	{ id: "control", n: "04", short: "Human in the loop" },
	{ id: "tooling", n: "05", short: "Tooling" },
];

const audiences = [
	{
		label: "Construction tech companies",
		title: "You are putting AI into your product.",
		body: "We engineer the parts that decide whether it works in production: agents that finish long tasks, memory that respects permissions, and unit costs that leave you a margin.",
	},
	{
		label: "Enterprise contractors",
		title: "You want AI systems of your own.",
		body: "We build them with your team, on your data, inside your security and approval structure, and hand over a system you own and can extend.",
	},
];

const deployments = [
	"Multilingual voice and chat for daily updates on a major international airport. The AI read the crew's messages, called whoever had the gaps, and wrote the daily report.",
	"Daily updates tied to schedule and change orders. Flagged a welding method that differed from the contract, worth more than $100k.",
	"Lessons learned initiative automated for a major GC. From 20% reporting to fully compliant.",
	"A GC on a previously abandoned project got workers up to speed within one month.",
	"Proposal writing reduced from 3 days to 6 hours.",
	"Drawing takeoff. Estimators now spend their time verifying the AI-marked drawings.",
	"A multi-billion dollar hospital, two or three drawing revisions a day, and a $100k-a-day delay risk. Scope change detection went from days to a few hours.",
	"Technical report writer for an energy consultant. Reports drafted with 70% less writing time.",
];

/* The wireframe stack of disciplines, in a framed panel beside the hero copy. */
function HeroStack() {
	const boxRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const labelsRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const box = boxRef.current,
			canvas = canvasRef.current,
			labels = labelsRef.current;
		if (!box || !canvas || !labels) return;
		let cancelled = false;
		let deck: { resize: () => void; play: () => void; pause: () => void; destroy: () => void } | null =
			null;
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const resizer = new ResizeObserver(() => deck && deck.resize());
		const visible = new IntersectionObserver((entries) => {
			if (!deck) return;
			if (entries.some((e) => e.isIntersecting)) deck.play();
			else deck.pause();
		});

		Promise.all([import("three"), import("@/lib/deck/scenes.js")])
			.then(([THREE, mod]) => {
				if (cancelled) return;
				const d = mod.createDeck(THREE, {
					canvas,
					labels,
					reduceMotion: reduce,
					maxPixelRatio: 1.5,
				});
				d.start("team");
				d.play();
				deck = d;
				resizer.observe(box);
				visible.observe(box);
			})
			.catch(() => {
				/* No WebGL: the panel stays an empty frame and the copy carries the hero. */
			});

		return () => {
			cancelled = true;
			resizer.disconnect();
			visible.disconnect();
			if (deck) deck.destroy();
		};
	}, []);

	return (
		<div
			ref={boxRef}
			className="hero-stack relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-do-border bg-[#0a0e1a]"
		>
			{/* The scene frames its stack right of centre to leave room for the
			    labels; the stage is widened to the left so the stack and its labels
			    sit inside the panel. */}
			<div className="absolute inset-y-0 -left-[34%] right-0">
				<canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
				<div ref={labelsRef} className="deck-labels" aria-hidden="true" />
			</div>
		</div>
	);
}

/* One engineering discipline: number and heading on the left, detail on the right. */
function Discipline({
	id,
	n,
	label,
	title,
	intro,
	points,
	children,
}: {
	id: string;
	n: string;
	label: string;
	title: string;
	intro: string;
	points: string[];
	children?: React.ReactNode;
}) {
	return (
		<section id={id} className="scroll-mt-24 border-t border-do-border py-20 md:py-24">
			<div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-12 lg:gap-16">
				<div className="lg:col-span-5">
					<p className="do-section-label text-do-orange">
						{n} · {label}
					</p>
					<h2 className="mt-4 text-3xl font-semibold leading-[1.1] tracking-tight text-do-text md:text-4xl text-balance">
						{title}
					</h2>
					<p className="mt-5 text-lg leading-relaxed text-do-text-secondary">{intro}</p>
				</div>
				<div className="lg:col-span-7">
					<ul className="space-y-4">
						{points.map((p) => (
							<li key={p} className="flex gap-3 text-[17px] leading-relaxed text-do-text">
								<span className="mt-[11px] h-px w-4 shrink-0 bg-do-orange" aria-hidden="true" />
								<span>{p}</span>
							</li>
						))}
					</ul>
					{children && <div className="mt-10">{children}</div>}
				</div>
			</div>
		</section>
	);
}

/* A small labelled panel for each discipline's diagram. */
function Panel({ caption, children }: { caption: string; children: React.ReactNode }) {
	return (
		<figure className="m-0 rounded-2xl border border-do-border bg-do-bg-card p-5 md:p-6">
			{children}
			<figcaption className="do-section-label mt-5 text-do-text-muted">{caption}</figcaption>
		</figure>
	);
}

function Step({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
	return (
		<div
			className={`rounded-lg border px-3 py-2.5 text-center text-sm font-medium ${
				accent ? "border-do-orange/60 text-do-orange" : "border-do-border-accent text-do-text"
			}`}
		>
			{children}
		</div>
	);
}

export default function EngineeringHome() {
	return (
		<div className="bg-do-bg">
			{/* Hero */}
			<section className="relative overflow-hidden pb-20 pt-32 md:pb-24 md:pt-40">
				<div className="absolute inset-0 do-blueprint-grid pointer-events-none" />
				<div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
					<div>
						<p className="do-section-label text-do-orange">AI engineering for construction</p>
						<h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-do-text md:text-5xl lg:text-6xl text-balance">
							We engineer the AI systems construction runs on.
						</h1>
						<p className="mt-6 text-lg leading-relaxed text-do-text-secondary md:text-xl">
							construction.live is a specialist AI engineering team for construction tech
							companies and enterprise contractors. We build the harness, memory, cost and
							control layers that let AI do long, high-stakes work: drawing takeoffs,
							estimates, contract review and field operations.
						</p>
						<div className="mt-8 flex flex-wrap gap-3">
							<BookingLink
								location="home_hero"
								className="inline-flex items-center gap-2 rounded-lg bg-do-orange px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-do-orange-dark"
							>
								Talk to our engineers
								<ArrowRight className="h-4 w-4" />
							</BookingLink>
							<a
								href="#harness"
								className="inline-flex items-center gap-2 rounded-lg border border-do-border-accent px-5 py-3 text-sm font-medium text-do-text transition-colors hover:bg-do-bg-light"
							>
								How we build
							</a>
						</div>
						<nav aria-label="What we build" className="mt-10 flex flex-wrap gap-2">
							{disciplines.map((d) => (
								<a
									key={d.id}
									href={`#${d.id}`}
									className="rounded-full border border-do-border px-3 py-1.5 font-mono text-xs text-do-text-secondary transition-colors hover:border-do-orange hover:text-do-orange"
								>
									{d.n} {d.short}
								</a>
							))}
						</nav>
					</div>
					<HeroStack />
				</div>
			</section>

			{/* Who we build for */}
			<section className="border-t border-do-border py-20 md:py-24">
				<div className="mx-auto max-w-6xl px-6">
					<p className="do-section-label text-do-orange">Who we build for</p>
					<div className="mt-8 grid gap-5 md:grid-cols-2">
						{audiences.map((a) => (
							<div key={a.label} className="rounded-2xl border border-do-border bg-do-bg-card p-7 md:p-9">
								<p className="do-section-label">{a.label}</p>
								<h2 className="mt-3 text-2xl font-semibold tracking-tight text-do-text">{a.title}</h2>
								<p className="mt-3 text-[17px] leading-relaxed text-do-text-secondary">{a.body}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<Discipline
				id="harness"
				n="01"
				label="Harness engineering"
				title="A controlled harness for long-horizon work."
				intro="A takeoff across a full drawing set, an estimate or a contract review is hundreds of steps, not one prompt. We build harnesses that keep the model on a defined path, so long jobs finish correctly and can be trusted."
				points={[
					"Built for long-horizon tasks: drawing takeoffs, estimates, contract and specification review.",
					"Full control of the run: defined steps, permitted tools, and validation at every stage.",
					"Checkpoints and recovery, so hours of work survive a failure instead of starting over.",
					"Embedded end to end: the office directs field operations, and the field reports straight back into the office systems.",
				]}
			>
				<Panel caption="Every step runs inside the harness">
					<div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
						<Step>Plan</Step>
						<Step>Act</Step>
						<Step accent>Verify</Step>
						<Step>Checkpoint</Step>
					</div>
					<div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
						<Step>Office</Step>
						<span className="font-mono text-do-text-muted" aria-label="both ways">
							⇄
						</span>
						<Step>Field</Step>
					</div>
				</Panel>
			</Discipline>

			<Discipline
				id="memory"
				n="02"
				label="Memory layers"
				title="Context that holds across people, projects and the organisation."
				intro="AI is only as good as what it remembers, and who it is allowed to remember it for. We design memory in three layers and engineer how information moves between them at the infrastructure level."
				points={[
					"Information moves up only when someone promotes it, and down only to people cleared to see it.",
					"A private working note never surfaces in another team's estimate. A company-wide rate change reaches every live project.",
					"Permissions are enforced in the data layer, not in the prompt. Get this wrong and the system either leaks data or starves the AI of context.",
				]}
			>
				<Panel caption="Three layers, one permission model">
					<div className="space-y-2">
						{[
							["Organisation", "Standards, rates, lessons learned, past projects. Governed centrally."],
							["Project", "Drawings, RFIs, change orders, logs and decisions. Shared with the project team."],
							["Personal", "Working notes, drafts and preferences. Private by default."],
						].map(([name, desc]) => (
							<div
								key={name}
								className="grid gap-1 rounded-lg border border-do-border-accent px-4 py-3 sm:grid-cols-[140px_1fr] sm:gap-4"
							>
								<span className="font-medium text-do-orange">{name}</span>
								<span className="text-sm leading-relaxed text-do-text-secondary">{desc}</span>
							</div>
						))}
					</div>
				</Panel>
			</Discipline>

			<Discipline
				id="cost"
				n="03"
				label="Cost engineering"
				title="The right model for each step, at a cost that scales."
				intro="Model prices differ by orders of magnitude. For an enterprise team, or a product with thousands of users, that difference decides whether AI pays for itself. We measure cost per task and engineer it down."
				points={[
					"Routing: each step goes to the smallest model that does it reliably. Frontier models only where they earn it.",
					"Smaller specialised models, trained on construction work, for high-volume steps like sheet classification and extraction.",
					"Caching and batching for repeat work across drawing sets and revisions.",
					"Cost per takeoff, per estimate and per review tracked, so you can price your product or budget your rollout with confidence.",
				]}
			>
				<Panel caption="Example routing for a takeoff and estimate">
					<table className="w-full text-left text-sm">
						<thead>
							<tr className="text-do-text-muted">
								<th className="pb-2 font-mono text-xs font-medium uppercase tracking-wider">Step</th>
								<th className="pb-2 font-mono text-xs font-medium uppercase tracking-wider">Model</th>
							</tr>
						</thead>
						<tbody className="text-do-text">
							{[
								["Sheet classification", "Small, fine-tuned"],
								["Quantity extraction", "Small to mid, specialised"],
								["Estimate assembly", "Mid-tier"],
								["Scope and contract risk reasoning", "Frontier"],
							].map(([step, model]) => (
								<tr key={step} className="border-t border-do-border">
									<td className="py-2.5 pr-4">{step}</td>
									<td className="py-2.5 text-do-text-secondary">{model}</td>
								</tr>
							))}
						</tbody>
					</table>
				</Panel>
			</Discipline>

			<Discipline
				id="control"
				n="04"
				label="Human in the loop"
				title="AI does the work. People keep the authority."
				intro="In construction, who signs off matters as much as what was done. Every task the AI completes is verified, and that verification follows your chain of authority."
				points={[
					"Role-based access: each person sees and approves only what their role allows.",
					"Layered review: an estimator checks the takeoff, a PM approves the estimate, a director signs off the contract position.",
					"Clean handovers: work passes from one person to the next with its full context and history attached.",
					"A complete record of every AI action and every human decision, so the hierarchy of decision-making always holds.",
				]}
			>
				<Panel caption="Each level verifies before work moves on, and can send it back">
					<div className="grid gap-2 sm:grid-cols-4">
						<Step>AI drafts</Step>
						<Step>Estimator verifies</Step>
						<Step>PM approves</Step>
						<Step accent>Director signs off</Step>
					</div>
				</Panel>
			</Discipline>

			<Discipline
				id="tooling"
				n="05"
				label="Tooling"
				title="Workspaces where AI and people work side by side."
				intro="AI should not sit in a chat box next to the real work. We put it inside the tools, running in parallel with your people on the same drawing, the same document and the same record."
				points={[
					"Takeoff Beam: our takeoff tool. The AI marks up the drawings and estimators verify them.",
					"Our own collaborative document editor, built on Tiptap, where AI and people draft proposals, reports and contract reviews together.",
					"A field app where crews report by voice, photo or message, straight into the office record.",
					"Connected to the platforms you already run, so the work stays where your teams are.",
				]}
			>
				<Link
					href={openHref}
					className="inline-flex items-center gap-2 text-sm font-medium text-do-orange hover:underline"
				>
					Try Takeoff Beam
					<ArrowRight className="h-4 w-4" />
				</Link>
			</Discipline>

			{/* Team */}
			<section className="border-t border-do-border py-20 md:py-24">
				<div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-12 lg:gap-16">
					<div className="lg:col-span-5">
						<p className="do-section-label text-do-orange">Who we are</p>
						<h2 className="mt-4 text-3xl font-semibold leading-[1.1] tracking-tight text-do-text md:text-4xl">
							Rahul Vaishnav.
						</h2>
					</div>
					<p className="text-lg leading-relaxed text-do-text-secondary lg:col-span-7">
						Ten years lived on mining and construction sites. Deep AI expertise that works as
						your in-house tech team. Behind us, a team across intelligence, cyber security,
						engineering and claims.
					</p>
				</div>
			</section>

			{/* Deployments */}
			<section className="border-t border-do-border py-20 md:py-24">
				<div className="mx-auto max-w-6xl px-6">
					<p className="do-section-label text-do-orange">Deployments</p>
					<h2 className="mt-4 text-3xl font-semibold tracking-tight text-do-text md:text-4xl">
						Where this already runs.
					</h2>
					<div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						{deployments.map((d) => (
							<p
								key={d}
								className="rounded-2xl border border-do-border bg-do-bg-card p-5 text-[15px] leading-relaxed text-do-text-secondary"
							>
								{d}
							</p>
						))}
					</div>
				</div>
			</section>

			{/* Call to action */}
			<section id="book-a-demo" className="border-t border-do-border py-24 md:py-32">
				<div className="mx-auto max-w-3xl px-6 text-center">
					<h2 className="text-3xl font-semibold leading-[1.1] tracking-tight text-do-text md:text-5xl text-balance">
						Building AI for construction? Bring us the hardest task on your list.
					</h2>
					<p className="mt-6 text-lg leading-relaxed text-do-text-secondary">
						A working session with our engineers. Bring one workflow, a takeoff, an estimate or
						a contract review, and we will walk through how we would build its harness, memory,
						cost model and controls.
					</p>
					<div className="mt-9 flex flex-wrap justify-center gap-3">
						<BookingLink
							location="home_engineering_cta"
							className="inline-flex items-center gap-2 rounded-lg bg-do-orange px-6 py-3.5 text-base font-medium text-white transition-colors hover:bg-do-orange-dark"
						>
							<Calendar className="h-4 w-4" />
							Book a session
						</BookingLink>
						<Link
							href={contactHref}
							className="inline-flex items-center gap-2 rounded-lg border border-do-border-accent px-6 py-3.5 text-base font-medium text-do-text transition-colors hover:bg-do-bg-light"
						>
							Send us a message
						</Link>
					</div>
				</div>
			</section>
		</div>
	);
}
