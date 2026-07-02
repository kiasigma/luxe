// Client-side mirror of the API domain types (see server/src/types.ts).

export type Category =
  | "Clothing"
  | "Shoes"
  | "Handbags"
  | "Jewellery"
  | "Makeup"
  | "Skincare"
  | "Perfume"
  | "Accessories";

export interface Offer {
  retailerId: string;
  retailerName: string;
  retailerLogo: string;
  price: number;
  originalPrice?: number;
  currency: string;
  shipping: string;
  freeDelivery: boolean;
  inStock: boolean;
  rating?: number;
  reviews?: number;
  url: string;
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
  rating: number;
  reviews: number;
  offers: Offer[];
  createdAt: string;
  isNew: boolean;
  sponsored: boolean;
  lowestPrice: number;
  bestDiscount: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  helpful: number;
}

export type RatingBreakdown = [number, number, number, number, number];

export interface Facet {
  value: string;
  count: number;
}

export interface SearchResult {
  products: Product[];
  total: number;
  page: number;
  pageSize: number;
  facets: {
    brands: Facet[];
    colours: Facet[];
    sizes: Facet[];
    materials: Facet[];
    retailers: Facet[];
    categories: Facet[];
    priceRange: { min: number; max: number };
  };
}

export interface Suggestion {
  type: "product" | "brand" | "category" | "query";
  label: string;
  sublabel?: string;
  productId?: string;
}

export interface RetailerInfo {
  id: string;
  name: string;
  logo: string;
  accent: string;
  homepage: string;
}

export interface PopularCategory {
  name: string;
  category: string;
  icon: string;
}

export interface Discovery {
  trendingSearches: string[];
  popularCategories: PopularCategory[];
  popularBrands: string[];
  priceDropped: Product[];
  editorsPicks: Product[];
  newIn: Product[];
  trendingProducts: Product[];
}

export type SortKey =
  | "popular"
  | "price-asc"
  | "price-desc"
  | "discount"
  | "newest"
  | "rating";
