"use client";

/* The homepage story, scroll-driven. A wireframe jobsite stays pinned behind
   the page while the copy scrolls over it; each step that scrolls into view
   switches the scene or advances its phase, so the visitor drives the pitch
   deck with the scroll wheel.

   Scenes live in lib/deck/scenes.js (plain JS, ported from the deck). three.js
   and that module are loaded only on the client, after mount, so the server
   render is just the copy. */

import { useEffect, useRef, useState } from "react";
import BrandMark from "@components/BrandMark";
import { ChevronDown } from "lucide-react";

type Step = {
	phase: number;
	title: string;
	sub?: string;
	hero?: boolean;
	video?: { src: string; caption: string };
};
type Chapter = { scene: string; label: string; steps: Step[] };

const chapters: Chapter[] = [
	{
		scene: "handshake",
		label: "construction.live",
		steps: [
			{
				phase: 0,
				hero: true,
				title: "construction.live",
				sub: "Your in-house expertise in AI and construction.",
			},
		],
	},
	{
		scene: "team",
		label: "Who we are",
		steps: [
			{
				phase: 0,
				title: "Rahul Vaishnav.",
				sub: "Ten years lived on mining and construction sites. Deep AI expertise that works as your in-house tech team.Behind us, a team across intelligence, cyber security, engineering and claims.",
			},
		],
	},
	{
		scene: "hook",
		label: "Why we built it",
		steps: [
			{
				phase: 0,
				title: "We experienced the pain first hand.",
				sub: "We were spending 70% of our time managing paper.",
			},
			{
				phase: 1,
				title: "We experienced the pain first hand.",
				sub: "A $2 million change order on a $20 million project. Three years of daily logs, emails and change orders to fight it. Then the superintendent who knew it all left, and took the knowledge with him.",
			},
			{
				phase: 2,
				title: "This is why we built construction.live.",
				sub: "To free up people stuck in paperwork.",
			},
			{
				phase: 3,
				title: "This is why we built construction.live.",
				sub: "To create a strong foundation for the business, not one that rests on a few key people.",
			},
			{
				phase: 4,
				title: "This is why we built construction.live.",
				sub: "To help grow the business profitably, and replicate what works.",
			},
			{
				phase: 5,
				title: "This is why we built construction.live.",
				sub: "To create an institutionalised knowledge base that applies across projects.",
			},
		],
	},
	{
		scene: "own",
		label: "The platform",
		steps: [
			{
				phase: 0,
				title: "One central approach that works everywhere.",
				sub: "Field. Your crews talk, the system writes.",
				video: { src: "/video/fieldapp.mp4", caption: "Field app, web and mobile" },
			},
			{
				phase: 1,
				title: "One central approach that works everywhere.",
				sub: "Meetings. Every huddle becomes decisions and tasks.",
				video: { src: "/video/meetings.mp4", caption: "Meeting platform" },
			},
			{
				phase: 2,
				title: "One central approach that works everywhere.",
				sub: "Drawings. The plans read themselves.",
				video: { src: "/video/takeoff.mp4", caption: "Drawing intelligence, takeoff" },
			},
			{
				phase: 3,
				title: "One central approach that works everywhere.",
				sub: "Connected and shared. Everything linked, everything searchable.",
			},
			{
				phase: 4,
				title: "We own the full software and AI stack, and customise it to your business.",
			},
		],
	},
	{
		scene: "train",
		label: "Training",
		steps: [
			{ phase: 0, title: "Training is a key part of our deployment strategy." },
			{
				phase: 1,
				title: "Training is a key part of our deployment strategy.",
				sub: "Using your past project data to build the foundation for AI knowledge.",
			},
			{
				phase: 2,
				title: "Training is a key part of our deployment strategy.",
				sub: "Understanding your business and choosing the right tools that make sense.",
			},
			{
				phase: 3,
				title: "Training is a key part of our deployment strategy.",
				sub: "Mapping workflows end to end, so multiple processes connect into one seamless action.",
			},
			{
				phase: 4,
				title: "Training is a key part of our deployment strategy.",
				sub: "Human judgement as the key driver of every decision.",
			},
			{
				phase: 5,
				title: "Training is a key part of our deployment strategy.",
				sub: "Human judgement as the key driver of every decision.",
			},
			{
				phase: 6,
				title: "Training is a key part of our deployment strategy.",
				sub: "We build the tools. You drive.",
			},
		],
	},
	{
		scene: "cases",
		label: "Deployments",
		steps: [
			{
				phase: 0,
				title: "Major past deployments.",
				sub: "Multilingual voice and chat for daily updates on a major international airport. The AI read the crew's messages, called whoever had the gaps, and wrote the daily report.",
			},
			{
				phase: 1,
				title: "Major past deployments.",
				sub: "Daily updates tied to schedule and change orders. Flagged a welding method that differed from the contract, worth more than $100k.",
			},
			{
				phase: 2,
				title: "Major past deployments.",
				sub: "Lessons learned initiative automated for a major GC. From 20% reporting to fully compliant.",
			},
			{
				phase: 3,
				title: "Major past deployments.",
				sub: "A GC on a previously abandoned project got workers up to speed within one month.",
			},
			{
				phase: 4,
				title: "Major past deployments.",
				sub: "Proposal writing reduced from 3 days to 6 hours.",
			},
			{
				phase: 5,
				title: "Major past deployments.",
				sub: "Drawing takeoff. Estimators now spend their time verifying the AI-marked drawings.",
			},
			{
				phase: 6,
				title: "Major past deployments.",
				sub: "A multi-billion dollar hospital, two or three drawing revisions a day, and a $100k-a-day delay risk. Scope change detection went from days to a few hours.",
			},
			{
				phase: 7,
				title: "Major past deployments.",
				sub: "Technical report writer for an energy consultant. Reports drafted with 70% less writing time.",
			},
		],
	},
];

type Deck = {
	current: () => string | null;
	start: (kind: string) => void;
	setPhase: (i: number) => void;
	resize: () => void;
	play: () => void;
	pause: () => void;
	destroy: () => void;
};

export default function DeckHome() {
	const rootRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const labelsRef = useRef<HTMLDivElement>(null);
	const deckRef = useRef<Deck | null>(null);
	const [ready, setReady] = useState(false);

	/* Load three.js and the scenes after mount, then drive them from scroll. */
	useEffect(() => {
		const root = rootRef.current,
			canvas = canvasRef.current,
			labels = labelsRef.current;
		if (!root || !canvas || !labels) return;
		let cancelled = false;
		let deck: Deck | null = null;
		const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const small = window.innerWidth < 720;

		const sections = () =>
			Array.from(root.querySelectorAll<HTMLElement>(".deck-step[data-scene]"));

		/* The active step is the last section whose top has passed the middle
		   of the viewport. A scroll handler rather than an IntersectionObserver
		   so a long jump (a link, a dragged scrollbar) still lands on the right
		   step instead of whichever entries happened to fire. */
		let last: HTMLElement | null = null;
		let ticking = false;
		let poll = 0;
		let switchTimer = 0;
		/* Active state is written straight to the DOM: the step gets
		   `is-active` (its copy brightens, the others dim) and the matching
		   recording panel, if any, gets `is-on`. */
		const apply = (el: HTMLElement) => {
			const scene = el.getAttribute("data-scene") || "";
			const phase = Number(el.getAttribute("data-phase") || 0);
			root.querySelectorAll<HTMLElement>(".deck-copy").forEach((c) => {
				c.classList.toggle(
					"is-active",
					c.dataset.scene === scene && Number(c.dataset.phase) === phase,
				);
			});
			root.querySelectorAll<HTMLElement>(".deck-panel").forEach((p) => {
				const on = p.dataset.scene === scene && Number(p.dataset.phase) === phase;
				p.classList.toggle("is-on", on);
				const v = p.querySelector("video");
				if (v && !on && !v.paused) v.pause();
			});
			if (!deck) return;
			if (deck.current() === scene) {
				deck.setPhase(phase);
				return;
			}
			if (deck.current() === null) {
				/* First scene: nothing to fade from. */
				deck.start(scene);
				deck.setPhase(phase);
				return;
			}
			/* A new chapter: dip the canvas to black, swap the scene behind it,
			   and bring it back. The copy crossfades on its own. */
			canvas.classList.add("is-switching");
			window.clearTimeout(switchTimer);
			switchTimer = window.setTimeout(() => {
				if (!deck) return;
				deck.start(scene);
				deck.setPhase(phase);
				canvas.classList.remove("is-switching");
			}, 220);
		};
		const onScroll = () => {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(() => {
				ticking = false;
				const mid = window.innerHeight * 0.5;
				let best: HTMLElement | null = null;
				for (const el of sections()) {
					if (el.getBoundingClientRect().top <= mid) best = el;
					else break;
				}
				if (!best) best = sections()[0] || null;
				if (best && best !== last) {
					last = best;
					apply(best);
				}
			});
		};

		/* Only render while the story is on screen. */
		const rootObserver = new IntersectionObserver(
			(entries) => {
				const on = entries.some((e) => e.isIntersecting);
				if (!deck) return;
				if (on) deck.play();
				else deck.pause();
			},
			{ threshold: 0 },
		);

		Promise.all([import("three"), import("@/lib/deck/scenes.js")])
			.then(([THREE, mod]) => {
				if (cancelled) return;
				deck = mod.createDeck(THREE, {
					canvas,
					labels,
					reduceMotion: reduce,
					maxPixelRatio: small ? 1 : 1.5,
				}) as Deck;
				deckRef.current = deck;
				deck.play();
				setReady(true);
				last = null;
				onScroll();
				window.addEventListener("scroll", onScroll, { passive: true });
				/* Belt and braces: some embedders and programmatic jumps deliver no
				   scroll event, so the position is also sampled on a short timer.
				   The handler is cheap and bails when nothing changed. */
				poll = window.setInterval(onScroll, 120);
				rootObserver.observe(root);
			})
			.catch(() => {
				/* No WebGL or the import failed: the copy still reads as a page. */
			});

		const onResize = () => deck && deck.resize();
		window.addEventListener("resize", onResize);
		return () => {
			cancelled = true;
			window.removeEventListener("resize", onResize);
			window.removeEventListener("scroll", onScroll);
			window.clearInterval(poll);
			window.clearTimeout(switchTimer);
			canvas.classList.remove("is-switching");
			rootObserver.disconnect();
			if (deck) deck.destroy();
			deckRef.current = null;
		};
	}, []);

	return (
		<div ref={rootRef} className="deck dark">
			{/* The pinned viewport: canvas, projected labels, and the video panel. */}
			<div className="deck-stage">
				<canvas ref={canvasRef} className="deck-canvas" aria-hidden="true" />
				<div ref={labelsRef} className="deck-labels" aria-hidden="true" />
				{chapters.map((ch) =>
					ch.steps.map((st) => (
						<div
							key={`${ch.scene}-${st.phase}`}
							data-scene={ch.scene}
							data-phase={st.phase}
							className={`deck-copy${st.hero ? " deck-copy-hero is-active" : ""}`}
						>
							{!st.hero && <p className="deck-label">{ch.label}</p>}
							{st.hero ? (
								<h1 className="deck-h1">
									construction<span className="text-do-orange">.live</span>
								</h1>
							) : (
								<h2 className="deck-h2">{st.title}</h2>
							)}
							{st.sub && <p className="deck-sub">{st.sub}</p>}
						</div>
					)),
				)}
				<button
					type="button"
					className="deck-next"
					aria-label="Next"
					onClick={() => {
						const steps = Array.from(
							rootRef.current?.querySelectorAll<HTMLElement>(".deck-step") ?? [],
						);
						const on = rootRef.current?.querySelector<HTMLElement>(".deck-copy.is-active");
						const i = steps.findIndex(
							(st) =>
								st.dataset.scene === on?.dataset.scene &&
								st.dataset.phase === on?.dataset.phase,
						);
						const target = steps[i + 1] ?? null;
						const top = target
							? target.getBoundingClientRect().top + window.scrollY + window.innerHeight * 0.2
							: (rootRef.current?.getBoundingClientRect().bottom ?? 0) + window.scrollY;
						window.scrollTo({ top, behavior: "smooth" });
					}}
				>
					<ChevronDown className="h-7 w-7" />
				</button>
				{!ready && (
					<div className="deck-fallback" aria-hidden="true">
						<BrandMark className="h-10 w-10 text-do-orange" />
					</div>
				)}
				{chapters.map((ch) =>
					ch.steps
						.filter((st) => st.video)
						.map((st) => (
							<figure
								key={`${ch.scene}-${st.phase}`}
								className="deck-panel"
								data-scene={ch.scene}
								data-phase={st.phase}
							>
								<video
									src={st.video!.src}
									controls
									muted
									playsInline
									preload="metadata"
								/>
								<figcaption>{st.video!.caption}</figcaption>
							</figure>
						)),
				)}
			</div>

			{/* Spacers that drive the story: one screen per step. */}
			<div className="deck-steps">
				{chapters.map((ch) =>
					ch.steps.map((st) => (
						<section
							key={`${ch.scene}-${st.phase}`}
							data-scene={ch.scene}
							data-phase={st.phase}
							className={`deck-step${st.hero ? " deck-step-hero" : ""}`}
							aria-hidden="true"
						/>
					)),
				)}
			</div>
		</div>
	);
}
