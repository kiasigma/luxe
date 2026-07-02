import type {
  Discovery,
  Product,
  RatingBreakdown,
  RetailerInfo,
  Review,
  SearchResult,
  Suggestion,
} from "../types";

const BASE = "/api";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export interface SearchQuery {
  q?: string;
  category?: string;
  brand?: string[];
  colour?: string[];
  size?: string[];
  material?: string[];
  retailer?: string[];
  minPrice?: number;
  maxPrice?: number;
  saleOnly?: boolean;
  freeDelivery?: boolean;
  newOnly?: boolean;
  minRating?: number;
  sort?: string;
  page?: number;
  pageSize?: number;
}

/** Serialise a SearchQuery to a query string, omitting empty values. */
export function toQueryString(q: SearchQuery): string {
  const params = new URLSearchParams();
  const add = (k: string, v: unknown) => {
    if (v == null || v === "" || (Array.isArray(v) && v.length === 0)) return;
    params.set(k, Array.isArray(v) ? v.join(",") : String(v));
  };
  add("q", q.q);
  add("category", q.category);
  add("brand", q.brand);
  add("colour", q.colour);
  add("size", q.size);
  add("material", q.material);
  add("retailer", q.retailer);
  add("minPrice", q.minPrice);
  add("maxPrice", q.maxPrice);
  add("saleOnly", q.saleOnly);
  add("freeDelivery", q.freeDelivery);
  add("newOnly", q.newOnly);
  add("minRating", q.minRating);
  add("sort", q.sort);
  add("page", q.page);
  add("pageSize", q.pageSize);
  return params.toString();
}

export const api = {
  search: (q: SearchQuery) => get<SearchResult>(`/search?${toQueryString(q)}`),

  product: (id: string) =>
    get<{ product: Product; related: Product[]; reviews: Review[]; ratingBreakdown: RatingBreakdown }>(
      `/products/${id}`,
    ),

  productsByIds: (ids: string[]) =>
    get<{ products: Product[] }>(`/products?ids=${ids.join(",")}`),

  suggest: (q: string) =>
    get<{ suggestions: Suggestion[] }>(`/suggest?q=${encodeURIComponent(q)}`),

  discovery: () => get<Discovery>("/discovery"),

  retailers: () => get<{ retailers: RetailerInfo[] }>("/retailers"),

  config: () => get<{ currency: string; currencySymbol: string }>("/config"),

  checkAlerts: async (items: { productId: string; threshold: number }[]) => {
    const res = await fetch(`${BASE}/alerts/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    if (!res.ok) throw new Error("Alert check failed");
    return res.json() as Promise<{
      results: {
        productId: string;
        found: boolean;
        currentPrice?: number;
        threshold?: number;
        triggered: boolean;
        retailer?: string;
      }[];
    }>;
  },
};
