"use client";

import Image, { type StaticImageData } from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

/* Full-bleed photograph used as a break between homepage sections.

   Text sits on the photo, so the colours here are fixed rather than themed:
   white type over a scrim that darkens the bottom of the frame. The do-* text
   tokens flip with the theme and would go near-black on the photo in light
   mode, which is why this is the one component on the page that hardcodes.

   The image is decorative in the sense that the caption carries the meaning,
   but it is still a real photograph of the work, so it gets a described alt
   rather than an empty one. */

interface PhotoBandProps {
	image: StaticImageData;
	alt: string;
	label: string;
	headline: string;
	/* object-position, for frames whose subject is not in the middle. */
	focus?: string;
}

export default function PhotoBand({
	image,
	alt,
	label,
	headline,
	focus = "center",
}: PhotoBandProps) {
	const ref = useRef(null);
	const inView = useInView(ref, { once: true, margin: "-60px" });

	return (
		<section
			ref={ref}
			className="relative h-[300px] md:h-[400px] lg:h-[460px] overflow-hidden border-y border-do-border bg-do-bg-card"
		>
			<Image
				src={image}
				alt={alt}
				fill
				placeholder="blur"
				sizes="100vw"
				className="object-cover"
				style={{ objectPosition: focus }}
			/>

			{/* Two scrims: one up from the bottom so the caption always has contrast,
			    one from the left so it holds on wide screens where the caption sits
			    far from the bottom edge. */}
			<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
			<div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-transparent" />

			<div className="absolute inset-0 flex items-end">
				<div className="w-full max-w-6xl mx-auto px-6 pb-9 md:pb-12">
					<motion.div
						initial={{ opacity: 0, y: 22 }}
						animate={inView ? { opacity: 1, y: 0 } : {}}
						transition={{ duration: 0.6 }}
						className="max-w-2xl"
					>
						<span className="do-section-label text-do-orange inline-flex items-center gap-2">
							<span className="h-1.5 w-1.5 rounded-full bg-do-orange" />
							{label}
						</span>
						<p className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mt-3 tracking-tight leading-[1.15] text-balance drop-shadow-sm">
							{headline}
						</p>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
