import type { Product } from "../types";

/**
 * Lightweight, additive badge logic. None of this changes existing data or
 * behaviour — it only derives small UI hints from the product data already
 * present.
 */

/**
 * Returns the id of the product with the largest price drop within a list, used
 * to show a single "Biggest Price Drop" badge. Only returns an id when the drop
 * is meaningful (>= `minDiscount`%), so the badge isn't forced onto weak deals.
 */
export function biggestDropId(products: Product[], minDiscount = 15): string | null {
  let top: Product | null = null;
  for (const p of products) {
    if (p.bestDiscount < minDiscount) continue;
    if (!top || p.bestDiscount > top.bestDiscount) top = p;
  }
  return top?.id ?? null;
}

/**
 * "Expected to drop soon" heuristic: high price volatility across the retailers
 * carrying the item (a wide spread between the cheapest and dearest offer
 * suggests the price moves around). Deterministic from existing offer data, so
 * it naturally selects a minority (~10–20%) of products.
 */
export function isExpectedToDrop(product: Product): boolean {
  const prices = product.offers.map((o) => o.price);
  if (prices.length < 2) return false;
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  // Tuned so a minority (~10–20%) of products qualify as volatile.
  return (max - min) / min >= 0.42;
}

/** The single best (lowest-price) offer for a product. Always the true minimum. */
export function bestOffer(product: Product) {
  return product.offers.reduce((a, b) => (b.price < a.price ? b : a), product.offers[0]);
}
