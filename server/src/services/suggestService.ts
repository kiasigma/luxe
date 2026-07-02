import { getCatalog } from "../data/catalog.js";

export interface Suggestion {
  type: "product" | "brand" | "category" | "query";
  label: string;
  sublabel?: string;
  productId?: string;
}

/** Curated, always-on suggestions that power the homepage discovery rails. */
export const TRENDING_SEARCHES = [
  "Yoga pants", "Black dress", "Gold hoop earrings", "White trainers", "Vitamin C serum",
  "Lululemon leggings", "Quilted shoulder bag", "Silk slip dress", "Charlotte Tilbury",
  "Linen wrap dress", "Sports bra", "Perfume gift sets", "Cashmere jumper",
];

export const POPULAR_CATEGORIES = [
  { name: "Dresses", category: "Clothing", icon: "👗" },
  { name: "Handbags", category: "Handbags", icon: "👜" },
  { name: "Trainers", category: "Shoes", icon: "👟" },
  { name: "Skincare", category: "Skincare", icon: "✨" },
  { name: "Makeup", category: "Makeup", icon: "💄" },
  { name: "Jewellery", category: "Jewellery", icon: "💍" },
  { name: "Perfume", category: "Perfume", icon: "🌸" },
  { name: "Accessories", category: "Accessories", icon: "🕶️" },
];

export const POPULAR_BRANDS = [
  "Charlotte Tilbury", "Lululemon", "Reformation", "Missoma", "The Ordinary",
  "Ganni", "Alo Yoga", "Jo Malone", "Veja", "Mango", "Polène", "Gymshark",
];

export async function autocomplete(q: string, limit = 8): Promise<Suggestion[]> {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  const catalog = await getCatalog();
  const out: Suggestion[] = [];
  const seen = new Set<string>();

  const add = (s: Suggestion) => {
    const key = s.type + ":" + s.label.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    out.push(s);
  };

  // Matching categories
  for (const c of new Set(catalog.map((p) => p.category))) {
    if (c.toLowerCase().includes(query)) add({ type: "category", label: c, sublabel: "Category" });
  }
  // Matching brands
  for (const b of new Set(catalog.map((p) => p.brand))) {
    if (b.toLowerCase().includes(query)) add({ type: "brand", label: b, sublabel: "Brand" });
  }
  // Matching products
  for (const p of catalog) {
    if (out.length >= limit + 6) break;
    if (p.name.toLowerCase().includes(query)) {
      add({ type: "product", label: p.name, sublabel: p.brand, productId: p.id });
    }
  }
  // Trending query completions
  for (const t of TRENDING_SEARCHES) {
    if (t.toLowerCase().includes(query)) add({ type: "query", label: t, sublabel: "Trending" });
  }

  return out.slice(0, limit);
}
