import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
	ArrowDown,
	CalendarDays,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { HeroGeometry } from "./Hero";
import { StarPattern } from "./home/kit";

const ease = [0.16, 1, 0.3, 1] as const;
const heroImages = [
	"/الامام الحسين(ع).jpg",
	"/معرض4.jpg",
	"/معرض3.jpg",
	"/معرض2.jpg",
];
const AUTOPLAY_MS = 5000;

export default function SeventhHero() {
	const { t, lang, openSubmission } = useApp();
	const [index, setIndex] = useState(0);
	const content = t.seventhConference;
	const isAr = lang === "ar";

	useEffect(() => {
		const id = setTimeout(() => {
			setIndex((i) => (i + 1) % heroImages.length);
		}, AUTOPLAY_MS);
		return () => clearTimeout(id);
	}, [index]);

	const scrollTo = (id: string) =>
		document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

	return (
		<section
			id="seventh-hero"
			className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-ink-950"
		>
			<AnimatePresence mode="sync">
				<motion.div
					key={index}
					className="absolute inset-0 bg-cover bg-center"
					initial={{ opacity: 0, scale: 1.06 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 1.2, ease }}
					style={{ backgroundImage: `url('${heroImages[index]}')` }}
				/>
			</AnimatePresence>

			{/* طبقات التعتيم: أعلى لشريط التنقل، جانبية لوضوح النص، وسفلية لدمج الصورة مع الشريط */}
			<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,15,31,0.7)_0%,rgba(10,15,31,0.25)_22%,rgba(10,15,31,0.55)_55%,rgba(10,15,31,0.97)_100%)]" />
			<div className="absolute inset-0 from-ink-950/80 via-ink-950/35 to-transparent ltr:bg-gradient-to-r rtl:bg-gradient-to-l" />
			<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,166,92,0.16),_transparent_62%)]" />
			<StarPattern className="text-gold-300/[0.07]" />
			<HeroGeometry />

			<div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-40 pt-32 sm:pt-40 lg:px-10 lg:pb-52 lg:pt-44">
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, ease }}
					className="inline-flex max-w-full items-center gap-3 rounded-2xl border border-gold-400/35 bg-ink-950/50 px-4 py-2 text-xs font-semibold leading-relaxed text-gold-200 backdrop-blur-md sm:rounded-full sm:text-sm"
				>
					<span className="relative flex h-2 w-2 shrink-0">
						<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400/70 motion-reduce:hidden" />
						<span className="relative inline-flex h-2 w-2 rounded-full bg-gold-400" />
					</span>
					<span>{content.editionBadge}</span>
				</motion.div>

				<motion.p
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.7, ease, delay: 0.1 }}
					className="mt-8 flex max-w-2xl items-center gap-3 text-sm font-medium leading-relaxed text-gold-300 sm:text-base"
				>
					<span className="h-px w-10 shrink-0 bg-gold-400/70" />
					{content.eyebrow}
				</motion.p>

				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease, delay: 0.2 }}
					className="font-display mt-4 max-w-4xl text-4xl leading-[1.15] text-paper sm:text-5xl lg:text-6xl"
				>
					{isAr ? (
						<>
							مؤتمر <span className="text-green-400">الإسلام حياة</span> العلمي
							السابع
						</>
					) : (
						content.editionTitle
					)}
				</motion.h1>

				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease, delay: 0.3 }}
					className="mt-8 max-w-4xl border-s-2 border-gold-400/70 ps-5 sm:ps-7"
				>
					{isAr && (
						<p className="font-sans text-base font-medium leading-relaxed text-paper/80 sm:text-lg">
							الموسوم بـ
						</p>
					)}
					<h2 className="font-display mt-1 text-xl leading-relaxed text-gold-300 sm:text-2xl lg:text-3xl">
						«{content.themeTitle}»
					</h2>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, ease, delay: 0.5 }}
					className="mt-10 flex flex-wrap items-center gap-4"
				>
					<button
						onClick={openSubmission}
						className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-gold-300 to-gold-500 px-7 py-3.5 text-sm font-bold text-ink-950 shadow-[0_12px_32px_-10px_rgba(201,166,92,0.8)] transition-all hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-10px_rgba(201,166,92,0.9)] sm:text-base"
					>
						{content.ctaPrimary}
						{isAr ? (
							<ChevronLeft
								size={18}
								className="transition-transform group-hover:-translate-x-0.5"
							/>
						) : (
							<ChevronRight
								size={18}
								className="transition-transform group-hover:translate-x-0.5"
							/>
						)}
					</button>

					<button
						onClick={() => scrollTo("rules")}
						className="rounded-full border border-paper/30 bg-paper/5 px-7 py-3.5 text-sm font-semibold text-paper backdrop-blur-sm transition-colors hover:border-gold-400/70 hover:bg-paper/10 sm:text-base"
					>
						{content.ctaRules}
					</button>

					<button
						onClick={() => scrollTo("committees")}
						className="rounded-full border border-paper/30 bg-paper/5 px-7 py-3.5 text-sm font-semibold text-paper backdrop-blur-sm transition-colors hover:border-gold-400/70 hover:bg-paper/10 sm:text-base"
					>
						{content.ctaCommittees}
					</button>
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.8, delay: 0.7 }}
					className="mt-10 inline-flex max-w-full items-center gap-3 rounded-2xl border border-paper/15 bg-paper/5 px-4 py-2.5 text-sm text-ink-100 backdrop-blur-md"
				>
					<CalendarDays size={18} className="shrink-0 text-gold-400" />
					{content.dateLine}
				</motion.div>
			</div>

			<button
				onClick={() => scrollTo("info")}
				aria-label="scroll down"
				className="absolute bottom-[4.5rem] left-1/2 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-paper/25 bg-ink-950/30 text-paper/80 backdrop-blur-sm transition-colors hover:border-gold-400 hover:text-gold-300 lg:bottom-[8.5rem]"
			>
				<motion.span
					animate={{ y: [0, 4, 0] }}
					transition={{ duration: 1.8, repeat: Infinity }}
					className="block"
				>
					<ArrowDown size={18} />
				</motion.span>
			</button>
		</section>
	);
}
