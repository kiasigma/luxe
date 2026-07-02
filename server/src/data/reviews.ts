import type { Product, RatingBreakdown, Review } from "../types.js";

/**
 * Deterministic customer-review generator. Reviews are derived from a product's
 * id + rating so they're stable across requests. In production this is replaced
 * by real review data (retailer feed, your own DB, or a reviews provider).
 */

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
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
const pick = <T>(r: () => number, a: T[]): T => a[Math.floor(r() * a.length)];

const NAMES = [
  "Sophie M.", "Emma L.", "Olivia R.", "Isla T.", "Ava B.", "Mia K.", "Grace H.",
  "Chloé D.", "Freya W.", "Lily P.", "Hannah S.", "Zara N.", "Amelia C.", "Ruby F.",
  "Daisy G.", "Eva J.", "Maya V.", "Nina A.", "Poppy O.", "Lara E.",
];

const TITLES_HIGH = ["Obsessed!", "Absolutely love it", "Worth every penny", "Exceeded expectations", "My new favourite", "Better than I hoped", "Stunning quality"];
const TITLES_MID = ["Pretty good", "Nice but a few notes", "Happy overall", "Good value", "Does the job"];
const TITLES_LOW = ["A little disappointed", "Not quite for me", "Expected more", "Sizing was off"];

const BODIES_HIGH = [
  "The quality is incredible and it looks even better in person. I've already had so many compliments.",
  "Fits beautifully and feels so luxurious. Would 100% buy again and recommend to friends.",
  "Found it cheaper here than anywhere else — exactly the same product. Delighted with the whole experience.",
  "Such a flattering fit and the colour is gorgeous. This has quickly become a wardrobe staple.",
  "Comfortable, well made and great for everyday. Honestly can't fault it.",
];
const BODIES_MID = [
  "Lovely piece overall, though delivery took a little longer than I'd hoped. Still happy with it.",
  "Good quality for the price. Runs slightly large so consider sizing down.",
  "Nice and as described. Not blown away but no complaints either.",
  "Does what it says — decent everyday option that I'll get plenty of use from.",
];
const BODIES_LOW = [
  "It's fine but the fit wasn't quite right for me. Might exchange for a different size.",
  "Lovely design but I expected the material to feel a bit more premium.",
  "Colour was slightly different to the photos in person, otherwise okay.",
];

function bodyFor(r: () => number, rating: number): { title: string; body: string } {
  if (rating >= 5) return { title: pick(r, TITLES_HIGH), body: pick(r, BODIES_HIGH) };
  if (rating === 4) return { title: pick(r, [...TITLES_HIGH, ...TITLES_MID]), body: pick(r, [...BODIES_HIGH, ...BODIES_MID]) };
  if (rating === 3) return { title: pick(r, TITLES_MID), body: pick(r, BODIES_MID) };
  return { title: pick(r, TITLES_LOW), body: pick(r, BODIES_LOW) };
}

/** A plausible per-star distribution that averages near `avg` and sums to `total`. */
export function ratingBreakdown(avg: number, total: number): RatingBreakdown {
  // Weight mass around the average, skewed high for premium products.
  const base =
    avg >= 4.6 ? [0.7, 0.2, 0.06, 0.02, 0.02] :
    avg >= 4.2 ? [0.55, 0.28, 0.1, 0.04, 0.03] :
    avg >= 3.8 ? [0.4, 0.32, 0.16, 0.07, 0.05] :
    [0.3, 0.3, 0.2, 0.12, 0.08];
  const counts = base.map((w) => Math.round(w * total)) as RatingBreakdown;
  // Fix rounding drift onto the top bucket.
  const drift = total - counts.reduce((a, b) => a + b, 0);
  counts[0] = Math.max(0, counts[0] + drift);
  return counts;
}

export function generateReviews(product: Product, count = 6): Review[] {
  const r = rng(hash("rev:" + product.id));
  const reviews: Review[] = [];
  const now = Date.now();
  // Bias individual review ratings around the product's aggregate rating.
  for (let i = 0; i < count; i++) {
    const roll = r();
    let rating = Math.round(product.rating + (roll - 0.5) * 1.6);
    rating = Math.max(2, Math.min(5, rating));
    const { title, body } = bodyFor(r, rating);
    reviews.push({
      id: `${product.id}-r${i + 1}`,
      author: pick(r, NAMES),
      rating,
      title,
      body,
      date: new Date(now - Math.floor(r() * 160) * 86400000).toISOString(),
      verified: r() > 0.2,
      helpful: Math.floor(r() * 60),
    });
  }
  // Most recent first.
  return reviews.sort((a, b) => +new Date(b.date) - +new Date(a.date));
}
