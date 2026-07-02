import type { Product, SearchFilters, SearchResult, SortKey } from "../types.js";
import { getCatalog } from "../data/catalog.js";

/**
 * ───────────────────────── Smart search ─────────────────────────
 * Matching is fuzzy and synonym-aware, so a query doesn't need the exact word:
 *   • "yoga pants"  → matches sports leggings / activewear
 *   • "yogo pants"  → typo-tolerant (Levenshtein), still finds yoga leggings
 *   • "trainers"    → also matches "sneakers", "purse" → "handbag", etc.
 */

/** Groups of interchangeable terms. Matching any member expands to all members. */
const SYNONYM_GROUPS: string[][] = [
  ["pants", "trousers", "leggings", "joggers", "bottoms", "slacks"],
  ["yoga", "sports", "sport", "activewear", "gym", "workout", "athletic", "athleisure", "exercise", "running", "training"],
  ["leggings", "tights", "yoga", "gym"],
  ["trainers", "sneakers", "kicks", "runners", "trainer"],
  ["bag", "handbag", "purse", "tote", "crossbody", "shoulder"],
  ["perfume", "fragrance", "scent", "cologne", "eau", "mist"],
  ["jumper", "sweater", "knit", "knitwear", "pullover", "cardigan"],
  ["dress", "gown", "frock"],
  ["coat", "jacket", "outerwear", "blazer", "puffer"],
  ["makeup", "cosmetics", "beauty"],
  ["lipstick", "lip", "lips", "gloss"],
  ["heels", "stilettos", "pumps", "slingback"],
  ["boots", "booties", "chelsea"],
  ["sandals", "flats", "mules", "slides"],
  ["earrings", "studs", "hoops"],
  ["necklace", "pendant", "chain", "lariat"],
  ["ring", "rings", "bracelet", "bangle", "cuff"],
  ["moisturiser", "moisturizer", "cream", "lotion", "hydrating"],
  ["serum", "treatment", "drops"],
  ["cleanser", "cleansing", "wash", "balm"],
  ["mask", "masque", "sheet"],
  ["sunglasses", "shades", "eyewear", "glasses"],
  ["scarf", "scarves", "silk", "wrap"],
  ["jeans", "denim"],
  ["hoodie", "sweatshirt"],
  ["bra", "bralette"],
  ["skirt", "skort"],
  ["loungewear", "comfy", "cosy", "lounge", "loungeset"],
];

// term → set of all terms reachable through any group it appears in.
const synonymIndex = new Map<string, Set<string>>();
for (const group of SYNONYM_GROUPS) {
  for (const term of group) {
    const set = synonymIndex.get(term) ?? new Set<string>();
    group.forEach((t) => set.add(t));
    synonymIndex.set(term, set);
  }
}

/** Classic Levenshtein edit distance (small strings, cheap). */
function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, i) => i);
  let curr = new Array(n + 1);
  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[n];
}

/** Does a query term match a product token (substring or close typo)? */
function termMatchesToken(term: string, token: string): boolean {
  if (token === term) return true;
  // Ignore tiny tokens/terms beyond exact equality (avoids "a", "of" noise).
  if (term.length < 3 || token.length < 3) return false;
  // Product word contains the query term, e.g. "skirts" ⊇ "skirt". (Not the
  // reverse — that wrongly lets "workout" match the token "work".)
  if (token.includes(term)) return true;
  // Typo tolerance: 1 edit for normal words, 2 only for long (≥8) words.
  const maxDist = term.length >= 8 ? 2 : 1;
  if (Math.abs(token.length - term.length) <= maxDist && levenshtein(term, token) <= maxDist) return true;
  return false;
}

/** Expand a query term to itself plus any synonyms (incl. fuzzy key matches). */
function expandTerm(term: string): string[] {
  const out = new Set<string>([term]);
  for (const [key, members] of synonymIndex) {
    if (termMatchesToken(term, key)) members.forEach((m) => out.add(m));
  }
  return [...out];
}

interface WeightedToken {
  token: string;
  weight: number;
}

/** Build weighted tokens for a product (name/brand rank highest). */
function weightedTokens(p: Product): WeightedToken[] {
  const toks: WeightedToken[] = [];
  const add = (text: string, weight: number) => {
    for (const w of text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)) {
      toks.push({ token: w, weight });
    }
  };
  add(p.name, 3);
  add(p.brand, 3);
  add(p.subcategory, 2.5);
  add(p.category, 2);
  add(p.tags.join(" "), 1.5);
  add(p.colours.join(" "), 1);
  add(p.materials.join(" "), 1);
  return toks;
}

/**
 * Relevance score for a product against a free-text query. Returns 0 when the
 * product shouldn't appear. Short queries (≤2 words) must match every word;
 * longer queries allow one miss — keeping results precise without being rigid.
 */
function scoreProduct(p: Product, terms: string[]): number {
  if (terms.length === 0) return 1;
  const tokens = weightedTokens(p);
  let score = 0;
  let matchedTerms = 0;

  for (const term of terms) {
    const variants = expandTerm(term);
    let best = 0;
    for (const v of variants) {
      for (const { token, weight } of tokens) {
        if (termMatchesToken(v, token)) {
          // A synonym/fuzzy hit counts slightly less than the literal word.
          const w = v === term ? weight : weight * 0.7;
          if (w > best) best = w;
        }
      }
    }
    if (best > 0) {
      matchedTerms++;
      score += best;
    }
  }

  const need = terms.length <= 2 ? terms.length : terms.length - 1;
  if (matchedTerms < need) return 0;
  if (matchedTerms === terms.length) score += 2; // matched everything
  return score;
}

function queryTerms(q: string): string[] {
  return q.toLowerCase().split(/\s+/).map((t) => t.trim()).filter(Boolean);
}

function applyFilters(products: Product[], f: SearchFilters): Product[] {
  return products.filter((p) => {
    if (f.category && p.category.toLowerCase() !== f.category.toLowerCase()) return false;
    if (f.brand?.length && !f.brand.includes(p.brand)) return false;
    if (f.colour?.length && !f.colour.some((c) => p.colours.includes(c))) return false;
    if (f.size?.length && !f.size.some((s) => p.sizes.includes(s))) return false;
    if (f.material?.length && !f.material.some((m) => p.materials.includes(m))) return false;
    if (f.retailer?.length && !p.offers.some((o) => f.retailer!.includes(o.retailerId))) return false;
    if (f.minPrice != null && p.lowestPrice < f.minPrice) return false;
    if (f.maxPrice != null && p.lowestPrice > f.maxPrice) return false;
    if (f.saleOnly && p.bestDiscount <= 0) return false;
    if (f.freeDelivery && !p.offers.some((o) => o.freeDelivery)) return false;
    if (f.newOnly && !p.isNew) return false;
    if (f.minRating != null && p.rating < f.minRating) return false;
    return true;
  });
}

function sortProducts(products: Product[], sort: SortKey, terms: string[]): Product[] {
  const arr = [...products];
  switch (sort) {
    case "price-asc":
      return arr.sort((a, b) => a.lowestPrice - b.lowestPrice);
    case "price-desc":
      return arr.sort((a, b) => b.lowestPrice - a.lowestPrice);
    case "discount":
      return arr.sort((a, b) => b.bestDiscount - a.bestDiscount);
    case "newest":
      return arr.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    case "rating":
      return arr.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    case "popular":
    default:
      return arr.sort(
        (a, b) =>
          scoreProduct(b, terms) - scoreProduct(a, terms) ||
          b.reviews - a.reviews ||
          b.rating - a.rating,
      );
  }
}

function countFacet(products: Product[], getter: (p: Product) => string[]): { value: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of products) for (const v of getter(p)) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count);
}

export interface SearchParams extends SearchFilters {
  sort?: SortKey;
  page?: number;
  pageSize?: number;
}

export async function search(params: SearchParams): Promise<SearchResult> {
  const catalog = await getCatalog();
  const q = (params.q ?? "").trim();
  const terms = queryTerms(q);

  // Smart text match first, so facets reflect the searched set.
  const matched = terms.length ? catalog.filter((p) => scoreProduct(p, terms) > 0) : catalog.slice();
  const facetBase = matched;

  const filtered = applyFilters(matched, params);
  const sorted = sortProducts(filtered, params.sort ?? "popular", terms);

  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(60, Math.max(1, params.pageSize ?? 24));
  const start = (page - 1) * pageSize;
  const pageItems = sorted.slice(start, start + pageSize);

  const prices = facetBase.map((p) => p.lowestPrice);

  return {
    products: pageItems,
    total: sorted.length,
    page,
    pageSize,
    facets: {
      brands: countFacet(facetBase, (p) => [p.brand]),
      colours: countFacet(facetBase, (p) => p.colours),
      sizes: countFacet(facetBase, (p) => p.sizes),
      materials: countFacet(facetBase, (p) => p.materials),
      retailers: countFacet(facetBase, (p) => p.offers.map((o) => `${o.retailerId}::${o.retailerName}`)),
      categories: countFacet(facetBase, (p) => [p.category]),
      priceRange: {
        min: prices.length ? Math.floor(Math.min(...prices)) : 0,
        max: prices.length ? Math.ceil(Math.max(...prices)) : 0,
      },
    },
  };
}
