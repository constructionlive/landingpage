import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/convexServer";
import EditPostLink from "@components/blog/EditPostLink";
import JsonLd from "@/components/JsonLd";
import RemoteImage from "@/components/RemoteImage";
import NewsletterSignup from "@/components/NewsletterSignup";
import SiteFooter from "@/components/home/SiteFooter";
import { SITE_URL as siteUrl, absoluteUrl } from "@/lib/site";
import {
  ORGANIZATION_ID,
  WEBSITE_ID,
  breadcrumbSchema,
  graph,
} from "@/lib/schema";
export const dynamic = "force-dynamic";

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function truncate(text: string, max = 160) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trim()}...`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return {
      title: "Post Not Found | construction.live Blog",
      robots: { index: false, follow: true },
    };
  }

  const fallbackDescription = truncate(post.excerpt?.trim() || stripHtml(post.content));
  const description = post.metaDescription || fallbackDescription;
  const pageTitle = post.metaTitle || post.title;
  const canonicalUrl = post.canonicalUrl || `${siteUrl}/blog/${post.slug}`;

  const ogImage = post.ogImageUrl || post.coverImageUrl;
  const twImage = post.twitterImageUrl || ogImage;

  return {
    title: `${pageTitle} | construction.live Blog`,
    description,
    ...(post.metaKeywords && {
      keywords: post.metaKeywords.split(",").map((k: string) => k.trim()),
    }),
    ...(post.noIndex && {
      robots: { index: false, follow: true },
    }),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.ogTitle || pageTitle,
      description: post.ogDescription || description,
      type: "article",
      url: canonicalUrl,
      publishedTime: new Date(post.publishedAt).toISOString(),
      modifiedTime: new Date(post.updatedAt).toISOString(),
      authors: [post.authorName],
      images: ogImage ? [{ url: ogImage, alt: post.ogTitle || pageTitle }] : undefined,
    },
    twitter: {
      card: post.twitterCard || (twImage ? "summary_large_image" : "summary"),
      title: post.twitterTitle || post.ogTitle || pageTitle,
      description: post.twitterDescription || post.ogDescription || description,
      images: twImage ? [twImage] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    notFound();
  }

  const fallbackDesc = truncate(post.excerpt?.trim() || stripHtml(post.content));
  const description = post.metaDescription || fallbackDesc;
  const canonicalUrl = post.canonicalUrl || `${siteUrl}/blog/${post.slug}`;
  const articleSchema = {
    "@type": "Article",
    headline: post.metaTitle || post.title,
    description,
    image: post.ogImageUrl || post.coverImageUrl ? [post.ogImageUrl || post.coverImageUrl] : undefined,
    datePublished: new Date(post.publishedAt).toISOString(),
    dateModified: new Date(post.updatedAt).toISOString(),
    author: {
      "@type": "Person",
      name: post.authorName,
    },
    /* Points at the Organization node the root layout emits, so the logo,
       legalName and sameAs links come along without being repeated here.
       Google's Article guidance wants that logo present. */
    publisher: { "@id": ORGANIZATION_ID },
    isPartOf: { "@id": WEBSITE_ID },
    mainEntityOfPage: canonicalUrl,
  };

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: absoluteUrl("/") },
    { name: "Blog", url: absoluteUrl("/blog") },
    { name: post.title, url: canonicalUrl },
  ]);

  return (
    <main className="min-h-screen bg-do-bg">
      <section className="relative mx-6 my-12 overflow-hidden rounded-3xl border border-do-border/70 bg-do-bg-card do-blueprint-grid md:mx-8 md:my-14">
        <article className="relative mx-auto w-full max-w-4xl p-6 sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Link
                className="rounded-md border border-do-border bg-do-bg-card/80 px-3 py-2 text-sm text-do-text transition hover:border-do-orange/50 hover:text-do-orange"
                href="/blog"
              >
                Back to blog
              </Link>
              <EditPostLink slug={post.slug} authorId={post.authorId} />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-do-orange">construction.live Article</p>
          </div>

          <header className="rounded-2xl border border-do-border bg-do-bg-card/85 p-5 sm:p-7">
            <h1 className="text-3xl md:text-5xl font-bold leading-tight text-do-text">
              {post.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-do-border bg-do-bg/70 px-3 py-1 text-[11px] text-do-text-secondary">
                Published {new Date(post.publishedAt).toLocaleDateString()}
              </span>
              <span className="rounded-full border border-do-border bg-do-bg/70 px-3 py-1 text-[11px] text-do-text-secondary">
                Updated {new Date(post.updatedAt).toLocaleDateString()}
              </span>
              <span className="rounded-full border border-do-orange/30 bg-do-orange/10 px-3 py-1 text-[11px] text-do-orange">
                Written by {post.authorName}
              </span>
            </div>
            {post.excerpt ? (
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-do-text-secondary sm:text-base">
                {post.excerpt}
              </p>
            ) : null}
          </header>

          {post.coverImageUrl ? (
            /* The post's LCP element. Eager, not lazy. */
            <RemoteImage
              src={post.coverImageUrl}
              alt={post.title}
              width={1600}
              height={900}
              sizes="(max-width: 896px) 100vw, 896px"
              priority
              className="mt-6 h-72 w-full rounded-2xl border border-do-border object-cover sm:h-96"
            />
          ) : null}

          <section className="mt-6 rounded-2xl border border-do-border bg-do-bg-card/90 p-5 sm:p-7">
            {/<[a-z][\s\S]*>/i.test(post.content) ? (
              <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
            ) : (
              <div className="whitespace-pre-wrap text-base leading-8 text-do-text">{post.content}</div>
            )}
          </section>

          <section className="mt-8 rounded-2xl border border-do-border bg-do-bg-card/90 p-5 sm:p-6">
            <p className="text-xs font-mono text-do-orange uppercase tracking-wider">Written by</p>
            <div className="mt-4 flex items-start gap-3">
              {post.authorImageUrl ? (
                <RemoteImage
                  src={post.authorImageUrl}
                  alt={post.authorName}
                  width={96}
                  height={96}
                  sizes="48px"
                  className="h-12 w-12 rounded-full border border-do-border object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-do-border bg-do-bg text-sm font-semibold text-do-text">
                  {post.authorName.slice(0, 1).toUpperCase()}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-do-text">{post.authorName}</p>
                {post.authorBio ? (
                  <p className="mt-1 text-sm text-do-text-secondary">{post.authorBio}</p>
                ) : (
                  <p className="mt-1 text-sm text-do-text-secondary">
                    This author has not added a bio yet.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Someone who reached the end of an article is the most likely
              subscriber on the site, so this asks the full set of questions
              rather than the footer's one-liner. autoFocus is off: the card on
              /newsletter takes focus because that page exists to be filled in,
              but doing that here would scroll the reader past the article they
              just opened. */}
          <section className="mt-10 rounded-2xl border border-do-orange/20 bg-do-bg-card/90 p-6 sm:p-8">
            <p className="font-mono text-[10px] uppercase tracking-widest text-do-orange">
              Get the next one
            </p>
            <h2 className="mt-3 text-2xl font-bold leading-tight text-do-text sm:text-3xl">
              One email a week on what AI is actually doing to construction paperwork
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-do-text-secondary">
              What works on real jobs, what still doesn&apos;t, and what changed in the
              tools. No pitch, and one click to leave.
            </p>
            <div className="mt-7">
              <NewsletterSignup
                variant="card"
                location="blog_post_footer"
                autoFocus={false}
              />
            </div>
          </section>

          <div className="mt-8">
            <Link
              className="inline-flex rounded-md border border-do-orange/35 bg-do-orange/10 px-4 py-2 text-sm text-do-orange transition hover:border-do-orange/60 hover:bg-do-orange/15"
              href="/blog"
            >
              View all posts
            </Link>
          </div>
        </article>
      </section>
      <JsonLd schema={graph(articleSchema, breadcrumbs)} />
      <SiteFooter />
    </main>
  );
}
