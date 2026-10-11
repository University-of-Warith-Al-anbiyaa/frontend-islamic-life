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
import { GALLERY_EDITION_INDEXES, GALLERY_PATH } from "../config/gallery";

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
	const scrolledTextClass = theme === "dark" ? "text-white" : "text-black";
	const isRtl = t.dir === "rtl";
	const SubmenuArrow = isRtl ? ChevronLeft : ChevronRight;
	const versionSubmenuItems = [
		{ label: t.nav.galleryLabel, to: GALLERY_PATH, icon: Images },
	];

	const isSeventhPage = location.pathname.startsWith("/seventh-conference");
	const isGalleryPage = location.pathname.startsWith(GALLERY_PATH);
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

	return (
		<header
			ref={navbarRef}
			className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
				scrolled
					? "bg-paper/80 dark:bg-ink-950/70 backdrop-blur-md shadow-soft border-b border-ink-900/5 dark:border-paper/5"
					: "bg-transparent"
			}`}
		>
			<div
				dir={t.dir}
				className="mx-auto flex w-full max-w-[100rem] items-center gap-3 px-3 py-3 sm:gap-4 sm:px-5 sm:py-4 lg:gap-5 lg:px-8"
			>
				<button
					onClick={handleBrandClick}
					className="flex min-w-0 shrink-0 items-center gap-2.5 whitespace-nowrap text-start sm:gap-3 min-[1600px]:w-[12rem]"
				>
					<ConferenceLogo className="h-14 w-14 shrink-0 sm:h-16 sm:w-16" />
					<span
						className={`min-w-0 text-[11px] font-medium leading-tight transition-colors sm:text-[16px] min-[1600px]:text-[14px] ${scrolled ? scrolledTextClass : "text-paper"}`}
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

				<nav className="hidden min-w-0 flex-1 items-center justify-center gap-2 min-[1600px]:flex">
					{activeLinks.map((link) => (
						<button
							key={link.id}
							onClick={() => scrollTo(link.id)}
							className={`whitespace-nowrap text-[14px] font-medium transition-colors hover:text-gold-500 ${
								scrolled ? scrolledTextClass : "text-paper"
							}`}
						>
							{link.label}
						</button>
					))}

					{contactLink && (
						<button
							onClick={() => scrollTo(contactLink.id)}
							className={`whitespace-nowrap text-[14px] font-medium transition-colors hover:text-gold-500 ${
								scrolled ? scrolledTextClass : "text-paper"
							}`}
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
							className={`flex items-center gap-1.5 whitespace-nowrap py-1.5 text-[14px] font-medium transition-colors hover:text-gold-500 ${
								scrolled ? scrolledTextClass : "text-paper"
							}`}
						>
							{t.nav.previousVersionsLabel}
							<ChevronDown
								size={14}
								className={`transition-transform ${previousVersionsOpen ? "rotate-180" : ""}`}
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
									className="absolute end-0 top-full z-50 w-72 rounded-lg border border-ink-900/10 bg-paper py-1 shadow-lg dark:border-paper/10 dark:bg-ink-950"
								>
									{t.nav.previousVersions.map((version, index) => {
										const itemClass = `block w-full px-4 py-2.5 text-start text-[14px] transition-colors ${
											scrolled
												? `${scrolledTextClass} hover:bg-black/5`
												: "text-ink-900 hover:bg-ink-900/5 dark:text-paper dark:hover:bg-paper/5"
										}`;

										if (!hasVersionSubmenu(index)) {
											return (
												<button
													key={version}
													type="button"
													data-version-index={index}
													onClick={() => openPreviousVersion(index)}
													className={itemClass}
												>
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
													className={`flex items-stretch transition-colors ${
														submenuOpen
															? "bg-gold-500/10"
															: ""
													}`}
												>
													<button
														type="button"
														data-version-index={index}
														onClick={() => openPreviousVersion(index)}
														className={`${itemClass} flex-1 !pe-1`}
													>
														{version}
													</button>
													<button
														type="button"
														onClick={() => toggleVersionSubmenu(index)}
														aria-haspopup="menu"
														aria-expanded={submenuOpen}
														aria-label={`${t.nav.openSubmenu}: ${version}`}
														className={`flex w-9 shrink-0 items-center justify-center transition-colors hover:text-gold-500 ${
															submenuOpen
																? "text-gold-500"
																: scrolled
																	? scrolledTextClass
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
																className="w-44 rounded-lg border border-gold-500/30 bg-paper py-1 shadow-xl dark:bg-ink-950"
															>
																{versionSubmenuItems.map((item) => (
																	<Link
																		key={item.to}
																		to={item.to}
																		role="menuitem"
																		data-submenu-item=""
																		onClick={handleSubmenuItemClick}
																		className={`flex items-center gap-2 px-4 py-2.5 text-[14px] font-medium transition-colors hover:text-gold-500 ${
																			scrolled
																				? `${scrolledTextClass} hover:bg-black/5`
																				: "text-ink-900 hover:bg-ink-900/5 dark:text-paper dark:hover:bg-paper/5"
																		}`}
																	>
																		<item.icon size={15} className="text-gold-500" />
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
							className={`inline-flex items-center justify-center whitespace-nowrap rounded-full border px-2.5 py-1.5 text-[12px] font-medium transition-colors hover:text-gold-500 ${
								scrolled
									? `border-ink-900/15 ${scrolledTextClass}`
									: "border-paper/50 text-paper"
							}`}
						>
							{lang === "ar" ? "العد التنازلي" : "Countdown"}
						</button>

						{lang === "ar" ? (
							<>
								{!isSeventhPage ? (
									<button
										type="button"
										onClick={() => {
											navigate("/seventh-conference");
											window.scrollTo({ top: 0, behavior: "smooth" });
										}}
										className={`inline-flex items-center justify-center whitespace-nowrap rounded-full border px-2.5 py-1.5 text-[12px] font-semibold transition-all ${
											scrolled
												? theme === "dark"
													? "border-gold-500/50 bg-gold-500/15 text-white hover:bg-gold-500/25"
													: "border-gold-500/50 bg-gold-500/15 text-gold-600 hover:bg-gold-500/25"
												: "border-gold-400/60 bg-gold-500/20 text-gold-300 hover:bg-gold-500/30"
										}`}
									>
										<span>{"النسخة الحالية"}</span>
									</button>
								) : (
									<button
										type="button"
										onClick={() => {
											navigate("/");
											window.scrollTo({ top: 0, behavior: "smooth" });
										}}
										className={`inline-flex items-center justify-center whitespace-nowrap rounded-full border px-2.5 py-1.5 text-[12px] font-semibold transition-all ${
											scrolled
												? `border-ink-900/15 ${scrolledTextClass} hover:bg-ink-900/5`
												: "border-paper/40 text-paper hover:bg-paper/10"
										}`}
									>
										<span>{t.seventhConference.backToPortal}</span>
									</button>
								)}

								<button
									onClick={() => setLang("en")}
									aria-label="toggle language"
									className={`inline-flex items-center justify-center whitespace-nowrap rounded-full border px-2.5 py-1.5 text-[12px] font-medium transition-colors ${
										scrolled
											? `border-ink-900/15 ${scrolledTextClass}`
											: "border-paper/50 text-paper"
									}`}
								>
									{t.ui.langToggle}
								</button>
							</>
						) : (
							<>
								{!isSeventhPage ? (
									<button
										type="button"
										onClick={() => {
											navigate("/seventh-conference");
											window.scrollTo({ top: 0, behavior: "smooth" });
										}}
										className={`inline-flex items-center justify-center whitespace-nowrap rounded-full border px-2.5 py-1.5 text-[12px] font-semibold transition-all ${
											scrolled
												? theme === "dark"
													? "border-gold-500/50 bg-gold-500/15 text-white hover:bg-gold-500/25"
													: "border-gold-500/50 bg-gold-500/15 text-gold-600 hover:bg-gold-500/25"
												: "border-gold-400/60 bg-gold-500/20 text-gold-300 hover:bg-gold-500/30"
										}`}
									>
										<span>Current Edition</span>
									</button>
								) : (
									<button
										type="button"
										onClick={() => {
											navigate("/");
											window.scrollTo({ top: 0, behavior: "smooth" });
										}}
										className={`inline-flex items-center justify-center whitespace-nowrap rounded-full border px-2.5 py-1.5 text-[12px] font-semibold transition-all ${
											scrolled
												? `border-ink-900/15 ${scrolledTextClass} hover:bg-ink-900/5`
												: "border-paper/40 text-paper hover:bg-paper/10"
										}`}
									>
										<span>{t.seventhConference.backToPortal}</span>
									</button>
								)}

								<button
									onClick={() => setLang("ar")}
									aria-label="toggle language"
									className={`inline-flex items-center justify-center whitespace-nowrap rounded-full border px-2.5 py-1.5 text-[12px] font-medium transition-colors ${
										scrolled
											? `border-ink-900/15 ${scrolledTextClass}`
											: "border-paper/50 text-paper"
									}`}
								>
									{t.ui.langToggle}
								</button>
							</>
						)}
					</div>

					<button
						onClick={toggleTheme}
						aria-label="toggle theme"
						className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
							scrolled
								? `border-ink-900/15 ${scrolledTextClass}`
								: "border-paper/50 text-paper"
						}`}
					>
						{theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
					</button>
					<button
						onClick={openSubmission}
						className={`hidden min-w-[9.5rem] whitespace-nowrap rounded-full bg-gold-500 px-6 py-2 text-[16px] font-medium transition-colors hover:bg-gold-400 min-[1600px]:block ${theme === "dark" ? "text-white" : "text-ink-950"}`}
					>
						{t.nav.submit}
					</button>
					<button
						onClick={() => setOpen((v) => !v)}
						className={`flex h-9 w-9 items-center justify-center rounded-full border min-[1600px]:hidden ${
							scrolled
								? `border-ink-900/15 ${scrolledTextClass}`
								: "border-paper/50 text-paper"
						}`}
						aria-label="toggle menu"
					>
						{open ? <X size={18} /> : <Menu size={18} />}
					</button>
				</div>
			</div>

			{open && (
				<div className="max-h-[calc(100svh-5.5rem)] overflow-y-auto overscroll-contain border-t border-ink-900/10 bg-paper px-5 py-4 dark:border-paper/10 dark:bg-ink-950 min-[1600px]:hidden">
					<div className="flex flex-col gap-1">
						{activeLinks.map((link) => (
							<button
								key={link.id}
								onClick={() => scrollTo(link.id)}
								className={`rounded-md px-3 py-2.5 text-start text-[16px] font-medium whitespace-nowrap transition-colors ${
									scrolled
										? `${scrolledTextClass} hover:bg-black/5`
										: "text-ink-900 hover:bg-ink-900/5 dark:text-paper dark:hover:bg-paper/5"
								}`}
							>
								{link.label}
							</button>
						))}

						{contactLink && (
							<button
								onClick={() => scrollTo(contactLink.id)}
								className={`flex items-center rounded-md px-3 py-2.5 text-start text-[16px] font-medium whitespace-nowrap transition-colors ${
									scrolled
										? `${scrolledTextClass} hover:bg-black/5`
										: "text-ink-900 hover:bg-ink-900/5 dark:text-paper dark:hover:bg-paper/5"
								}`}
							>
								{contactLink.label}
							</button>
						)}

						<div className="mt-2 border-t border-ink-900/10 pt-2 dark:border-paper/10">
							<button
								type="button"
								onClick={() => {
									setOpen(false);
									handleCountdownOpen();
								}}
								className={`mb-1 flex w-full items-center rounded-md px-3 py-2.5 text-start text-[16px] font-medium whitespace-nowrap transition-colors ${
									scrolled
										? `${scrolledTextClass} hover:bg-black/5`
										: "text-ink-900 hover:bg-ink-900/5 dark:text-paper dark:hover:bg-paper/5"
								}`}
							>
								{lang === "ar" ? "العد التنازلي" : "Countdown"}
							</button>

							<button
								type="button"
								onClick={togglePreviousVersionsOnTouch}
								aria-expanded={previousVersionsOpen}
								className={`flex w-full items-center rounded-md px-3 py-2.5 text-start text-[16px] font-medium whitespace-nowrap transition-colors ${
									scrolled
										? `${scrolledTextClass} hover:bg-black/5`
										: "text-ink-900 hover:bg-ink-900/5 dark:text-paper dark:hover:bg-paper/5"
								}`}
							>
								{t.nav.previousVersionsLabel}
								<ChevronDown
									size={15}
									className={`ms-auto transition-transform ${previousVersionsOpen ? "rotate-180" : ""}`}
								/>
							</button>
							<AnimatePresence>
								{previousVersionsOpen && (
									<motion.div
										initial={{ opacity: 0, height: 0 }}
										animate={{ opacity: 1, height: "auto" }}
										exit={{ opacity: 0, height: 0 }}
										className="mt-1 overflow-hidden rounded-md border border-ink-900/10 dark:border-paper/10"
									>
										{t.nav.previousVersions.map((version, index) => {
											const itemClass = `block w-full px-4 py-2 text-start text-[14px] whitespace-nowrap transition-colors ${
												scrolled
													? `${scrolledTextClass} hover:bg-black/5`
													: "text-ink-900 hover:bg-ink-900/5 dark:text-paper dark:hover:bg-paper/5"
											}`;

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
														className={`flex items-stretch ${submenuOpen ? "bg-gold-500/10" : ""}`}
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
																	: scrolled
																		? scrolledTextClass
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
																		className={`flex items-center gap-2 border-s-2 border-gold-500/60 py-2 pe-4 ps-8 text-[14px] font-medium transition-colors hover:text-gold-500 ${
																			scrolled
																				? `${scrolledTextClass} hover:bg-black/5`
																				: "text-ink-900 hover:bg-ink-900/5 dark:text-paper dark:hover:bg-paper/5"
																		}`}
																	>
																		<item.icon size={15} className="text-gold-500" />
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
								className={`flex items-center gap-2 rounded-md px-3 py-2.5 text-start text-[16px] font-semibold whitespace-nowrap transition-colors ${
									scrolled
										? `${scrolledTextClass} hover:bg-black/5`
										: "text-gold-600 hover:bg-gold-500/10 dark:text-gold-400"
								}`}
							>
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
								className={`flex items-center gap-2 rounded-md px-3 py-2.5 text-[16px] font-semibold whitespace-nowrap transition-colors ${
									scrolled
										? `${scrolledTextClass} hover:bg-black/5`
										: "text-ink-900 hover:bg-ink-900/5 dark:text-paper dark:hover:bg-paper/5"
								}`}
							>
								<span>{t.seventhConference.backToPortal}</span>
							</button>
						)}

						<div className="mt-2 flex items-center gap-2 px-3">
							<button
								onClick={() => setLang(lang === "ar" ? "en" : "ar")}
								className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-[14px] font-medium transition-colors ${
									scrolled
										? `border-ink-900/15 ${scrolledTextClass}`
										: "border-ink-900/15 text-ink-900 dark:border-paper/20 dark:text-paper"
								}`}
							>
								{t.ui.langToggle}
							</button>
							<button
								onClick={() => {
									setOpen(false);
									openSubmission();
								}}
								className={`whitespace-nowrap rounded-full bg-gold-500 px-4 py-1.5 text-[14px] font-medium transition-colors ${
									scrolled ? scrolledTextClass : "text-ink-950"
								}`}
							>
								{t.nav.submit}
							</button>
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
								className="w-full max-w-xl overflow-hidden rounded-xl border border-gold-500/30 bg-paper shadow-2xl dark:bg-ink-950"
								initial={{ opacity: 0, y: 24, scale: 0.97 }}
								animate={{ opacity: 1, y: 0, scale: 1 }}
								exit={{ opacity: 0, y: 16, scale: 0.98 }}
								transition={{ duration: 0.25 }}
							>
								<div className="flex items-start justify-between border-b border-ink-900/10 px-6 py-5 dark:border-paper/10 sm:px-8">
									<div className="flex items-start gap-3">
										<div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-600 dark:text-gold-400">
											<Info size={20} />
										</div>
										<div dir={t.dir}>
											<p className="text-xs font-medium text-gold-600 dark:text-gold-400">
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
										className="flex h-9 w-9 items-center justify-center rounded-full text-slate-ink transition-colors hover:bg-ink-900/5 hover:text-ink-900 dark:text-ink-200 dark:hover:bg-paper/5 dark:hover:text-paper"
									>
										<X size={19} />
									</button>
								</div>
								<div
									dir={t.dir}
									className="space-y-5 px-6 py-7 text-base leading-relaxed text-slate-ink dark:text-ink-200 sm:px-8 sm:py-8"
								>
									<div>
										<p className="text-xs font-medium text-gold-600 dark:text-gold-400">
											{lang === "ar" ? "السنة" : "Year"}
										</p>
										<p className="mt-1 text-lg font-semibold text-ink-900 dark:text-paper">
											{selectedPreviousVersion.year}
										</p>
									</div>
									<div>
										<p className="text-xs font-medium text-gold-600 dark:text-gold-400">
											{lang === "ar" ? "العنوان" : "Title"}
										</p>
										<p className="mt-1 text-lg font-semibold text-ink-900 dark:text-paper">
											{selectedPreviousVersion.title}
										</p>
									</div>
									<div>
										<p className="text-xs font-medium text-gold-600 dark:text-gold-400">
											{lang === "ar" ? "ملاحظات" : "Notes"}
										</p>
										<p className="mt-1 text-justify">
											{selectedPreviousVersion.notes}
										</p>
									</div>
									<div className="flex justify-end border-t border-ink-900/10 pt-5 dark:border-paper/10">
										<button
											type="button"
											onClick={() => setSelectedPreviousVersion(null)}
											className="rounded-full bg-gold-500 px-6 py-2.5 text-sm font-medium text-ink-950 transition-colors hover:bg-gold-400"
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
