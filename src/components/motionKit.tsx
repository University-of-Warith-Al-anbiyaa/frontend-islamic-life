import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export const EASE = [0.22, 1, 0.36, 1] as const;

export type Tone = "gold" | "navy";

const tones = {
	gold: {
		card: "border-gold-500/55 bg-gradient-to-br from-amber-50 via-paper to-white shadow-[0_16px_48px_rgba(169,122,25,0.18)] hover:border-gold-500 hover:shadow-[0_22px_60px_rgba(169,122,25,0.28)] dark:from-ink-900 dark:via-ink-950 dark:to-ink-900",
		badge:
			"border-gold-500/45 bg-gold-500/15 text-gold-600 shadow-[0_8px_28px_rgba(169,122,25,0.2)] dark:text-gold-300",
		title: "text-ink-900 dark:text-paper",
		lead: "text-slate-ink dark:text-ink-200",
	},
	navy: {
		card: "border-gold-500/45 bg-gradient-to-br from-ink-900 via-ink-950 to-ink-900 text-paper shadow-[0_16px_48px_rgba(15,27,61,0.35)] hover:border-gold-400 hover:shadow-[0_22px_60px_rgba(201,166,92,0.22)]",
		badge:
			"border-gold-400/40 bg-gold-500/15 text-gold-300 shadow-[0_8px_28px_rgba(0,0,0,0.3)]",
		title: "text-paper",
		lead: "text-ink-200",
	},
} as const;

// The card is the stagger container: once it scrolls into view it rises, then
// every motion child that uses `itemVariants` follows one after another.
const cardVariants: Variants = {
	hidden: { opacity: 0, y: 40, scale: 0.97 },
	show: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			duration: 0.65,
			ease: EASE,
			delayChildren: 0.2,
			staggerChildren: 0.09,
		},
	},
};

export const itemVariants: Variants = {
	hidden: { opacity: 0, y: 22 },
	show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const badgeVariants: Variants = {
	hidden: { opacity: 0, scale: 0.5, rotate: -20 },
	show: {
		opacity: 1,
		scale: 1,
		rotate: 0,
		transition: { type: "spring", stiffness: 260, damping: 16 },
	},
};

const ruleVariants: Variants = {
	hidden: { opacity: 0, scaleX: 0 },
	show: { opacity: 1, scaleX: 1, transition: { duration: 0.8, ease: EASE } },
};

/** Gold edge + light sweep that play on hover. The parent must be `group relative overflow-hidden`. */
function CardShine() {
	return (
		<>
			<span
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-center scale-x-0 bg-gradient-to-r from-transparent via-gold-500 to-transparent transition-transform duration-500 group-hover:scale-x-100 motion-reduce:hidden"
			/>
			<span
				aria-hidden="true"
				className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-gold-400/15 to-transparent opacity-0 group-hover:animate-awardsSweep motion-reduce:hidden"
			/>
		</>
	);
}

/** Expanding ring around an icon badge. Renders nothing for reduced motion. */
function PulseRing() {
	const prefersReducedMotion = useReducedMotion();
	if (prefersReducedMotion) return null;

	return (
		<motion.span
			aria-hidden="true"
			className="absolute inset-0 rounded-full border border-gold-500/50"
			animate={{ scale: [1, 1.45], opacity: [0.6, 0] }}
			transition={{
				duration: 2.4,
				repeat: Infinity,
				ease: "easeOut",
				repeatDelay: 0.8,
			}}
		/>
	);
}

/** Full-width section frame shared by FAQ, Awards and Call for Papers. */
export function RevealCard({
	tone = "gold",
	lift = true,
	className = "",
	children,
}: {
	tone?: Tone;
	/** Raise the card on hover. Turn off for cards that hold interactive content. */
	lift?: boolean;
	className?: string;
	children: ReactNode;
}) {
	const prefersReducedMotion = useReducedMotion() ?? false;

	return (
		<motion.div
			variants={cardVariants}
			initial={prefersReducedMotion ? false : "hidden"}
			whileInView="show"
			viewport={{ once: true, margin: "-80px" }}
			whileHover={
				prefersReducedMotion || !lift
					? undefined
					: {
							y: -6,
							transition: { type: "spring", stiffness: 300, damping: 20 },
						}
			}
			className={`group relative overflow-hidden rounded-2xl border-2 transition-[border-color,box-shadow] duration-300 motion-reduce:transition-none ${tones[tone].card} ${className}`}
		>
			<CardShine />
			{children}
		</motion.div>
	);
}

/** Icon badge, title, gold rule and lead text, animated in sequence by the parent RevealCard. */
export function CardHeading({
	icon: Icon,
	title,
	lead,
	tone = "gold",
}: {
	icon: LucideIcon;
	title: string;
	lead?: string;
	tone?: Tone;
}) {
	const palette = tones[tone];

	return (
		<div className="text-center">
			<motion.div variants={badgeVariants} className="flex justify-center">
				<div
					className={`relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-2 ${palette.badge}`}
				>
					<PulseRing />
					<Icon
						size={38}
						aria-hidden="true"
						className="transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 motion-reduce:transition-none"
					/>
				</div>
			</motion.div>
			<motion.h2
				variants={itemVariants}
				className={`mt-6 font-display text-3xl leading-tight sm:text-4xl ${palette.title}`}
			>
				{title}
			</motion.h2>
			<motion.span
				variants={ruleVariants}
				aria-hidden="true"
				className="mx-auto mt-4 block h-0.5 w-24 origin-center rounded-full bg-gradient-to-r from-transparent via-gold-500 to-transparent"
			/>
			{lead && (
				<motion.p
					variants={itemVariants}
					className={`mx-auto mt-4 max-w-2xl text-base leading-relaxed sm:text-lg ${palette.lead}`}
				>
					{lead}
				</motion.p>
			)}
		</div>
	);
}
