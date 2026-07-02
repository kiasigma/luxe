/**
 * The retailer integration contract.
 *
 * Every retailer the platform compares prices across is represented by a single
 * `RetailerAdapter`. This is the ONE place you integrate a retailer's official
 * public API or affiliate product feed. The rest of the system (search,
 * comparison, filtering, facets) is retailer-agnostic and works automatically
 * for any registered adapter.
 *
 * To add a retailer: create an adapter in `./adapters`, then register it in
 * `./registry.ts`. Nothing else needs to change.
 */

/** Intrinsic product information, independent of any single retailer. */
export interface CatalogItem {
  id: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  description: string;
  materials: string[];
  colours: string[];
  sizes: string[];
  images: string[];
  tags: string[];
  /** Reference RRP used by adapters to derive realistic per-retailer pricing. */
  basePrice: number;
  baseRating: number;
  baseReviews: number;
  createdAt: string;
  /** Stable seed so demo pricing is deterministic across restarts. */
  seed: number;
}

export interface RetailerInfo {
  id: string;
  name: string;
  /** Short initials used to render a tasteful monogram logo on the client. */
  logo: string;
  /** Pastel accent used in the retailer chip. */
  accent: string;
  homepage: string;
}

/** A raw offer as returned by an adapter, before aggregation/formatting. */
export interface RawOffer {
  productId: string;
  price: number;
  originalPrice?: number;
  shipping: string;
  freeDelivery: boolean;
  inStock: boolean;
  rating?: number;
  reviews?: number;
  /** Outbound deep link to the retailer's product page (affiliate-tagged). */
  url: string;
}

export interface RetailerAdapter {
  readonly info: RetailerInfo;
  /**
   * Return offers for the products this retailer carries. In production this
   * would call an official API / affiliate feed and map the response into
   * `RawOffer`s. Adapters may be async.
   */
  fetchOffers(items: CatalogItem[]): Promise<RawOffer[]> | RawOffer[];
}
