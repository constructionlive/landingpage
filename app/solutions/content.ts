/* Copy for every section on /solutions, keyed by the slug in nav-data.ts.
   Adding a solution to the nav is enough to make it appear on the page; add
   its slug here to give it a paragraph.

   The nav is deliberately short, so one section per pillar carries the
   capabilities that don't have their own line. That overflow goes in `extra`,
   which renders as a quieter second paragraph:
     01 → voice-notes      (the app itself, and T&M tickets)
     02 → cloud-storage    (Autodesk, Bluebeam, QuickBooks, Sage)
     03 → report-generator (drawing updates driving the estimate, RFIs)
     04 → revision-chain   (T&M into finance, schedule against submittals) */

export interface SolutionMedia {
	/* "video" renders a <video>, "image" renders a next/image. `src` is optional on
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
	/* Optional second paragraph, for sections that carry the capabilities we
	   chose not to give their own nav line. */
	extra?: string;
	media?: SolutionMedia;
}

export interface GroupIntro {
	/* Sits under the pillar number, above the heading. */
	kicker: string;
	body: string;
}

export const GROUP_INTROS: Record<string, GroupIntro> = {
	capture: {
		kicker: "The field never stops producing evidence. Most of it is lost by Friday.",
		body: "Everything a crew sees, says and does on site, captured the day it happens, without asking a super to sit down and type. Voice instead of forms, offline by default, on the phone they already carry.",
	},
	inbound: {
		kicker: "The other half of the job arrives from somewhere else.",
		body: "Owner directives, GC updates, revised sets and cost data land in email and in the systems you already run. We read all of it, file it against the right job, and update the drawing, the schedule and the change order from what it says.",
	},
	outbound: {
		kicker: "What you send is only as good as what you can back it with.",
		body: "Estimates, submittals, change orders and reports, generated from the record rather than retyped, and then tracked until somebody signs. When the drawings move, the estimate moves with them.",
	},
	"linked-record": {
		kicker: "This is the part other tools cannot do, and it is not a separate module.",
		body: "Because capture, inbound and outbound all run on one record, every entry points at whatever caused it. The daily log knows which change order it supports. The T&M ticket knows which invoice it became. Nobody assembles that chain by hand, because it was never broken apart.",
	},
};

export const SOLUTION_DETAILS: Record<string, SolutionDetail> = {
	/* ── 01 Capture in the field ─────────────────────────────────────── */
	"voice-notes": {
		tagline: "Thirty seconds of talking becomes a timestamped, searchable entry",
		body: "A super holds one button, describes what they are looking at, and it comes back as a transcript, geotagged, attached to the project, the scope and the sheet it belongs to. Construction language is what the model was built for, so a note about rebar that is not on the prints is understood as an unforeseen condition rather than filed as text. That single note is what a change order is built from eight months later.",
		extra: "The app it runs on is built for someone in a stairwell with gloves on: one button, no forms, and no signal required, which is the normal condition in a basement or a shaft. Everything queues and syncs when service returns. The same flow captures a T&M ticket, labour, hours, equipment and materials against the directive that authorised it, and takes a signature on the spot, so the work that starts on a verbal go-ahead is documented before anyone leaves the site.",
		media: {
			kind: "video",
			caption: "Capturing a voice note and a signed T&M ticket on site, offline",
		},
	},
	"meeting-recording": {
		tagline: "OAC and coordination calls become record, not notes nobody wrote",
		body: "Record the meeting, on a call or in a trailer with no connection, and you get a transcript, a summary and a clean list of decisions, commitments and open items attributed to whoever said them. Anything touching money or schedule is flagged rather than buried in the middle of an hour of audio. The next meeting starts from what was actually agreed.",
	},
	"daily-reporting": {
		tagline: "The daily log writes itself from what the field already said",
		body: "Every voice note, photo, ticket and meeting from a shift is assembled into the daily report for that project, organised by scope, with weather and crew filled in where we can pull them. The PM reviews and signs rather than reconstructing Tuesday from memory on Friday afternoon. A log built the same shift is the only kind worth anything in a dispute.",
		media: {
			kind: "image",
			caption: "A daily report assembled from one shift of field capture",
		},
	},
	"live-schedule": {
		tagline: "The current schedule, in the hand of the person building to it",
		body: "The field opens today's activities on a phone without asking the office which version is current, and marks progress against them in the same breath as the daily note. That progress flows straight back, so the schedule reflects what was actually installed instead of what someone assumed at the monthly update. Look-aheads come out of the same data rather than being rebuilt by hand each week.",
	},

	/* ── 02 Everything that arrives ──────────────────────────────────── */
	"email-tracking": {
		tagline: "Owner and GC directives stop living in one person's inbox",
		body: "The decisions that move a job almost always arrive as email, and then disappear behind whoever received them. Connect Outlook or Gmail and we file project mail against the right job and scope, surface the messages that carry a directive, an approval or a schedule change, and attach them to the record they affect. Nobody has to forward anything to a shared mailbox for the file to be complete.",
		media: {
			kind: "video",
			caption: "An owner email routed to the job, scope and change order it affects",
		},
	},
	"auto-updates": {
		tagline: "The drawing, the schedule and the change order update from what came in",
		body: "Reading the mail is not the point; acting on it is. A revised set arriving by email updates the current drawing and flags what changed on it. A directive that moves a date moves the schedule activity and the work downstream of it. A message authorising extra work opens the change order draft with that message already attached as the authority. You review the update rather than perform it.",
		media: {
			kind: "video",
			caption: "A revised set arrives by email and the drawing, schedule and CO all move",
		},
	},
	procore: {
		tagline: "Keep Procore as the system of record",
		body: "If your owner or your office runs on Procore, none of that has to change. Projects, drawings, RFIs, submittals and daily logs stay in sync, so what the field captures with us appears where your team and your owner already look. You get the capture and the intelligence without maintaining a second place to check.",
	},
	"cloud-storage": {
		tagline: "The folders and tools your drawings and numbers already live in",
		body: "Point us at Google Drive, SharePoint or Dropbox and we pull the sets, specs, contracts and photos already sitting there, including the scanned and badly named ones. Nobody has to migrate a folder structure or change where they save things. New files landing in a watched folder are read and filed on arrival.",
		extra: "The same applies to the tools around them. Sheets, revisions and markups move between construction.live, Autodesk Construction Cloud and Bluebeam, so estimators and PMs keep the software they are quick in and the field is never working off a sheet superseded somewhere else. On the money side, jobs, cost codes and commitments line up with QuickBooks or Sage, and pay applications carry their backup across, which keeps accounting out of the business of chasing photos before a draw goes out.",
	},

	/* ── 03 What goes back out ───────────────────────────────────────── */
	"takeoff-estimates": {
		tagline: "Quantities off the set, priced against how you actually build",
		body: "Upload a drawing set and we pull measurable quantities off it, counts, lengths and areas by scope, so the estimator is checking and adjusting rather than starting with a blank page and a scale wheel. Quantities carry into the estimate with your own labour rates, production factors and material pricing. Every line traces back to the sheet and revision it came from.",
		media: {
			kind: "video",
			caption: "Takeoff to priced estimate on a tenant fit-out set",
		},
	},
	"submittal-tracking": {
		tagline: "The log, the ball-in-court and the chasing, handled",
		body: "Submittals are built from the spec sections, routed to the right reviewer, and tracked with a clear ball-in-court so nobody opens a spreadsheet to answer where it is. Overdue reviews chase themselves. When an approval comes back conditioned or rejected, the procurement and schedule activities behind it are flagged instead of quietly running late.",
	},
	"change-order": {
		tagline: "The packet assembled from day-one documentation",
		body: "The moment the field describes an extra, an owner directive or an unforeseen condition, the record starts: transcript, photos, timestamp, affected sheet, schedule impact and the email that authorised it. At submission the packet is assembled with pricing and a chronology rather than reconstructed from memory. Change orders are usually lost on documentation rather than on merit, which is why the trail starts on day one.",
		media: {
			kind: "video",
			caption: "From a field voice note to a submitted change order packet",
		},
	},
	"report-generator": {
		tagline: "Owner, lender and internal reports built from the live record",
		body: "Monthly owner reports, lender draws and internal reviews all pull from the same record, so nobody spends two days assembling a deck out of email and photo folders. Pick the period and the audience and it comes back with progress, issues, changes and photos already organised, in your template. Export it, or keep it tracked so the next one starts where this one ended.",
		extra: "The same reporting engine drives the tracking underneath it. RFIs are drafted from the field note that raised the conflict, routed, chased, and filed back against the drawing when the answer lands. And because estimate lines are tied to the sheets they were measured from, a revised set flags exactly which quantities and costs moved, the same day it arrives, instead of at billing.",
		media: {
			kind: "image",
			caption: "A monthly owner report generated from the project record",
		},
	},

	/* ── 04 One linked record ────────────────────────────────────────── */
	"revision-chain": {
		tagline: "Every document knows which version of the truth it was built on",
		body: "Drawings, specs, estimates, submittals and change orders each carry the revision they were made against. When a sheet supersedes another, everything downstream of it is identified rather than left to somebody's memory of what they had priced. Asking which revision a decision was made under stops being an afternoon of digging.",
		extra: "The same links run through cost and schedule. A signed T&M ticket carries into billing with its labour, equipment, photos and authorising directive still attached, so committed cost and pending exposure are made of tickets you can open rather than numbers typed beside them. Submittals and procurement are tied to the schedule activities that depend on them, so an approval sitting on a desk surfaces as the schedule risk it actually is, while there is still time to act on it.",
	},
	"log-to-change-order": {
		tagline: "The daily log is the evidence, so it is attached before you ask",
		body: "A change order submitted with nothing behind it is an opinion. Because the daily log, the voice note and the photos are already linked to the condition that triggered the change, the packet arrives with its chronology intact. You are not searching for the Tuesday in March when the super first mentioned it, because the change order already points at it.",
		media: {
			kind: "image",
			caption: "A change order with its originating log entries linked, not attached by hand",
		},
	},
	"search-everything": {
		tagline: "Ask a question, get the sheet, the clause or the email that answers it",
		body: "Drawings, specs, contracts, submittals, transcripts, emails and photos sit in one index. Ask in plain language, the way you would ask a PM who has been on the job since day one, and the answer comes back with a link to the exact page or message it came from. It reads scanned sets and handwritten markups too, so the old paper is not a dead end.",
		media: {
			kind: "video",
			caption: "One plain-language question answered across drawings, email and field notes",
		},
	},
};
