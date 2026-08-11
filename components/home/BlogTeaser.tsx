"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, BookOpen } from "lucide-react";

type BlogPost = {
	_id: string;
	slug: string;
	title: string;
	excerpt?: string;
	coverImageUrl?: string;
	publishedAt: number;
	authorName: string;
};

/* Posts are passed in rather than queried here, the Convex client is currently
   disabled on the marketing pages. Pass `posts` once it's wired back up and the
   card grid takes over from the empty state. */
export default function BlogTeaser({ posts = [] }: { posts?: BlogPost[] }) {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-80px" });
	const teasers = posts.slice(0, 3);

	return (
		<section id="resources" className="relative py-24 overflow-hidden bg-do-bg">
			<div className="absolute inset-0 do-blueprint-grid pointer-events-none opacity-60" />

			<div className="relative z-10 max-w-6xl mx-auto px-6" ref={ref}>
				<motion.div
					className="flex flex-wrap items-end justify-between gap-4 mb-10"
					initial={{ opacity: 0, y: 25 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6 }}
				>
					<div>
						<span className="do-section-label text-do-orange">Resources</span>
						<h2 className="text-3xl md:text-4xl font-bold text-do-text mt-4 tracking-tight">
							From the blog
						</h2>
					</div>
					<a
						href="/blog"
						className="group inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-do-text-secondary hover:text-do-text border border-do-border hover:border-do-border-accent rounded-xl transition-all"
					>
						View all posts
						<ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
					</a>
				</motion.div>

				{teasers.length > 0 ? (
					<div className="grid md:grid-cols-3 gap-6">
						{teasers.map((post, i) => (
							<motion.a
								key={post._id}
								href={`/blog/${post.slug}`}
								className="group rounded-2xl border border-do-border bg-do-bg-card/60 overflow-hidden hover:border-do-border-accent transition-all hover:-translate-y-1"
								initial={{ opacity: 0, y: 25 }}
								animate={inView ? { opacity: 1, y: 0 } : {}}
								transition={{ delay: i * 0.1, duration: 0.5 }}
							>
								{post.coverImageUrl ? (
									/* eslint-disable-next-line @next/next/no-img-element */
									<img
										src={post.coverImageUrl}
										alt={post.title}
										className="h-44 w-full object-cover"
										loading="lazy"
									/>
								) : (
									<div className="h-44 w-full flex items-center justify-center bg-do-bg-light/60 border-b border-do-border">
										<BookOpen className="h-7 w-7 text-do-text-muted" />
									</div>
								)}
								<div className="p-5">
									<p className="text-[10px] font-mono uppercase tracking-widest text-do-text-muted mb-2">
										{new Date(post.publishedAt).toLocaleDateString()}
									</p>
									<h3 className="text-lg font-semibold text-do-text leading-snug group-hover:text-do-orange transition-colors">
										{post.title}
									</h3>
									{post.excerpt && (
										<p className="mt-2 text-sm text-do-text-secondary leading-relaxed line-clamp-3">
											{post.excerpt}
										</p>
									)}
								</div>
							</motion.a>
						))}
					</div>
				) : (
					<motion.a
						href="/blog"
						className="group flex flex-col sm:flex-row items-start sm:items-center gap-5 rounded-2xl border border-do-border bg-do-bg-card/60 p-7 md:p-9 hover:border-do-border-accent transition-colors"
						initial={{ opacity: 0, y: 20 }}
						animate={inView ? { opacity: 1, y: 0 } : {}}
						transition={{ delay: 0.15, duration: 0.5 }}
					>
						<div className="h-12 w-12 rounded-xl bg-do-orange/10 border border-do-orange/20 flex items-center justify-center shrink-0">
							<BookOpen className="h-5 w-5 text-do-orange" />
						</div>
						<div className="flex-1">
							<h3 className="text-lg font-semibold text-do-text mb-1.5">
								We write about the paperwork side of construction
							</h3>
							<p className="text-sm text-do-text-secondary leading-relaxed">
								Change orders, delay claims, submittal chaos and what it actually
								takes to get paid for the work you did. Read the latest on the blog.
							</p>
						</div>
						<ArrowRight className="h-5 w-5 text-do-orange group-hover:translate-x-1 transition-transform shrink-0" />
					</motion.a>
				)}
			</div>
		</section>
	);
}
