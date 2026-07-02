import { config } from "../config.js";
import type { Offer, Product, Category } from "../types.js";
import type { CatalogItem, RawOffer } from "../retailers/types.js";
import { retailerAdapters } from "../retailers/registry.js";
import { generateCatalog } from "./generator.js";
import { brandHomepage, brandStoreInfo, VERTICAL_BRANDS } from "./brandStores.js";
import { retailerCarries } from "./retailerBrands.js";

const round99 = (v: number) => {
  const whole = Math.floor(v);
  return Number((whole + (v - whole > 0.5 ? 0.99 : 0.95)).toFixed(2));
};

const freshness = (price: number) =>
  new Date(Date.now() - ((Math.round(price * 7) % 56) + 3) * 60_000).toISOString();

/**
 * Builds the comparable product catalogue by asking every registered retailer
 * adapter for its offers, then aggregating offers per product. This is the
 * retailer-agnostic core: add an adapter and its offers flow in automatically.
 */
async function buildCatalog(): Promise<Product[]> {
  const items = generateCatalog();

  // Gather raw offers from all adapters in parallel.
  const offersByProduct = new Map<string, { offer: RawOffer; retailer: typeof retailerAdapters[number]["info"] }[]>();

  const results = await Promise.all(
    retailerAdapters.map(async (adapter) => ({
      info: adapter.info,
      offers: await adapter.fetchOffers(items),
    })),
  );

  for (const { info, offers } of results) {
    for (const raw of offers) {
      const list = offersByProduct.get(raw.productId) ?? [];
      list.push({ offer: raw, retailer: info });
      offersByProduct.set(raw.productId, list);
    }
  }

  const products: Product[] = [];
  let sponsoredCounter = 0;

  for (const item of items) {
    // Third-party retailer offers — but vertically-integrated brands (Zara,
    // Mango…) are sold only on their own site, so they get no third-party offers.
    const rawOffers = VERTICAL_BRANDS.has(item.brand)
      ? []
      : (offersByProduct.get(item.id) ?? []).filter(({ retailer }) =>
          retailerCarries(retailer.id, item.brand),
        );

    const retailerOffers: Offer[] = rawOffers.map(({ offer, retailer }) => ({
      retailerId: retailer.id,
      retailerName: retailer.name,
      retailerLogo: retailer.logo,
      price: offer.price,
      originalPrice: offer.originalPrice,
      currency: config.currency,
      shipping: offer.shipping,
      freeDelivery: offer.freeDelivery,
      inStock: offer.inStock,
      rating: offer.rating,
      reviews: offer.reviews,
      url: offer.url,
      lastChecked: freshness(offer.price),
    }));

    // The brand's own store: always present and always the best price, so the
    // "Best Deal" retailer matches the item's brand and links to its homepage.
    const store = brandStoreInfo(item.brand);
    const cheapestRetailer = retailerOffers.length
      ? Math.min(...retailerOffers.map((o) => o.price))
      : round99(item.basePrice);
    const brandPrice = round99(cheapestRetailer * 0.95);
    const brandOffer: Offer = {
      retailerId: store.id,
      retailerName: store.name,
      retailerLogo: store.logo,
      price: brandPrice,
      originalPrice: item.basePrice > brandPrice * 1.12 ? round99(item.basePrice) : undefined,
      currency: config.currency,
      shipping: "Free delivery",
      freeDelivery: true,
      inStock: true,
      rating: Number(item.baseRating.toFixed(1)),
      reviews: Math.round(item.baseReviews * 0.6),
      url: brandHomepage(item.brand),
      lastChecked: freshness(brandPrice),
    };

    const offers: Offer[] = [brandOffer, ...retailerOffers].sort((a, b) => a.price - b.price);

    const lowestPrice = offers[0].price;
    const bestDiscount = Math.max(
      0,
      ...offers.map((o) =>
        o.originalPrice ? Math.round(((o.originalPrice - o.price) / o.originalPrice) * 100) : 0,
      ),
    );
    const ratings = offers.filter((o) => o.rating).map((o) => o.rating as number);
    const rating = ratings.length
      ? Number((ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1))
      : item.baseRating;
    const reviews = offers.reduce((a, o) => a + (o.reviews ?? 0), 0);
    const isNew = Date.now() - new Date(item.createdAt).getTime() < 21 * 86400000;
    const sponsored = sponsoredCounter++ % 14 === 5; // a tasteful few

    products.push({
      id: item.id,
      name: item.name,
      brand: item.brand,
      category: item.category as Category,
      subcategory: item.subcategory,
      description: item.description,
      materials: item.materials,
      colours: item.colours,
      sizes: item.sizes,
      images: item.images,
      tags: item.tags,
      rating,
      reviews,
      offers,
      createdAt: item.createdAt,
      isNew,
      sponsored,
      lowestPrice,
      bestDiscount,
    });
  }

  return products;
}

// Build once at boot and cache. `getCatalog` is the single read entry point.
let cache: Product[] | null = null;
let building: Promise<Product[]> | null = null;

export async function getCatalog(): Promise<Product[]> {
  if (cache) return cache;
  if (!building) building = buildCatalog().then((p) => (cache = p));
  return building;
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const catalog = await getCatalog();
  return catalog.find((p) => p.id === id);
}

/** Helper for "you might also like" / related rails. */
export async function getRelated(product: Product, limit = 8): Promise<Product[]> {
  const catalog = await getCatalog();
  return catalog
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}
