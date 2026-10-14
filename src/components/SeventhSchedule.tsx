import { useApp } from "../context/AppContext";
import Reveal from "./Reveal";
import { SectionHeading, StarFrame, StarPattern } from "./home/kit";

export default function SeventhSchedule() {
	const { t } = useApp();
	const { schedule } = t.seventhConference;

	return (
		<section className="relative overflow-hidden px-5 py-24 lg:px-10 lg:py-28">
			<StarPattern className="text-gold-500/[0.1] dark:text-gold-400/[0.07]" />

			<div className="relative mx-auto max-w-7xl">
				<Reveal>
					<SectionHeading title={schedule.title} />
				</Reveal>

				<ol className="mt-14 grid gap-5 md:grid-cols-3 lg:gap-6">
					{schedule.items.map((item, index) => (
						<Reveal
							as="li"
							key={item.label}
							delay={index * 100}
							className="h-full"
						>
							<div className="group relative h-full overflow-hidden rounded-3xl border border-ink-900/10 bg-white p-6 shadow-[0_14px_44px_-22px_rgba(15,27,61,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/50 hover:shadow-[0_22px_56px_-24px_rgba(176,140,66,0.5)] dark:border-paper/10 dark:bg-ink-900 sm:p-8">
								<span
									aria-hidden="true"
									className="absolute inset-y-0 start-0 w-1 bg-gradient-to-b from-gold-300 via-gold-500 to-gold-600 opacity-70 transition-opacity duration-300 group-hover:opacity-100"
								/>
								<StarFrame className="text-gold-500">
									<span className="font-display text-base text-gold-700 dark:text-gold-300">
										{String(index + 1).padStart(2, "0")}
									</span>
								</StarFrame>
								<p className="mt-5 text-sm font-semibold text-gold-700 dark:text-gold-300 sm:text-base">
									{item.label}
								</p>
								<time
									dir="ltr"
									className="mt-2 block text-start font-display text-xl leading-relaxed text-ink-900 dark:text-paper sm:text-2xl"
								>
									{item.date}
								</time>
							</div>
						</Reveal>
					))}
				</ol>
			</div>
		</section>
	);
}
