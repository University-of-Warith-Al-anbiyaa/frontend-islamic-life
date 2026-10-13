import { Calendar, MapPin, GraduationCap, Award } from "lucide-react";
import { useApp } from "../../context/AppContext";
import Reveal from "../Reveal";

const icons = [Calendar, MapPin, GraduationCap, Award];

/** شريط معلومات المؤتمر: لوح واحد متصل بأربع خلايا يتداخل مع أسفل الـ Hero. */
export default function HomeInfo() {
	const { t } = useApp();

	return (
		<section id="info" className="relative z-10 -mt-12 px-5 lg:-mt-24 lg:px-10">
			<div className="mx-auto max-w-7xl">
				<Reveal>
					<div className="relative overflow-hidden rounded-3xl border border-gold-500/30 bg-paper shadow-[0_30px_80px_-24px_rgba(15,27,61,0.45)] dark:border-gold-400/25 dark:bg-ink-900">
						<span
							aria-hidden="true"
							className="absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-gold-600 via-gold-300 to-gold-600"
						/>
						<div className="grid gap-px bg-gold-500/25 sm:grid-cols-2 lg:grid-cols-4 dark:bg-gold-400/20">
							{t.info.map((item, i) => {
								const Icon = icons[i];
								return (
									<div
										key={item.label}
										className="group flex items-start gap-4 bg-paper p-6 pt-7 transition-colors duration-300 hover:bg-gold-50 dark:bg-ink-900 dark:hover:bg-ink-800 sm:p-7 sm:pt-8"
									>
										<span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-100 to-gold-50 text-gold-600 ring-1 ring-gold-500/30 transition-transform duration-300 group-hover:scale-110 dark:from-gold-500/25 dark:to-gold-500/5 dark:text-gold-300">
											<Icon size={24} strokeWidth={1.8} />
										</span>
										<div className="min-w-0">
											<p className="text-sm font-semibold text-gold-700 dark:text-gold-300">
												{item.label}
											</p>
											<p className="mt-1.5 whitespace-pre-line font-display text-lg leading-snug text-ink-900 dark:text-paper sm:text-xl">
												{item.value}
											</p>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
