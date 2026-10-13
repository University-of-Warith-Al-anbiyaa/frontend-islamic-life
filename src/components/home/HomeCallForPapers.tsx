import { ArrowUpRight, FileText } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useApp } from "../../context/AppContext";
import Reveal from "../Reveal";
import { SectionHeading, StarPattern } from "./kit";

/** لافتة الدعوة لتقديم البحوث: بطاقة كحلية عريضة بنص على جانب ولوح موعد وزر تقديم على الجانب الآخر. */
export default function HomeCallForPapers() {
	const { t, openSubmission } = useApp();
	const prefersReducedMotion = useReducedMotion() ?? false;

	return (
		<section id="cfp" className="relative px-5 py-24 lg:px-10 lg:py-32">
			<div className="mx-auto max-w-7xl">
				<Reveal>
					<div className="relative overflow-hidden rounded-[2rem] border border-gold-400/30 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 p-8 text-paper shadow-[0_40px_100px_-32px_rgba(15,27,61,0.7)] sm:p-12 lg:p-16">
						<StarPattern className="text-gold-300/[0.08]" />
						<motion.div
							aria-hidden="true"
							className="pointer-events-none absolute -end-20 -top-20 h-72 w-72 rounded-full bg-gold-500/20 blur-3xl"
							animate={
								prefersReducedMotion
									? undefined
									: { scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }
							}
							transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
						/>

						<div className="relative grid items-center gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
							<SectionHeading
								align="start"
								tone="dark"
								icon={FileText}
								title={t.cfp.title}
								lead={t.cfp.text}
								className="!max-w-none"
							/>

							<div className="rounded-3xl border border-gold-400/30 bg-paper/[0.06] p-6 backdrop-blur-sm sm:p-8">
								<p
									role="status"
									className="flex items-center gap-3 rounded-2xl border border-gold-400/40 bg-gold-500/10 px-4 py-3.5 text-sm font-bold leading-relaxed text-gold-200 sm:text-base"
								>
									<span
										aria-hidden="true"
										className="relative flex h-2.5 w-2.5 shrink-0"
									>
										<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400/70 motion-reduce:hidden" />
										<span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold-400" />
									</span>
									{t.cfp.deadline}
								</p>

								<motion.button
									type="button"
									onClick={openSubmission}
									whileHover={prefersReducedMotion ? undefined : { scale: 1.03 }}
									whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
									className="group/cta relative mt-5 inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-b from-gold-300 to-gold-500 px-8 py-4 text-base font-bold text-ink-950 shadow-[0_14px_36px_-12px_rgba(201,166,92,0.8)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-300"
								>
									{!prefersReducedMotion && (
										<motion.span
											aria-hidden="true"
											className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/45 blur-sm"
											animate={{ x: ["0%", "480%"] }}
											transition={{
												duration: 1.3,
												ease: "easeInOut",
												repeat: Infinity,
												repeatDelay: 3.2,
											}}
										/>
									)}
									<span className="relative">{t.cfp.cta}</span>
									<ArrowUpRight
										size={18}
										aria-hidden="true"
										className="relative transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5 motion-reduce:transition-none"
									/>
								</motion.button>
							</div>
						</div>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
