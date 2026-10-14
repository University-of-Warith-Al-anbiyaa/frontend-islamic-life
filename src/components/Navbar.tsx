import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
	Menu,
	X,
	Moon,
	Sun,
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	Info,
	Images,
} from "lucide-react";
import {
	Link,
	useLocation,
	useNavigate,
	type LinkProps,
} from "react-router-dom";
import { createPortal } from "react-dom";
import { useApp } from "../context/AppContext";
import ConferenceLogo from "./ConferenceLogo";
import { StarFrame, StarMark, StarPattern } from "./home/kit";
import { GALLERY_EDITION_INDEXES, GALLERY_PATH } from "../config/gallery";

/** نقطة ذهبية نابضة تدل على النسخة الحالية. */
function PulseDot() {
	return (
		<span aria-hidden="true" className="relative flex h-2 w-2 shrink-0">
			<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400/70 motion-reduce:hidden" />
			<span className="relative inline-flex h-2 w-2 rounded-full bg-gold-400" />
		</span>
	);
}

export default function Navbar() {
	const {
		t,
		lang,
		setLang,
		theme,
		toggleTheme,
		openSubmission,
		openCountdown,
	} = useApp();
	const [scrolled, setScrolled] = useState(false);
	const [open, setOpen] = useState(false);
	const [previousVersionsOpen, setPreviousVersionsOpen] = useState(false);
	const [selectedPreviousVersion, setSelectedPreviousVersion] = useState<
		(typeof t.nav.previousVersionsDetails)[number] | null
	>(null);
	// فهرس النسخة التي قائمتها الفرعية (المعرض) مفتوحة حالياً
	const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
	const navbarRef = useRef<HTMLElement>(null);
	const previousVersionsTriggerRef = useRef<HTMLButtonElement>(null);
	const previousVersionsMenuRef = useRef<HTMLDivElement>(null);
	const location = useLocation();
	const navigate = useNavigate();
	const scrolledTextClass = theme === "dark" ? "text-paper" : "text-ink-900";
	const isRtl = t.dir === "rtl";
	const SubmenuArrow = isRtl ? ChevronLeft : ChevronRight;
	const versionSubmenuItems = [
		{ label: t.nav.galleryLabel, to: GALLERY_PATH, icon: Images },
	];

	const isSeventhPage = location.pathname.startsWith("/seventh-conference");
	const isGalleryPage = location.pathname.startsWith(GALLERY_PATH);
	const isEnglishSeventhPage = isSeventhPage && lang === "en";
	const activeLinks = isSeventhPage
		? t.seventhConference.navLinks.filter(
				(link) => link.id !== "contact" && link.id !== "seventh-hero",
			)
		: t.nav.links.filter((link) => link.id !== "contact");

	const contactLink = isSeventhPage
		? t.seventhConference.navLinks.find((link) => link.id === "contact")
		: t.nav.links.find((link) => link.id === "contact");

	const supportsHover = () =>
		window.matchMedia("(hover: hover) and (pointer: fine)").matches;

	const togglePreviousVersionsOnTouch = () => {
		if (!supportsHover()) {
			setPreviousVersionsOpen((value) => !value);
		}
	};

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 40);
		onScroll();
		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	useEffect(() => {
		if (!previousVersionsOpen) {
			setOpenSubmenu(null);
			return;
		}

		const closeOnOutsideClick = (event: PointerEvent) => {
			if (!navbarRef.current?.contains(event.target as Node)) {
				setPreviousVersionsOpen(false);
			}
		};

		document.addEventListener("pointerdown", closeOnOutsideClick);
		return () =>
			document.removeEventListener("pointerdown", closeOnOutsideClick);
	}, [previousVersionsOpen]);

	// Escape: يغلق القائمة الفرعية أولاً ثم قائمة النسخ السابقة، ويعيد التركيز للعنصر الأب
	useEffect(() => {
		if (!previousVersionsOpen) return;

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key !== "Escape") return;
			const focusWasInside = navbarRef.current?.contains(
				document.activeElement,
			);
			if (openSubmenu !== null) {
				const parentIndex = openSubmenu;
				setOpenSubmenu(null);
				if (focusWasInside) focusVersionItem(parentIndex);
			} else {
				setPreviousVersionsOpen(false);
				if (focusWasInside) previousVersionsTriggerRef.current?.focus();
			}
		};

		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [previousVersionsOpen, openSubmenu]);

	useEffect(() => {
		setPreviousVersionsOpen(false);
		setOpen(false);
	}, [location.pathname]);

	useEffect(() => {
		if (!selectedPreviousVersion) return;

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") setSelectedPreviousVersion(null);
		};
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		document.addEventListener("keydown", onKeyDown);

		return () => {
			document.body.style.overflow = previousOverflow;
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [selectedPreviousVersion]);

	const openPreviousVersion = (index: number) => {
		setSelectedPreviousVersion(t.nav.previousVersionsDetails[index]);
		setPreviousVersionsOpen(false);
		setOpen(false);
	};

	const hasVersionSubmenu = (index: number) =>
		GALLERY_EDITION_INDEXES.includes(index);

	const toggleVersionSubmenu = (index: number) =>
		setOpenSubmenu((current) => (current === index ? null : index));

	const closeAllMenus = () => {
		setOpenSubmenu(null);
		setPreviousVersionsOpen(false);
		setOpen(false);
	};

	const handleSubmenuItemClick: LinkProps["onClick"] = () => {
		closeAllMenus();
		window.scrollTo({ top: 0 });
	};

	// تنتظر إطار رسم واحد حتى تظهر العناصر بعد فتح القائمة
	const focusInMenu = (selector: string) =>
		window.requestAnimationFrame(() =>
			previousVersionsMenuRef.current
				?.querySelector<HTMLElement>(selector)
				?.focus(),
		);

	const focusVersionItem = (index: number) =>
		focusInMenu(`[data-version-index="${index}"]`);

	const handlePreviousVersionsTriggerKeyDown = (
		event: React.KeyboardEvent<HTMLButtonElement>,
	) => {
		if (["Enter", " ", "ArrowDown"].includes(event.key)) {
			event.preventDefault();
			setPreviousVersionsOpen(true);
			focusInMenu("[data-version-index]");
		}
	};

	const handlePreviousVersionsMenuKeyDown = (
		event: React.KeyboardEvent<HTMLDivElement>,
	) => {
		const target = event.target as HTMLElement;
		const towardSubmenu = isRtl ? "ArrowLeft" : "ArrowRight";
		const awayFromSubmenu = isRtl ? "ArrowRight" : "ArrowLeft";
		const submenuOwner = target.closest<HTMLElement>("[data-submenu-owner]");
		const inSubmenu = target.hasAttribute("data-submenu-item");

		if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			event.preventDefault();
			const selector = inSubmenu
				? "[data-submenu-item]"
				: "[data-version-index]";
			const scope = inSubmenu ? submenuOwner : previousVersionsMenuRef.current;
			const items = Array.from(
				scope?.querySelectorAll<HTMLElement>(selector) ?? [],
			);
			const current = items.indexOf(target);
			const step = event.key === "ArrowDown" ? 1 : -1;
			items[(current + step + items.length) % items.length]?.focus();
			if (!inSubmenu) setOpenSubmenu(null);
		} else if (event.key === towardSubmenu && submenuOwner && !inSubmenu) {
			event.preventDefault();
			setOpenSubmenu(Number(submenuOwner.dataset.submenuOwner));
			window.requestAnimationFrame(() =>
				submenuOwner.querySelector<HTMLElement>("[data-submenu-item]")?.focus(),
			);
		} else if (event.key === awayFromSubmenu && inSubmenu && submenuOwner) {
			event.preventDefault();
			const parentIndex = Number(submenuOwner.dataset.submenuOwner);
			setOpenSubmenu(null);
			focusVersionItem(parentIndex);
		}
	};

	const handlePreviousVersionsBlur = (event: React.FocusEvent<HTMLDivElement>) => {
		// النقر خارج القائمة يعالجه مستمع pointerdown؛ هنا نغلق فقط عند انتقال التركيز بـ Tab لعنصر خارجها
		const nextFocus = event.relatedTarget as Node | null;
		if (nextFocus && !event.currentTarget.contains(nextFocus)) {
			setPreviousVersionsOpen(false);
		}
	};

	const scrollTo = (id: string) => {
		setOpen(false);
		const element = document.getElementById(id);
		if (element) {
			if (id === "faq") {
				window.requestAnimationFrame(() => {
					const navbarHeight =
						navbarRef.current?.getBoundingClientRect().height ?? 0;
					const targetTop =
						element.getBoundingClientRect().top +
						window.scrollY -
						navbarHeight -
						16;
					window.scrollTo({ top: targetTop, behavior: "smooth" });
				});
			} else {
				element.scrollIntoView({ behavior: "smooth", block: "start" });
			}
		} else {
			if (isGalleryPage) {
				// أقسام الرئيسية غير موجودة في صفحة المعرض: ننتقل للرئيسية ثم نمرّر للقسم
				navigate("/");
				window.setTimeout(() => {
					document
						.getElementById(id)
						?.scrollIntoView({ behavior: "smooth", block: "start" });
				}, 150);
			} else if (isSeventhPage && id === "hero") {
				navigate("/");
			} else if (
				!isSeventhPage &&
				(id === "rules" || id === "committees" || id === "seventh-hero")
			) {
				navigate("/seventh-conference");
			}
		}
	};

	const handleBrandClick = () => {
		setOpen(false);
		if (isSeventhPage) {
			window.scrollTo({ top: 0, behavior: "smooth" });
		} else {
			scrollTo("hero");
		}
	};

	const handleCountdownOpen = () => {
		openCountdown();
		window.dispatchEvent(new Event("countdown-start"));
	};

	// ===== التصميم: الأصناف المشتركة =====
	// فوق صورة الـ Hero نستخدم النص الفاتح، وبعد التمرير يتبع النص الثيم
	const barText = scrolled ? scrolledTextClass : "text-paper";

	// رابط في الشريط العلوي: خط ذهبي يتمدد من المنتصف عند التمرير فوقه
	const navLinkClass = `relative whitespace-nowrap py-1.5 text-[14px] ${
		isEnglishSeventhPage ? "font-medium" : "font-semibold"
	} transition-colors hover:text-gold-500 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-center after:scale-x-0 after:rounded-full after:bg-gradient-to-r after:from-gold-300 after:to-gold-500 after:transition-transform after:duration-300 hover:after:scale-x-100 ${
		isEnglishSeventhPage ? "shrink-0" : ""
	} ${barText}`;

	// أزرار دائرية صغيرة (العد التنازلي، اللغة، النسخة الحالية، الثيم)
	const pillClass = `inline-flex items-center justify-center whitespace-nowrap rounded-full border px-2.5 py-1.5 text-[12px] font-medium transition-all duration-300 hover:border-gold-400 hover:bg-gold-500/10 hover:text-gold-500 ${
		scrolled
			? `border-gold-500/30 bg-white/50 dark:bg-paper/5 ${scrolledTextClass}`
			: "border-paper/40 bg-paper/5 text-paper backdrop-blur-sm"
	}`;

	// الشارة الذهبية للنسخة الحالية
	const editionPillClass = `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border px-2.5 py-1.5 text-[12px] font-semibold transition-all duration-300 hover:bg-gold-500/25 ${
		scrolled
			? "border-gold-500/50 bg-gold-500/15 text-gold-700 dark:text-gold-300"
			: "border-gold-400/60 bg-gold-500/20 text-gold-300 backdrop-blur-sm"
	}`;

	// زر التقديم الرئيسي: ذهبي متدرّج كما في الـ Hero
	const ctaClass =
		"whitespace-nowrap rounded-full bg-gradient-to-b from-gold-300 to-gold-500 font-bold text-ink-950 shadow-[0_10px_28px_-10px_rgba(201,166,92,0.8)] transition-all hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-10px_rgba(201,166,92,0.9)]";

	// عناصر القوائم المنسدلة (النسخ السابقة) على خلفية لوحة فاتحة/داكنة
	const menuItemClass =
		"group/item flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-start text-[14px] leading-relaxed text-ink-900 transition-colors hover:bg-gold-500/10 hover:text-gold-700 focus-visible:bg-gold-500/10 dark:text-paper dark:hover:text-gold-300";

	// عناصر قائمة الموبايل
	const mobileItemClass =
		"flex w-full items-center gap-3 rounded-xl px-3 py-3 text-start text-[16px] font-medium whitespace-nowrap text-ink-900 transition-colors hover:bg-gold-500/10 hover:text-gold-700 dark:text-paper dark:hover:text-gold-300";

	return (
		<header ref={navbarRef} className="fixed inset-x-0 top-0 z-50">
			{/* طبقات الخلفية: تعتيم علوي فوق الـ Hero، ولوح زجاجي بعد التمرير */}
			<span
				aria-hidden="true"
				className={`pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-950/55 via-ink-950/20 to-transparent transition-opacity duration-500 ${
					scrolled ? "opacity-0" : "opacity-100"
				}`}
			/>
			<span
				aria-hidden="true"
				className={`pointer-events-none absolute inset-0 bg-paper/85 shadow-[0_14px_40px_-26px_rgba(15,27,61,0.5)] backdrop-blur-xl transition-opacity duration-500 dark:bg-ink-950/80 ${
					scrolled ? "opacity-100" : "opacity-0"
				}`}
			/>
			<span
				aria-hidden="true"
				className={`pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-500/70 to-transparent transition-opacity duration-500 ${
					scrolled ? "opacity-100" : "opacity-0"
				}`}
			/>

			<div
				dir={t.dir}
				className={`relative mx-auto flex w-full max-w-[100rem] items-center gap-3 px-3 transition-all duration-500 sm:gap-4 sm:px-5 lg:gap-5 lg:px-8 ${
					scrolled ? "py-2 sm:py-2.5" : "py-3 sm:py-4"
				}`}
			>
				<button
					onClick={handleBrandClick}
					className="group flex min-w-0 shrink-0 items-center gap-2.5 whitespace-nowrap text-start sm:gap-3 min-[1600px]:me-8 min-[1600px]:w-[12rem]"
				>
					<ConferenceLogo className="h-14 w-14 shrink-0 drop-shadow-[0_4px_14px_rgba(201,166,92,0.35)] transition-transform duration-300 group-hover:scale-105 sm:h-16 sm:w-16" />
					<span
						aria-hidden="true"
						className="hidden h-10 w-px shrink-0 bg-gradient-to-b from-transparent via-gold-400/60 to-transparent sm:block"
					/>
					<span
						className={`min-w-0 text-[11px] font-medium leading-tight transition-colors sm:text-[16px] min-[1600px]:text-[14px] ${barText}`}
					>
						<span className="block whitespace-nowrap" dir={t.dir}>
							{t.header.university}
						</span>
						<span
							className={`mt-0.5 block whitespace-nowrap text-[0.86em] font-bold transition-colors ${scrolled ? scrolledTextClass : "text-white"}`}
						>
							{t.header.college}
						</span>
						<span
							className={`mt-0.5 block whitespace-nowrap text-[0.92em] font-bold leading-[1.15] tracking-[0.01em] transition-colors ${
								scrolled
									? scrolledTextClass
									: isSeventhPage
										? "text-gold-400"
										: "text-paper"
							}`}
						>
							{isSeventhPage
								? lang === "ar"
									? "المؤتمر الدولي السابع"
									: "The 7th International Conference"
								: t.header.conference}
						</span>
					</span>
				</button>

				<nav
					className={`hidden min-w-0 flex-1 items-center min-[1600px]:flex ${
						!isSeventhPage ? "justify-center" : "justify-end"
					} ${
						isEnglishSeventhPage ? "flex-wrap gap-x-4 gap-y-1" : "gap-7"
					}`}
				>
					{activeLinks.map((link) => (
						<button
							key={link.id}
							onClick={() => scrollTo(link.id)}
							className={navLinkClass}
						>
							{link.label}
						</button>
					))}

					{contactLink && (
						<button
							onClick={() => scrollTo(contactLink.id)}
							className={navLinkClass}
						>
							{contactLink.label}
						</button>
					)}

					<div
						className="relative"
						onMouseEnter={() => {
							if (supportsHover()) setPreviousVersionsOpen(true);
						}}
						onMouseLeave={() => {
							if (supportsHover()) setPreviousVersionsOpen(false);
						}}
						onBlur={handlePreviousVersionsBlur}
					>
						<button
							ref={previousVersionsTriggerRef}
							type="button"
							onClick={togglePreviousVersionsOnTouch}
							onKeyDown={handlePreviousVersionsTriggerKeyDown}
							aria-haspopup="menu"
							aria-expanded={previousVersionsOpen}
							className={`${navLinkClass} flex items-center gap-1.5`}
						>
							{t.nav.previousVersionsLabel}
							<ChevronDown
								size={14}
								className={`text-gold-500 transition-transform ${previousVersionsOpen ? "rotate-180" : ""}`}
							/>
						</button>
						<AnimatePresence>
							{previousVersionsOpen && (
								<motion.div
									initial={{ opacity: 0, y: -6 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -6 }}
									transition={{ duration: 0.18 }}
									ref={previousVersionsMenuRef}
									onKeyDown={handlePreviousVersionsMenuKeyDown}
									className="absolute end-0 top-full z-50 w-80 pt-3"
								>
									<div className="relative rounded-2xl border border-gold-500/30 bg-paper/95 p-2 shadow-[0_30px_70px_-24px_rgba(15,27,61,0.5)] backdrop-blur-xl dark:border-gold-400/25 dark:bg-ink-900/95">
										<span
											aria-hidden="true"
											className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/80 to-transparent"
										/>
										{t.nav.previousVersions.map((version, index) => {
											if (!hasVersionSubmenu(index)) {
												return (
													<button
														key={version}
														type="button"
														data-version-index={index}
														onClick={() => openPreviousVersion(index)}
														className={menuItemClass}
													>
														<StarMark className="h-2.5 w-2.5 shrink-0 text-gold-500/60 transition-colors group-hover/item:text-gold-500" />
														{version}
													</button>
												);
											}

											const submenuOpen = openSubmenu === index;
											return (
												<div
													key={version}
													data-submenu-owner={index}
													className="relative"
													onMouseEnter={() => {
														if (supportsHover()) setOpenSubmenu(index);
													}}
													onMouseLeave={() => {
														if (supportsHover()) setOpenSubmenu(null);
													}}
												>
													<div
														className={`flex items-stretch rounded-xl transition-colors ${
															submenuOpen ? "bg-gold-500/10" : ""
														}`}
													>
														<button
															type="button"
															data-version-index={index}
															onClick={() => openPreviousVersion(index)}
															className={`${menuItemClass} flex-1 !pe-1`}
														>
															<StarMark className="h-2.5 w-2.5 shrink-0 text-gold-500/60 transition-colors group-hover/item:text-gold-500" />
															{version}
														</button>
														<button
															type="button"
															onClick={() => toggleVersionSubmenu(index)}
															aria-haspopup="menu"
															aria-expanded={submenuOpen}
															aria-label={`${t.nav.openSubmenu}: ${version}`}
															className={`flex w-9 shrink-0 items-center justify-center rounded-xl transition-colors hover:text-gold-500 ${
																submenuOpen
																	? "text-gold-500"
																	: "text-ink-900/60 dark:text-paper/60"
															}`}
														>
															<SubmenuArrow
																size={15}
																className={`transition-transform duration-200 ${
																	submenuOpen
																		? isRtl
																			? "-translate-x-0.5 scale-125"
																			: "translate-x-0.5 scale-125"
																		: ""
																}`}
															/>
														</button>
													</div>
													<AnimatePresence>
														{submenuOpen && (
															<motion.div
																initial={{ opacity: 0, x: isRtl ? 6 : -6 }}
																animate={{ opacity: 1, x: 0 }}
																exit={{ opacity: 0, x: isRtl ? 6 : -6 }}
																transition={{ duration: 0.16 }}
																className="absolute start-full top-0 z-[60] ps-1.5"
															>
																<div
																	role="menu"
																	aria-label={version}
																	className="w-48 rounded-2xl border border-gold-500/30 bg-paper p-1.5 shadow-[0_24px_60px_-22px_rgba(15,27,61,0.5)] dark:border-gold-400/25 dark:bg-ink-900"
																>
																	{versionSubmenuItems.map((item) => (
																		<Link
																			key={item.to}
																			to={item.to}
																			role="menuitem"
																			data-submenu-item=""
																			onClick={handleSubmenuItemClick}
																			className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[14px] font-medium text-ink-900 transition-colors hover:bg-gold-500/10 hover:text-gold-700 dark:text-paper dark:hover:text-gold-300"
																		>
																			<item.icon
																				size={15}
																				className="text-gold-500"
																			/>
																			{item.label}
																		</Link>
																	))}
																</div>
															</motion.div>
														)}
													</AnimatePresence>
												</div>
											);
										})}
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</nav>

				<div
					className="flex shrink-0 items-center justify-end gap-2"
					dir={lang === "ar" ? "rtl" : "ltr"}
				>
					<div className="hidden items-center gap-2 min-[1600px]:flex">
						<button
							type="button"
							onClick={handleCountdownOpen}
							className={pillClass}
						>
							{lang === "ar" ? "العد التنازلي" : "Countdown"}
						</button>

						{!isSeventhPage ? (
							<button
								type="button"
								onClick={() => {
									navigate("/seventh-conference");
									window.scrollTo({ top: 0, behavior: "smooth" });
								}}
								className={editionPillClass}
							>
								<PulseDot />
								<span>{lang === "ar" ? "النسخة الحالية" : "Current Edition"}</span>
							</button>
						) : (
							<button
								type="button"
								onClick={() => {
									navigate("/");
									window.scrollTo({ top: 0, behavior: "smooth" });
								}}
								className={pillClass}
							>
								<span>{t.seventhConference.backToPortal}</span>
							</button>
						)}

						<button
							onClick={() => setLang(lang === "ar" ? "en" : "ar")}
							aria-label="toggle language"
							className={pillClass}
						>
							{t.ui.langToggle}
						</button>
					</div>

					<button
						onClick={toggleTheme}
						aria-label="toggle theme"
						className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 hover:border-gold-400 hover:bg-gold-500/10 hover:text-gold-500 ${
							scrolled
								? `border-gold-500/30 bg-white/50 dark:bg-paper/5 ${scrolledTextClass}`
								: "border-paper/40 bg-paper/5 text-paper backdrop-blur-sm"
						}`}
					>
						{theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
					</button>
					<button
						onClick={openSubmission}
						className={`${ctaClass} hidden min-w-[9.5rem] px-6 py-2 text-[16px] min-[1600px]:block`}
					>
						{t.nav.submit}
					</button>
					<button
						onClick={() => setOpen((v) => !v)}
						className={`flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 hover:border-gold-400 hover:bg-gold-500/10 hover:text-gold-500 min-[1600px]:hidden ${
							scrolled
								? `border-gold-500/30 bg-white/50 dark:bg-paper/5 ${scrolledTextClass}`
								: "border-paper/40 bg-paper/5 text-paper backdrop-blur-sm"
						}`}
						aria-label="toggle menu"
					>
						{open ? <X size={18} /> : <Menu size={18} />}
					</button>
				</div>
			</div>

			{open && (
				<div className="relative px-3 pb-3 sm:px-5 min-[1600px]:hidden">
					<div className="max-h-[calc(100svh-6.5rem)] overflow-y-auto overscroll-contain rounded-3xl border border-gold-500/30 bg-paper/95 p-3 shadow-[0_30px_70px_-24px_rgba(15,27,61,0.55)] backdrop-blur-xl dark:border-gold-400/25 dark:bg-ink-900/95 sm:p-4">
						<div className="flex flex-col gap-1">
							{activeLinks.map((link) => (
								<button
									key={link.id}
									onClick={() => scrollTo(link.id)}
									className={mobileItemClass}
								>
									<StarMark className="h-3 w-3 shrink-0 text-gold-500" />
									{link.label}
								</button>
							))}

							{contactLink && (
								<button
									onClick={() => scrollTo(contactLink.id)}
									className={mobileItemClass}
								>
									<StarMark className="h-3 w-3 shrink-0 text-gold-500" />
									{contactLink.label}
								</button>
							)}

							<div className="mt-2 border-t border-gold-500/20 pt-2">
								<button
									type="button"
									onClick={() => {
										setOpen(false);
										handleCountdownOpen();
									}}
									className={`${mobileItemClass} mb-1`}
								>
									<StarMark className="h-3 w-3 shrink-0 text-gold-500" />
									{lang === "ar" ? "العد التنازلي" : "Countdown"}
								</button>

								<button
									type="button"
									onClick={togglePreviousVersionsOnTouch}
									aria-expanded={previousVersionsOpen}
									className={mobileItemClass}
								>
									<StarMark className="h-3 w-3 shrink-0 text-gold-500" />
									{t.nav.previousVersionsLabel}
									<ChevronDown
										size={15}
										className={`ms-auto text-gold-500 transition-transform ${previousVersionsOpen ? "rotate-180" : ""}`}
									/>
								</button>
								<AnimatePresence>
									{previousVersionsOpen && (
										<motion.div
											initial={{ opacity: 0, height: 0 }}
											animate={{ opacity: 1, height: "auto" }}
											exit={{ opacity: 0, height: 0 }}
											className="mt-1 overflow-hidden rounded-2xl border border-gold-500/25 bg-gold-500/[0.04]"
										>
											{t.nav.previousVersions.map((version, index) => {
												const itemClass =
													"block w-full rounded-xl px-4 py-2.5 text-start text-[14px] whitespace-nowrap text-ink-900 transition-colors hover:bg-gold-500/10 hover:text-gold-700 dark:text-paper dark:hover:text-gold-300";

												if (!hasVersionSubmenu(index)) {
													return (
														<button
															key={version}
															type="button"
															onClick={() => {
																openPreviousVersion(index);
															}}
															className={itemClass}
														>
															{version}
														</button>
													);
												}

												const submenuOpen = openSubmenu === index;
												return (
													<div key={version}>
														<div
															className={`flex items-stretch rounded-xl ${submenuOpen ? "bg-gold-500/10" : ""}`}
														>
															<button
																type="button"
																onClick={() => openPreviousVersion(index)}
																className={`${itemClass} min-w-0 flex-1 overflow-hidden text-ellipsis`}
															>
																{version}
															</button>
															<button
																type="button"
																onClick={() => toggleVersionSubmenu(index)}
																aria-expanded={submenuOpen}
																aria-label={`${t.nav.openSubmenu}: ${version}`}
																className={`flex w-11 shrink-0 items-center justify-center transition-colors ${
																	submenuOpen
																		? "text-gold-500"
																		: "text-ink-900/70 dark:text-paper/70"
																}`}
															>
																<ChevronDown
																	size={16}
																	className={`transition-transform duration-200 ${submenuOpen ? "rotate-180" : ""}`}
																/>
															</button>
														</div>
														<AnimatePresence initial={false}>
															{submenuOpen && (
																<motion.div
																	initial={{ opacity: 0, height: 0 }}
																	animate={{ opacity: 1, height: "auto" }}
																	exit={{ opacity: 0, height: 0 }}
																	className="overflow-hidden"
																>
																	{versionSubmenuItems.map((item) => (
																		<Link
																			key={item.to}
																			to={item.to}
																			onClick={handleSubmenuItemClick}
																			className="mx-2 flex items-center gap-2 rounded-xl border-s-2 border-gold-500/60 py-2 pe-4 ps-6 text-[14px] font-medium text-ink-900 transition-colors hover:bg-gold-500/10 hover:text-gold-700 dark:text-paper dark:hover:text-gold-300"
																		>
																			<item.icon
																				size={15}
																				className="text-gold-500"
																			/>
																			{item.label}
																		</Link>
																	))}
																</motion.div>
															)}
														</AnimatePresence>
													</div>
												);
											})}
										</motion.div>
									)}
								</AnimatePresence>
							</div>

							{!isSeventhPage ? (
								<button
									type="button"
									onClick={() => {
										setOpen(false);
										navigate("/seventh-conference");
										window.scrollTo({ top: 0, behavior: "smooth" });
									}}
									className="mt-1 flex items-center gap-3 rounded-xl border border-gold-500/30 bg-gold-500/10 px-3 py-3 text-start text-[16px] font-semibold whitespace-nowrap text-gold-700 transition-colors hover:bg-gold-500/20 dark:text-gold-300"
								>
									<PulseDot />
									<span>
										{lang === "ar"
											? "النسخة الحالية (المؤتمر الدولي السابع)"
											: "Current Edition (7th Conf)"}
									</span>
								</button>
							) : (
								<button
									type="button"
									onClick={() => {
										setOpen(false);
										navigate("/");
										window.scrollTo({ top: 0, behavior: "smooth" });
									}}
									className={`${mobileItemClass} mt-1 font-semibold`}
								>
									<StarMark className="h-3 w-3 shrink-0 text-gold-500" />
									<span>{t.seventhConference.backToPortal}</span>
								</button>
							)}

							<div className="mt-3 flex items-center gap-2 border-t border-gold-500/20 px-1 pt-3">
								<button
									onClick={() => setLang(lang === "ar" ? "en" : "ar")}
									className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-gold-500/30 px-4 py-2 text-[14px] font-medium text-ink-900 transition-colors hover:border-gold-400 hover:bg-gold-500/10 dark:text-paper"
								>
									{t.ui.langToggle}
								</button>
								<button
									onClick={() => {
										setOpen(false);
										openSubmission();
									}}
									className={`${ctaClass} flex-1 px-4 py-2 text-[14px]`}
								>
									{t.nav.submit}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{createPortal(
				<AnimatePresence>
					{selectedPreviousVersion && (
						<motion.div
							className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-ink-950/70 px-4 py-8 backdrop-blur-sm"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onMouseDown={(event) => {
								if (event.target === event.currentTarget)
									setSelectedPreviousVersion(null);
							}}
						>
							<motion.div
								role="dialog"
								aria-modal="true"
								aria-labelledby="previous-version-modal-title"
								className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-gold-500/30 bg-paper shadow-[0_40px_100px_-30px_rgba(0,0,0,0.7)] dark:border-gold-400/25 dark:bg-ink-900"
								initial={{ opacity: 0, y: 24, scale: 0.97 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, y: 16, scale: 0.98 }}
								transition={{ duration: 0.25 }}
							>
								<span
									aria-hidden="true"
									className="absolute inset-x-0 top-0 z-10 h-1 bg-gradient-to-r from-gold-600 via-gold-300 to-gold-600"
								/>
								<StarPattern
									className="text-gold-500/[0.08] dark:text-gold-300/[0.06]"
									fade={false}
								/>
								<div className="relative flex items-start justify-between border-b border-gold-500/20 px-6 py-5 pt-6 sm:px-8">
									<div className="flex items-start gap-4">
										<StarFrame size="md" className="text-gold-500">
											<Info
												size={20}
												strokeWidth={1.8}
												className="text-gold-600 dark:text-gold-300"
											/>
										</StarFrame>
										<div dir={t.dir}>
											<p className="text-xs font-semibold text-gold-700 dark:text-gold-300">
												{t.nav.previousVersionsLabel}
											</p>
											<h2
												id="previous-version-modal-title"
												className="mt-1 font-display text-2xl text-ink-900 dark:text-paper"
											>
												{selectedPreviousVersion.edition}
											</h2>
										</div>
									</div>
									<button
										type="button"
										onClick={() => setSelectedPreviousVersion(null)}
										aria-label={lang === "ar" ? "إغلاق" : "Close"}
										className="flex h-9 w-9 items-center justify-center rounded-full border border-gold-500/30 text-slate-ink transition-colors hover:border-gold-400 hover:bg-gold-500/10 hover:text-gold-700 dark:text-ink-200 dark:hover:text-gold-300"
									>
										<X size={18} />
									</button>
								</div>
								<div
									dir={t.dir}
									className="relative space-y-5 px-6 py-7 text-base leading-relaxed text-slate-ink dark:text-ink-200 sm:px-8 sm:py-8"
								>
									<div>
										<p className="text-xs font-semibold text-gold-700 dark:text-gold-300">
											{lang === "ar" ? "السنة" : "Year"}
										</p>
										<p className="mt-1 text-lg font-semibold text-ink-900 dark:text-paper">
											{selectedPreviousVersion.year}
										</p>
									</div>
									<div>
										<p className="text-xs font-semibold text-gold-700 dark:text-gold-300">
											{lang === "ar" ? "العنوان" : "Title"}
										</p>
										<p className="mt-1 text-lg font-semibold text-ink-900 dark:text-paper">
											{selectedPreviousVersion.title}
										</p>
									</div>
									<div>
										<p className="text-xs font-semibold text-gold-700 dark:text-gold-300">
											{lang === "ar" ? "ملاحظات" : "Notes"}
										</p>
										<p className="mt-1 text-justify">
											{selectedPreviousVersion.notes}
										</p>
									</div>
									<div className="flex justify-end border-t border-gold-500/20 pt-5">
										<button
											type="button"
											onClick={() => setSelectedPreviousVersion(null)}
											className={`${ctaClass} px-7 py-2.5 text-sm`}
										>
											{lang === "ar" ? "إغلاق" : "Close"}
										</button>
									</div>
								</div>
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>,
				document.body,
			)}
		</header>
	);
}
