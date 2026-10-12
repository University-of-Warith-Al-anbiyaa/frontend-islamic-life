import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import ConferenceInfo from "../components/ConferenceInfo";
import About from "../components/About";
import Objectives from "../components/Objectives";
import CallForPapers from "../components/CallForPapers";
import FAQ from "../components/FAQ";
import Gallery from "../components/Gallery";
import Sponsors from "../components/Sponsors";
import AwardsSection from "../components/AwardsSection";
import VenueSection from "../components/Venue";
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
				<ConferenceInfo />
				<About />
				<Objectives />
				<div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-24 lg:gap-10 lg:px-10 lg:py-32">
					<FAQ wide />
					<AwardsSection />
					<CallForPapers />
				</div>
				<Gallery />
				<Sponsors />
				<VenueSection />
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
