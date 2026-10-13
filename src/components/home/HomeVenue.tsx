import { MapPin } from "lucide-react";
import { useApp } from "../../context/AppContext";
import Reveal from "../Reveal";
import { Ornament, StarPattern } from "./kit";

/** مكان الانعقاد: النص في جانب، والخريطة داخل إطار ذهبي مزاح في الجانب الآخر. */
export default function HomeVenue() {
	const { t } = useApp();

	return (
		<section
			id="venue"
			className="relative overflow-hidden bg-gold-50/70 px-5 py-24 dark:bg-ink-900/50 lg:px-10 lg:py-32"
		>
			<StarPattern className="text-gold-500/[0.1] dark:text-gold-400/[0.06]" />

			<div className="relative mx-auto max-w-7xl">
				<div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
					<Reveal>
						<p className="mb-3 text-sm font-semibold text-gold-700 dark:text-gold-300 sm:text-base">
							{t.venue.title}
						</p>
						<h2 className="font-display text-3xl leading-tight text-ink-900 dark:text-paper sm:text-4xl lg:text-5xl">
							{t.meta.university}
						</h2>
						<Ornament align="start" className="mt-5" />

						<div className="mt-8 flex items-start gap-4 rounded-2xl border border-gold-500/30 bg-white p-5 shadow-sm dark:border-gold-400/25 dark:bg-ink-900">
							<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-500/15 text-gold-600 dark:text-gold-300">
								<MapPin size={22} strokeWidth={1.8} />
							</span>
							<p className="pt-2 text-base font-medium leading-relaxed text-ink-900 dark:text-paper">
								{t.venue.address}
							</p>
						</div>

						<p className="mt-6 max-w-lg text-base leading-loose text-slate-ink dark:text-ink-200">
							{t.venue.text}
						</p>
					</Reveal>

					<Reveal delay={120}>
						<div className="relative">
							<div
								aria-hidden="true"
								className="absolute inset-0 translate-x-3 translate-y-3 rounded-3xl border-2 border-gold-500/40 rtl:-translate-x-3"
							/>
							<div className="relative overflow-hidden rounded-3xl border border-gold-500/30 bg-ink-50 shadow-[0_30px_70px_-30px_rgba(15,27,61,0.5)]">
								<iframe
									title="conference-venue-map"
									src="https://www.google.com/maps?q=Warith+Al-Anbiyaa+University,+Karbala,+Iraq&output=embed"
									width="100%"
									height="420"
									className="block"
									style={{ border: 0 }}
									loading="lazy"
									referrerPolicy="no-referrer-when-downgrade"
								/>
							</div>
						</div>
					</Reveal>
				</div>
			</div>
		</section>
	);
}
