"use client";

import { useState, FormEvent } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export default function WaitlistForm() {
  const joinWaitlist = useMutation(api.earlyAccess.joinWaitlist);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "created" | "duplicate" | "error">("idle");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("submitting");
    try {
      const result = await joinWaitlist({ email: email.trim() });
      setStatus(result.status);
      if (result.status === "created") setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1 px-4 py-3 rounded-lg border border-do-border bg-do-bg-card text-do-text placeholder:text-do-text-secondary text-sm focus:outline-none focus:ring-2 focus:ring-do-orange"
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="px-6 py-3 text-sm font-medium text-white bg-do-orange hover:bg-do-orange-dark rounded-lg transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] disabled:opacity-60"
      >
        {status === "submitting" ? "Joining..." : "Join Waitlist"}
      </button>
      {status === "created" && (
        <p className="text-sm text-green-500 sm:absolute sm:mt-14">You&apos;re on the list!</p>
      )}
      {status === "duplicate" && (
        <p className="text-sm text-do-text-secondary sm:absolute sm:mt-14">You&apos;re already on the list.</p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-500 sm:absolute sm:mt-14">Something went wrong. Try again.</p>
      )}
    </form>
  );
}
