/* Draft answers, written against the objections that come up on demo calls.
   Worth a read-through before these go in front of customers.

   Lives apart from FAQ.tsx so the /faqs layout can build FAQPage JSON-LD from
   the same source the component renders. Google requires the markup to match
   the visible answers, and one shared array is the only way to guarantee it
   stays that way. Editing an answer here updates both. */
export const faqs = [
	{
		q: "Do my crews have to learn new software?",
		a: "No. The field app works like sending a message, talk, snap a photo, or type a line. If a crew never opens it, the AI can call them at shift change and capture the same update by voice.",
	},
	{
		q: "Can I keep working from email?",
		a: "Yes. Forward or copy construction.live and the AI files it, links it to the right job, and replies with what you asked for. One subcontractor runs their entire bidding process this way without ever logging in.",
	},
	{
		q: "Does it replace our current PM tool?",
		a: "It doesn't have to. We connect to Procore, Autodesk Construction Cloud, Bluebeam, Outlook and Gmail, QuickBooks and Sage. Run us as the connected record on top of what you already have, or as the whole platform.",
	},
	{
		q: "Will reports use our own templates?",
		a: "Yes. Submittals, daily reports and T&M packages generate in your company's templates. Send us the ones you use today and we set them up during onboarding.",
	},
	{
		q: "How long does setup take?",
		a: "Connect email and your document folders and the first project is running in days, not months. There's no migration to finish before you get value, the record starts building from the next email and the next site visit.",
	},
	{
		q: "Who owns our data, and is it secure?",
		a: "You own it. Your project data is encrypted in transit and at rest, it isn't used to train models for anyone else, and you can export it whenever you want.",
	},
	{
		q: "Does the field app work offline?",
		a: "Yes. Voice notes and photos queue on the device when there's no service and sync as soon as reception comes back, which is most of what a jobsite day looks like.",
	},
	{
		q: "How is it priced?",
		a: "By project and team size. We're still shaping plans with early customers, so pricing is a five-minute conversation on the demo call rather than a table on a page.",
	},
	{
		q: "Who exactly is construction.live built for?",
		a:
			"Small and mid-size commercial general contractors, typically $2M-50M annual revenue, and the electrical, mechanical, and specialty subs contractors. We're focused on tenant fit-out, mixed-use, light commercial new build, retail, and hospitality. Not built for enterprise GCs, heavy civil, or institutional/healthcare.",
	},
	{
		q: "Why focus on small and mid-size, not enterprise?",
		a:
			"Enterprise GCs already have dedicated documentation staff, PMO teams, and software budgets sized for committee evaluation. Their problem isn't ours. The $2M-50M commercial contractor, where the PM is often the owner and the super is covering three jobs, has the documentation problem we solve, and they don't have a tool built for them. That's our market.",
	},
	{
		q: "What makes construction.live different from Raken, Fieldwire, or Procore field logs?",
		a:
			"Those tools collect data, usually through typed forms supers don't fill out reliably. We unify voice notes, photos, AI outbound calls, and integration data into one intelligence layer that flags money moments same-day and auto-assembles pay-app backup. The output is payment protection, not just a daily log.",
	},
];

