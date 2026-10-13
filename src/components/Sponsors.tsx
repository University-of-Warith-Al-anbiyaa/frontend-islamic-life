import { useApp } from "../context/AppContext";
import Reveal from "./Reveal";
import { SectionHeading, StarPattern } from "./home/kit";
import {
	evaluatingOrganization,
	supportingOrganizations,
} from "../config/sponsors";

export default function Sponsors() {
	const { t, lang } = useApp();
	const evaluatorName =
		lang === "ar"
			? evaluatingOrganization.nameAr
			: evaluatingOrganization.nameEn;

	return (
		<section className="relative overflow-hidden px-5 py-24 lg:px-10 lg:py-28">
			<StarPattern className="text-gold-500/[0.09] dark:text-gold-400/[0.06]" />

			<div className="relative mx-auto max-w-5xl">
				<Reveal>
					<SectionHeading title={t.sponsors.title} />
				</Reveal>

				<div className="mx-auto mt-14 grid max-w-3xl items-stretch gap-6 sm:grid-cols-2 sm:gap-8">
					{supportingOrganizations.map((sponsor, i) => {
						const sponsorName = lang === "ar" ? sponsor.nameAr : sponsor.nameEn;
						const card = (
							<div className="group flex h-full flex-col overflow-hidden rounded-3xl border border-ink-900/10 bg-white shadow-[0_18px_50px_-26px_rgba(15,27,61,0.35)] transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-500/50 hover:shadow-[0_26px_60px_-26px_rgba(176,140,66,0.55)] dark:border-paper/10">
								<div className="flex h-44 items-center justify-center bg-white p-8">
									{sponsor.logo ? (
										<img
											src={sponsor.logo}
											alt={sponsorName}
											className="max-h-28 max-w-[78%] object-contain transition-transform duration-500 group-hover:scale-105"
											loading="lazy"
										/>
									) : (
										<span className="text-center font-display text-lg text-ink-900">
											{sponsorName}
										</span>
									)}
								</div>
								<p className="border-t border-gold-500/25 bg-gold-50/80 px-5 py-3.5 text-center font-display text-base text-ink-900 dark:bg-ink-900 dark:text-paper">
									{sponsorName}
								</p>
							</div>
						);

						return (
							<Reveal key={sponsorName} delay={i * 100} className="h-full">
								{sponsor.url ? (
									<a
										href={sponsor.url}
										target="_blank"
										rel="noopener noreferrer"
										aria-label={sponsorName}
										className="block h-full"
									>
										{card}
									</a>
								) : (
									card
								)}
							</Reveal>
						);
					})}
				</div>

				<Reveal>
					<div className="relative mx-auto mt-10 max-w-3xl overflow-hidden rounded-3xl border border-gold-400/35 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 p-6 text-paper shadow-[0_28px_70px_-30px_rgba(15,27,61,0.6)] sm:p-8">
						<StarPattern className="text-gold-300/[0.09]" fade={false} />
						<div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:text-start">
							<a
								href={evaluatingOrganization.url}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={evaluatorName}
								className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-gold-400/40 bg-white p-3 shadow-[0_10px_28px_rgba(0,0,0,0.3)] transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-400"
							>
								<img
									src={evaluatingOrganization.logo}
									alt={evaluatorName}
									className="max-h-full max-w-full object-contain"
									loading="lazy"
								/>
							</a>
							<div className="min-w-0 flex-1">
								<p className="text-xs font-bold uppercase tracking-[0.16em] text-gold-300">
									{t.sponsors.evaluatorTitle}
								</p>
								<h3 className="mt-2 font-display text-xl text-paper sm:text-2xl">
									{evaluatingOrganization.url ? (
										<a
											href={evaluatingOrganization.url}
											target="_blank"
											rel="noopener noreferrer"
											className="transition-colors hover:text-gold-300"
										>
											{evaluatorName}
										</a>
									) : (
										evaluatorName
									)}
								</h3>
								<p className="mt-2 text-sm leading-relaxed text-ink-200">
									{t.sponsors.evaluatorDescription}
								</p>
							</div>
							<span className="shrink-0 rounded-full border border-gold-400/50 bg-gold-500/15 px-4 py-2 text-xs font-semibold text-gold-200">
								{t.sponsors.evaluatorBadge}
							</span>
						</div>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
