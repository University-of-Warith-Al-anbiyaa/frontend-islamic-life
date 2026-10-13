import { useApp } from "../context/AppContext";
import Reveal from "./Reveal";
import ConferenceName from "./ConferenceName";
import HighlightedConferenceText from "./HighlightedConferenceText";
import { SectionHeading, StarFrame, StarMark, StarPattern } from "./home/kit";

export default function About() {
	const { t } = useApp();
	const blocks = [t.about.vision, t.about.mission, t.about.goals];

	return (
		<section id="about" className="relative overflow-hidden px-5 py-24 lg:px-10 lg:py-32">
			<StarPattern className="text-gold-500/[0.1] dark:text-gold-400/[0.07]" />

			<div className="relative mx-auto max-w-7xl">
				<div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-16">
					<div className="lg:sticky lg:top-28 lg:col-span-5">
						<Reveal>
							<SectionHeading
								align="start"
								eyebrow={
									<ConferenceName greenClassName="text-green-600 dark:text-green-400" />
								}
								title={t.about.title}
								lead={<HighlightedConferenceText text={t.about.lead} />}
							/>
						</Reveal>

						<Reveal delay={100} className="mt-10">
							<p className="text-sm font-semibold text-gold-700 dark:text-gold-300">
								{t.about.partnersTitle}
							</p>
							<ul className="mt-4 flex flex-wrap gap-3">
								{t.about.cooperation.items.map((partner) => (
									<li
										key={partner}
										className="inline-flex items-center gap-2.5 rounded-full border border-gold-500/30 bg-white px-4 py-2.5 text-sm font-medium text-ink-900 shadow-sm dark:border-gold-400/25 dark:bg-ink-900 dark:text-paper"
									>
										<StarMark className="h-3 w-3 shrink-0 text-gold-500" />
										{partner}
									</li>
								))}
							</ul>
						</Reveal>
					</div>

					<div className="space-y-5 lg:col-span-7">
						{blocks.map((b, i) => (
							<Reveal key={b.title} delay={i * 100}>
								<article className="group relative overflow-hidden rounded-3xl border border-ink-900/10 bg-white p-6 shadow-[0_14px_44px_-22px_rgba(15,27,61,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/50 hover:shadow-[0_22px_56px_-24px_rgba(176,140,66,0.5)] dark:border-paper/10 dark:bg-ink-900 sm:p-8">
									<span
										aria-hidden="true"
										className="absolute inset-y-0 start-0 w-1 bg-gradient-to-b from-gold-300 via-gold-500 to-gold-600 opacity-70 transition-opacity duration-300 group-hover:opacity-100"
									/>
									<div className="flex gap-5 sm:gap-6">
										<StarFrame className="text-gold-500">
											<span className="font-display text-base text-gold-700 dark:text-gold-300">
												{String(i + 1).padStart(2, "0")}
											</span>
										</StarFrame>
										<div className="min-w-0">
											<h3 className="font-display text-xl text-ink-900 dark:text-paper sm:text-2xl">
												{b.title}
											</h3>
											<p className="mt-3 text-base leading-loose text-slate-ink dark:text-ink-200">
												{b.text}
											</p>
										</div>
									</div>
								</article>
							</Reveal>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
