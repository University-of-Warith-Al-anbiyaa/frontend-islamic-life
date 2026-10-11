import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Preloader from "./components/Preloader";
import ResearchSubmissionModal from "./components/ResearchSubmissionModal";
import AboutWebsiteModal from "./components/AboutWebsiteModal";
import CountdownModal from "./components/CountdownModal";
import ScrollToTop from "./components/ScrollToTop";
import HomePage from "./pages/HomePage";
import SeventhConferencePage from "./pages/SeventhConferencePage";
import GalleryPage from "./pages/GalleryPage";
import { GALLERY_PATH } from "./config/gallery";

export default function App() {
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => setLoading(false), 1400);
		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (loading) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
	}, [loading]);

	return (
		<>
			<ScrollToTop />
			<Preloader show={loading} />
			<ResearchSubmissionModal />
			<AboutWebsiteModal />
			<CountdownModal />
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/seventh-conference" element={<SeventhConferencePage />} />
				<Route path={GALLERY_PATH} element={<GalleryPage />} />
				<Route path="*" element={<HomePage />} />
			</Routes>
		</>
	);
}
