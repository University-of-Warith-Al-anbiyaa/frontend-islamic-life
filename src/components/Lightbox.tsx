import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext";

interface LightboxProps {
	photos: readonly string[];
	index: number | null;
	onClose: () => void;
	onChange: (index: number) => void;
}

/** عارض صور مشترك: إغلاق، سابق/تالي، أسهم لوحة المفاتيح، Escape، سحب باللمس، ومنع تمرير الخلفية */
export default function Lightbox({
	photos,
	index,
	onClose,
	onChange,
}: LightboxProps) {
	const { t } = useApp();
	const isRtl = t.dir === "rtl";
	const closeRef = useRef<HTMLButtonElement>(null);
	const touchStartX = useRef<number | null>(null);
	const isOpen = index !== null;

	const next = () => {
		if (index !== null) onChange((index + 1) % photos.length);
	};
	const prev = () => {
		if (index !== null) onChange((index - 1 + photos.length) % photos.length);
	};

	// مراجع ثابتة حتى لا يُعاد ربط مستمع لوحة المفاتيح عند كل تنقل
	const handlers = useRef({ next, prev, onClose });
	handlers.current = { next, prev, onClose };

	useEffect(() => {
		if (!isOpen) return;

		const previouslyFocused = document.activeElement as HTMLElement | null;
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		closeRef.current?.focus();

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				handlers.current.onClose();
			} else if (event.key === "ArrowRight") {
				event.preventDefault();
				if (isRtl) handlers.current.prev();
				else handlers.current.next();
			} else if (event.key === "ArrowLeft") {
				event.preventDefault();
				if (isRtl) handlers.current.next();
				else handlers.current.prev();
			}
		};
		document.addEventListener("keydown", onKeyDown);

		return () => {
			document.body.style.overflow = previousOverflow;
			document.removeEventListener("keydown", onKeyDown);
			previouslyFocused?.focus?.();
		};
	}, [isOpen, isRtl]);

	const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
	const NextIcon = isRtl ? ChevronLeft : ChevronRight;
	const navButtonClass =
		"absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink-900/60 text-paper/80 backdrop-blur-sm transition-colors hover:bg-gold-500 hover:text-ink-950 sm:h-12 sm:w-12";

	return createPortal(
		<AnimatePresence>
			{index !== null && (
				<motion.div
					role="dialog"
					aria-modal="true"
					aria-label={t.gallery.title}
					dir={t.dir}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-[90] flex items-center justify-center bg-ink-950/95 p-4 sm:p-6"
					onClick={onClose}
					onTouchStart={(event) => {
						touchStartX.current = event.touches[0].clientX;
					}}
					onTouchEnd={(event) => {
						if (touchStartX.current === null) return;
						const delta = event.changedTouches[0].clientX - touchStartX.current;
						touchStartX.current = null;
						if (Math.abs(delta) < 50) return;
						// السحب نحو بداية الاتجاه يعني الصورة التالية
						const swipedLeft = delta < 0;
						if (swipedLeft !== isRtl) next();
						else prev();
					}}
				>
					<button
						ref={closeRef}
						type="button"
						onClick={(event) => {
							event.stopPropagation();
							onClose();
						}}
						className="absolute end-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-ink-900/60 text-paper/80 transition-colors hover:text-paper sm:end-6 sm:top-6"
						aria-label={t.gallery.close}
					>
						<X size={24} />
					</button>

					<span className="absolute start-5 top-6 z-10 rounded-full border border-gold-400/30 px-3 py-1 text-xs font-medium tabular-nums text-gold-300 sm:start-8 sm:top-8">
						<span dir="ltr">
							{index + 1} / {photos.length}
						</span>
					</span>

					{photos.length > 1 && (
						<button
							type="button"
							onClick={(event) => {
								event.stopPropagation();
								prev();
							}}
							className={`${navButtonClass} start-2 sm:start-5`}
							aria-label={t.gallery.previous}
						>
							<PrevIcon size={26} />
						</button>
					)}

					<motion.img
						key={index}
						initial={{ opacity: 0, scale: 0.96 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.3 }}
						src={photos[index]}
						alt={`${t.gallery.title} ${index + 1}`}
						onClick={(event) => event.stopPropagation()}
						className="max-h-[80vh] max-w-full rounded-lg object-contain shadow-2xl sm:max-w-[85vw]"
					/>

					{photos.length > 1 && (
						<button
							type="button"
							onClick={(event) => {
								event.stopPropagation();
								next();
							}}
							className={`${navButtonClass} end-2 sm:end-5`}
							aria-label={t.gallery.next}
						>
							<NextIcon size={26} />
						</button>
					)}
				</motion.div>
			)}
		</AnimatePresence>,
		document.body,
	);
}
