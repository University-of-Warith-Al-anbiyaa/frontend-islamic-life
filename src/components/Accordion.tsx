import { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { itemVariants } from "./motionKit";

export default function Accordion({
	items,
	columns = 1,
}: {
	items: readonly { q: string; a: string }[];
	columns?: 1 | 2;
}) {
	const [open, setOpen] = useState<number | null>(0);

	return (
		<div
			className={`grid gap-3 ${columns === 2 ? "lg:grid-cols-2 lg:items-start" : ""}`}
		>
			{items.map((item, i) => {
				const isOpen = open === i;
				return (
					<motion.div
						key={item.q}
						variants={itemVariants}
						className={`relative overflow-hidden rounded-xl border transition-colors duration-300 ${
							isOpen
								? "border-gold-500/45 bg-gold-500/[0.06] dark:border-gold-400/35 dark:bg-gold-500/[0.08]"
								: "border-ink-900/10 bg-paper/70 hover:border-gold-500/30 hover:bg-gold-500/[0.04] dark:border-paper/10 dark:bg-ink-900/40 dark:hover:border-gold-400/25 dark:hover:bg-gold-500/[0.05]"
						}`}
					>
						<span
							aria-hidden="true"
							className={`absolute inset-y-3 start-0 w-1 origin-center rounded-full bg-gold-500 transition-transform duration-300 motion-reduce:transition-none ${isOpen ? "scale-y-100" : "scale-y-0"}`}
						/>
						<button
							onClick={() => setOpen(isOpen ? null : i)}
							aria-expanded={isOpen}
							className="flex w-full items-center justify-between gap-4 px-4 py-4 text-start transition-colors sm:px-5 sm:py-5"
						>
							<span className="font-display text-base font-medium leading-relaxed text-ink-900 dark:text-paper sm:text-lg">
								{item.q}
							</span>
							<Plus
								size={18}
								className={`shrink-0 text-gold-500 transition-transform duration-300 motion-reduce:transition-none ${isOpen ? "rotate-45" : ""}`}
							/>
						</button>
						<div className={`accordion-panel ${isOpen ? "open" : ""}`}>
							<div className="px-4 sm:px-5">
								<p className="max-w-2xl border-t border-gold-500/15 pb-5 pt-3 text-justify text-base font-medium leading-relaxed text-ink-800 dark:border-gold-400/15 dark:text-ink-100">
									{item.a}
								</p>
							</div>
						</div>
					</motion.div>
				);
			})}
		</div>
	);
}
