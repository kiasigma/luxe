# Luxe — Premium Fashion & Beauty Price Comparison

A modern, startup-quality price comparison platform for women's clothing, shoes,
handbags, jewellery, makeup, skincare, perfume and accessories. Built to feel as
polished and addictive to browse as Pinterest, Sephora and Zara combined.

> **Find the best price. Across every retailer. In one beautiful place.**

---

## ✨ Highlights

- **Premium, minimal UI** — lots of white space, soft shadows, rounded corners,
  pastel accents, elegant typography, and smooth micro-animations throughout.
- **Instant search** with autocomplete, suggested/trending/recent searches and
  search history.
- **Responsive product grid** with premium cards (image, retailer, price,
  discount badge, delivery info, rating, “View Deal”).
- **Rich filtering & sorting** — price, brand, colour, size, category, material,
  retailer, sale-only, free delivery, newest, best rated.
- **Product pages** with a gallery, multi-retailer price comparison, colours,
  sizes, materials and full details.
- **Wishlist & collections** (Summer, Wedding Guest, Work, Holiday…).
- **Price alerts** — “notify me when this drops below £X”.
- **Modular retailer architecture** — add a new retailer by dropping in one
  adapter file. Designed for official public APIs / affiliate product feeds
  (no scraping).
- **Monetisation-ready** — slots for AdSense, affiliate links, sponsored
  products and future premium memberships, designed never to interrupt browsing.

## 🧱 Tech Stack

| Layer      | Tech                                            |
| ---------- | ----------------------------------------------- |
| Frontend   | React + TypeScript, Vite, Tailwind CSS, Framer Motion, React Router |
| Backend    | Node.js, Express, TypeScript                    |
| Data       | Modular retailer adapters (mock affiliate feeds, ready to swap for real APIs) |
| State      | React Context + `localStorage` persistence      |

## 🚀 Getting Started

```bash
# from the repo root
npm install            # installs root + both workspaces
npm run dev            # starts API (http://localhost:4000) + web (http://localhost:5173)
```

Then open **http://localhost:5173**.

Run them individually if you prefer:

```bash
npm run dev -w server  # API only
npm run dev -w client  # web only
```

Build for production:

```bash
npm run build
npm run start          # serves the built API; deploy client/dist to any static host/CDN
```

## 📁 Project Structure

```
fashion-finder/
├── server/                     # Express + TypeScript API
│   └── src/
│       ├── index.ts            # app entry, middleware, routing
│       ├── config.ts
│       ├── types.ts            # shared domain types
│       ├── data/
│       │   ├── catalog.ts      # generated demo catalog
│       │   └── generator.ts    # deterministic product generator
│       ├── retailers/          # ⭐ modular retailer adapters
│       │   ├── types.ts        # RetailerAdapter contract
│       │   ├── registry.ts     # plug new retailers in here
│       │   ├── baseAdapter.ts
│       │   └── adapters/       # one file per retailer
│       ├── services/
│       │   ├── searchService.ts
│       │   └── suggestService.ts
│       └── routes/             # search, products, suggest, meta, alerts, wishlist
└── client/                     # React + TypeScript + Tailwind web app
    └── src/
        ├── pages/              # Home, Search, Product, Wishlist, Alerts
        ├── components/         # SearchBar, ProductCard, Filters, Navbar…
        ├── context/            # Wishlist, Alerts, RecentSearches
        ├── lib/                # API client, formatting, hooks
        └── types.ts
```

## 🔌 Adding a New Retailer

Retailer integrations are fully modular. To add one:

1. Create `server/src/retailers/adapters/<name>.ts` exporting a `RetailerAdapter`
   (see `retailers/types.ts` and the `baseAdapter` helper).
2. Register it in `server/src/retailers/registry.ts`.

That's it — search, comparison and filtering pick it up automatically. Each
adapter is the single integration point where you'd call an **official public
API** or load an **official affiliate product feed**. The demo ships with mock
feeds so everything runs offline; swap the `fetchProducts` implementation for a
real feed and nothing else changes.

> This project never scrapes websites or uses unofficial APIs. Adapters are
> designed for official/affiliate data sources only.

### Making links & prices real

The demo data is **synthetic**, so links don't resolve and prices don't match
live retailers. To make links open the **exact product** and prices match the
retailer's **live price**, connect an official affiliate feed/API. See
**[DATA_SOURCES.md](DATA_SOURCES.md)** and the fully-commented
[`_feedTemplate.ts`](server/src/retailers/adapters/_feedTemplate.ts).

### Images

Product imagery renders the **brand's logo tile** (generated SVG, no external
hosts — see [`brandLogo.ts`](server/src/data/brandLogo.ts)). When a feed supplies
official product photos, populate `CatalogItem.images` from them instead.

### SEO & monetisation extras

- **Structured data**: `Product` + `AggregateOffer` + `AggregateRating` JSON-LD on
  product pages (eligible for Google rich price results), site-wide `WebSite`
  search-box markup, `robots.txt` + `sitemap.xml`, and dynamic meta/canonical via
  `lib/seo.ts` — the biggest free-traffic levers for a comparison site.
- **Ad placements** (non-intrusive): native in-grid units every ~12 cards, a
  sticky high-viewability sidebar unit on search, a leaderboard between homepage
  sections, an in-content unit on product pages, and a dismissible sticky footer
  anchor. All AdSense-ready via `VITE_ADSENSE_CLIENT`.
- **Owned audience**: email capture (`NewsletterSignup`) for repeat traffic.
- **Price freshness**: each offer carries `lastChecked`, surfaced as
  "checked N min ago" so the UI never overstates accuracy.

## 💰 Monetisation Architecture

- `AdSlot` component renders unobtrusive ad placements (between content rows,
  never mid-card). Wire up Google AdSense by setting your client id.
- Offers carry an affiliate `url`; the `?ref=luxe` param shows where tracking
  goes.
- Products can be flagged `sponsored` to surface sponsored placements tastefully.
- A `Premium` upsell surface is stubbed for future memberships.

## ⚖️ Data & Legal Notes

Demo data is synthetic and for illustration only. Brand and retailer names are
used to demonstrate the comparison UX. For production, connect each adapter to a
retailer's official API or affiliate product feed and comply with their terms.
