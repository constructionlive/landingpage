import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/convexServer";
import EditPostLink from "@components/blog/EditPostLink";

const siteUrl = "https://www.construction.live";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog | construction.live",
  description:
    "Insights on construction AI, project management, and building technology from the construction.live team.",
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    title: "Blog | construction.live",
    description:
      "Insights on construction AI, project management, and building technology from the construction.live team.",
    type: "website",
    url: `${siteUrl}/blog`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | construction.live",
    description:
      "Insights on construction AI, project management, and building technology from the construction.live team.",
  },
};

function formatPublishDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  const [featuredPost, ...remainingPosts] = posts;

  return (
    <main className="min-h-screen px-6 py-12 md:px-8 md:py-14 bg-do-bg">
      <section className="relative overflow-hidden rounded-3xl border border-do-border/70 bg-do-bg-card do-blueprint-grid">
        <div className="relative mx-auto w-full max-w-7xl p-6 sm:p-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-mono text-do-orange uppercase tracking-wider mb-3">construction.live Knowledge Center</p>
              <h1 className="text-4xl md:text-5xl font-bold text-do-text">
                Blog Insights
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-do-text-secondary sm:text-base">
                Practical guidance on construction AI, project management, and building technology.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                className="rounded-md border border-do-border bg-do-bg-card/80 px-4 py-2 text-sm text-do-text transition hover:border-do-orange/50 hover:text-do-orange"
                href="/"
              >
                Back to home
              </Link>
              <Link
                className="rounded-md border border-do-orange/35 bg-do-orange/10 px-4 py-2 text-sm text-do-orange transition hover:border-do-orange/60 hover:bg-do-orange/15"
                href="/blog/new"
              >
                Write post
              </Link>
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="rounded-xl border border-do-border bg-do-bg-card/80 p-6">
              <p className="text-sm text-do-text-secondary">No posts yet.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {featuredPost ? (
                <article className="overflow-hidden rounded-2xl border border-do-border bg-do-bg-card/90">
                  <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="p-6 sm:p-8">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-do-orange">
                        Featured story
                      </p>
                      <h2 className="mt-3 text-3xl md:text-4xl font-bold leading-tight text-do-text">
                        {featuredPost.title}
                      </h2>
                      <p className="mt-4 text-xs text-do-text-secondary">
                        {formatPublishDate(featuredPost.publishedAt)} · By {featuredPost.authorName}
                      </p>
                      {featuredPost.excerpt ? (
                        <p className="mt-4 max-w-xl text-sm leading-relaxed text-do-text-secondary">
                          {featuredPost.excerpt}
                        </p>
                      ) : null}
                      <div className="mt-6 flex items-center gap-2">
                        <Link
                          className="inline-flex rounded-md border border-do-orange/35 bg-do-orange/10 px-4 py-2 text-sm text-do-orange transition hover:border-do-orange/60 hover:bg-do-orange/15"
                          href={`/blog/${featuredPost.slug}`}
                        >
                          Read article
                        </Link>
                        <EditPostLink
                          slug={featuredPost.slug}
                          authorId={featuredPost.authorId}
                          className="inline-flex rounded-md border border-do-border px-3 py-2 text-sm text-do-text-secondary transition hover:border-do-orange/50 hover:text-do-orange"
                        />
                      </div>
                    </div>
                    <div className="border-t border-do-border lg:border-l lg:border-t-0">
                      {featuredPost.coverImageUrl ? (
                        <img
                          src={featuredPost.coverImageUrl}
                          alt={featuredPost.title}
                          className="h-full min-h-64 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full min-h-64 items-center justify-center bg-do-bg-light/30 text-xs text-do-text-secondary">
                          No cover image
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ) : null}

              {remainingPosts.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {remainingPosts.map((post) => (
                    <article
                      className="group overflow-hidden rounded-xl border border-do-border bg-do-bg-card/90 transition-all duration-300 hover:-translate-y-0.5 hover:border-do-orange/40"
                      key={post._id}
                    >
                      {post.coverImageUrl ? (
                        <img
                          src={post.coverImageUrl}
                          alt={post.title}
                          className="h-48 w-full object-cover"
                        />
                      ) : null}
                      <div className="p-5">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-do-text-secondary">
                          {formatPublishDate(post.publishedAt)} · {post.authorName}
                        </p>
                        <Link
                          className="mt-2 block text-xl font-semibold leading-tight text-do-text transition group-hover:text-do-orange"
                          href={`/blog/${post.slug}`}
                        >
                          {post.title}
                        </Link>
                        {post.excerpt ? (
                          <p className="mt-3 text-sm leading-relaxed text-do-text-secondary">{post.excerpt}</p>
                        ) : null}
                        <div className="mt-4 flex items-center gap-3">
                          <Link
                            className="inline-block text-sm text-do-orange transition hover:underline"
                            href={`/blog/${post.slug}`}
                          >
                            Continue reading
                          </Link>
                          <EditPostLink
                            slug={post.slug}
                            authorId={post.authorId}
                            className="text-sm text-do-text-secondary transition hover:text-do-orange hover:underline"
                          />
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
