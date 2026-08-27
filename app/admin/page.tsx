"use client";

import { useState } from "react";
import { useConvexAuth, useQuery } from "convex/react";
import Link from "next/link";
import { api } from "../../convex/_generated/api";

function formatSignupDate(timestamp: number) {
  return new Date(timestamp).toLocaleString();
}

/* The whole point of the register is getting the list back out to send from.
   Copying beats a CSV download here: the addresses go straight into the Bcc
   field of whatever is actually sending the issue.

   Only the currently-subscribed addresses are copied. Handing over a list that
   quietly includes people who opted out is how an unsubscribe stops meaning
   anything. */
function CopySubscribedButton({ emails }: { emails: string[] }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(emails.join(", "));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.warn("Could not copy the subscriber list", error);
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      disabled={emails.length === 0}
      className="rounded-md border border-do-border px-3 py-1.5 text-xs text-do-text hover:bg-do-bg-light/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {copied ? "Copied" : `Copy ${emails.length} subscribed`}
    </button>
  );
}

export default function AdminDashboardPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const me = useQuery(api.users.me, isAuthenticated ? {} : "skip");
  const isAdmin = me?.profile?.role === "admin";
  const dashboard = useQuery(api.earlyAccess.dashboard, isAdmin ? { limit: 200 } : "skip");
  const newsletter = useQuery(api.newsletter.dashboard, isAdmin ? { limit: 500 } : "skip");

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-12 bg-do-bg">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-do-text">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-do-text-secondary">Early access waitlist and the newsletter register.</p>
        </div>
        <Link className="rounded-md border border-do-border px-3 py-2 text-sm text-do-text hover:bg-do-bg-light/50 transition-colors" href="/">
          Back to site
        </Link>
      </div>

      {isLoading ? <p className="text-sm text-do-text-secondary">Checking session...</p> : null}

      {!isLoading && !isAuthenticated ? (
        <p className="text-sm text-red-500">You must be signed in to access this page.</p>
      ) : null}

      {!isLoading && isAuthenticated && me === undefined ? (
        <p className="text-sm text-do-text-secondary">Loading profile...</p>
      ) : null}

      {!isLoading && isAuthenticated && me && !isAdmin ? (
        <p className="text-sm text-red-500">Admin role is required to view this dashboard.</p>
      ) : null}

      {isAdmin && dashboard === undefined ? (
        <p className="text-sm text-do-text-secondary">Loading early access data...</p>
      ) : null}

      {isAdmin && dashboard ? (
        <>
          <section className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-do-border p-4 bg-do-bg-card">
              <p className="text-xs uppercase tracking-wide text-do-text-secondary">Total Loaded</p>
              <p className="mt-2 text-3xl font-semibold text-do-text">{dashboard.stats.totalLoaded}</p>
            </div>
            <div className="rounded-lg border border-do-border p-4 bg-do-bg-card">
              <p className="text-xs uppercase tracking-wide text-do-text-secondary">Last 24 Hours</p>
              <p className="mt-2 text-3xl font-semibold text-do-text">{dashboard.stats.last24Hours}</p>
            </div>
            <div className="rounded-lg border border-do-border p-4 bg-do-bg-card">
              <p className="text-xs uppercase tracking-wide text-do-text-secondary">Last 7 Days</p>
              <p className="mt-2 text-3xl font-semibold text-do-text">{dashboard.stats.last7Days}</p>
            </div>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-lg border border-do-border p-4 bg-do-bg-card">
              <h2 className="text-lg font-semibold text-do-text">Recent Signups</h2>
              <p className="mt-1 text-xs text-do-text-secondary">Showing newest first.</p>
              {dashboard.signups.length === 0 ? (
                <p className="mt-4 text-sm text-do-text-secondary">No signups yet.</p>
              ) : (
                <div className="mt-4 overflow-auto">
                  <table className="w-full min-w-[560px] border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-do-border text-left text-xs uppercase tracking-wide text-do-text-secondary">
                        <th className="py-2 pr-4">Email</th>
                        <th className="py-2 pr-4">Domain</th>
                        <th className="py-2 pr-4">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dashboard.signups.map((signup) => (
                        <tr className="border-b border-do-border/60" key={signup._id}>
                          <td className="py-2 pr-4 text-do-text">{signup.email}</td>
                          <td className="py-2 pr-4 text-do-text">{signup.normalizedEmail.split("@")[1] ?? "unknown"}</td>
                          <td className="py-2 pr-4 text-do-text-secondary">{formatSignupDate(signup.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="rounded-lg border border-do-border p-4 bg-do-bg-card">
              <h2 className="text-lg font-semibold text-do-text">Top Domains</h2>
              {dashboard.stats.topDomains.length === 0 ? (
                <p className="mt-4 text-sm text-do-text-secondary">No domain data yet.</p>
              ) : (
                <ul className="mt-4 space-y-2 text-sm">
                  {dashboard.stats.topDomains.map((item) => (
                    <li className="flex items-center justify-between gap-4" key={item.domain}>
                      <span className="truncate text-do-text">{item.domain}</span>
                      <span className="rounded-full border border-do-border px-2 py-0.5 text-xs text-do-text-secondary">{item.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </>
      ) : null}

      {isAdmin && newsletter ? (
        <section className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-do-text">Newsletter Register</h2>
              <p className="mt-1 text-sm text-do-text-secondary">
                Everyone who subscribed at /newsletter or from the site footer. This is the
                list to send an issue to.
              </p>
            </div>
            <CopySubscribedButton
              emails={newsletter.subscribers
                .filter((subscriber) => subscriber.status === "subscribed")
                .map((subscriber) => subscriber.email)}
            />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-do-border p-4 bg-do-bg-card">
              <p className="text-xs uppercase tracking-wide text-do-text-secondary">Subscribed</p>
              <p className="mt-2 text-3xl font-semibold text-do-text">{newsletter.stats.subscribed}</p>
            </div>
            <div className="rounded-lg border border-do-border p-4 bg-do-bg-card">
              <p className="text-xs uppercase tracking-wide text-do-text-secondary">Unsubscribed</p>
              <p className="mt-2 text-3xl font-semibold text-do-text">{newsletter.stats.unsubscribed}</p>
            </div>
            <div className="rounded-lg border border-do-border p-4 bg-do-bg-card">
              <p className="text-xs uppercase tracking-wide text-do-text-secondary">Last 24 Hours</p>
              <p className="mt-2 text-3xl font-semibold text-do-text">{newsletter.stats.last24Hours}</p>
            </div>
            <div className="rounded-lg border border-do-border p-4 bg-do-bg-card">
              <p className="text-xs uppercase tracking-wide text-do-text-secondary">Last 7 Days</p>
              <p className="mt-2 text-3xl font-semibold text-do-text">{newsletter.stats.last7Days}</p>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-do-border p-4 bg-do-bg-card">
            <h3 className="text-lg font-semibold text-do-text">Subscribers</h3>
            <p className="mt-1 text-xs text-do-text-secondary">Showing newest first.</p>
            {newsletter.subscribers.length === 0 ? (
              <p className="mt-4 text-sm text-do-text-secondary">No subscribers yet.</p>
            ) : (
              <div className="mt-4 overflow-auto">
                <table className="w-full min-w-[720px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-do-border text-left text-xs uppercase tracking-wide text-do-text-secondary">
                      <th className="py-2 pr-4">Email</th>
                      <th className="py-2 pr-4">Name</th>
                      <th className="py-2 pr-4">Company</th>
                      <th className="py-2 pr-4">Does</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newsletter.subscribers.map((subscriber) => (
                      <tr className="border-b border-do-border/60" key={subscriber._id}>
                        <td className="py-2 pr-4 text-do-text">{subscriber.email}</td>
                        <td className="py-2 pr-4 text-do-text-secondary">{subscriber.name ?? "—"}</td>
                        <td className="py-2 pr-4 text-do-text-secondary">{subscriber.company ?? "—"}</td>
                        <td className="py-2 pr-4 text-do-text-secondary">{subscriber.interest ?? "—"}</td>
                        <td className="py-2 pr-4">
                          <span
                            className={`rounded-full border px-2 py-0.5 text-xs ${
                              subscriber.status === "subscribed"
                                ? "border-do-orange/40 text-do-orange"
                                : "border-do-border text-do-text-muted"
                            }`}
                          >
                            {subscriber.status}
                          </span>
                        </td>
                        <td className="py-2 pr-4 text-do-text-secondary">{formatSignupDate(subscriber.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      ) : null}
    </main>
  );
}
