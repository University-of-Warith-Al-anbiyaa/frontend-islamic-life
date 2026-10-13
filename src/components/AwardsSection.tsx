import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Trophy, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { awards, type RecognitionAward } from "../config/awards";
import { EASE } from "./motionKit";
import Reveal from "./Reveal";
import { SectionHeading, StarFrame, StarPattern } from "./home/kit";

export default function AwardsSection() {
	const { t, lang } = useApp();
	const [selectedAward, setSelectedAward] = useState<RecognitionAward | null>(
		null,
	);
	const closeButtonRef = useRef<HTMLButtonElement>(null);
	const dialogRef = useRef<HTMLDivElement>(null);
	const triggerRef = useRef<HTMLElement | null>(null);
	const prefersReducedMotion = useReducedMotion() ?? false;
	const copy = t.awards;
	const subtitle = "subtitle" in copy ? copy.subtitle : undefined;
	const singleAward = awards.length <= 1;

	const awardName = (award: RecognitionAward) =>
		lang === "ar" ? award.titleAr : award.titleEn;
	const organizationName = (award: RecognitionAward) =>
		lang === "ar" ? award.organizationAr : award.organizationEn;
	const categoryName = (award: RecognitionAward) =>
		lang === "ar" ? award.categoryAr : award.categoryEn;
	const description = (award: RecognitionAward) =>
		lang === "ar" ? award.descriptionAr : award.descriptionEn;

	useEffect(() => {
		if (!selectedAward) return;

		const previousOverflow = document.body.style.overflow;
		const previousFocus = document.activeElement;
		document.body.style.overflow = "hidden";
		closeButtonRef.current?.focus();

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setSelectedAward(null);
				return;
			}

			if (event.key !== "Tab" || !dialogRef.current) return;
			const focusable = Array.from(
				dialogRef.current.querySelectorAll<HTMLElement>(
					"button:not([disabled]), a[href]",
				),
			);
			if (focusable.length === 0) {
				event.preventDefault();
				return;
			}

			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		};

		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.body.style.overflow = previousOverflow;
			document.removeEventListener("keydown", onKeyDown);
			if (previousFocus instanceof HTMLElement) previousFocus.focus();
		};
	}, [selectedAward]);

	const openAward = (
		award: RecognitionAward,
		event: React.MouseEvent<HTMLButtonElement>,
	) => {
		triggerRef.current = event.currentTarget;
		setSelectedAward(award);
	};

	const closeAward = () => setSelectedAward(null);

	return (
		<section
			id="awards"
			dir={t.dir}
			className="relative overflow-hidden bg-gold-50/70 px-5 py-24 dark:bg-ink-900/50 lg:px-10 lg:py-32"
		>
			<StarPattern className="text-gold-500/[0.12] dark:text-gold-400/[0.06]" />

			<div className="relative mx-auto max-w-7xl">
				<Reveal>
					<SectionHeading icon={Trophy} title={copy.title} lead={subtitle} />
				</Reveal>

				<div
					className={`mt-14 grid gap-6 ${
						singleAward ? "mx-auto max-w-5xl" : "lg:grid-cols-2"
					}`}
				>
					{awards.map((award) => (
						<Reveal key={award.id} className="h-full">
							<article
								className={`group relative h-full overflow-hidden rounded-3xl border border-gold-500/35 bg-white shadow-[0_28px_70px_-32px_rgba(15,27,61,0.45)] transition-shadow duration-300 hover:shadow-[0_32px_80px_-30px_rgba(176,140,66,0.55)] dark:border-gold-400/25 dark:bg-ink-900 ${
									singleAward ? "md:grid md:grid-cols-[18rem_1fr]" : "flex flex-col"
								}`}
							>
								<div className="relative flex min-h-[13rem] items-center justify-center overflow-hidden bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 p-8">
									<StarPattern className="text-gold-300/[0.14]" fade={false} />
									<div
										aria-hidden="true"
										className="absolute h-48 w-48 rounded-full bg-gold-500/25 blur-3xl"
									/>
									{award.image ? (
										<img
											src={award.image}
											alt={awardName(award)}
											className="relative max-h-44 w-full object-contain"
											loading="lazy"
										/>
									) : (
										<StarFrame
											size="xl"
											className="text-gold-400 transition-transform duration-500 group-hover:rotate-6"
										>
											<Trophy
												size={44}
												strokeWidth={1.5}
												aria-hidden="true"
												className="text-gold-300"
											/>
										</StarFrame>
									)}
								</div>

								<div className="relative flex flex-1 flex-col p-6 sm:p-8 lg:p-10">
									<span className="w-fit rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-1.5 text-sm font-semibold text-gold-700 dark:text-gold-300">
										{categoryName(award)}
									</span>
									<h3 className="mt-5 font-display text-2xl leading-snug text-ink-900 dark:text-paper sm:text-3xl">
										{awardName(award)}
									</h3>
									<p className="mt-2 text-sm font-semibold text-gold-700 dark:text-gold-300 sm:text-base">
										{organizationName(award)}
									</p>
									<p className="mt-5 flex-1 border-t border-gold-500/20 pt-5 text-base leading-loose text-ink-900 dark:text-paper sm:text-lg">
										{description(award)}
									</p>

									<button
										type="button"
										onClick={(event) => openAward(award, event)}
										aria-label={`${copy.viewDetails}: ${awardName(award)}`}
										className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-ink-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 dark:bg-gold-500 dark:text-ink-950 dark:hover:bg-gold-400 motion-reduce:transition-none"
									>
										{copy.viewDetails}
										<ArrowUpRight
											size={16}
											aria-hidden="true"
											className="text-gold-300 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 dark:text-ink-950 motion-reduce:transition-none"
										/>
									</button>
								</div>
							</article>
						</Reveal>
					))}
				</div>
			</div>

			{typeof document !== "undefined" &&
				createPortal(
					<AnimatePresence>
						{selectedAward && (
							<motion.div
								className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-ink-950/70 px-4 py-8 backdrop-blur-sm"
								initial={prefersReducedMotion ? false : { opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={prefersReducedMotion ? undefined : { opacity: 0 }}
								onMouseDown={(event) => {
									if (event.target === event.currentTarget) closeAward();
								}}
							>
								<motion.div
									ref={dialogRef}
									dir={t.dir}
									role="dialog"
									aria-modal="true"
									aria-labelledby="award-dialog-title"
									aria-describedby="award-dialog-description"
									tabIndex={-1}
									className="w-full max-w-lg overflow-hidden rounded-3xl border border-gold-500/40 bg-paper shadow-2xl outline-none dark:bg-ink-950"
									initial={
										prefersReducedMotion
											? false
											: { opacity: 0, y: 20, scale: 0.98 }
									}
									animate={{ opacity: 1, y: 0, scale: 1 }}
									exit={
										prefersReducedMotion
											? undefined
											: { opacity: 0, y: 12, scale: 0.98 }
									}
									transition={
										prefersReducedMotion
											? { duration: 0 }
											: { type: "spring", stiffness: 320, damping: 28 }
									}
								>
									<div className="flex items-start justify-between gap-4 border-b border-ink-900/10 px-6 py-5 dark:border-paper/10 sm:px-8">
										<div className="flex items-start gap-3">
											<motion.div
												className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-600 dark:text-gold-400"
												initial={
													prefersReducedMotion ? false : { scale: 0, rotate: -90 }
												}
												animate={{ scale: 1, rotate: 0 }}
												transition={{
													type: "spring",
													stiffness: 260,
													damping: 15,
													delay: 0.15,
												}}
											>
												<Trophy size={20} aria-hidden="true" />
											</motion.div>
											<div>
												<h2
													id="award-dialog-title"
													className="font-display text-2xl text-ink-900 dark:text-paper"
												>
													{awardName(selectedAward)}
												</h2>
											</div>
										</div>
										<button
											ref={closeButtonRef}
											type="button"
											onClick={closeAward}
											aria-label={copy.close}
											className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-ink transition-colors hover:bg-ink-900/5 hover:text-ink-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 dark:text-ink-200 dark:hover:bg-paper/5 dark:hover:text-paper motion-reduce:transition-none"
										>
											<X size={19} aria-hidden="true" />
										</button>
									</div>
									<motion.div
										className="space-y-5 px-6 py-6 sm:px-8 sm:py-8"
										initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.4, delay: 0.2, ease: EASE }}
									>
										{selectedAward.image && (
											<img
												src={selectedAward.image}
												alt={awardName(selectedAward)}
												className="max-h-52 w-full rounded-lg object-contain"
											/>
										)}
										<dl className="grid gap-4 sm:grid-cols-2">
											<div>
												<dt className="text-xs font-medium text-slate-ink dark:text-ink-200">
													{copy.organizationLabel}
												</dt>
												<dd className="mt-1 font-semibold text-ink-900 dark:text-paper">
													{organizationName(selectedAward)}
												</dd>
											</div>
											<div className="sm:col-span-2">
												<dt className="text-xs font-medium text-slate-ink dark:text-ink-200">
													{copy.categoryLabel}
												</dt>
												<dd className="mt-1 font-semibold text-ink-900 dark:text-paper">
													{categoryName(selectedAward)}
												</dd>
											</div>
										</dl>
										<p
											id="award-dialog-description"
											className="text-base leading-relaxed text-slate-ink dark:text-ink-200"
										>
											{description(selectedAward)}
										</p>
									</motion.div>
								</motion.div>
							</motion.div>
						)}
					</AnimatePresence>,
					document.body,
				)}
		</section>
	);
}
