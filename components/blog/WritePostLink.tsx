"use client";

import Link from "next/link";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function WritePostLink({ className }: { className?: string }) {
  const { isAuthenticated } = useConvexAuth();
  const me = useQuery(api.users.me, isAuthenticated ? {} : "skip");

  if (!me) return null;

  const role = me.profile?.role;
  const isWriter = role === "writer" || role === "admin";
  if (!isWriter) return null;

  return (
    <Link
      href="/blog/new"
      className={
        className ??
        "rounded-md border border-do-orange/35 bg-do-orange/10 px-4 py-2 text-sm text-do-orange transition hover:border-do-orange/60 hover:bg-do-orange/15"
      }
    >
      Write post
    </Link>
  );
}
