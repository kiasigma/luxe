import type { CatalogItem, RawOffer, RetailerAdapter, RetailerInfo } from "../types.js";
import { config } from "../../config.js";

/**
 * ───────────────────────────────────────────────────────────────────────────
 *  REAL RETAILER FEED ADAPTER — TEMPLATE (not registered by default)
 * ───────────────────────────────────────────────────────────────────────────
 *
 * This is the blueprint for making links go to the EXACT product and prices
 * match the retailer's live price. Copy it to a real adapter (e.g. `asos.ts`),
 * point `FEED_URL` at your official affiliate product feed, and register it in
 * `../registry.ts`.
 *
 * Where to get a feed (official, ToS-compliant — no scraping):
 *   • Awin / Skimlinks / Rakuten Advertising / CJ / Sovrn  → product datafeeds
 *   • Some retailers expose their own Product/Catalog API with a key
 *
 * A feed row typically contains: product id, title, brand, price, currency,
 * sale price, stock, delivery, rating, the canonical product URL, and an image
 * URL. You map those fields → `RawOffer` below and the platform does the rest
 * (comparison, filtering, facets, SEO). The two fields that make links and
 * prices REAL are:
 *   • `url`   → the feed's canonical/deep-link product URL (exact product)
 *   • `price` → the feed's current price (matches the retailer site)
 */

const FEED_URL = process.env.EXAMPLE_FEED_URL ?? ""; // set per-retailer

interface FeedRow {
  sku: string;
  title: string;
  brand: string;
  price: number;
  salePrice?: number;
  currency: string;
  inStock: boolean;
  deliveryText?: string;
  freeDelivery?: boolean;
  rating?: number;
  reviews?: number;
  productUrl: string; // canonical/deep link to the exact product
  imageUrl?: string;
}

const info: RetailerInfo = {
  id: "example",
  name: "Example Retailer",
  logo: "EX",
  accent: "#1c1a1d",
  homepage: "https://www.example.com",
};

/** Wrap a canonical product URL with your affiliate tracking parameters. */
function toAffiliateLink(productUrl: string): string {
  const u = new URL(productUrl);
  u.searchParams.set("ref", config.affiliateTag);
  // e.g. Awin: `https://www.awin1.com/cread.php?awinmid=...&awinaffid=...&ued=${encodeURIComponent(productUrl)}`
  return u.toString();
}

/**
 * Match a feed row to our catalogue item. With a real feed you'd typically key
 * on GTIN/EAN/MPN or the retailer SKU; here we show a defensive title/brand
 * match so the example stays self-contained.
 */
function matchesCatalogItem(row: FeedRow, item: CatalogItem): boolean {
  return (
    row.brand.toLowerCase() === item.brand.toLowerCase() &&
    item.name.toLowerCase().includes(row.title.toLowerCase().slice(0, 12))
  );
}

export const exampleFeedAdapter: RetailerAdapter = {
  info,
  async fetchOffers(items: CatalogItem[]): Promise<RawOffer[]> {
    if (!FEED_URL) return []; // template is inert until configured

    // 1) Pull the official feed (JSON shown; CSV/XML feeds parse the same way).
    const res = await fetch(FEED_URL);
    if (!res.ok) return [];
    const rows: FeedRow[] = await res.json();

    // 2) Map feed rows → RawOffers with REAL url + price.
    const offers: RawOffer[] = [];
    for (const item of items) {
      const row = rows.find((r) => matchesCatalogItem(r, item));
      if (!row) continue;
      offers.push({
        productId: item.id,
        price: row.salePrice ?? row.price,
        originalPrice: row.salePrice ? row.price : undefined,
        shipping: row.freeDelivery ? "Free delivery" : row.deliveryText ?? "See site",
        freeDelivery: Boolean(row.freeDelivery),
        inStock: row.inStock,
        rating: row.rating,
        reviews: row.reviews,
        url: toAffiliateLink(row.productUrl), // ← exact product, affiliate-tagged
      });
    }
    return offers;
  },
};
