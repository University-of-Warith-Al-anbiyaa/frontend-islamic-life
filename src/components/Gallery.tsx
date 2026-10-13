import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { useApp } from "../context/AppContext";
import Reveal from "./Reveal";
import HighlightedConferenceText from "./HighlightedConferenceText";
import Lightbox from "./Lightbox";
import { galleryPhotos as photos } from "../config/gallery";
import { SectionHeading, StarPattern } from "./home/kit";

export default function Gallery() {
	const { t } = useApp();
	const [active, setActive] = useState<number | null>(null);
	const [carouselIndex, setCarouselIndex] = useState(0);
	const [trackOffset, setTrackOffset] = useState(0);
	const [lastIndex, setLastIndex] = useState(photos.length - 1);
	const galleryRef = useRef<HTMLDivElement>(null);
	const firstPhotoRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		const timer = window.setTimeout(() => {
			setCarouselIndex((index) => (index >= lastIndex ? 0 : index + 1));
		}, 5000);
		return () => window.clearTimeout(timer);
	}, [carouselIndex, lastIndex]);

	useEffect(() => {
		const updateGallery = () => {
			const gallery = galleryRef.current;
			const firstPhoto = firstPhotoRef.current;
			if (!gallery || !firstPhoto) return;

			const styles = window.getComputedStyle(gallery);
			const gap = Number.parseFloat(styles.columnGap) || 0;
			const step = firstPhoto.getBoundingClientRect().width + gap;
			const visiblePhotos = Math.max(
				1,
				Math.floor((gallery.clientWidth + gap) / step),
			);
			setTrackOffset(step);
			setLastIndex(Math.max(0, photos.length - visiblePhotos));
		};

		updateGallery();
		const observer = new ResizeObserver(updateGallery);
		if (galleryRef.current) observer.observe(galleryRef.current);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		if (carouselIndex > lastIndex) setCarouselIndex(lastIndex);
	}, [carouselIndex, lastIndex]);

	const showNext = () =>
		setCarouselIndex((index) => (index >= lastIndex ? 0 : index + 1));
	const showPrevious = () =>
		setCarouselIndex((index) => (index <= 0 ? lastIndex : index - 1));

	return (
		<section className="relative overflow-hidden bg-ink-900 px-5 py-24 lg:px-10 lg:py-32">
			<StarPattern className="text-gold-300/[0.07]" />

			<div className="relative mx-auto max-w-7xl">
				<Reveal>
					<SectionHeading
						tone="dark"
						title={t.gallery.title}
						lead={<HighlightedConferenceText text={t.gallery.subtitle} />}
					/>
				</Reveal>

				<div className="relative mt-14 px-1 sm:px-2" dir="ltr">
					<motion.div ref={galleryRef} className="overflow-hidden py-2">
						<motion.div
							animate={{ x: -(carouselIndex * trackOffset) }}
							transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
							className="flex gap-4"
						>
							{photos.map((photo, index) => (
								<button
									key={photo}
									ref={index === 0 ? firstPhotoRef : undefined}
									onClick={() => setActive(index)}
									className="group relative block aspect-[4/3] w-full shrink-0 overflow-hidden rounded-2xl border border-gold-400/20 shadow-lg shadow-black/30 transition-colors duration-300 hover:border-gold-400/70 sm:basis-[calc((100%-1rem)/2)] md:basis-[calc((100%-2rem)/3)] lg:basis-[calc((100%-3rem)/4)]"
								>
									<img
										src={photo}
										alt=""
										className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
									/>
									<span className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-ink-950/70 via-ink-950/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
										<span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-500 text-ink-950 shadow-lg">
											<ZoomIn size={22} />
										</span>
									</span>
								</button>
							))}
						</motion.div>
					</motion.div>
				</div>

				<div
					className="mx-auto mt-8 flex max-w-xl items-center gap-4"
					dir="ltr"
				>
					<button
						type="button"
						onClick={showPrevious}
						aria-label={t.gallery.previous}
						className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-400/50 text-gold-300 transition-colors hover:bg-gold-500 hover:text-ink-950 sm:h-12 sm:w-12"
					>
						<ChevronLeft size={22} strokeWidth={2.2} />
					</button>
					<div
						aria-hidden="true"
						className="h-1 flex-1 overflow-hidden rounded-full bg-paper/15"
					>
						<div
							className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-300 transition-all duration-500"
							style={{
								width: `${((carouselIndex + 1) / (lastIndex + 1)) * 100}%`,
							}}
						/>
					</div>
					<button
						type="button"
						onClick={showNext}
						aria-label={t.gallery.next}
						className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold-400/50 text-gold-300 transition-colors hover:bg-gold-500 hover:text-ink-950 sm:h-12 sm:w-12"
					>
						<ChevronRight size={22} strokeWidth={2.2} />
					</button>
				</div>
			</div>

			<Lightbox
				photos={photos}
				index={active}
				onClose={() => setActive(null)}
				onChange={setActive}
			/>
		</section>
	);
}
