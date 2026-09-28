/* The three questions the /try onboarding asks, in one place.

   Shared on purpose: app/try/verify/page.tsx renders these buttons and
   app/api/try/answers/route.ts checks the answer came from this list. Two
   copies of the same list is how a reworded option starts failing validation
   for the people who see the new wording, which is every new visitor.

   No node imports here — this is pulled into a client component.

   The options are deliberately coarse. They exist to tell the founder which
   conversation to open with, not to segment a funnel: four choices someone can
   pick in a second beat twelve that make them think about us instead of their
   own problem. "Just exploring" is a real, useful answer and is listed as one
   rather than left to the free-text box. */

export interface TrialQuestion {
	key: "biggestProblem" | "workType" | "teamSize";
	/* Shown above the options. */
	label: string;
	/* The line under it. Empty for questions that need no explaining. */
	help?: string;
	options: string[];
}

export const TRIAL_QUESTIONS: TrialQuestion[] = [
	{
		key: "biggestProblem",
		label: "What's the biggest problem you want to solve?",
		help: "Pick the one that costs you the most. We'll open with that.",
		options: [
			"Estimating and AI take-off",
			"Jobsite visibility",
			"Paperwork and project admin",
			"Just want to explore",
		],
	},
	{
		key: "workType",
		label: "What kind of work do you do?",
		options: [
			"General contractor",
			"Specialty contractor / sub",
			"Owner or developer",
			"Something else",
		],
	},
	{
		key: "teamSize",
		label: "How many people do you have in the field?",
		options: ["Just me", "2–10", "11–50", "51–200", "200+"],
	},
];

/** Whether `value` is one of the offered answers for `key`. */
export function isValidAnswer(key: TrialQuestion["key"], value: string) {
	const question = TRIAL_QUESTIONS.find((q) => q.key === key);
	return Boolean(question?.options.includes(value));
}

/* The optional last box. Not a question — it is where someone tells us the
   thing none of the options covered, and it is what the founder reads first
   when it is filled in. */
export const TRIAL_NOTES_LABEL = "Anything else we should know before we call?";
export const TRIAL_NOTES_MAX = 1000;
