/* Copy for every section on /solutions, keyed by the slug in nav-data.ts.
   Adding a solution to the nav is enough to make it appear on the page; add
   its slug here to give it a paragraph. */

export interface SolutionMedia {
	/* "video" renders a <video>, "image" renders an <img>. `src` is optional on
	   purpose: until the real asset exists we render a labelled frame in the
	   same slot, so nothing 404s and the layout is already correct. Drop a file
	   in /public, fill in `src`, and the frame becomes the real thing. */
	kind: "video" | "image";
	src?: string;
	poster?: string;
	alt?: string;
	caption: string;
}

export interface SolutionDetail {
	/* One short line under the heading. */
	tagline: string;
	/* The three-to-four line paragraph. */
	body: string;
	media?: SolutionMedia;
}

export const GROUP_INTROS: Record<string, string> = {
	"capture-field":
		"Everything that happens on the jobsite, captured the day it happens, without asking a super to sit down and type.",
	"preconstruction-bidding":
		"The work that decides whether a job is profitable before a single crew shows up.",
	"documents-revisions":
		"Drawings, submittals and RFIs move constantly. This is the layer that keeps the field working off what's actually current.",
	"controls-finance":
		"Schedule, issues, changes and cash, tied back to the field record they came from.",
	integrations:
		"We connect to the systems you already run instead of asking your team to abandon them.",
};

export const SOLUTION_DETAILS: Record<string, SolutionDetail> = {
	/* ── Capture & Field ─────────────────────────────────────────────── */
	"field-app": {
		tagline: "Voice, photos and location, from the phone already in their pocket",
		body: "The field app is built for someone standing in a stairwell with gloves on. A super holds one button, talks for thirty seconds, and that becomes a timestamped entry with a transcript, geotagged photos and the scope it belongs to. There are no forms to fill and nothing to remember at the end of the day. It queues everything when there's no signal and syncs the moment service comes back.",
		media: {
			kind: "video",
			caption: "Walkthrough: capturing a voice note and photo on site",
		},
	},
	"daily-reporting": {
		tagline: "The daily log writes itself from what the field already said",
		body: "Every voice note, photo and call summary from a shift is assembled into a daily report for that project, organised by scope, with weather, crew and equipment filled in where we can pull them. The PM reviews and signs rather than reconstructing the day from memory on Friday afternoon. Because the log is built the same shift, it is worth something when a dispute arrives months later.",
		media: {
			kind: "image",
			caption: "A daily report assembled from a single shift of field capture",
		},
	},
	meetings: {
		tagline: "OAC and coordination calls become searchable record, not notes nobody wrote",
		body: "Join a meeting with us on the call and you get a transcript, a summary and a clean list of decisions, commitments and open items, each attributed to the person who said it. Anything that touches money or schedule is flagged and can be pushed straight into the issue log or a change order draft. The next meeting starts from what was actually agreed, not from whoever's notebook is closest.",
	},
	"document-search": {
		tagline: "Ask a question, get the sheet, the clause or the email that answers it",
		body: "Drawings, specs, contracts, submittals, transcripts and photos all land in one searchable index. Ask it in plain language, the way you would ask a PM who has been on the job since day one, and you get the answer with a link to the exact page or message it came from. It searches inside scanned PDFs and handwritten markups too, so the old sheets are not a dead end.",
		media: {
			kind: "video",
			caption: "Asking a plain-language question across a project's documents",
		},
	},
	"email-management": {
		tagline: "The project's real record lives in inboxes; we pull it into the file",
		body: "Owner directives, sub commitments and schedule changes almost always arrive as email and then disappear into somebody's inbox. Connect Outlook or Gmail and we file project mail against the right job and scope, surface the messages that carry a decision, and attach them to the change order or claim they belong to. Nobody has to forward anything to a shared mailbox for the record to be complete.",
	},

	/* ── Preconstruction & Bidding ───────────────────────────────────── */
	"takeoff-estimates": {
		tagline: "Quantities off the drawings, priced against how you actually build",
		body: "Upload a set and we pull measurable quantities off it, counts, lengths, areas, by scope, so the estimator is checking and adjusting rather than starting from a blank page and a scale wheel. Quantities carry into the estimate with your own labour rates, production factors and material pricing. Every line traces back to the sheet and revision it came from, so when the drawings change you can see exactly which numbers moved.",
		media: {
			kind: "video",
			caption: "Takeoff to priced estimate on a tenant fit-out set",
		},
	},
	"bid-proposal": {
		tagline: "The estimate turned into a proposal an owner can read",
		body: "The proposal is generated from the estimate rather than retyped into last year's Word file, so inclusions, exclusions, allowances, alternates and clarifications stay consistent with what you actually priced. Your format, your terms, your cover. When scope shifts during negotiation you regenerate instead of hunting for the paragraph that no longer matches the number.",
	},
	"bid-leveling": {
		tagline: "Sub quotes on one sheet, with the gaps made obvious",
		body: "Sub bids arrive as PDFs, emails and spreadsheets that all describe scope differently. We read them, line them up against your scope breakdown, and show where a number is low because someone excluded the work rather than sharpened the pencil. Exclusions, alternates and unit rates sit side by side so the award conversation is about scope, not about who wrote the shortest email.",
		media: {
			kind: "image",
			caption: "Three sub quotes leveled against one scope breakdown",
		},
	},
	"subcontractor-management": {
		tagline: "One record per sub, from invite through closeout",
		body: "Keep your bidders, their trades, coverage areas and history in one place, then track who was invited, who responded and who is still sitting on a package. Once a sub is on the job the same record carries their insurance and licence expiries, their commitments from meetings, and their performance on the jobs you have already run with them. Next bid day you are inviting from evidence rather than from memory.",
	},
	"time-and-material": {
		tagline: "T&M tickets captured in the field and signed before anyone leaves",
		body: "T&M is where documentation quietly costs the most, because the work is done on a verbal go-ahead and written up days later. A foreman captures labour, hours, equipment and materials against the directive that authorised it, attaches photos, and gets a signature on the spot. The ticket lands with the daily log and flows straight into the billing package, still attached to the conversation that started it.",
		media: {
			kind: "image",
			caption: "A field-signed T&M ticket with its authorising directive attached",
		},
	},

	/* ── Documents & Revisions ───────────────────────────────────────── */
	"drawing-manager": {
		tagline: "One current set, and the field always sees it",
		body: "Drop a drawing package in and sheets are named, numbered and filed by discipline automatically, including scanned and sloppily titled sets. The field opens the current sheet on a phone or tablet without asking anyone which folder it lives in. Markups, photos and voice notes hang off the sheet they were taken against, so the drawing carries its own history.",
		media: {
			kind: "video",
			caption: "Uploading a drawing set and opening the current sheet in the field",
		},
	},
	"revision-tracking": {
		tagline: "What changed between revisions, in plain language",
		body: "When a new revision lands we compare it against the superseded sheet and show what actually moved, not just that a new file exists. Changes are described in words as well as highlighted on the sheet, and anything with a cost or schedule consequence is flagged for the PM. Work put in place against an old revision is exactly the kind of thing that becomes a change order, so we make sure it is on the record the day the revision arrives.",
	},
	"submittal-tracking": {
		tagline: "The log, the ball-in-court and the reminders, handled",
		body: "Submittals get built from the spec sections, routed to the right reviewer, and tracked with a clear ball-in-court so nobody has to open a spreadsheet to answer 'where is it'. Overdue reviews chase themselves. When an approval comes back conditioned or rejected, the affected procurement and schedule activities are flagged rather than quietly running late.",
	},
	"rfi-tracking": {
		tagline: "RFIs written from what the field actually asked",
		body: "A super's voice note describing a conflict in the field becomes a draft RFI with the question, the affected sheet and the photos already attached. It routes, it chases, and the answer files itself back against the drawing and the scope. If the response changes scope, the change order draft starts there instead of six weeks later when someone notices the cost.",
	},
	"report-generator": {
		tagline: "Owner, lender and internal reports built from the live record",
		body: "Monthly owner reports, lender draws and internal reviews all pull from the same field record, so nobody spends two days assembling a deck from email and photo folders. Pick the period and the audience and the report comes back with progress, issues, changes and photos already organised. Your template, your logo, exported when you need it.",
		media: {
			kind: "image",
			caption: "A monthly owner report generated from the project record",
		},
	},

	/* ── Controls & Finance ──────────────────────────────────────────── */
	"auto-scheduling": {
		tagline: "The schedule updated from the field, not from a guess",
		body: "Progress captured in the field updates the activities it belongs to, so the schedule reflects what was actually installed rather than what someone assumed at the monthly update. When an activity slips, downstream work and the critical path move with it and the people affected are told. Look-aheads come out of the same data instead of being rebuilt by hand every week.",
	},
	"issue-tracker": {
		tagline: "Every open item in one place, with an owner and a date",
		body: "Issues raised in a voice note, a meeting, an RFI response or a punch walk all land in one tracker with a responsible party, a due date and the evidence attached. Nothing depends on somebody remembering to type it up afterwards. You can see at a glance what is open per project, per sub and per scope, and what is old enough to start costing money.",
	},
	"change-order": {
		tagline: "The change order packet assembled from day-one documentation",
		body: "The moment the field describes an extra, an owner directive or an unforeseen condition, we start the record: transcript, photos, timestamp, affected drawing, and the schedule impact. When it is time to submit, the packet is assembled with pricing and a chronology rather than reconstructed from memory. Change orders are usually lost on documentation rather than on merit, so the paper trail starts on day one.",
		media: {
			kind: "video",
			caption: "From a field voice note to a submitted change order packet",
		},
	},
	"delay-claims": {
		tagline: "A defensible chronology, built while the delay is happening",
		body: "Delays are made up of small daily facts, crews standing by, access not granted, a late approval, that are impossible to reconstruct a year later. Those facts are already in the field record, so we build the chronology as the delay unfolds and tie each entry to the schedule activity it affected. When notice needs to go out, the dates, the cause and the evidence are already in one place.",
	},
	"finance-diary": {
		tagline: "The money view of the job, tied back to the field record",
		body: "Committed cost, billed to date, pending changes, retention and exposure sit in one running view per project, with every number linked to the document behind it. Pay applications ship with their backup already assembled per line item. When a PM asks where the margin went, the answer is a trail of entries rather than an opinion.",
		media: {
			kind: "image",
			caption: "A project's running cost position with backup attached per line",
		},
	},

	/* ── Integrations ────────────────────────────────────────────────── */
	procore: {
		tagline: "Keep Procore as the system of record",
		body: "If your owner or your office runs on Procore, nothing about that has to change. Projects, drawings, RFIs, submittals and daily logs stay in sync, so what the field captures with us shows up where your team and your owner already look. You get the capture and the intelligence layer without a second place to check.",
	},
	"autodesk-construction-cloud": {
		tagline: "Drawings and issues in step with ACC",
		body: "Sheets, revisions, issues and RFIs move between construction.live and Autodesk Construction Cloud, so the field is never working off a sheet that was superseded in the other system. Markups and photos captured on site come back attached to the right sheet and version.",
	},
	"outlook-gmail": {
		tagline: "Project email becomes part of the record",
		body: "Connect Outlook or Gmail and the mail that carries a decision gets filed against the project and scope it affects, instead of living in one person's inbox. Owner directives and sub commitments are surfaced and attached to the change order or claim they support. Your team keeps working in the inbox they already use.",
	},
	"quickbooks-sage": {
		tagline: "Cost and billing stay aligned with accounting",
		body: "Jobs, cost codes, commitments and billing line up with QuickBooks or Sage so the field record and the books are describing the same project. Pay applications and T&M billings carry their backup across, which keeps the accounting team out of the business of chasing photos and daily logs.",
	},
	bluebeam: {
		tagline: "Markups where your team already does them",
		body: "Sets and markups move between construction.live and Bluebeam, so the estimator and the PM keep the tooling they are fast in. Takeoff quantities and field markups stay tied to the sheet and revision they were made against on both sides.",
	},
};
