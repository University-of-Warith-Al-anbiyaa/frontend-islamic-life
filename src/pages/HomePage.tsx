import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import HomeInfo from "../components/home/HomeInfo";
import About from "../components/About";
import HomeObjectives from "../components/home/HomeObjectives";
import HomeFaq from "../components/home/HomeFaq";
import AwardsSection from "../components/AwardsSection";
import HomeCallForPapers from "../components/home/HomeCallForPapers";
import Gallery from "../components/Gallery";
import Sponsors from "../components/Sponsors";
import HomeVenue from "../components/home/HomeVenue";
import Footer from "../components/Footer";
import { useApp } from "../context/AppContext";

export default function HomePage() {
	const { t } = useApp();
	const [showTop, setShowTop] = useState(false);

	useEffect(() => {
		const onScroll = () => setShowTop(window.scrollY > 800);
		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	return (
		<>
			<Navbar />
			<main>
				<Hero />
				<HomeInfo />
				<About />
				<HomeObjectives />
				<HomeFaq />
				<AwardsSection />
				<HomeCallForPapers />
				<Gallery />
				<Sponsors />
				<HomeVenue />
			</main>
			<Footer />

			{showTop && (
				<button
					onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
					aria-label={t.ui.backToTop}
					className="fixed bottom-6 end-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-gold-500 text-ink-950 shadow-lg transition-transform hover:-translate-y-0.5"
				>
					<ArrowUp size={18} />
				</button>
			)}
		</>
	);
}
