import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SiteNav from "@components/home/SiteNav";
import SiteFooter from "@components/home/SiteFooter";
import JsonLd from "@/components/JsonLd";
import TrainingEnquiryForm from "@/components/TrainingEnquiryForm";
import { absoluteUrl } from "@/lib/site";
import { ORGANIZATION_ID, WEBSITE_ID, breadcrumbSchema, graph } from "@/lib/schema";

/* Training and implementation.

   Written as JSX rather than an HTML string like its two siblings under
   /resources, because this page has a form in the middle of it and a component
   cannot live inside dangerouslySetInnerHTML. It borrows the `.article-body`
   band classes from globals.css so it still reads as the same family of page —
   same alternating bands, same section chip, same card grids.

   The copy is drawn from the two published articles rather than invented:
   "Good support is part of the product" and "Buying AI is easy. Getting value
   from it is the real work". If those change, this should change with them. */

const SLUG = "/resources/training";

const TITLE = "Training and implementation";

const DESCRIPTION =
	"We train your team ourselves, on site or online, using your drawings, your RFIs and your daily logs — not a demo account. Forward-deployed engineers stay through the rollout.";

const HERO = "/images/resources/why-ai-training-jobsite.webp";

export const metadata: Metadata = {
	title: "Training and implementation | construction.live",
	description: DESCRIPTION,
	alternates: { canonical: absoluteUrl(SLUG) },
	openGraph: {
		title: TITLE,
		description: DESCRIPTION,
		type: "article",
		url: absoluteUrl(SLUG),
		images: [{ url: absoluteUrl(HERO), alt: TITLE }],
	},
	twitter: {
		card: "summary_large_image",
		title: TITLE,
		description: DESCRIPTION,
		images: [absoluteUrl(HERO)],
	},
};

/* Grounded in the four personas on the homepage, in the order we actually
   start with: the people who create the record first, then the people who
   have to act on it. */
const ROLES = [
	{
		role: "Site supers and foremen",
		first: "The field app, by voice",
		detail:
			"Daily logs, inspections and photos from the phone, offline if the site has no signal. If this group does not adopt, nothing downstream has anything to work with — so they are trained first, in the shortest session.",
	},
	{
		role: "Project managers and coordinators",
		first: "Email, submittals and the revision chain",
		detail:
			"Where the field record links to the schedule, the drawing revision and the submittal behind it, and how the daily report writes itself out of what the crew already sent.",
	},
	{
		role: "Estimators",
		first: "Drawings and takeoff",
		detail:
			"Working the plan set inside the platform: counts, measurements and the checking step that keeps the estimator in control of the number rather than the model.",
	},
	{
		role: "Back office and accounts",
		first: "T&M, billing and the paper trail",
		detail:
			"Pulling the evidence behind a claim or an invoice out of records the field already filed, instead of chasing four people for it at month end.",
	},
];

const SUCCESS = [
	"Estimators move from drawings to checked quantities faster.",
	"Field information reaches the office with less chasing and retyping.",
	"Meetings, photographs, reports and decisions become part of the project record.",
	"Company knowledge becomes easier to find and reuse.",
	"New ideas become working tools while the need is still current.",
];

export default function TrainingPage() {
	const url = absoluteUrl(SLUG);

	const articleSchema = {
		"@type": "Article",
		headline: TITLE,
		description: DESCRIPTION,
		image: [absoluteUrl(HERO)],
		author: { "@id": ORGANIZATION_ID },
		publisher: { "@id": ORGANIZATION_ID },
		isPartOf: { "@id": WEBSITE_ID },
		mainEntityOfPage: url,
	};

	const breadcrumbs = breadcrumbSchema([
		{ name: "Home", url: absoluteUrl("/") },
		{ name: "Resources", url: absoluteUrl("/resources") },
		{ name: TITLE, url },
	]);

	return (
		<main className="min-h-screen bg-do-bg">
			<SiteNav />

			{/* ── Hero ───────────────────────────────────────────────────────── */}
			<section className="relative overflow-hidden pt-36 pb-12 md:pt-44 md:pb-16">
				<div className="do-blueprint-grid pointer-events-none absolute inset-0" />
				<div className="pointer-events-none absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-do-orange/[0.05] blur-[140px]" />

				<div className="relative z-10 mx-auto max-w-5xl px-6">
					<Link
						href="/resources"
						className="do-section-label inline-flex items-center gap-2 text-do-orange transition-colors hover:text-do-orange-dark"
					>
						<ArrowLeft className="h-3.5 w-3.5" />
						Resources
						<span className="text-do-text-muted">/ Training</span>
					</Link>

					<h1 className="mt-5 text-4xl font-bold leading-[1.08] tracking-tight text-do-text md:text-5xl lg:text-[3.25rem]">
						We train your team on your job, not on a demo account.
					</h1>

					<p className="mt-5 max-w-3xl text-lg font-medium leading-snug text-do-text md:text-xl">
						A licence does not create adoption. People do.
					</p>

					<p className="mt-5 max-w-3xl text-lg leading-relaxed text-do-text-secondary">
						We run the training ourselves — on site or online — using your drawings,
						your RFIs and your daily logs. Then we stay through the rollout, because
						the problems that kill an AI project turn up in week three, not on the
						day the licences are issued.
					</p>

					<figure className="mt-10">
						<Image
							src={HERO}
							alt="A crew in hard hats gathered around a laptop on a cart, being shown the app on an active jobsite"
							width={1600}
							height={900}
							sizes="(max-width: 1024px) 100vw, 1024px"
							priority
							className="aspect-video w-full rounded-xl border border-do-border object-cover"
						/>
						<figcaption className="mt-2.5 text-sm leading-relaxed text-do-text-muted">
							Training happens with the crew that will use it, in the building they
							are working in, on the job they are already running.
						</figcaption>
					</figure>
				</div>
			</section>

			{/* ── Body ───────────────────────────────────────────────────────── */}
			<div className="article-body">
				<section className="section" id="why">
					<div className="section-grid">
						<div className="section-number">01</div>
						<div>
							<h2>The software working and the team using it are two different projects</h2>
							<p className="lead">
								Most AI rollouts do not fail on capability. They fail on adoption.
							</p>
							<p>
								General AI tools are built for many industries. That reach is worth
								something, but it leaves the translation work with you: deciding
								where it fits, connecting it to the job, writing processes people
								can safely follow, training the users and keeping the rollout moving
								while the work carries on.
							</p>
							<p>
								Large vendors serve very large markets. A support request may pass
								through several teams before it reaches someone who can answer it,
								and training is often delivered by a third-party consultant who
								understands the software but not the pace of a live construction
								project.
							</p>
							<div className="plain-point">
								You should not have to explain construction from the beginning every
								time you ask for help.
							</div>
						</div>
					</div>
				</section>

				<section className="section" id="delivery">
					<div className="section-grid">
						<div className="section-number">02</div>
						<div>
							<h2>On site or online. Usually both.</h2>
							<p className="lead">
								The first session happens where the work is.
							</p>
							<div className="two-up">
								<div className="card">
									<span className="label">On site</span>
									<h3>In the trailer, with the crew</h3>
									<p>
										We come to the project. Supers, foremen and anyone else who
										creates the daily record get trained standing up, on their own
										phones, on the job they are running that week. Short enough to
										fit either side of a shift.
									</p>
								</div>
								<div className="card">
									<span className="label">Online</span>
									<h3>Scheduled around the job</h3>
									<p>
										For office roles and for anyone the site visit missed. Shorter
										sessions, recorded if you want them, and repeated for new
										starters rather than treated as a one-off event you had to be
										present for.
									</p>
								</div>
							</div>
							<figure className="visual">
								<Image
									src="/images/resources/why-hero-field-coordination.webp"
									alt="A foreman walking four crew members through a plan set spread on a cart on site"
									width={1680}
									height={945}
									sizes="(max-width: 1024px) 100vw, 1024px"
									loading="lazy"
									className="w-full"
								/>
								<figcaption>
									The format construction already trusts: someone who knows the job,
									walking the people doing it through the thing in front of them.
								</figcaption>
							</figure>
						</div>
					</div>
				</section>

				<section className="section" id="material">
					<div className="section-grid">
						<div className="section-number">03</div>
						<div>
							<h2>Trained on your project, not on sample data</h2>
							<p className="lead">
								Generic examples do not survive contact with a live site.
							</p>
							<p>
								Before the first session we load your material, so what people learn
								on is what they will use on Monday. Nobody is asked to imagine how it
								would apply to their job, because it is already their job.
							</p>
							<ul className="simple-points">
								<li>
									<strong>Your drawings:</strong> the current plan set, with the
									revisions that are actually live on the project.
								</li>
								<li>
									<strong>Your correspondence:</strong> real RFIs, submittals and
									email threads, so search and linking are demonstrated on records
									the team recognises.
								</li>
								<li>
									<strong>Your approval chain:</strong> the reviewers and the order
									your contract requires, not a default workflow.
								</li>
								<li>
									<strong>Your templates:</strong> the daily report and transmittal
									formats you already send, so the output needs no reformatting.
								</li>
							</ul>
							<p>
								The setup has to respect the pressure the team is already under —
								bids, inspections, changes and closeout. A site team cannot spend
								months learning a new system, so we do not design a rollout that
								assumes they can.
							</p>
						</div>
					</div>
				</section>

				<section className="section" id="who">
					<div className="section-grid">
						<div className="section-number">04</div>
						<div>
							<h2>Who we train, and in what order</h2>
							<p className="lead">
								Start with the people who create the record. Everything else depends
								on them.
							</p>
							<div className="two-up">
								{ROLES.map((role) => (
									<div className="card" key={role.role}>
										<span className="label">{role.first}</span>
										<h3>{role.role}</h3>
										<p>{role.detail}</p>
									</div>
								))}
							</div>
						</div>
					</div>
				</section>

				<section className="section" id="engineers">
					<div className="section-grid">
						<div className="section-number">05</div>
						<div>
							<h2>Our engineers stay after the training ends</h2>
							<p className="lead">
								The problems that stall a rollout appear in week three.
							</p>
							<p>
								When it helps, our forward-deployed engineers work alongside your
								team. They study the workflow as it actually runs, watch where people
								get stuck, and turn what they find into changes in the product rather
								than into a longer training deck.
							</p>
							<p>
								That is the same loop that produced the T&amp;M consolidation workflow
								for one client in a week: a real operating problem went in, and the
								product changed to solve it. Feedback goes from anywhere in the app
								straight to the people who can act on it.
							</p>
							<figure>
								<Image
									src="/images/resources/why-feedback-support.webp"
									alt="The construction.live feedback dialog, open over the app"
									width={1680}
									height={917}
									sizes="(max-width: 1024px) 100vw, 1024px"
									loading="lazy"
									className="w-full"
								/>
								<figcaption>
									Send feedback from anywhere, at any time. A forward-deployed
									engineer answers it.
								</figcaption>
							</figure>
						</div>
					</div>
				</section>

				<section className="section" id="success">
					<div className="section-grid">
						<div className="section-number">06</div>
						<div>
							<h2>What we are aiming at</h2>
							<p className="lead">
								Not seats filled. Work that got easier.
							</p>
							<ul>
								{SUCCESS.map((item) => (
									<li key={item}>{item}</li>
								))}
							</ul>
							<div className="plain-point">
								We do not want to sell your team one more unused tool. We want to
								help your company build a practical AI capability that lasts.
							</div>
						</div>
					</div>
				</section>
			</div>

			{/* ── Enquiry ────────────────────────────────────────────────────── */}
			<section
				id="ask"
				className="relative scroll-mt-24 overflow-hidden border-t border-do-border bg-do-bg-card py-20 md:py-24"
			>
				<div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-do-orange/[0.06] blur-[120px]" />

				<div className="relative z-10 mx-auto max-w-3xl px-6">
					<div className="mb-8 text-center">
						<span className="do-section-label text-do-orange">Ask about training</span>
						<h2 className="mt-4 text-3xl font-bold leading-[1.1] tracking-tight text-do-text md:text-4xl">
							Tell us who needs training.
						</h2>
						<p className="mt-5 text-lg leading-relaxed text-do-text-secondary">
							Roles, rough numbers and what is coming up on the job. We will come back
							with a plan for the first session and what we would start with.
						</p>
					</div>

					<TrainingEnquiryForm />
				</div>
			</section>

			<JsonLd schema={graph(articleSchema, breadcrumbs)} />
			<SiteFooter />
		</main>
	);
}
