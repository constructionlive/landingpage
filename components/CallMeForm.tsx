"use client";

import { useState, useEffect, useCallback, FormEvent, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "convex/react";
import { Phone, X, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { api } from "../convex/_generated/api";

type Status =
  | "idle"
  | "submitting"
  | "queued"
  | "consent-required"
  | "duplicate"
  | "rate-limited"
  | "invalid"
  | "error";

interface CallMeFormProps {
  children: (props: { open: () => void }) => ReactNode;
  source?: string;
}

export default function CallMeForm({ children, source }: CallMeFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [projectName, setProjectName] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [submittedPhone, setSubmittedPhone] = useState("");
  const [retryInSeconds, setRetryInSeconds] = useState<number | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const requestCallback = useMutation(api.callbacks.requestCallback);

  const open = useCallback(() => {
    setIsOpen(true);
    setStatus("idle");
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      if (status === "queued") {
        setName("");
        setCompany("");
        setProjectName("");
        setPhone("");
        setConsent(false);
      }
      setStatus("idle");
      setRetryInSeconds(null);
    }, 300);
  }, [status]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!phone.trim()) return;

    if (!consent) {
      setStatus("consent-required");
      return;
    }

    // Normalize to E.164 client-side. Default to US if no country prefix.
    const parsed = parsePhoneNumberFromString(phone.trim(), "US");
    if (!parsed || !parsed.isValid()) {
      setStatus("invalid");
      return;
    }
    const e164 = parsed.number;

    setStatus("submitting");
    try {
      const result = await requestCallback({
        phone: e164,
        name: name.trim() || undefined,
        company: company.trim() || undefined,
        projectName: projectName.trim() || undefined,
        source,
        consent: true,
      });

      if (result.status === "queued") {
        setSubmittedPhone(parsed.formatInternational());
        setStatus("queued");
      } else if (result.status === "rate-limited") {
        setRetryInSeconds(result.retryInSeconds ?? null);
        setStatus("rate-limited");
      } else if (result.status === "invalid") {
        setStatus("invalid");
      } else if (result.status === "consent-required") {
        setStatus("consent-required");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <>
      {children({ open })}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              className="relative w-full max-w-md rounded-2xl border border-do-border bg-do-bg-card shadow-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={close}
                className="absolute top-4 right-4 h-8 w-8 rounded-lg text-do-text-muted hover:text-do-text hover:bg-do-bg-light flex items-center justify-center transition-colors"
                aria-label="Close"
                type="button"
              >
                <X className="h-4 w-4" />
              </button>

              {status !== "queued" ? (
                <form onSubmit={onSubmit} className="p-7 sm:p-8">
                  <div className="h-12 w-12 rounded-xl bg-do-orange/10 border border-do-orange/20 flex items-center justify-center mb-5">
                    <Phone className="h-5 w-5 text-do-orange" />
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-do-text mb-2 tracking-tight">
                    Have our AI call you
                  </h2>
                  <p className="text-sm text-do-text-secondary leading-relaxed mb-6">
                    Drop your number. Our AI calls you within 60 seconds so you
                    can leave a sample field update and see what gets documented.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label
                        htmlFor="cm-phone"
                        className="block text-xs font-mono text-do-text-muted uppercase tracking-wider mb-1.5"
                      >
                        Phone number
                      </label>
                      <input
                        id="cm-phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="+1 (555) 123-4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-do-border bg-do-bg text-do-text placeholder:text-do-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-do-orange focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="cm-name"
                          className="block text-xs font-mono text-do-text-muted uppercase tracking-wider mb-1.5"
                        >
                          Name <span className="text-do-text-muted/60">(optional)</span>
                        </label>
                        <input
                          id="cm-name"
                          type="text"
                          autoComplete="given-name"
                          placeholder="Your name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-do-border bg-do-bg text-do-text placeholder:text-do-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-do-orange focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="cm-company"
                          className="block text-xs font-mono text-do-text-muted uppercase tracking-wider mb-1.5"
                        >
                          Company <span className="text-do-text-muted/60">(optional)</span>
                        </label>
                        <input
                          id="cm-company"
                          type="text"
                          autoComplete="organization"
                          placeholder="Company"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-do-border bg-do-bg text-do-text placeholder:text-do-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-do-orange focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="cm-project"
                        className="block text-xs font-mono text-do-text-muted uppercase tracking-wider mb-1.5"
                      >
                        Project or site <span className="text-do-text-muted/60">(optional)</span>
                      </label>
                      <input
                        id="cm-project"
                        type="text"
                        placeholder="e.g. Tower B — Mechanical"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-do-border bg-do-bg text-do-text placeholder:text-do-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-do-orange focus:border-transparent"
                      />
                    </div>
                  </div>

                  <label className="mt-5 flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => {
                        setConsent(e.target.checked);
                        if (status === "consent-required" && e.target.checked) {
                          setStatus("idle");
                        }
                      }}
                      className="mt-0.5 h-4 w-4 rounded border border-do-border bg-do-bg text-do-orange focus:ring-2 focus:ring-do-orange focus:ring-offset-0"
                      required
                    />
                    <span className="text-xs text-do-text-secondary leading-relaxed">
                      I&apos;m requesting a call from construction.live and consent
                      to a brief AI-led conversation. Calls may be recorded for
                      quality and documentation.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={status === "submitting" || !phone.trim()}
                    className="mt-6 w-full px-6 py-3.5 text-sm font-medium text-white bg-do-orange hover:bg-do-orange-dark rounded-lg transition-all shadow-[0_0_30px_rgba(249,115,22,0.25)] hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {status === "submitting" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Calling you now...
                      </>
                    ) : (
                      <>
                        Call me now
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  {status === "consent-required" && (
                    <p className="mt-3 text-sm text-amber-600 dark:text-amber-400 text-center">
                      Please confirm consent above to proceed.
                    </p>
                  )}
                  {status === "duplicate" && (
                    <p className="mt-3 text-sm text-do-text-secondary text-center">
                      We already have your number on file. We&apos;ll be in touch shortly.
                    </p>
                  )}
                  {status === "rate-limited" && (
                    <p className="mt-3 text-sm text-do-text-secondary text-center">
                      We already requested a call to that number recently. Try
                      again in {retryInSeconds && retryInSeconds > 60
                        ? `${Math.ceil(retryInSeconds / 60)} minutes`
                        : `${retryInSeconds ?? 60} seconds`}.
                    </p>
                  )}
                  {status === "invalid" && (
                    <p className="mt-3 text-sm text-red-500 text-center">
                      Please enter a valid phone number with country code.
                    </p>
                  )}
                  {status === "error" && (
                    <p className="mt-3 text-sm text-red-500 text-center">
                      Something went wrong. Please try again.
                    </p>
                  )}

                  <p className="mt-5 text-[11px] text-do-text-muted text-center leading-relaxed">
                    No signup. No credit card. Hang up any time.
                  </p>
                </form>
              ) : (
                <div className="p-7 sm:p-8 text-center">
                  <div className="h-14 w-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="h-7 w-7 text-emerald-500" />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-do-text mb-2 tracking-tight">
                    Calling you now.
                  </h2>
                  <p className="text-sm text-do-text-secondary leading-relaxed mb-6">
                    Our AI is dialing <span className="text-do-text font-medium">{submittedPhone}</span> — please
                    answer. Talk through a real or sample field update — pour
                    progress, unexpected conditions, a delay — and see what comes
                    back.
                  </p>
                  <button
                    onClick={close}
                    type="button"
                    className="px-6 py-2.5 text-sm text-do-text-secondary hover:text-do-text border border-do-border hover:border-do-border-accent rounded-lg transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
