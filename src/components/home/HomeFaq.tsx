import { useState } from "react";
import { HelpCircle, Plus } from "lucide-react";
import { useApp } from "../../context/AppContext";
import Reveal from "../Reveal";
import { SectionHeading } from "./kit";

/** الأسئلة العامة: العنوان في عمود جانبي ثابت، والأسئلة قائمة منسدلة مرقّمة. */
export default function HomeFaq() {
	const { t } = useApp();
	const [open, setOpen] = useState<number | null>(0);

	return (
		<section id="faq" className="relative px-5 py-24 lg:px-10 lg:py-32">
			<div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:gap-16">
				<div className="lg:col-span-4">
					<div className="lg:sticky lg:top-28">
						<Reveal>
							<SectionHeading
								align="start"
								icon={HelpCircle}
								title={t.faq.title}
								lead={t.faq.subtitle}
							/>
						</Reveal>
					</div>
				</div>

				<div className="space-y-4 lg:col-span-8">
					{t.faq.items.map((item, i) => {
						const isOpen = open === i;
						return (
							<Reveal key={item.q} delay={i * 70}>
								<div
									className={`rounded-2xl border transition-all duration-300 ${
										isOpen
											? "border-gold-500/50 bg-white shadow-[0_20px_50px_-26px_rgba(176,140,66,0.6)] dark:border-gold-400/40 dark:bg-ink-900"
											: "border-ink-900/10 bg-white/60 hover:border-gold-500/35 hover:bg-white dark:border-paper/10 dark:bg-ink-900/40 dark:hover:bg-ink-900/70"
									}`}
								>
									<button
										type="button"
										onClick={() => setOpen(isOpen ? null : i)}
										aria-expanded={isOpen}
										className="flex w-full items-center gap-4 px-5 py-5 text-start sm:px-6"
									>
										<span
											className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-sm transition-colors duration-300 ${
												isOpen
													? "bg-gold-500 text-ink-950"
													: "bg-gold-500/10 text-gold-700 dark:text-gold-300"
											}`}
										>
											{String(i + 1).padStart(2, "0")}
										</span>
										<span className="flex-1 font-display text-base leading-relaxed text-ink-900 dark:text-paper sm:text-lg">
											{item.q}
										</span>
										<Plus
											size={20}
											className={`shrink-0 text-gold-500 transition-transform duration-300 motion-reduce:transition-none ${isOpen ? "rotate-45" : ""}`}
										/>
									</button>
									<div className={`accordion-panel ${isOpen ? "open" : ""}`}>
										<div>
											<div className="mx-5 border-t border-gold-500/20 sm:mx-6">
												<p className="pb-6 pt-4 text-base leading-loose text-slate-ink ps-[3.25rem] dark:text-ink-100">
													{item.a}
												</p>
											</div>
										</div>
									</div>
								</div>
							</Reveal>
						);
					})}
				</div>
			</div>
		</section>
	);
}
