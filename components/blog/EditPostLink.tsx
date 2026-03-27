"use client";

import Link from "next/link";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function EditPostLink({
  slug,
  authorId,
  className,
}: {
  slug: string;
  authorId: string;
  className?: string;
}) {
  const { isAuthenticated } = useConvexAuth();
  const me = useQuery(api.users.me, isAuthenticated ? {} : "skip");

  if (!me) return null;

  const role = me.profile?.role;
  const isWriter = role === "writer" || role === "admin";
  const isOwner = me.id === authorId;
  if (!isWriter || (!isOwner && role !== "admin")) return null;

  return (
    <Link
      href={`/blog/${slug}/edit`}
      className={
        className ??
        "rounded-md border border-do-border bg-do-bg-card/80 px-3 py-2 text-sm text-do-text transition hover:border-do-orange/50 hover:text-do-orange"
      }
    >
      Edit post
    </Link>
  );
}
