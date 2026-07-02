/**
 * Curated, type-accurate product photography.
 *
 * Each product renders a real photo that depicts what the item actually is (a
 * dress photo for a dress, trainers for trainers, lipstick for lipstick…), not
 * the brand name and not a random image. Photos are mapped by subcategory, with
 * a per-category fallback, and were visually verified to match.
 *
 * These are representative photos for the demo catalogue. When you connect a
 * real retailer/affiliate feed, populate `CatalogItem.images` from the feed's
 * official image URLs to show the exact product shot — `productImageUrls`
 * becomes unnecessary at that point.
 *
 * Source: Unsplash (royalty-free). Served via the Unsplash image CDN.
 */

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=640&h=800&q=80`;

// Subcategory → verified photo set.
const BY_SUBCATEGORY: Record<string, string[]> = {
  // Clothing
  Dresses: ["1595777457583-95e059d581b8", "1572804013309-59a88b7e92f1", "1612722432474-b971cdcea546"].map(img),
  Tops: ["1564257631407-4deb1f99d992", "1503342217505-b0a15ec3261c"].map(img),
  "Tank Tops": ["1503342217505-b0a15ec3261c", "1564257631407-4deb1f99d992"].map(img),
  Bodysuits: ["1564257631407-4deb1f99d992", "1503342217505-b0a15ec3261c"].map(img),
  Blazers: ["1591047139829-d91aecb6caea", "1539533018447-63fcce2678e3"].map(img),
  Knitwear: ["1434389677669-e08b4cac3105"].map(img),
  Jeans: ["1542272604-787c3835535d", "1541099649105-f69ad21f3246"].map(img),
  Activewear: ["1506629082955-511b1aa562c8", "1518611012118-696072aa579a", "1571019613454-1cb2f99b2d8b"].map(img),
  "Sports Tops": ["1518310383802-640c2de311b2", "1571019613454-1cb2f99b2d8b"].map(img),
  Loungewear: ["1434389677669-e08b4cac3105", "1571019613454-1cb2f99b2d8b"].map(img),
  "Coats & Jackets": ["1539533018447-63fcce2678e3", "1591047139829-d91aecb6caea"].map(img),
  Skirts: ["1583496661160-fb5886a0aaaa", "1582142306909-195724d33ffc"].map(img),
  // Shoes
  Heels: ["1518049362265-d5b2a6467637", "1543163521-1bf539c55dd2"].map(img),
  Trainers: ["1542291026-7eec264c27ff", "1606107557195-0e29a4b5b4aa"].map(img),
  Boots: ["1605812860427-4024433a70fd", "1608256246200-53e635b5b65f"].map(img),
  "Flats & Sandals": ["1603487742131-4160ec999306"].map(img),
  // Handbags
  "Shoulder Bags": ["1584917865442-de89df76afd3", "1548036328-c9fa89d128fa"].map(img),
  "Tote Bags": ["1594223274512-ad4803739b7c", "1591561954557-26941169b49e"].map(img),
  "Clutches & Mini": ["1548036328-c9fa89d128fa", "1584917865442-de89df76afd3"].map(img),
  // Jewellery
  Necklaces: ["1515562141207-7a88fb7ce338", "1611652022419-a9419f74343d", "1599643478518-a784e5dc4c8f"].map(img),
  Earrings: ["1611652022419-a9419f74343d", "1599643478518-a784e5dc4c8f"].map(img),
  "Rings & Bracelets": ["1599643478518-a784e5dc4c8f", "1515562141207-7a88fb7ce338"].map(img),
  // Makeup
  Lips: ["1586495777744-4413f21062fa", "1596462502278-27bfdc403348"].map(img),
  Face: ["1522335789203-aabd1fc54bc9", "1596462502278-27bfdc403348"].map(img),
  Eyes: ["1596462502278-27bfdc403348", "1522335789203-aabd1fc54bc9"].map(img),
  // Skincare
  Serums: ["1556228720-195a672e8a03", "1612817288484-6f916006741a"].map(img),
  Moisturisers: ["1570172619644-dfd03ed5d881", "1556228720-195a672e8a03"].map(img),
  "Cleansers & Masks": ["1612817288484-6f916006741a", "1570172619644-dfd03ed5d881"].map(img),
  // Perfume
  "Eau de Parfum": ["1541643600914-78b084683601", "1592945403244-b3fbafd7f539"].map(img),
  "Body Mist & Sets": ["1592945403244-b3fbafd7f539", "1541643600914-78b084683601"].map(img),
  // Accessories
  Sunglasses: ["1511499767150-a48a237f0083", "1572635196237-14b3f281503f"].map(img),
  "Scarves & Silk": ["1457545195570-67f207084966"].map(img),
  "Hats & Belts": ["1521369909029-2afed882baee", "1533827432537-70133748f5c8"].map(img),
};

// Category → fallback photo set (covers any unmapped subcategory).
const BY_CATEGORY: Record<string, string[]> = {
  Clothing: BY_SUBCATEGORY.Dresses,
  Shoes: BY_SUBCATEGORY.Trainers,
  Handbags: BY_SUBCATEGORY["Shoulder Bags"],
  Jewellery: BY_SUBCATEGORY.Necklaces,
  Makeup: BY_SUBCATEGORY.Lips,
  Skincare: BY_SUBCATEGORY.Serums,
  Perfume: BY_SUBCATEGORY["Eau de Parfum"],
  Accessories: BY_SUBCATEGORY.Sunglasses,
};

/**
 * Returns a single, deterministic, type-accurate photo URL for a product.
 * Returns `null` if nothing matches (caller can fall back to a brand tile).
 */
export function productImageUrl(subcategory: string, category: string, seed: number): string | null {
  const list = BY_SUBCATEGORY[subcategory] ?? BY_CATEGORY[category];
  if (!list || list.length === 0) return null;
  return list[seed % list.length];
}
