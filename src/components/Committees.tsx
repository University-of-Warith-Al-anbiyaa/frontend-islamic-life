import { useState } from "react";
import { useApp } from "../context/AppContext";
import Reveal from "./Reveal";
import { SectionHeading, StarPattern } from "./home/kit";

const scientificCommitteeMembers = [
	{
		name: "أ.د. نور مهدي الساعدي",
		org: "جامعة وارث الأنبياء (ع)",
		role: "رئيساً",
	},
	{
		name: "أ.د. فردوس هاشم احمد",
		org: "جامعة وارث الأنبياء (ع)",
		role: "عضواً",
	},
	{ name: "أ.د. حليم عباس عبيد", org: "جامعة بغداد", role: "عضواً" },
	{ name: "أ.د. رياض عبد الرحيم", org: "جامعة البصرة", role: "عضواً" },
	{ name: "أ.د. محمد هادي شهاب", org: "جامعة تكريت", role: "عضواً" },
	{ name: "أ.د. علي شكر داود", org: "الجامعة العراقية", role: "عضواً" },
	{ name: "أ.د. كامران اورحمان مجيد", org: "جامعة السليمانية", role: "عضواً" },
	{ name: "أ.د. حيدر حسن ديوان", org: "جامعة الكوفة", role: "عضواً" },
	{ name: "أ.د. حيدر محمد الشلاه", org: "جامعة بابل", role: "عضواً" },
	{ name: "أ.د. خالد عليوي العرداوي", org: "جامعة كربلاء", role: "عضواً" },
	{ name: "أ.د. اياد كامل إبراهيم", org: "جامعة زاخو", role: "عضواً" },
	{ name: "أ.د. بركاوي جليب دارم", org: "جامعة واسط", role: "عضواً" },
	{ name: "أ.د. احمد صبيح محسن", org: "جامعة العميد", role: "عضواً" },
	{
		name: "أ.م.د. مهند عبد الحسن جلاب",
		org: "بيت الحكمة العراقي",
		role: "عضواً",
	},
	{
		name: "أ.م.د. محمد عبد الهادي شاكر",
		org: "جامعة الزهراء (ع)",
		role: "عضواً",
	},
	{ name: "أ.م.د. حسن كامل محمد", org: "وارث الأنبياء (ع)", role: "عضواً" },
	{ name: "أ.م.د. نجلاء مهدي محسن", org: "معهد العلمين", role: "عضواً" },
	{ name: "أ.م.د. علي شمخي جبر", org: "معهد العلمين", role: "عضواً" },
	{
		name: "أ.م.د. محمد مرزوك موزان العلي",
		org: "جامعة المصطفى قم",
		role: "عضواً",
	},
	{
		name: "أ.م.د. فلاح سبتي جمعة",
		org: "جامعة ال البيت العالمية قم",
		role: "عضواً",
	},
	{
		name: "أ.م.د. احمد يحى هادي",
		org: "كلية الامام الكاظم (ع) الجامعة",
		role: "عضواً",
	},
	{
		name: "أ.م.د. حيدر عبد الرضا عبد علي",
		org: "كلية الطف الجامعة",
		role: "عضواً",
	},
	{
		name: "أ.م.د. حيدر محمد عبد الله",
		org: "مركز كربلاء للبحوث والدراسات",
		role: "عضواً",
	},
	{ name: "أ.م.د. احمد علي عبود", org: "جامعة الكفيل", role: "عضواً" },
	{
		name: "م.د. عبد الستار جبار الجابري",
		org: "جامعة وارث الأنبياء (ع)",
		role: "عضواً",
	},
];

const preparatoryCommitteeMembers = [
	{
		name: "أ.د. طلال فائق الكمالي",
		org: "جامعة وارث الأنبياء (ع)",
		role: "رئيساً",
	},
	{
		name: "أ.د. سداد هشام حميد",
		org: "هيئة المستشارين في رئاسة الوزراء",
		role: "عضواً",
	},
	{
		name: "أ.م.د. علي احمد ناصر",
		org: "جامعة كربلاء",
		role: "",
	},
	{
		name: "م.د. فاضل عبد الحسن هاشم",
		org: "هيئة الإعلام والاتصالات",
		role: "عضواً",
	},
	{
		name: "م.د. جبريل عبد الستار جبر",
		org: "معهد التطوير النيابي / مجلس النواب",
		role: "عضواً",
	},
	{
		name: "م.د. ناجي عبد الحسن جبار",
		org: "شبكة الإعلام العراقي",
		role: "عضواً",
	},
	{
		name: "م.د. محمد جمال الطيف",
		org: "جامعة وارث الأنبياء (ع)",
		role: "عضواً",
	},
	{ name: "م.د. كرار علي جواد", org: "جامعة وارث الأنبياء (ع)", role: "عضواً" },
	{
		name: "م.د. عباس عدنان كامل",
		org: "جامعة وارث الأنبياء (ع)",
		role: "عضواً",
	},
	{
		name: "م.د. إسراء نظام الدين الطائي",
		org: "جامعة وارث الأنبياء (ع)",
		role: "عضواً",
	},
	{
		name: "م.د. ملهم سالم عيسى",
		org: "جامعة وارث الأنبياء (ع)",
		role: "عضواً",
	},
	{
		name: "م.د. منتظر شكر خضير",
		org: "جامعة وارث الأنبياء (ع)",
		role: "عضواً",
	},
	{
		name: "م.د. عبير فايز الكوسا",
		org: "جامعة وارث الأنبياء (ع)",
		role: "عضواً",
	},
	{
		name: "م.د. إحسان عبد الأمير خليف",
		org: "مدير مكتب الأمين العام للعتبة الحسينية المقدسة",
		role: "عضواً",
	},
	{
		name: "م.م. مرتضى محمد علي",
		org: "جامعة وارث الأنبياء (ع)",
		role: "عضواً",
	},
	{
		name: "م.م. محمد فاضل خليل",
		org: "جامعة وارث الأنبياء (ع)",
		role: "عضواً",
	},
	{
		name: "م.م. أحمد حسين طوفان",
		org: "جامعة وارث الأنبياء (ع)",
		role: "عضواً",
	},
	{
		name: "م.م. كاظم جاسب جبار",
		org: "جامعة وارث الأنبياء (ع)",
		role: "عضواً",
	},
	{
		name: "م.م. فائزة عماد حسن",
		org: "جامعة وارث الأنبياء (ع)",
		role: "عضواً",
	},
	{
		name: "م.م. عمار عبد الإله خليل",
		org: "جامعة وارث الأنبياء (ع)",
		role: "عضواً",
	},
	{
		name: "السيدة فرح سعيد اندراوس",
		org: "ديوان أوقاف الديانات المسيحية والإيزيدية والصابئة المندائية",
		role: "عضواً",
	},
	{
		name: "السيد ضياء صهيب",
		org: "ممثلية كرسي اليونسكو في العراق",
		role: "عضواً",
	},
	{
		name: "السيد باسم جاسم هجول",
		org: "هيئة النزاهة الاتحادية",
		role: "عضواً",
	},
	{
		name: "السيد محمد الكنائي",
		org: "رئيس قسم الموارد البشرية / العتبة الحسينية المقدسة",
		role: "",
	},
];

export default function Committees() {
	const { t } = useApp();
	const [active, setActive] = useState(0);
	const group =
		active === 0
			? { ...t.committees.groups[0], members: scientificCommitteeMembers }
			: active === 1
				? { ...t.committees.groups[1], members: preparatoryCommitteeMembers }
				: t.committees.groups[active];

	return (
		<section
			id="committees"
			className="relative overflow-hidden px-5 py-24 lg:px-10 lg:py-32"
		>
			<StarPattern className="text-gold-500/[0.1] dark:text-gold-400/[0.07]" />

			<div className="relative mx-auto max-w-7xl">
				<Reveal>
					<SectionHeading
						eyebrow={t.committees.title}
						title={t.committees.subtitle}
					/>
				</Reveal>

				<div className="mt-12 flex flex-wrap justify-center gap-3">
					{t.committees.groups.map((g, i) => (
						<button
							key={g.title}
							onClick={() => setActive(i)}
							className={`rounded-full border px-6 py-3 text-sm font-bold transition-all duration-300 sm:text-base ${
								active === i
									? "border-transparent bg-gradient-to-b from-gold-300 to-gold-500 text-ink-950 shadow-[0_12px_32px_-12px_rgba(201,166,92,0.8)]"
									: "border-gold-500/30 bg-white text-ink-900 hover:-translate-y-0.5 hover:border-gold-500 dark:border-gold-400/25 dark:bg-ink-900 dark:text-paper"
							}`}
						>
							{g.title}
						</button>
					))}
				</div>

				<div
					key={active}
					dir={active === 1 ? "rtl" : undefined}
					className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
				>
					{group.members.map((m, i) => {
						const isChair =
							m.role.toLowerCase().includes("رئيس") ||
							m.role.toLowerCase().includes("chair");

						return (
							<Reveal key={m.name} delay={(i % 9) * 45} className="h-full">
								<div className="group relative flex h-full flex-col gap-2 overflow-hidden rounded-2xl border border-ink-900/10 bg-white p-5 shadow-[0_14px_44px_-26px_rgba(15,27,61,0.28)] transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/50 hover:shadow-[0_22px_56px_-26px_rgba(176,140,66,0.5)] dark:border-paper/10 dark:bg-ink-900">
									<span
										aria-hidden="true"
										className={`absolute inset-y-0 start-0 w-1 bg-gradient-to-b from-gold-300 via-gold-500 to-gold-600 transition-opacity duration-300 group-hover:opacity-100 ${isChair ? "opacity-100" : "opacity-40"}`}
									/>
									<div className="flex items-start justify-between gap-3">
										<h3 className="font-display text-base leading-snug text-ink-900 dark:text-paper">
											{m.name}
										</h3>
										{m.role && (
											<span
												className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-bold ${
													isChair
														? "bg-gradient-to-b from-gold-300 to-gold-500 text-ink-950"
														: "bg-gold-500/10 text-gold-700 dark:text-gold-300"
												}`}
											>
												{m.role}
											</span>
										)}
									</div>
									<p className="text-xs leading-relaxed text-slate-ink dark:text-ink-200">
										{m.org}
									</p>
								</div>
							</Reveal>
						);
					})}
				</div>
			</div>
		</section>
	);
}
