import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedPosts } from "@/lib/convexServer";
import EditPostLink from "@components/blog/EditPostLink";
import WritePostLink from "@components/blog/WritePostLink";
import RemoteImage from "@/components/RemoteImage";
import NewsletterSignup from "@/components/NewsletterSignup";
import SiteFooter from "@/components/home/SiteFooter";
import { SITE_URL as siteUrl } from "@/lib/site";
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
    <main className="min-h-screen bg-do-bg">
      <section className="relative mx-6 my-12 overflow-hidden rounded-3xl border border-do-border/70 bg-do-bg-card do-blueprint-grid md:mx-8 md:my-14">
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
              <WritePostLink className="rounded-md border border-do-orange/35 bg-do-orange/10 px-4 py-2 text-sm text-do-orange transition hover:border-do-orange/60 hover:bg-do-orange/15" />
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="rounded-xl border border-do-border bg-do-bg-card/80 p-6">
              <p className="text-sm text-do-text-secondary">No posts yet.</p>
            </div>
          ) : (
            <div className="space-y-8 sm:space-y-10">
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
                        /* The featured cover is the LCP element on this page,
                           so it loads eagerly with a high fetch priority
                           rather than lazily like the ones below the fold. */
                        <div className="relative aspect-[3/2] w-full overflow-hidden bg-white lg:aspect-auto lg:h-full lg:min-h-64">
                          <RemoteImage
                            src={featuredPost.coverImageUrl}
                            alt={featuredPost.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            priority
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="flex h-full min-h-64 items-center justify-center bg-do-bg-light/30 text-xs text-do-text-secondary">
                          No cover image
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              ) : null}

              <section className="rounded-2xl border border-do-orange/20 bg-do-bg-card/90 p-6 sm:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="lg:max-w-xl">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-do-orange">
                      Subscribe to updates
                    </p>
                    <h2 className="mt-2 text-2xl font-bold leading-tight text-do-text">
                      New posts, once a week
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-do-text-secondary">
                      What AI is actually doing to construction paperwork. No pitch, and
                      one click to leave.
                    </p>
                  </div>
                  <div className="w-full lg:w-[26rem] lg:shrink-0">
                    <NewsletterSignup variant="inline" location="blog_index" />
                  </div>
                </div>
              </section>

              {remainingPosts.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
                  {remainingPosts.map((post) => (
                    <article
                      className="group flex h-full flex-col overflow-hidden rounded-xl border border-do-border bg-do-bg-card/90 transition-all duration-300 hover:-translate-y-0.5 hover:border-do-orange/40"
                      key={post._id}
                    >
                      {post.coverImageUrl ? (
                        /* Covers are mostly 3:2 illustrated banners with words
                           baked into them, so they get a fixed 3:2 frame and
                           `contain` — cropping to fill lopped the headline off
                           the top of half of them. */
                        <div className="relative aspect-[3/2] w-full overflow-hidden border-b border-do-border bg-white">
                          <RemoteImage
                            src={post.coverImageUrl}
                            alt={post.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-contain"
                          />
                        </div>
                      ) : null}
                      <div className="flex flex-1 flex-col p-6">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-do-text-secondary">
                          {formatPublishDate(post.publishedAt)} · {post.authorName}
                        </p>
                        <Link
                          className="mt-2 block text-xl font-semibold leading-tight text-do-text transition line-clamp-2 group-hover:text-do-orange"
                          href={`/blog/${post.slug}`}
                        >
                          {post.title}
                        </Link>
                        {post.excerpt ? (
                          <p className="mt-3 text-sm leading-relaxed text-do-text-secondary line-clamp-3">
                            {post.excerpt}
                          </p>
                        ) : null}
                        <div className="mt-auto flex items-center gap-3 pt-5">
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
      <SiteFooter />
    </main>
  );
}
