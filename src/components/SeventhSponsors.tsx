import { useApp } from "../context/AppContext";
import Reveal from "./Reveal";
import { SectionHeading, StarPattern } from "./home/kit";
import communicationsLogo from "../../logo/هيئة الإعلام والاتصالات.png";
import cabinetAdvisorsLogo from "../../logo/لوكو_هيئة_المستشارين_في_مجلس_الوزراء.-removebg-preview.png";
import unescoLogo from "../../logo/لوكو يونسكو.png";
import integrityCommissionLogo from "../../logo/لوكو هيئة النزاهة.png";
import graduateStudiesLogo from "../../logo/لوكو معهد الدراسات العليا.png";
import parliamentaryDevelopmentLogo from "../../logo/لوكو معهد التطوير النيابي.png";
import diwanLogo from "../../logo/لوكو ديوان.png";
import sunniEndowmentLogo from "../../logo/لوكو ديوان الوقف السني.png";
import iraqiMediaLogo from "../../logo/لوكو الاعلام العراقي.png";
import religiousEndowmentsLogo from "../../logo/ديوان أوقاف الديانات.png";

const supportingOrganizations = [
	{
		nameAr: "هيئة الإعلام والاتصالات",
		nameEn: "Communications and Media Commission",
		logo: communicationsLogo,
	},
	{
		nameAr: "هيئة المستشارين في مجلس الوزراء",
		nameEn: "Council of Ministers Advisory Commission",
		logo: cabinetAdvisorsLogo,
	},
	{
		nameAr: "منظمة الأمم المتحدة للتربية والعلم والثقافة (اليونسكو)",
		nameEn:
			"United Nations Educational, Scientific and Cultural Organization (UNESCO)",
		logo: unescoLogo,
	},
	{
		nameAr: "هيئة النزاهة الاتحادية",
		nameEn: "Federal Commission of Integrity",
		logo: integrityCommissionLogo,
	},
	{
		nameAr: "معهد العلمين للدراسات العليا",
		nameEn: "Al-Alamein Institute for Graduate Studies",
		logo: graduateStudiesLogo,
	},
	{
		nameAr: "معهد التطوير النيابي",
		nameEn: "Parliamentary Development Institute",
		logo: parliamentaryDevelopmentLogo,
	},
	{
		nameAr: "ديوان الوقف الشيعي",
		nameEn: "Shiite Endowment Diwan",
		logo: diwanLogo,
	},
	{
		nameAr: "ديوان الوقف السني",
		nameEn: "Sunni Endowment Diwan",
		logo: sunniEndowmentLogo,
	},
	{
		nameAr: "شبكة الإعلام العراقي",
		nameEn: "Iraqi Media Network",
		logo: iraqiMediaLogo,
	},
	{
		nameAr: "ديوان أوقاف الديانات",
		nameEn: "Diwan of Religious Endowments",
		logo: religiousEndowmentsLogo,
	},
];

export default function SeventhSponsors() {
	const { lang } = useApp();

	return (
		<section className="relative overflow-hidden px-5 py-24 lg:px-10 lg:py-28">
			<StarPattern className="text-gold-500/[0.09] dark:text-gold-400/[0.06]" />

			<div className="relative mx-auto max-w-7xl">
				<Reveal>
					<SectionHeading
						title={lang === "ar" ? "الجهات الساندة" : "Supporting Organizations"}
					/>
				</Reveal>

				<div className="mt-14 grid grid-cols-2 items-stretch gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-5">
					{supportingOrganizations.map((organization, index) => {
						const name =
							lang === "ar" ? organization.nameAr : organization.nameEn;

						return (
							<Reveal
								key={organization.nameAr}
								delay={(index % 5) * 80}
								className="h-full"
							>
								<figure className="group flex h-full flex-col overflow-hidden rounded-3xl border border-ink-900/10 bg-white shadow-[0_18px_50px_-26px_rgba(15,27,61,0.35)] transition-all duration-300 hover:-translate-y-1.5 hover:border-gold-500/50 hover:shadow-[0_26px_60px_-26px_rgba(176,140,66,0.55)] dark:border-paper/10">
									<div className="flex h-36 items-center justify-center bg-white p-6">
										<img
											src={organization.logo}
											alt={name}
											loading="lazy"
											className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
										/>
									</div>
									<figcaption className="flex flex-1 items-center justify-center border-t border-gold-500/25 bg-gold-50/80 px-4 py-3.5 text-center font-display text-sm leading-relaxed text-ink-900 dark:bg-ink-900 dark:text-paper">
										{name}
									</figcaption>
								</figure>
							</Reveal>
						);
					})}
				</div>
			</div>
		</section>
	);
}
