'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import RemoteImage from './RemoteImage'

type BlogPost = {
  _id: string
  slug: string
  title: string
  excerpt?: string
  coverImageUrl?: string
  publishedAt: number
  authorName: string
}

type BlogCarouselSectionProps = {
  posts: BlogPost[]
}

function truncate(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 1).trim()}...`
}

export default function BlogCarouselSection({ posts }: BlogCarouselSectionProps) {
  const sliderRef = useRef<HTMLDivElement | null>(null)

  const scrollByCard = (direction: 'left' | 'right') => {
    const slider = sliderRef.current
    if (!slider) return
    const cardWidth = Math.max(slider.clientWidth * 0.8, 320)
    slider.scrollBy({
      left: direction === 'right' ? cardWidth : -cardWidth,
      behavior: 'smooth',
    })
  }

  return (
    <section className="relative px-6 py-24 md:px-8 md:py-28 bg-do-bg-card do-blueprint-grid mx-4 md:mx-6 lg:mx-8 rounded-3xl border border-do-border/70 scroll-mt-24">
      <div className="relative max-w-7xl mx-auto">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-mono text-do-orange uppercase tracking-wider mb-3">From the Blog</p>
            <h2 className="text-3xl md:text-4xl font-bold text-do-text leading-tight">
              Construction Insights
            </h2>
          </div>
          <Link
            className="rounded-md border border-do-border bg-do-bg-card/80 px-4 py-2 text-sm text-do-text transition hover:border-do-orange/50 hover:text-do-orange"
            href="/blog"
          >
            View all posts
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="rounded-xl border border-do-border bg-do-bg-card/80 p-6">
            <p className="text-sm text-do-text-secondary">No blog posts yet. Check back soon.</p>
          </div>
        ) : (
          <>
            <div className="mb-5 flex justify-end gap-2">
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-do-border bg-do-bg-card/80 text-do-text transition hover:border-do-orange/50 hover:text-do-orange disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Scroll blog posts left"
                onClick={() => scrollByCard('left')}
                disabled={posts.length < 2}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-do-border bg-do-bg-card/80 text-do-text transition hover:border-do-orange/50 hover:text-do-orange disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Scroll blog posts right"
                onClick={() => scrollByCard('right')}
                disabled={posts.length < 2}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            <div
              ref={sliderRef}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {posts.map((post) => (
                <article
                  className="w-[min(22rem,88vw)] shrink-0 snap-start rounded-xl border border-do-border bg-do-bg-card/90 p-4"
                  key={post._id}
                >
                  {post.coverImageUrl ? (
                    <RemoteImage
                      src={post.coverImageUrl}
                      alt={post.title}
                      width={704}
                      height={352}
                      sizes="(max-width: 400px) 88vw, 22rem"
                      className="mb-4 h-44 w-full rounded-md object-cover"
                    />
                  ) : (
                    <div className="mb-4 flex h-44 w-full items-center justify-center rounded-md border border-do-border bg-do-bg/50 text-xs text-do-text-secondary">
                      No cover image
                    </div>
                  )}
                  <p className="text-[10px] font-mono uppercase tracking-widest text-do-text-secondary">
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </p>
                  <Link
                    className="mt-2 block text-xl font-semibold leading-tight text-do-text transition hover:text-do-orange"
                    href={`/blog/${post.slug}`}
                  >
                    {post.title}
                  </Link>
                  <p className="mt-2 text-xs text-do-text-secondary">By {post.authorName}</p>
                  {post.excerpt ? (
                    <p className="mt-3 text-sm text-do-text-secondary">{truncate(post.excerpt, 150)}</p>
                  ) : null}
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
