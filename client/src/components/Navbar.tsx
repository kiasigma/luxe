import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useWishlist } from "../context/WishlistContext";
import { useAlerts } from "../context/AlertsContext";
import { SearchBar } from "./SearchBar";
import { HeartIcon, BellIcon, HomeIcon, SparkleIcon } from "./icons";

const CATEGORIES = [
  "Clothing", "Shoes", "Handbags", "Jewellery", "Makeup", "Skincare", "Perfume", "Accessories",
];

export function Navbar() {
  const { totalSaved } = useWishlist();
  const { alerts } = useAlerts();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-300 ${
        scrolled ? "border-b border-ink/5 bg-canvas/85 backdrop-blur-xl" : "bg-canvas"
      }`}
    >
      <div className="container-luxe">
        <div className="flex items-center gap-4 py-4">
          <Link to="/" className="group flex shrink-0 items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-blush-400 to-lilac-400 font-display text-lg italic text-white shadow-soft transition-transform group-hover:scale-105">
              L
            </span>
            <span className="font-display text-2xl tracking-tight text-ink">Luxe</span>
          </Link>

          {/* Compact search on inner pages */}
          {!isHome && (
            <div className="hidden flex-1 md:block">
              <SearchBar size="md" />
            </div>
          )}

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <NavLink
              to="/how-it-works"
              className={({ isActive }) =>
                `hidden rounded-full px-3.5 py-2 text-sm font-medium transition-colors sm:inline-flex ${
                  isActive ? "bg-ink text-white" : "text-ink-soft hover:bg-ink/5 hover:text-ink"
                }`
              }
            >
              How it works
            </NavLink>
            <NavLink to="/" end className="grid h-11 w-11 place-items-center rounded-full text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink" aria-label="Home">
              <HomeIcon className="h-5 w-5" />
            </NavLink>
            <NavLink to="/alerts" className="relative grid h-11 w-11 place-items-center rounded-full text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink" aria-label="Price alerts">
              <BellIcon className="h-5 w-5" />
              {alerts.length > 0 && <Badge count={alerts.length} />}
            </NavLink>
            <NavLink to="/wishlist" className="relative grid h-11 w-11 place-items-center rounded-full text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink" aria-label="Wishlist">
              <HeartIcon className="h-5 w-5" />
              {totalSaved > 0 && <Badge count={totalSaved} />}
            </NavLink>
          </div>
        </div>

        {/* Category rail */}
        <nav className="-mx-5 flex items-center gap-1 overflow-x-auto px-5 pb-3 no-scrollbar sm:mx-0 sm:px-0">
          {CATEGORIES.map((c) => (
            <NavLink
              key={c}
              to={`/search?category=${encodeURIComponent(c)}`}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-ink text-white"
                    : "text-ink-soft hover:bg-ink/5 hover:text-ink"
                }`
              }
            >
              {c}
            </NavLink>
          ))}
          <NavLink
            to="/search?saleOnly=true&sort=discount"
            className="ml-1 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-semibold text-blush-500 transition-colors hover:bg-blush-50"
          >
            Sale
          </NavLink>
          {/* Guide link — surfaced in the rail on mobile (header link is sm+ only) */}
          <NavLink
            to="/how-it-works"
            className={({ isActive }) =>
              `ml-1 inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors sm:hidden ${
                isActive ? "bg-ink text-white" : "text-ink-soft hover:bg-ink/5 hover:text-ink"
              }`
            }
          >
            <SparkleIcon className="h-3.5 w-3.5" /> How it works
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

function Badge({ count }: { count: number }) {
  return (
    <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-blush-500 px-1 text-[10px] font-bold text-white shadow-sm">
      {count > 99 ? "99+" : count}
    </span>
  );
}
