import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

/**
 * عناصر التصميم المشتركة لصفحة المؤتمر العام:
 * العلامة الدائرية، الفاصل الزخرفي، ترويسة القسم، وخلفية الزخرفة.
 */

/** علامة دائرية صغيرة. */
export function StarMark({ className = "h-3 w-3" }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 16 16"
			aria-hidden="true"
			className={className}
			fill="none"
			stroke="currentColor"
			strokeWidth="1.5"
		>
			<circle cx="8" cy="8" r="5.5" />
			<circle cx="8" cy="8" r="1.5" fill="currentColor" stroke="none" />
		</svg>
	);
}

const frameSizes = {
	md: "h-14 w-14",
	lg: "h-20 w-20",
	xl: "h-28 w-28",
} as const;

/** إطار دائري يحيط برقم أو أيقونة. لون الخط من text-* على الحاوية. */
export function StarFrame({
	children,
	size = "md",
	className = "",
}: {
	children: ReactNode;
	size?: keyof typeof frameSizes;
	className?: string;
}) {
	return (
		<span
			className={`relative inline-flex shrink-0 items-center justify-center ${frameSizes[size]} ${className}`}
		>
			<svg
				viewBox="0 0 48 48"
				aria-hidden="true"
				className="absolute inset-0 h-full w-full"
				fill="none"
				stroke="currentColor"
				strokeWidth="0.9"
			>
				<circle cx="24" cy="24" r="20" />
				<circle cx="24" cy="24" r="16" strokeDasharray="1.5 2.5" />
				<circle cx="24" cy="24" r="12" fill="currentColor" fillOpacity="0.08" />
			</svg>
			<span className="relative flex items-center justify-center">{children}</span>
		</span>
	);
}

/** فاصل زخرفي: خط وعلامة دائرية. اللون من text-* على الحاوية (الافتراضي ذهبي). */
export function Ornament({
	align = "center",
	className = "",
}: {
	align?: "center" | "start";
	className?: string;
}) {
	if (align === "center") {
		return (
			<span
				dir="ltr"
				aria-hidden="true"
				className={`flex items-center justify-center gap-3 text-gold-500 ${className}`}
			>
				<span className="h-px w-14 bg-gradient-to-r from-transparent to-current opacity-70" />
				<StarMark className="h-3 w-3" />
				<span className="h-px w-14 bg-gradient-to-r from-current to-transparent opacity-70" />
			</span>
		);
	}

	return (
		<span
			aria-hidden="true"
			className={`flex items-center gap-3 text-gold-500 ${className}`}
		>
			<StarMark className="h-3 w-3" />
			<span className="h-px w-20 bg-gradient-to-r from-current to-transparent opacity-70 rtl:bg-gradient-to-l" />
		</span>
	);
}

/** ترويسة موحّدة لكل أقسام الصفحة: أيقونة اختيارية، عنوان صغير، عنوان، فاصل، نص تمهيدي. */
export function SectionHeading({
	title,
	eyebrow,
	lead,
	icon: Icon,
	align = "center",
	tone = "light",
	className = "",
}: {
	title: ReactNode;
	eyebrow?: ReactNode;
	lead?: ReactNode;
	icon?: LucideIcon;
	align?: "center" | "start";
	tone?: "light" | "dark";
	className?: string;
}) {
	const center = align === "center";
	const dark = tone === "dark";

	return (
		<div
			className={`${center ? "mx-auto max-w-3xl text-center" : "max-w-xl"} ${className}`}
		>
			{Icon && (
				<StarFrame
					size="lg"
					className={`mb-6 ${center ? "mx-auto" : ""} ${dark ? "text-gold-400" : "text-gold-500"}`}
				>
					<Icon
						size={28}
						strokeWidth={1.6}
						aria-hidden="true"
						className={dark ? "text-gold-300" : "text-gold-600 dark:text-gold-300"}
					/>
				</StarFrame>
			)}
			{eyebrow && (
				<p
					className={`mb-3 text-sm font-semibold sm:text-base ${dark ? "text-gold-300" : "text-gold-700 dark:text-gold-300"}`}
				>
					{eyebrow}
				</p>
			)}
			<h2
				className={`font-display text-3xl leading-tight sm:text-4xl lg:text-5xl ${dark ? "text-paper" : "text-ink-900 dark:text-paper"}`}
			>
				{title}
			</h2>
			<Ornament align={align} className="mt-5" />
			{lead && (
				<p
					className={`mt-5 text-base leading-relaxed sm:text-lg ${dark ? "text-ink-200" : "text-slate-ink dark:text-ink-200"}`}
				>
					{lead}
				</p>
			)}
		</div>
	);
}

/** خلفية الزخرفة الهندسية. الشفافية واللون من text-* عبر className، وتتلاشى نحو الأطراف افتراضياً. */
export function StarPattern({
	className = "",
	fade = true,
}: {
	className?: string;
	fade?: boolean;
}) {
	return (
		<div
			aria-hidden="true"
			className={`pointer-events-none absolute inset-0 ${fade ? "home-pattern-fade" : ""} ${className}`}
		>
			<div className="home-pattern absolute inset-0" />
		</div>
	);
}
