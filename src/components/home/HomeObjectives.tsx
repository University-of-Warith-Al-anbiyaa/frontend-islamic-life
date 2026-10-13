import { useApp } from "../../context/AppContext";
import Reveal from "../Reveal";
import { SectionHeading, StarFrame, StarPattern } from "./kit";

/** أهداف المؤتمر على خلفية كحلية: عشر بطاقات (خمس في كل صف على الشاشات العريضة). */
export default function HomeObjectives() {
	const { t } = useApp();
	const content = t.objectives;

	return (
		<section
			id="objectives"
			className="relative overflow-hidden bg-ink-900 px-5 py-24 text-paper lg:px-10 lg:py-32"
		>
			<StarPattern className="text-gold-300/[0.08]" />
			<div
				aria-hidden="true"
				className="pointer-events-none absolute -top-40 start-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-gold-500/15 blur-3xl rtl:translate-x-1/2"
			/>

			<div className="relative mx-auto max-w-7xl">
				<Reveal>
					<SectionHeading
						tone="dark"
						title={content.title}
						lead={content.subtitle}
					/>
				</Reveal>

				<div className="mt-14 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:gap-5 xl:grid-cols-5">
					{content.items.map((item, i) => (
						<Reveal key={item.n} delay={(i % 5) * 80} className="h-full">
							<div className="group relative h-full rounded-2xl border border-paper/10 bg-paper/[0.04] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/50 hover:bg-paper/[0.08] sm:p-6">
								<span
									aria-hidden="true"
									className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-gold-400/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
								/>
								<StarFrame className="text-gold-400">
									<span className="font-display text-sm text-gold-300">
										{item.n}
									</span>
								</StarFrame>
								<h3 className="mt-5 font-display text-lg leading-snug text-paper">
									{item.title}
								</h3>
								<p className="mt-3 text-sm leading-relaxed text-ink-200">
									{item.text}
								</p>
							</div>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
