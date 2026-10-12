import { ArrowUpRight, FileText } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useApp } from "../context/AppContext";
import { CardHeading, RevealCard, itemVariants } from "./motionKit";

export default function CallForPapers() {
	const { t, openSubmission } = useApp();
	const prefersReducedMotion = useReducedMotion() ?? false;

	return (
		<section id="cfp" className="flex h-full">
			<RevealCard
				tone="navy"
				className="flex h-full w-full flex-col p-6 sm:p-8 lg:p-12"
			>
				<motion.div
					aria-hidden="true"
					className="pointer-events-none absolute -end-16 -top-16 h-56 w-56 rounded-full bg-gold-500/15 blur-3xl"
					animate={
						prefersReducedMotion
							? undefined
							: { scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }
					}
					transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
				/>

				<div className="relative flex flex-1 flex-col">
					<CardHeading
						tone="navy"
						icon={FileText}
						title={t.cfp.title}
						lead={t.cfp.text}
					/>

					<div className="mt-10 flex flex-1 flex-col items-center justify-end gap-6">
						<motion.p
							variants={itemVariants}
							role="status"
							className="flex max-w-2xl items-center justify-center gap-3 rounded-xl border border-gold-400/45 bg-gold-500/10 px-5 py-3 text-center text-sm font-bold leading-relaxed text-gold-300 shadow-sm sm:text-base"
						>
							<span
								aria-hidden="true"
								className="relative flex h-2.5 w-2.5 shrink-0"
							>
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400/70 motion-reduce:hidden" />
								<span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-gold-400" />
							</span>
							{t.cfp.deadline}
						</motion.p>

						<motion.button
							variants={itemVariants}
							type="button"
							onClick={openSubmission}
							whileHover={prefersReducedMotion ? undefined : { scale: 1.04 }}
							whileTap={prefersReducedMotion ? undefined : { scale: 0.96 }}
							className="group/cta relative inline-flex w-full shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-gold-500 px-8 py-3.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-gold-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-300 motion-reduce:transition-none sm:w-fit"
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
								size={16}
								aria-hidden="true"
								className="relative transition-transform duration-300 group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5 motion-reduce:transition-none"
							/>
						</motion.button>
					</div>
				</div>
			</RevealCard>
		</section>
	);
}
