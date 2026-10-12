import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Trophy, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { awards, type RecognitionAward } from "../config/awards";
import { CardHeading, EASE, RevealCard, itemVariants } from "./motionKit";

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
		<section id="awards" dir={t.dir} className="flex h-full">
			<RevealCard className="flex h-full w-full flex-col p-6 sm:p-8 lg:p-12">
				<CardHeading icon={Trophy} title={copy.title} lead={subtitle} />

				<div
					className={`mt-10 grid gap-5 ${
						awards.length > 1 ? "lg:grid-cols-2" : "mx-auto w-full max-w-3xl"
					}`}
				>
					{awards.map((award) => (
						<motion.article
							key={award.id}
							variants={itemVariants}
							className="flex flex-col rounded-xl border border-gold-500/30 bg-gold-500/10 p-6 text-center transition-colors duration-300 hover:border-gold-500/60 motion-reduce:transition-none sm:p-8"
						>
							{award.image && (
								<img
									src={award.image}
									alt={awardName(award)}
									className="mb-5 h-32 w-full rounded-md object-contain"
									loading="lazy"
								/>
							)}

							<h3 className="font-display text-2xl leading-snug text-ink-900 dark:text-paper">
								{awardName(award)}
							</h3>
							<p className="mt-2 text-sm font-medium text-gold-700 dark:text-gold-300">
								{organizationName(award)}
							</p>
							<p className="mt-5 text-base font-semibold leading-relaxed text-ink-900 dark:text-paper sm:text-lg">
								{description(award)}
							</p>

							<div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-gold-500/20 pt-4">
								<span className="rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-sm font-semibold text-gold-700 dark:text-gold-300">
									{categoryName(award)}
								</span>
							</div>

							<button
								type="button"
								onClick={(event) => openAward(award, event)}
								aria-label={`${copy.viewDetails}: ${awardName(award)}`}
								className="mx-auto mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-gold-500/50 bg-gold-500/10 px-5 py-2.5 text-sm font-semibold text-gold-700 transition-colors hover:border-gold-500 hover:bg-gold-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500 dark:text-gold-300 motion-reduce:transition-none"
							>
								{copy.viewDetails}
								<ArrowUpRight
									size={16}
									aria-hidden="true"
									className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
								/>
							</button>
						</motion.article>
					))}
				</div>
			</RevealCard>

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
									className="w-full max-w-lg overflow-hidden rounded-xl border border-gold-500/30 bg-paper shadow-2xl outline-none dark:bg-ink-950"
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
