"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Download, X } from "lucide-react";
import { EVENTS, track } from "@/lib/analytics";
import { attributionForSubmit } from "@/lib/attribution";
import { silenceNewsletterPrompt } from "@/components/NewsletterPrompt";

/* Shown the moment a download starts. It asks for an email and makes a point
   of not needing one: the file is already on its way, there is nothing to
   unlock, and the only thing the address buys is a note when the next app
   ships. A download gate would cost more installs than the list is worth.

   The address goes into the newsletter register through the same endpoint as
   every other form, tagged with which app they downloaded, so there is one
   list to mail when Schedule ships rather than a second one to remember. */

export interface DownloadInfo {
	app: string;
	platform: "mac" | "windows";
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "submitting" | "done" | "error";

export default function DownloadPrompt({
	info,
	onClose,
}: {
	info: DownloadInfo | null;
	onClose: () => void;
}) {
	const [email, setEmail] = useState("");
	const [honeypot, setHoneypot] = useState("");
	const [status, setStatus] = useState<Status>("idle");

	/* Fresh form per download, and Escape closes it. */
	useEffect(() => {
		if (!info) return;
		setEmail("");
		setStatus("idle");
		const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [info, onClose]);

	const ready = EMAIL_PATTERN.test(email.trim());

	async function onSubmit(e: FormEvent) {
		e.preventDefault();
		if (!info || status === "submitting" || !ready) return;
		setStatus("submitting");
		try {
			const response = await fetch("/api/newsletter", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: email.trim(),
					interest: `Open Construction launches (downloaded ${info.app}, ${info.platform})`,
					company_website: honeypot,
					attribution: attributionForSubmit(),
				}),
			});
			if (!response.ok) throw new Error("submit_failed");
			const result = (await response.json()) as { status?: string };
			silenceNewsletterPrompt("subscribed");
			track(
				result.status === "already" ? EVENTS.NEWSLETTER_ALREADY_SUBSCRIBED : EVENTS.NEWSLETTER_SUBSCRIBED,
				{ location: `open_download_${info.app}`, interest: "open_launches" },
			);
			setStatus("done");
		} catch {
			track(EVENTS.NEWSLETTER_FAILED, { location: `open_download_${info?.app}` });
			setStatus("error");
		}
	}

	return (
		<AnimatePresence>
			{info && (
				<motion.div
					className="fixed inset-0 z-[80] flex items-end justify-center bg-black/50 p-4 backdrop-blur-sm sm:items-center"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={onClose}
				>
					<motion.div
						role="dialog"
						aria-modal="true"
						aria-labelledby="download-prompt-title"
						className="relative w-full max-w-md overflow-hidden rounded-2xl border border-do-border bg-do-bg-card p-7 shadow-2xl"
						initial={{ opacity: 0, y: 24, scale: 0.98 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 16, scale: 0.98 }}
						transition={{ duration: 0.25 }}
						onClick={(e) => e.stopPropagation()}
					>
						<button
							type="button"
							onClick={onClose}
							className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-do-text-muted transition-colors hover:bg-do-bg-hover hover:text-do-text"
							aria-label="Close"
						>
							<X className="h-4 w-4" />
						</button>

						<div className="flex items-center gap-2.5">
							<span className="flex h-9 w-9 items-center justify-center rounded-xl bg-do-orange/10">
								<Download className="h-4 w-4 text-do-orange" />
							</span>
							<span className="font-mono text-[11px] uppercase tracking-wider text-do-orange">
								Download started
							</span>
						</div>

						{status === "done" ? (
							<>
								<h2 id="download-prompt-title" className="mt-5 text-xl font-bold tracking-tight text-do-text">
									Noted. We&apos;ll write when the next one ships.
								</h2>
								<p className="mt-3 text-sm leading-relaxed text-do-text-secondary">
									Check {email.trim()} for a confirmation. Every mail has an unsubscribe
									link, so one click and you never hear from us again.
								</p>
								<button
									type="button"
									onClick={onClose}
									className="mt-6 inline-flex items-center gap-2 rounded-xl bg-do-orange px-5 py-3 text-sm font-medium text-white transition-all hover:bg-do-orange-dark"
								>
									<Check className="h-4 w-4" />
									Back to the page
								</button>
							</>
						) : (
							<>
								<h2 id="download-prompt-title" className="mt-5 text-xl font-bold tracking-tight text-do-text">
									{info.app} for {info.platform === "mac" ? "Mac" : "Windows"} is on its way.
								</h2>
								<p className="mt-3 text-sm leading-relaxed text-do-text-secondary">
									Want to hear when Schedule, the Contract Reviewer and the rest ship?
									Leave an email. <span className="text-do-text">You don&apos;t have to</span>:
									the download is already running, nothing on this page is gated, and
									the app never asks.
								</p>

								<form onSubmit={onSubmit} className="mt-5">
									<label htmlFor="download-prompt-email" className="sr-only">
										Email, optional
									</label>
									<div className="flex gap-2">
										<input
											id="download-prompt-email"
											type="email"
											autoComplete="email"
											placeholder="you@company.com (optional)"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											className="w-full rounded-xl border border-do-border bg-do-bg/60 px-4 py-3 text-sm text-do-text placeholder:text-do-text-muted transition-colors focus:border-do-orange/40 focus:outline-none focus:ring-1 focus:ring-do-orange/40"
										/>
										<button
											type="submit"
											disabled={!ready || status === "submitting"}
											className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-do-orange px-4 py-3 text-sm font-medium text-white transition-all hover:bg-do-orange-dark disabled:cursor-not-allowed disabled:opacity-40"
										>
											{status === "submitting" ? "Saving" : "Tell me"}
											<ArrowRight className="h-3.5 w-3.5" />
										</button>
									</div>
									{/* Honeypot: hidden from people, filled by bots. See the API route. */}
									<input
										type="text"
										name="company_website"
										tabIndex={-1}
										autoComplete="off"
										value={honeypot}
										onChange={(e) => setHoneypot(e.target.value)}
										className="absolute left-[-9999px] h-px w-px opacity-0"
										aria-hidden="true"
									/>
									{status === "error" && (
										<p className="mt-2 text-xs text-red-500">
											That did not save. The download is unaffected; try again or skip it.
										</p>
									)}
								</form>

								<div className="mt-5 flex items-center justify-between gap-4 border-t border-do-border pt-4">
									<p className="text-xs leading-relaxed text-do-text-muted">
										Launch notes only, on the newsletter list. One click to leave.
									</p>
									<button
										type="button"
										onClick={onClose}
										className="shrink-0 text-sm font-medium text-do-text-secondary transition-colors hover:text-do-text"
									>
										No thanks
									</button>
								</div>
							</>
						)}
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
