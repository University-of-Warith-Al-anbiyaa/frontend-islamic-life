import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, Expand, Home } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Reveal from "../components/Reveal";
import Lightbox from "../components/Lightbox";
import { useApp } from "../context/AppContext";
import { galleryPhotos } from "../config/gallery";

const ease = [0.16, 1, 0.3, 1] as const;

/** المسار الحقيقي للصفحة الرئيسية للمؤتمر العام (Route "/" → HomePage) */
const MAIN_CONFERENCE_PATH = "/";

/**
 * خلفية الـ Hero: فسيفساء من المعيّنات (على غرار صفحة معرض جامعة وارث الأنبياء).
 * شبكة مربعات مدوّرة 45° تُقصّ فيها الصور، والفواصل بينها تشكّل الخطوط القطرية.
 * نستخدم مجموعة مختارة من الصور تتكرر بإزاحة بحيث لا تتجاور الصورة نفسها.
 */
const MOSAIC_SIZE = 7;
const mosaicPhotos = [0, 2, 3, 5, 7, 9, 10, 12, 14, 16, 18, 20].map(
	(index) => galleryPhotos[index],
);
const mosaicTiles = Array.from({ length: MOSAIC_SIZE * MOSAIC_SIZE }, (_, i) => {
	const row = Math.floor(i / MOSAIC_SIZE);
	const col = i % MOSAIC_SIZE;
	return {
		photo: mosaicPhotos[(row * 5 + col) % mosaicPhotos.length],
		// ظهور متدرّج من مركز الشبكة إلى أطرافها
		delay:
			(Math.abs(row - (MOSAIC_SIZE - 1) / 2) +
				Math.abs(col - (MOSAIC_SIZE - 1) / 2)) *
			0.07,
	};
});

// صور بحجم مضاعف لكسر رتابة الشبكة. هذه المواضع مختارة لتمتلئ الشبكة (21 صورة)
// دون فراغات في الأعمدة 2 و3 و4؛ عند تغيير عدد الصور يجب إعادة اختيارها
const featuredIndexes = new Set([0, 4, 8, 12, 16]);
const isFeatured = (index: number) => featuredIndexes.has(index);

export default function GalleryPage() {
	const { t, lang } = useApp();
	const [active, setActive] = useState<number | null>(null);
	const [showTop, setShowTop] = useState(false);

	useEffect(() => {
		const originalTitle = document.title;
		document.title =
			lang === "ar"
				? "معرض الصور | مؤتمر الإسلام حياة"
				: "Photo Gallery | Islam is Life Conference";
		return () => {
			document.title = originalTitle;
		};
	}, [lang]);

	useEffect(() => {
		const onScroll = () => setShowTop(window.scrollY > 800);
		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const scrollToGrid = () =>
		document
			.getElementById("gallery-grid")
			?.scrollIntoView({ behavior: "smooth", block: "start" });

	return (
		<>
			<Navbar />
			<main>
				{/* ===== Hero ===== */}
				<section className="relative h-[400px] overflow-hidden bg-ink-950 sm:h-[420px] lg:h-[440px]">
					<div
						aria-hidden="true"
						className="gallery-mosaic [--tile:150px] sm:[--tile:200px] lg:[--tile:250px]"
					>
						{mosaicTiles.map((tile, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, scale: 0.85 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.9, ease, delay: tile.delay }}
								className="gallery-mosaic-tile"
							>
								<img src={tile.photo} alt="" />
							</motion.div>
						))}
					</div>

					{/* طبقة لونية كحلية فوق الفسيفساء لإبراز العنوان */}
					<div className="absolute inset-0 bg-ink-900/65" />
					<div className="absolute inset-0 bg-gradient-to-b from-ink-950/60 via-transparent to-ink-950/40" />

					<div className="relative z-10 flex h-full flex-col items-center justify-center px-5 pt-20 text-center">
						<motion.h1
							initial={{ opacity: 0, y: 16 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, ease, delay: 0.2 }}
							className="text-4xl font-light leading-tight text-paper drop-shadow-lg sm:text-5xl"
						>
							{t.galleryPage.title}
						</motion.h1>

						<motion.p
							initial={{ opacity: 0, y: 12 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, ease, delay: 0.35 }}
							className="mt-3 max-w-xl text-sm leading-relaxed text-paper/85 drop-shadow sm:text-base"
						>
							{t.galleryPage.description}
						</motion.p>

						<motion.div
							initial={{ opacity: 0, y: 12 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, ease, delay: 0.5 }}
							className="mt-5 flex flex-wrap items-center justify-center gap-2"
						>
							<button
								type="button"
								onClick={scrollToGrid}
								className="flex items-center gap-1.5 rounded border border-paper/90 px-3 py-1.5 text-sm text-paper transition-colors hover:border-gold-400 hover:bg-gold-500 hover:text-ink-950"
							>
								<ArrowDown size={15} />
								{t.galleryPage.browse}
							</button>
							<Link
								to={MAIN_CONFERENCE_PATH}
								className="flex items-center gap-1.5 rounded border border-paper/90 px-3 py-1.5 text-sm text-paper transition-colors hover:border-gold-400 hover:bg-gold-500 hover:text-ink-950"
							>
								<Home size={15} />
								{t.galleryPage.home}
							</Link>
							<span className="flex items-center gap-1.5 rounded border border-gold-400/70 px-3 py-1.5 text-sm text-gold-300">
								<span className="font-semibold tabular-nums">
									{galleryPhotos.length}
								</span>
								{t.galleryPage.photosCount}
							</span>
						</motion.div>
					</div>
				</section>

				{/* ===== شبكة الصور ===== */}
				<section
					id="gallery-grid"
					className="scroll-mt-24 px-5 py-20 lg:px-10 lg:py-28"
				>
					<div className="mx-auto max-w-7xl">
						<Reveal>
							<div className="flex flex-wrap items-end justify-between gap-6">
								<div className="max-w-xl">
									<div className="flex items-center gap-2">
										<span className="h-1 w-10 -skew-x-[30deg] bg-gold-500" />
										<span className="h-1 w-4 -skew-x-[30deg] bg-gold-500/50" />
									</div>
									<h2 className="mt-4 font-display text-3xl text-ink-900 dark:text-paper sm:text-4xl">
										{t.galleryPage.gridTitle}
									</h2>
									<p className="mt-3 text-base text-slate-ink dark:text-ink-200">
										{t.galleryPage.gridSubtitle}
									</p>
								</div>
								<Link
									to={MAIN_CONFERENCE_PATH}
									className="flex items-center gap-2 rounded-full border border-ink-900/15 px-5 py-2.5 text-sm font-medium text-ink-900 transition-colors hover:border-gold-500 hover:text-gold-600 dark:border-paper/20 dark:text-paper dark:hover:text-gold-300"
								>
									<Home size={16} />
									{t.galleryPage.home}
								</Link>
							</div>
						</Reveal>

						<div className="mt-12 grid grid-flow-dense grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
							{galleryPhotos.map((photo, index) => (
								<motion.button
									key={photo}
									type="button"
									onClick={() => setActive(index)}
									aria-label={`${t.galleryPage.openPhoto} ${index + 1}`}
									initial={{ opacity: 0, y: 24 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true, margin: "-40px" }}
									transition={{ duration: 0.6, ease, delay: (index % 4) * 0.06 }}
									className={`gallery-card group relative block aspect-[3/2] overflow-hidden bg-ink-100 dark:bg-ink-900 ${
										isFeatured(index) ? "col-span-2 row-span-2" : ""
									}`}
								>
									<img
										src={photo}
										alt=""
										loading="lazy"
										decoding="async"
										className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
									/>
									<span className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-ink-950/0 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
									<span className="absolute bottom-3 start-3 flex items-center gap-2 text-xs font-medium text-paper opacity-0 transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
										<span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500 text-ink-950">
											<Expand size={14} />
										</span>
										<span dir="ltr" className="tabular-nums">
											{String(index + 1).padStart(2, "0")}
										</span>
									</span>
								</motion.button>
							))}
						</div>
					</div>
				</section>
			</main>
			<Footer />

			<Lightbox
				photos={galleryPhotos}
				index={active}
				onClose={() => setActive(null)}
				onChange={setActive}
			/>

			{showTop && (
				<button
					onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
					aria-label={t.ui.backToTop}
					className="fixed bottom-6 end-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-gold-500 text-ink-950 shadow-lg transition-transform hover:-translate-y-0.5"
				>
					<ArrowUp size={18} />
				</button>
			)}
		</>
	);
}
