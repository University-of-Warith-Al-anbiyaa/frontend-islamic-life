import { ShieldCheck } from "lucide-react";
import { useApp } from "../context/AppContext";
import Reveal from "./Reveal";
import { SectionHeading, StarFrame, StarPattern } from "./home/kit";

export default function ParticipationRules({
	variant = "default",
}: {
	variant?: "default" | "seventh";
}) {
	const { t } = useApp();
	const content =
		variant === "seventh" ? t.seventhConference.requirements : t.rules;

	return (
		<section
			id="rules"
			className="relative overflow-hidden bg-gold-50/70 px-5 py-24 dark:bg-ink-900/50 lg:px-10 lg:py-32"
		>
			<StarPattern className="text-gold-500/[0.1] dark:text-gold-400/[0.06]" />

			<div className="relative mx-auto max-w-5xl">
				<Reveal>
					<SectionHeading eyebrow={content.title} title={content.subtitle} />
				</Reveal>

				<div className="mt-14 grid gap-4 sm:grid-cols-2 lg:gap-5">
					{content.items.map((rule, i) => (
						<Reveal key={rule} delay={(i % 2) * 70} className="h-full">
							<div className="group relative flex h-full gap-4 overflow-hidden rounded-2xl border border-ink-900/10 bg-white p-5 shadow-[0_14px_44px_-26px_rgba(15,27,61,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/50 hover:shadow-[0_22px_56px_-26px_rgba(176,140,66,0.5)] dark:border-paper/10 dark:bg-ink-900 sm:p-6">
								<span
									aria-hidden="true"
									className="absolute inset-y-0 start-0 w-1 bg-gradient-to-b from-gold-300 via-gold-500 to-gold-600 opacity-70 transition-opacity duration-300 group-hover:opacity-100"
								/>
								<StarFrame className="text-gold-500">
									<span className="font-display text-sm text-gold-700 dark:text-gold-300">
										{String(i + 1).padStart(2, "0")}
									</span>
								</StarFrame>
								<p
									className={`min-w-0 flex-1 self-center leading-loose text-slate-ink dark:text-ink-100 ${
										variant === "seventh"
											? "text-base sm:text-lg"
											: "text-[26px]"
									}`}
								>
									{rule}
								</p>
							</div>
						</Reveal>
					))}
				</div>

				<Reveal delay={160} className="mt-8">
					<div
						role="status"
						className="relative flex items-center gap-4 overflow-hidden rounded-3xl border border-gold-400/40 bg-gradient-to-br from-ink-800 via-ink-900 to-ink-950 px-5 py-5 text-base font-bold leading-relaxed text-gold-100 shadow-[0_28px_70px_-30px_rgba(15,27,61,0.6)] sm:gap-5 sm:px-8 sm:py-6 sm:text-lg"
					>
						<StarPattern className="text-gold-300/[0.09]" fade={false} />
						<StarFrame size="lg" className="relative text-gold-400">
							<ShieldCheck
								size={28}
								strokeWidth={1.8}
								aria-hidden="true"
								className="text-gold-300"
							/>
						</StarFrame>
						<span className="relative">{t.cfp.deadline}</span>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
