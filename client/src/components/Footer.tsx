import { Link } from "react-router-dom";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "Dresses", to: "/search?category=Clothing" },
      { label: "Handbags", to: "/search?category=Handbags" },
      { label: "Skincare", to: "/search?category=Skincare" },
      { label: "Makeup", to: "/search?category=Makeup" },
      { label: "Sale", to: "/search?saleOnly=true&sort=discount" },
    ],
  },
  {
    title: "Discover",
    links: [
      { label: "Trending", to: "/search?sort=popular" },
      { label: "New in", to: "/search?sort=newest" },
      { label: "Editor's picks", to: "/search?sort=rating" },
      { label: "Price drops", to: "/search?saleOnly=true&sort=discount" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "How it works", to: "/how-it-works" },
      { label: "Wishlist", to: "/wishlist" },
      { label: "Collections", to: "/wishlist" },
      { label: "Price alerts", to: "/alerts" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink/5 bg-white">
      <div className="container-luxe py-14">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-2xl bg-gradient-to-br from-blush-400 to-lilac-400 font-display text-lg italic text-white">
                L
              </span>
              <span className="font-display text-2xl text-ink">Dealista</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
              The most beautiful way to find the best price on women's fashion &amp;
              beauty — across every retailer, in one place.
            </p>
            <div className="mt-5 flex gap-2">
              {["IG", "PIN", "TT", "YT"].map((s) => (
                <span key={s} className="grid h-9 w-9 place-items-center rounded-full bg-ink/5 text-[11px] font-semibold text-ink-soft transition-colors hover:bg-blush-100 hover:text-blush-500">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-ink-soft transition-colors hover:text-blush-500">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-ink/5 pt-6 text-xs text-ink-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Dealista. Prices compared from official retailer feeds.</p>
          <p>Some links are affiliate links — they never affect the price you pay.</p>
        </div>
      </div>
    </footer>
  );
}
