"use client";

import { useEffect, useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const { signIn } = useAuthActions();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-4 px-6 bg-do-bg">
      <h1 className="text-4xl font-bold text-do-text">Writer Login</h1>
      <p className="text-sm text-do-text-secondary">
        Sign in as a selected writer account to create blog posts.
      </p>
      <form
        className="flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          setError(null);
          setSubmitting(true);
          const formData = new FormData(event.currentTarget);
          void signIn("password", formData)
            .catch((err: unknown) => {
              const message = err instanceof Error ? err.message : "Unable to continue.";
              setError(message);
            })
            .finally(() => {
              setSubmitting(false);
            });
        }}
      >
        <input
          className="rounded-md border border-do-border bg-transparent px-3 py-2 text-sm text-do-text"
          name="email"
          placeholder="Email"
          type="email"
          required
        />
        <input
          className="rounded-md border border-do-border bg-transparent px-3 py-2 text-sm text-do-text"
          name="password"
          placeholder="Password"
          type="password"
          minLength={8}
          required
        />
        <input name="flow" type="hidden" value={flow} />
        {isLoading ? <p className="text-sm text-do-text-secondary">Checking session...</p> : null}
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <button
          className="rounded-md bg-do-orange px-3 py-2 text-sm text-white disabled:opacity-60 hover:bg-do-orange-dark transition-colors"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Please wait..." : flow === "signIn" ? "Sign in" : "Create account"}
        </button>
      </form>
      <button
        className="w-fit text-sm text-do-orange underline"
        onClick={() => setFlow((current) => (current === "signIn" ? "signUp" : "signIn"))}
        type="button"
      >
        {flow === "signIn" ? "Need an account? Sign up" : "Already have an account? Sign in"}
      </button>
    </main>
  );
}
