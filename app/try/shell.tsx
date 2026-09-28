import BrandMark from "@/components/BrandMark";

/* The auth-style frame for /try and /try/verify.

   Shaped like app/signin/page.tsx rather than like the marketing pages on
   purpose: no nav, no hero, one narrow column in the middle of the screen. It
   reads as "you are creating an account", which is what is happening, rather
   than "you are filling in a lead form", which is what a form under a headline
   reads as. The difference is what this page is for.

   The nav is gone but the way home isn't: the mark at the top links back. */
export default function TryShell({
	eyebrow,
	children,
}: {
	eyebrow?: string;
	children: React.ReactNode;
}) {
	return (
		<main className="relative min-h-screen bg-do-bg flex flex-col">
			<div className="absolute inset-0 do-blueprint-grid pointer-events-none" />
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-do-orange/[0.05] rounded-full blur-[150px] pointer-events-none" />

			<div className="relative z-10 flex-1 flex flex-col justify-center mx-auto w-full max-w-md px-6 py-12">
				<a
					href="/"
					className="flex items-center justify-center mb-8"
					aria-label="construction.live home"
				>
					<BrandMark className="h-7 w-7 text-do-orange" />
					<span className="-ml-px text-do-text font-semibold text-xl tracking-tight">
						onstruction<span className="text-do-orange">.live</span>
					</span>
				</a>

				<div className="rounded-2xl border border-do-border bg-do-bg-card/80 backdrop-blur-xl p-7 md:p-8 shadow-xl">
					{eyebrow && (
						<span className="do-section-label text-do-orange block mb-3">{eyebrow}</span>
					)}
					{children}
				</div>

				<p className="mt-6 text-center text-xs text-do-text-muted">
					Prefer to talk first?{" "}
					<a href="/book" className="text-do-text-secondary underline underline-offset-2 hover:text-do-text">
						Book a demo
					</a>
					{" · "}
					<a href="/privacy" className="text-do-text-secondary underline underline-offset-2 hover:text-do-text">
						Privacy
					</a>
				</p>
			</div>
		</main>
	);
}
