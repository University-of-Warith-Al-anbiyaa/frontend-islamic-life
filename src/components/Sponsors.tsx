import { useApp } from "../context/AppContext";
import Reveal from "./Reveal";
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
		<section className="border-y border-ink-900/10 px-5 py-20 dark:border-paper/10 lg:px-10">
			<div className="mx-auto max-w-6xl">
				<Reveal>
					<div className="text-center">
						<h2 className="font-display text-2xl text-ink-900 dark:text-paper sm:text-3xl">
							{t.sponsors.title}
						</h2>
					</div>
				</Reveal>

				<Reveal>
					<div className="mx-auto mt-12 h-px max-w-3xl bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
				</Reveal>

				<div className="mx-auto mt-5 grid max-w-3xl items-start gap-6 sm:grid-cols-2 sm:gap-8">
					{supportingOrganizations.map((sponsor, i) => {
						const sponsorName = lang === "ar" ? sponsor.nameAr : sponsor.nameEn;
						const card = (
							<div className="flex h-40 items-center justify-center rounded-xl border border-ink-900/10 bg-paper p-6 shadow-[0_14px_38px_rgba(15,27,61,0.14)] transition-all hover:-translate-y-1 hover:border-gold-400/50 hover:shadow-[0_20px_48px_rgba(15,27,61,0.2)] dark:border-paper/20 dark:bg-paper sm:p-8">
								{sponsor.logo ? (
									<img
										src={sponsor.logo}
										alt={sponsorName}
										className="max-h-24 max-w-[78%] object-contain"
										loading="lazy"
									/>
								) : (
									<span className="text-center font-display text-lg text-ink-900 dark:text-paper">
										{sponsorName}
									</span>
								)}
							</div>
						);

						return (
							<Reveal key={sponsorName} delay={i * 100}>
								{sponsor.url ? (
									<a
										href={sponsor.url}
										target="_blank"
										rel="noopener noreferrer"
										aria-label={sponsorName}
										className="block"
									>
										{card}
									</a>
								) : (
									card
								)}
								<p className="mt-3 text-center text-sm font-medium text-ink-900 dark:text-paper">
									{sponsorName}
								</p>
							</Reveal>
						);
					})}
				</div>

				<Reveal>
					<div className="relative mx-auto mt-12 max-w-3xl overflow-hidden rounded-2xl border border-gold-500/40 bg-gradient-to-br from-gold-500/10 via-paper to-paper p-6 shadow-[0_16px_50px_rgba(15,27,61,0.08)] dark:via-ink-950 dark:to-ink-900 sm:p-8">
						<div
							aria-hidden="true"
							className="absolute -end-10 -top-12 h-36 w-36 rotate-45 border border-gold-500/20"
						/>
						<div className="relative flex flex-col items-center gap-5 text-center sm:flex-row sm:text-start">
							<a
								href={evaluatingOrganization.url}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={evaluatorName}
								className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-gold-500/30 bg-paper p-3 shadow-[0_8px_24px_rgba(15,27,61,0.12)] transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold-500"
							>
								<img
									src={evaluatingOrganization.logo}
									alt={evaluatorName}
									className="max-h-full max-w-full object-contain"
									loading="lazy"
								/>
							</a>
							<div className="min-w-0 flex-1">
								<p className="text-xs font-bold uppercase tracking-[0.16em] text-gold-700 dark:text-gold-300">
									{t.sponsors.evaluatorTitle}
								</p>
								<h3 className="mt-2 font-display text-xl text-ink-950 dark:text-paper sm:text-2xl">
									{evaluatingOrganization.url ? (
										<a
											href={evaluatingOrganization.url}
											target="_blank"
											rel="noopener noreferrer"
											className="transition-colors hover:text-gold-700 dark:hover:text-gold-300"
										>
											{evaluatorName}
										</a>
									) : (
										evaluatorName
									)}
								</h3>
								<p className="mt-2 text-sm leading-relaxed text-slate-ink dark:text-ink-200">
									{t.sponsors.evaluatorDescription}
								</p>
							</div>
							<span className="rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-2 text-xs font-semibold text-gold-800 dark:text-gold-200">
								{t.sponsors.evaluatorBadge}
							</span>
						</div>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
