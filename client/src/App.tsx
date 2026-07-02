import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { StickyAd } from "./components/StickyAd";
import { WelcomeTutorial } from "./components/WelcomeTutorial";
import { Home } from "./pages/Home";
import { Search } from "./pages/Search";
import { Product } from "./pages/Product";
import { Wishlist } from "./pages/Wishlist";
import { Alerts } from "./pages/Alerts";
import { HowItWorks } from "./pages/HowItWorks";
import { NotFound } from "./pages/NotFound";

/** Scroll to top on route change (except hash links). */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <StickyAd />
      <WelcomeTutorial />
    </div>
  );
}
