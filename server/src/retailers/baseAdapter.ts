import type { CatalogItem, RawOffer, RetailerAdapter, RetailerInfo } from "./types.js";

/** Tiny deterministic PRNG (mulberry32) so demo pricing is stable. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function round99(value: number): number {
  // Snap to a pleasing .95 / .99 retail price ending.
  const whole = Math.floor(value);
  return Number((whole + (value - whole > 0.5 ? 0.99 : 0.95)).toFixed(2));
}

export interface AdapterOptions {
  /** Pricing multiplier — < 1 means this retailer tends to be cheaper. */
  priceFactor?: number;
  /** Probability (0–1) that a given product is on sale here. */
  saleChance?: number;
  /** Probability that this retailer stocks any given product. */
  coverage?: number;
  /** Probability of free delivery. */
  freeDeliveryChance?: number;
  /** Standard paid delivery copy. */
  paidShipping?: string;
  /** If set, the retailer only carries items in these categories (realism). */
  categories?: string[];
}

/**
 * Builds a fully-functional demo adapter from a retailer profile. Real adapters
 * can either use this helper (swapping `fetchOffers`) or implement the
 * `RetailerAdapter` interface directly against an official API/affiliate feed.
 */
export function createDemoAdapter(
  info: RetailerInfo,
  options: AdapterOptions = {},
): RetailerAdapter {
  const {
    priceFactor = 1,
    saleChance = 0.35,
    coverage = 0.7,
    freeDeliveryChance = 0.5,
    paidShipping = "£3.99 · 2–4 days",
    categories,
  } = options;

  return {
    info,
    fetchOffers(items: CatalogItem[]): RawOffer[] {
      const offers: RawOffer[] = [];
      for (const item of items) {
        // Realism: a retailer only carries items in its categories.
        if (categories && !categories.includes(item.category)) continue;
        const rand = rng(hash(info.id + ":" + item.id));
        if (rand() > coverage) continue; // retailer doesn't stock this item

        const variance = 0.9 + rand() * 0.2; // ±10% retailer variance
        let price = round99(item.basePrice * priceFactor * variance);
        let originalPrice: number | undefined;

        if (rand() < saleChance) {
          originalPrice = round99(price * (1.15 + rand() * 0.45));
        }

        const freeDelivery = rand() < freeDeliveryChance;
        const rating = Number((item.baseRating - 0.3 + rand() * 0.6).toFixed(1));

        offers.push({
          productId: item.id,
          price,
          originalPrice,
          shipping: freeDelivery ? "Free delivery" : paidShipping,
          freeDelivery,
          inStock: rand() > 0.05,
          rating: Math.max(3.4, Math.min(5, rating)),
          reviews: Math.round(item.baseReviews * (0.4 + rand() * 0.9)),
          url: buildDeepLink(info.homepage, item),
        });
      }
      return offers;
    },
  };
}

/**
 * Outbound link to the retailer's homepage. Demo product URLs aren't real, so we
 * link to the homepage (and the UI offers a "copy product name" helper to search
 * there). With a real feed, this becomes the feed's canonical product URL.
 */
function buildDeepLink(homepage: string, _item: CatalogItem): string {
  return homepage;
}
