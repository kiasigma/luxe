/**
 * Shared domain types for the Luxe API. These mirror the shapes consumed by the
 * React client (see client/src/types.ts) so the contract stays in lock-step.
 */

export type Category =
  | "Clothing"
  | "Shoes"
  | "Handbags"
  | "Jewellery"
  | "Makeup"
  | "Skincare"
  | "Perfume"
  | "Accessories";

/** A single retailer's offer for a product. */
export interface Offer {
  retailerId: string;
  retailerName: string;
  retailerLogo: string; // initials-based logo rendered client-side
  price: number;
  originalPrice?: number; // present when on sale
  currency: string;
  /** Human-readable delivery copy, e.g. "Free delivery" or "£3.99 · 2–4 days". */
  shipping: string;
  freeDelivery: boolean;
  inStock: boolean;
  rating?: number; // 0–5
  reviews?: number;
  /** Affiliate-tagged outbound link to the retailer's exact product page. */
  url: string;
  /** ISO timestamp of when this price was last fetched from the retailer feed. */
  lastChecked: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  subcategory: string;
  description: string;
  materials: string[];
  colours: string[];
  sizes: string[];
  images: string[];
  tags: string[];
  /** Aggregated rating across retailers. */
  rating: number;
  reviews: number;
  offers: Offer[];
  createdAt: string; // ISO date
  isNew: boolean;
  sponsored: boolean;
  /** Cheapest current price, denormalised for fast sorting/filtering. */
  lowestPrice: number;
  /** Best discount percentage available across offers (0–100). */
  bestDiscount: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number; // 1–5
  title: string;
  body: string;
  date: string; // ISO
  verified: boolean;
  helpful: number;
}

/** Star-count breakdown [5★, 4★, 3★, 2★, 1★]. */
export type RatingBreakdown = [number, number, number, number, number];

export interface SearchFilters {
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
}

export type SortKey =
  | "popular"
  | "price-asc"
  | "price-desc"
  | "discount"
  | "newest"
  | "rating";

export interface SearchResult {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  /** Facets reflect the *unfiltered* result set so the UI can show counts. */
  facets: {
    brands: { value: string; count: number }[];
    colours: { value: string; count: number }[];
    sizes: { value: string; count: number }[];
    materials: { value: string; count: number }[];
    retailers: { value: string; count: number }[];
    categories: { value: string; count: number }[];
    priceRange: { min: number; max: number };
  };
}
