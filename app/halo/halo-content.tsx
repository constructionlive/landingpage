"use client";

import { useEffect, useRef, useState } from "react";
import { Big_Shoulders, Inter, Martian_Mono, Newsreader } from "next/font/google";
import "./halo.css";

const display = Big_Shoulders({ subsets: ["latin"], weight: ["700", "900"], variable: "--font-halo-display" });
const mono = Martian_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-halo-mono" });
const serif = Newsreader({ subsets: ["latin"], weight: "400", style: "italic", variable: "--font-halo-serif" });
const sans = Inter({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-halo-sans" });

/* The notarized Mac build on R2. `latest/` always serves the newest release. */
const DMG = "https://pub-061018a047d54079b309fb16a26a1ce0.r2.dev/halo/latest/Halo-arm64.dmg";
const REPO = "https://github.com/constructionlive/projecthalo";
const M = "/halo";

function AppleIcon() {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M16.37 12.6c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.77-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.82-.81-3-.79-1.54.02-2.96.9-3.76 2.27-1.6 2.78-.41 6.9 1.15 9.16.76 1.1 1.67 2.34 2.86 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.77.74 2.98.72 1.23-.02 2.01-1.12 2.76-2.23.87-1.28 1.23-2.52 1.25-2.58-.03-.01-2.4-.92-2.42-3.66zM14.1 5.86c.63-.77 1.06-1.83.94-2.89-.91.04-2.02.61-2.67 1.37-.58.67-1.09 1.76-.96 2.8 1.02.08 2.06-.52 2.69-1.28z" />
		</svg>
	);
}

function PlayIcon() {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M8 5.5v13l11-6.5z" />
		</svg>
	);
}

function GitHubIcon() {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
			<path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.09 0 4.42-2.7 5.39-5.26 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z" />
		</svg>
	);
}

type Beat = { img: string; alt: string; num: string; title: string; em: string; body: React.ReactNode; keys?: [string, string][] };

const BEATS: Beat[] = [
	{
		img: "launch.jpg",
		alt: "A roadster launching off a neon ramp at night",
		num: "01 · Lights out",
		title: "Launch an agent",
		em: "like a roadster.",
		body: "Say what you want done, pick who drives (Claude Code, Codex or OpenCode) and send it. A cutscene, a ramp, and your agent joins the race.",
		keys: [["⌘L", "launch"]],
	},
	{
		img: "ui-terminal.jpg",
		alt: "Halo's terminal cockpit: a real shell under the view from a red GT",
		num: "02 · Onboard",
		title: "Your terminal",
		em: "is a red GT.",
		body: (
			<>
				Real shells, in the repo you&apos;re working in. Run <code>npm run dev</code> and the car takes off, with its port on the bodywork. A failing test spins it out.
			</>
		),
		keys: [["⌘T", "new car"], ["⌘↩", "back to the arena"]],
	},
	{
		img: "gt.jpg",
		alt: "Cars racing around the Mesa Night circuit",
		num: "03 · The race",
		title: "Every task races",
		em: "to the finish line.",
		body: "Working agents lap the circuit. Finished ones park in the pit. The ones that need you pull in with their question, so nothing waits unseen.",
	},
	{
		img: "ui-season.jpg",
		alt: "The season view: four arenas, one for each repo",
		num: "04 · The season",
		title: "Every repo is",
		em: "a race arena.",
		body: "Open a folder and it becomes its own circuit: Bay Night, Mesa Night, Porto Quay, Col de Glace. Run them all at once and jump between them in a keystroke.",
		keys: [["⌘1–9", "arenas"], ["⌘0", "the season"]],
	},
	{
		img: "ui-arena.jpg",
		alt: "An arena with the radio bar and an agent's message",
		num: "05 · Radio tower",
		title: "No more juggling agents.",
		em: "Radio them.",
		body: "One radio for the whole team. Ask how the race is going, answer an agent in the pit, or ask Halo why a test failed. It reads the telemetry, meaning your terminals' output.",
		keys: [["right ⌘", "hold to talk"]],
	},
	{
		img: "drive.jpg",
		alt: "Driving a car on the Bay Night circuit at sunset",
		num: "06 · Take the wheel",
		title: "Agent taking too long?",
		em: "Drive it.",
		body: "Point at a car, press D, and you're behind the wheel. Arrows to steer, space for a flip. The agent keeps working while you lap.",
		keys: [["D", "drive"], ["←↑→↓", "steer"]],
	},
];

const ARENAS = [
	{ img: "ramp.jpg", alt: "Bay Night: cars lined up under a neon ramp", name: "Bay Night" },
	{ img: "gt.jpg", alt: "Mesa Night: a desert circuit at night", name: "Mesa Night" },
	{ img: "ui-porto.jpg", alt: "Porto Quay: a harbour town at dusk", name: "Porto Quay" },
	{ img: "glace.jpg", alt: "Col de Glace: a red GT drifting in the snow", name: "Col de Glace" },
];

export default function HaloContent() {
	const rootRef = useRef<HTMLDivElement>(null);
	const heroVideoRef = useRef<HTMLVideoElement>(null);
	const [scrolled, setScrolled] = useState(false);

	/* The nav gets a backdrop once you scroll past the top. */
	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 40);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	/* Sections fade up as they come into view. */
	useEffect(() => {
		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries)
					if (e.isIntersecting) {
						e.target.classList.add("in");
						io.unobserve(e.target);
					}
			},
			{ rootMargin: "0px 0px -8% 0px" },
		);
		rootRef.current?.querySelectorAll(".reveal").forEach((el) => io.observe(el));
		return () => io.disconnect();
	}, []);

	/* No looping background video for people who ask for less motion. */
	useEffect(() => {
		if (matchMedia("(prefers-reduced-motion: reduce)").matches) heroVideoRef.current?.pause();
	}, []);

	return (
		<div ref={rootRef} className={`halo ${display.variable} ${mono.variable} ${serif.variable} ${sans.variable}`}>
			<nav className={`top${scrolled ? " scrolled" : ""}`} aria-label="Main">
				<div className="wrap">
					<a className="brand" href="#top">
						HAL<span>O</span>
					</a>
					<ul>
						<li><a href="#trailer">Trailer</a></li>
						<li><a href="#story">How it plays</a></li>
						<li><a href="#themes">Themes</a></li>
						<li><a href="#open-source">Open source</a></li>
					</ul>
					<a className="btn solid" href={DMG}>Download for Mac</a>
				</div>
			</nav>

			<header className="hero" id="top">
				<img className="poster" src={`${M}/hero-poster.jpg`} alt="" />
				<video ref={heroVideoRef} autoPlay muted loop playsInline preload="auto" poster={`${M}/hero-poster.jpg`} aria-hidden="true">
					<source src={`${M}/hero-loop.mp4`} type="video/mp4" />
				</video>
				<div className="wrap">
					<div className="kicker">What if</div>
					<h1 className="display">
						Your AI agents
						<br />
						were fun?
					</h1>
					<p className="lede">
						Halo turns Claude Code, Codex and OpenCode into a racing team. Launch agents like roadsters, drive your terminal, and race every repo on its own circuit.
					</p>
					<div className="ctas">
						<a className="btn solid" href={DMG}>
							<AppleIcon />
							Download for Mac <small>APPLE SILICON</small>
						</a>
						<a className="btn" href="#trailer">
							<PlayIcon />
							Watch the trailer
						</a>
						<a className="btn" href={REPO}>
							<GitHubIcon />
							Star on GitHub
						</a>
					</div>
					<p className="meta">
						<b>Free &amp; open source</b> · MIT · macOS 13+ · Windows coming soon
					</p>
				</div>
			</header>

			<section className="trailer" id="trailer">
				<div className="wrap">
					<div className="head reveal">
						<div>
							<div className="kicker">The trailer · 56 seconds</div>
							<h2 className="display" style={{ marginTop: 14 }}>See it race</h2>
						</div>
						<p className="lede" style={{ maxWidth: "26em", margin: 0 }}>
							Everything in it is the real app: real agents launching, a real terminal racing, and a real agent building the Deep Sea theme live.
						</p>
					</div>
					<div className="frame reveal">
						<video controls playsInline preload="metadata" poster={`${M}/poster.jpg`}>
							<source src={`${M}/halo-trailer.mp4`} type="video/mp4" />
						</video>
					</div>
				</div>
			</section>

			<section className="story" id="story">
				<div className="wrap">
					<div className="intro reveal">
						<div className="kicker">How it plays</div>
						<h2 className="display">
							Your agents are a racing team.
							<br />
							You run the pit wall.
						</h2>
						<p className="lede">
							I got tired of staring at agent logs in a terminal. So I made every agent a car, every terminal a GT, and every repo a circuit.
						</p>
					</div>

					{BEATS.map((b) => (
						<article className="beat reveal" key={b.num}>
							<figure>
								<img src={`${M}/${b.img}`} alt={b.alt} loading="lazy" />
							</figure>
							<div>
								<div className="num">{b.num}</div>
								<h3 className="display">
									{b.title} <em>{b.em}</em>
								</h3>
								<p>{b.body}</p>
								{b.keys && (
									<p className="keys">
										{b.keys.map(([k, label]) => (
											<span key={k}>
												<kbd>{k}</kbd>
												{label}{" "}
											</span>
										))}
									</p>
								)}
							</div>
						</article>
					))}
				</div>

				<div className="grid-strip reveal">
					<div className="wrap">
						<div className="kicker">On the grid</div>
						<div className="agents">
							<span>Claude Code</span>
							<span>Codex</span>
							<span>OpenCode</span>
						</div>
					</div>
				</div>
			</section>

			<section className="themes" id="themes">
				<div className="wrap">
					<div className="head reveal">
						<div>
							<div className="kicker">Not your style?</div>
							<h2 className="display">Ask an agent to rebuild Halo&apos;s look.</h2>
						</div>
						<p className="lede" style={{ margin: 0 }}>
							Open the Workshop and say what you want:{" "}
							<span className="serif">&ldquo;make me an underwater theme where agents are submarines.&rdquo;</span> An agent rewrites the theme&apos;s code while you watch it rebuild. Themes are React and three.js, run sandboxed and offline, and every change can be undone.
						</p>
					</div>
					<figure className="big reveal">
						<img src={`${M}/ui-workshop.jpg`} alt="The Workshop, where agents build themes" loading="lazy" />
					</figure>
					<div className="pair">
						<figure className="tile reveal">
							<img src={`${M}/deepsea.jpg`} alt="The Deep Sea theme: agents as submarines over a neon coral reef" loading="lazy" />
							<figcaption>
								<span className="kicker">Built live by an agent</span>
								<b>Deep Sea</b>
								<p>Agents are submarines; the reef glows when they finish.</p>
							</figcaption>
						</figure>
						<figure className="tile reveal">
							<img src={`${M}/galaxy.jpg`} alt="The Galaxy theme: agents as stars" loading="lazy" />
							<figcaption>
								<span className="kicker">Or</span>
								<b>A star nursery</b>
								<p>The Galaxy theme: every agent a star being born.</p>
							</figcaption>
						</figure>
					</div>
				</div>
			</section>

			<section className="arenas">
				<div className="wrap">
					<div className="reveal">
						<div className="kicker">Four circuits, one per repo</div>
						<h2 className="display">Pick your arena</h2>
					</div>
					<div className="arena-row">
						{ARENAS.map((a) => (
							<figure className="tile reveal" key={a.name}>
								<img src={`${M}/${a.img}`} alt={a.alt} loading="lazy" />
								<figcaption>
									<b>{a.name}</b>
								</figcaption>
							</figure>
						))}
					</div>
				</div>
			</section>

			<section className="oss" id="open-source">
				<div className="wrap">
					<div className="card reveal">
						<div>
							<div className="kicker">Open source · MIT</div>
							<h2 className="display">Two days of game. A year of engine.</h2>
							<p>
								The racing world is new; the engine under it (agents that run in the background and wake you when they need you) has been in the works for a year. All of it is on GitHub. Fork it, add a track, or build multiplayer before I do.
							</p>
							<div className="ctas">
								<a className="btn solid" href={REPO}>View on GitHub</a>
								<a className="btn" href={`${REPO}/blob/main/CONTRIBUTING.md`}>Contribute</a>
							</div>
							<ul className="facts">
								<li>Rust + Tauri engine, React + three.js window</li>
								<li>On-device voice: hold a key and talk</li>
								<li>Signed, notarized, updates itself</li>
							</ul>
						</div>
						<pre>
							<span className="c"># build it yourself</span>
							{"\n"}
							<span className="p">$ </span>git clone https://github.com/constructionlive/projecthalo.git{"\n"}
							<span className="p">$ </span>cd projecthalo/ui &amp;&amp; npm ci &amp;&amp; cd ..{"\n"}
							<span className="p">$ </span>node scripts/stage-kit.mjs{"\n"}
							<span className="p">$ </span>cd crates/halo-app &amp;&amp; cargo tauri dev{"\n\n"}
							<span className="c">{"# needs Rust, Node 22, the Tauri CLI,\n# and Claude Code, Codex or OpenCode signed in"}</span>
						</pre>
					</div>
				</div>
			</section>

			<section className="finale">
				<img src={`${M}/finale.jpg`} alt="" loading="lazy" />
				<div className="wrap reveal">
					<h2 className="display">Halo</h2>
					<p className="serif">Make coding fun again!</p>
					<div className="ctas">
						<a className="btn solid" href={DMG}>
							Download for Mac <small>APPLE SILICON</small>
						</a>
						<a className="btn" href={REPO}>github.com/constructionlive/projecthalo</a>
					</div>
					<p className="meta">macOS 13+ · needs Claude Code, Codex or OpenCode · Windows coming soon</p>
				</div>
			</section>

			<footer>
				<div className="wrap">
					<span>© 2026 construction.live · MIT licensed</span>
					<span>
						<a href={REPO}>GitHub</a> · <a href={`${REPO}/issues`}>Report a bug</a> ·{" "}
						<a href="mailto:dev@construction.live">dev@construction.live</a>
					</span>
				</div>
			</footer>
		</div>
	);
}
