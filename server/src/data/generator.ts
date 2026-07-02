import type { CatalogItem } from "../retailers/types.js";
import { brandLogoUrl } from "./brandStores.js";

/**
 * Deterministic demo-catalogue generator.
 *
 * Produces a large, varied, stable set of `CatalogItem`s across every category
 * (including activewear). In production this module is replaced by ingestion
 * from official retailer feeds; the rest of the platform consumes
 * `CatalogItem`/`Product` regardless of source.
 */

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pick = <T>(rand: () => number, arr: T[]): T => arr[Math.floor(rand() * arr.length)];
const sample = <T>(rand: () => number, arr: T[], n: number): T[] => {
  const copy = [...arr];
  const out: T[] = [];
  while (out.length < n && copy.length) out.push(copy.splice(Math.floor(rand() * copy.length), 1)[0]);
  return out;
};

const COLOURS = [
  "Black", "White", "Beige", "Blush Pink", "Sage Green", "Powder Blue",
  "Lilac", "Cream", "Camel", "Burgundy", "Navy", "Lavender", "Terracotta",
  "Gold", "Silver", "Olive", "Charcoal", "Rose Gold", "Emerald", "Chocolate",
];
const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL"];
const SHOE_SIZES = ["3", "4", "5", "6", "7", "8"];

interface Template {
  category: string;
  subcategory: string;
  brands: string[];
  names: string[];
  materials: string[];
  sizes: string[] | null;
  priceRange: [number, number];
  tags: string[];
}

// Reusable brand pools
const ACTIVEWEAR_BRANDS = ["Lululemon", "Gymshark", "Alo Yoga", "Sweaty Betty", "Adidas", "Nike", "Varley", "Girlfriend Collective"];

const TEMPLATES: Template[] = [
  // ───────── Clothing ─────────
  {
    category: "Clothing", subcategory: "Dresses",
    brands: ["Reformation", "& Other Stories", "Ganni", "Mango", "Zara", "Self-Portrait", "Rixo", "Realisation Par"],
    names: ["Satin Slip Dress", "Floral Midi Dress", "Linen Wrap Dress", "Pleated Maxi Dress", "Black Mini Dress", "Cut-Out Bodycon Dress", "Puff-Sleeve Tea Dress", "Halter Slip Dress", "Shirred Sundress", "Ruched Mesh Dress"],
    materials: ["Silk", "Linen", "Viscose", "Cotton", "Satin"], sizes: CLOTHING_SIZES, priceRange: [39, 240],
    tags: ["dress", "occasion", "summer", "wedding-guest"],
  },
  {
    category: "Clothing", subcategory: "Tops",
    brands: ["COS", "Arket", "Mango", "Massimo Dutti", "& Other Stories", "Zara", "Uniqlo"],
    names: ["Silk Camisole", "Oversized Poplin Shirt", "Ribbed Knit Top", "Puff-Sleeve Blouse", "Cropped Cardigan", "Square-Neck Bodysuit", "Linen Tank Top", "Satin Shirt"],
    materials: ["Cotton", "Silk", "Modal", "Linen", "Viscose"], sizes: CLOTHING_SIZES, priceRange: [19, 130],
    tags: ["top", "work", "everyday", "blouse", "shirt"],
  },
  {
    category: "Clothing", subcategory: "Tank Tops",
    brands: ["COS", "Arket", "Mango", "Zara", "Uniqlo", "& Other Stories", "Skims", "Calvin Klein", "Sweaty Betty"],
    names: ["Ribbed Tank Top", "Cotton Vest Top", "Scoop-Neck Tank", "Racerback Tank", "Cropped Tank Top", "Fitted Cami Tank", "Square-Neck Vest", "Seamless Tank Top"],
    materials: ["Cotton", "Ribbed Jersey", "Modal", "Organic Cotton"], sizes: CLOTHING_SIZES, priceRange: [9, 65],
    tags: ["tank", "tank-top", "vest", "cami", "tee", "top", "everyday", "basic", "layering"],
  },
  {
    category: "Clothing", subcategory: "Bodysuits",
    brands: ["Skims", "Mango", "Zara", "& Other Stories", "Calvin Klein", "Wolford"],
    names: ["Square-Neck Bodysuit", "Long-Sleeve Bodysuit", "Ribbed Thong Bodysuit", "Halter-Neck Bodysuit", "Scoop Bodysuit"],
    materials: ["Modal", "Cotton", "Stretch Jersey"], sizes: CLOTHING_SIZES, priceRange: [15, 78],
    tags: ["bodysuit", "top", "going-out", "layering", "basic"],
  },
  {
    category: "Clothing", subcategory: "Blazers",
    brands: ["Mango", "Zara", "COS", "Reiss", "Massimo Dutti", "Whistles"],
    names: ["Oversized Wool Blazer", "Single-Breasted Blazer", "Cropped Tweed Blazer", "Double-Breasted Blazer", "Linen Blend Blazer"],
    materials: ["Wool Blend", "Tweed", "Linen", "Recycled Polyester"], sizes: CLOTHING_SIZES, priceRange: [49, 240],
    tags: ["blazer", "jacket", "tailoring", "work", "outerwear"],
  },
  {
    category: "Clothing", subcategory: "Knitwear",
    brands: ["COS", "Arket", "& Other Stories", "Mango", "Massimo Dutti", "Reiss"],
    names: ["Cashmere Jumper", "Wool Crew Neck", "Ribbed Knit Cardigan", "Merino Roll Neck", "Oversized Knit Jumper", "Cable-Knit Sweater"],
    materials: ["Cashmere", "Merino Wool", "Lambswool", "Cotton Blend"], sizes: CLOTHING_SIZES, priceRange: [45, 220],
    tags: ["knitwear", "jumper", "sweater", "winter", "work"],
  },
  {
    category: "Clothing", subcategory: "Jeans",
    brands: ["Levi's", "AGOLDE", "Zara", "Mango", "Frame", "Citizens of Humanity"],
    names: ["High-Rise Straight Jeans", "Wide-Leg Jeans", "Slim Mom Jeans", "Cropped Flare Jeans", "Barrel-Leg Jeans", "90s Bootcut Jeans"],
    materials: ["Organic Cotton", "Denim", "Stretch Denim"], sizes: CLOTHING_SIZES, priceRange: [29, 195],
    tags: ["jeans", "denim", "trousers", "pants", "everyday"],
  },
  {
    category: "Clothing", subcategory: "Activewear",
    brands: ACTIVEWEAR_BRANDS,
    names: ["Align High-Rise Leggings", "Yoga Pants", "Seamless Sports Leggings", "Flared Yoga Pants", "Cropped Gym Leggings", "Studio Jogger Pants", "High-Waist Workout Leggings", "Wide-Leg Lounge Pants", "Compression Running Leggings"],
    materials: ["Nulu Fabric", "Recycled Nylon", "Spandex Blend", "Buttery-Soft Jersey", "Sweat-Wicking Knit"], sizes: CLOTHING_SIZES, priceRange: [25, 128],
    tags: ["activewear", "yoga", "sports", "gym", "workout", "leggings", "pants", "athletic", "athleisure", "running"],
  },
  {
    category: "Clothing", subcategory: "Sports Tops",
    brands: ACTIVEWEAR_BRANDS,
    names: ["Seamless Sports Bra", "Energy Sports Bra", "Cropped Training Tank", "Longline Yoga Bra", "Workout Hoodie", "Running Vest", "Ribbed Gym Crop Top"],
    materials: ["Recycled Nylon", "Spandex Blend", "Sweat-Wicking Knit", "Mesh Panel"], sizes: CLOTHING_SIZES, priceRange: [18, 88],
    tags: ["activewear", "sports", "gym", "yoga", "workout", "sports-bra", "athletic", "running", "athleisure"],
  },
  {
    category: "Clothing", subcategory: "Loungewear",
    brands: ["Skims", "Lounge", "Calvin Klein", "Uniqlo", "Sweaty Betty", "Lululemon"],
    names: ["Cotton Lounge Set", "Ribbed Lounge Pants", "Soft Modal Joggers", "Cosy Knit Lounge Hoodie", "Waffle Lounge Tee"],
    materials: ["Modal", "Organic Cotton", "Bamboo Jersey", "Fleece"], sizes: CLOTHING_SIZES, priceRange: [22, 98],
    tags: ["loungewear", "comfy", "joggers", "pants", "athleisure", "home"],
  },
  {
    category: "Clothing", subcategory: "Coats & Jackets",
    brands: ["Mango", "Zara", "COS", "Reiss", "Massimo Dutti", "Whistles"],
    names: ["Wool Blend Coat", "Oversized Blazer", "Quilted Puffer Jacket", "Trench Coat", "Cropped Denim Jacket", "Belted Wrap Coat"],
    materials: ["Wool Blend", "Recycled Polyester", "Cotton", "Faux Leather"], sizes: CLOTHING_SIZES, priceRange: [49, 320],
    tags: ["coat", "jacket", "outerwear", "blazer", "winter"],
  },
  {
    category: "Clothing", subcategory: "Skirts",
    brands: ["Zara", "Mango", "& Other Stories", "Ganni", "COS"],
    names: ["Satin Slip Skirt", "Pleated Midi Skirt", "Denim Mini Skirt", "Leather A-Line Skirt", "Floral Maxi Skirt"],
    materials: ["Satin", "Denim", "Faux Leather", "Viscose"], sizes: CLOTHING_SIZES, priceRange: [25, 150],
    tags: ["skirt", "midi", "everyday", "work"],
  },

  // ───────── Shoes ─────────
  {
    category: "Shoes", subcategory: "Heels",
    brands: ["Jimmy Choo", "Aeyde", "Stuart Weitzman", "Mango", "Zara", "Sam Edelman"],
    names: ["Strappy Block Heels", "Pointed Slingback Pumps", "Satin Stiletto Sandals", "Mule Heels", "Ankle-Strap Heels", "Kitten Heel Slingbacks"],
    materials: ["Leather", "Suede", "Satin", "Patent Leather"], sizes: SHOE_SIZES, priceRange: [49, 480],
    tags: ["shoes", "heels", "occasion", "pumps"],
  },
  {
    category: "Shoes", subcategory: "Trainers",
    brands: ["Adidas", "Nike", "Veja", "New Balance", "Axel Arigato", "Puma", "Asics"],
    names: ["Leather Court Trainers", "Retro Running Trainers", "Chunky Sole Sneakers", "Minimal White Trainers", "Suede Low-Tops", "Mesh Running Shoes", "Gum-Sole Sneakers"],
    materials: ["Leather", "Suede", "Recycled Mesh", "Canvas"], sizes: SHOE_SIZES, priceRange: [55, 180],
    tags: ["shoes", "trainers", "sneakers", "everyday", "sports", "running"],
  },
  {
    category: "Shoes", subcategory: "Boots",
    brands: ["Dr. Martens", "Zara", "Mango", "Ganni", "Vagabond", "Sam Edelman"],
    names: ["Chelsea Ankle Boots", "Knee-High Leather Boots", "Western Cowboy Boots", "Chunky Platform Boots", "Heeled Sock Boots"],
    materials: ["Leather", "Suede", "Faux Leather"], sizes: SHOE_SIZES, priceRange: [59, 350],
    tags: ["shoes", "boots", "winter", "ankle-boots"],
  },
  {
    category: "Shoes", subcategory: "Flats & Sandals",
    brands: ["Birkenstock", "Aeyde", "Zara", "Mango", "Ancient Greek Sandals", "Toteme"],
    names: ["Leather Ballet Flats", "Mesh Ballet Flats", "Strappy Flat Sandals", "Slingback Flats", "Espadrille Wedges", "Slide Sandals"],
    materials: ["Leather", "Suede", "Mesh", "Raffia"], sizes: SHOE_SIZES, priceRange: [29, 240],
    tags: ["shoes", "flats", "sandals", "summer", "everyday"],
  },

  // ───────── Handbags ─────────
  {
    category: "Handbags", subcategory: "Shoulder Bags",
    brands: ["Polène", "Strathberry", "DeMellier", "Wandler", "Coach", "JW PEI"],
    names: ["Structured Tote Bag", "Quilted Shoulder Bag", "Mini Top-Handle Bag", "Soft Hobo Bag", "Crossbody Baguette Bag", "Half-Moon Shoulder Bag"],
    materials: ["Leather", "Suede", "Vegan Leather"], sizes: null, priceRange: [69, 590],
    tags: ["handbag", "bag", "purse", "luxury", "wedding-guest"],
  },
  {
    category: "Handbags", subcategory: "Tote Bags",
    brands: ["Polène", "Toteme", "Mango", "Zara", "Marc Jacobs", "Longchamp"],
    names: ["Leather Shopper Tote", "Woven Raffia Tote", "Canvas Logo Tote", "Slouchy Leather Tote", "Structured Work Tote"],
    materials: ["Leather", "Canvas", "Raffia", "Vegan Leather"], sizes: null, priceRange: [39, 420],
    tags: ["handbag", "bag", "tote", "work", "everyday"],
  },
  {
    category: "Handbags", subcategory: "Clutches & Mini",
    brands: ["Cult Gaia", "Mango", "Zara", "Bottega Veneta", "JW PEI"],
    names: ["Beaded Evening Clutch", "Box Clutch Bag", "Mini Pouch Bag", "Croc-Effect Clutch", "Chain Mini Bag"],
    materials: ["Satin", "Leather", "Beaded", "Vegan Leather"], sizes: null, priceRange: [29, 320],
    tags: ["handbag", "bag", "clutch", "occasion", "evening"],
  },

  // ───────── Jewellery ─────────
  {
    category: "Jewellery", subcategory: "Necklaces",
    brands: ["Missoma", "Astrid & Miyu", "Mejuri", "Monica Vinader", "Pandora", "Otiumberg"],
    names: ["Gold Vermeil Pendant Necklace", "Pearl Drop Necklace", "Layered Chain Necklace", "Birthstone Necklace", "Herringbone Chain", "Lariat Necklace"],
    materials: ["18k Gold Vermeil", "Sterling Silver", "Freshwater Pearl", "Recycled Gold"], sizes: null, priceRange: [29, 240],
    tags: ["jewellery", "necklace", "pendant", "chain", "gift", "everyday"],
  },
  {
    category: "Jewellery", subcategory: "Earrings",
    brands: ["Missoma", "Astrid & Miyu", "Mejuri", "Otiumberg", "Monica Vinader"],
    names: ["Gold Hoop Earrings", "Pearl Stud Earrings", "Huggie Earrings", "Drop Crystal Earrings", "Chunky Hoop Earrings", "Threader Earrings"],
    materials: ["18k Gold Vermeil", "Sterling Silver", "Freshwater Pearl"], sizes: null, priceRange: [19, 180],
    tags: ["jewellery", "earrings", "hoops", "studs", "gift"],
  },
  {
    category: "Jewellery", subcategory: "Rings & Bracelets",
    brands: ["Missoma", "Mejuri", "Astrid & Miyu", "Monica Vinader", "Pandora"],
    names: ["Stacking Ring Set", "Signet Ring", "Tennis Bracelet", "Beaded Chain Bracelet", "Pavé Band Ring", "Cuff Bracelet"],
    materials: ["18k Gold Vermeil", "Sterling Silver", "Recycled Gold", "Cubic Zirconia"], sizes: null, priceRange: [25, 260],
    tags: ["jewellery", "ring", "bracelet", "gift", "stacking"],
  },

  // ───────── Makeup ─────────
  {
    category: "Makeup", subcategory: "Lips",
    brands: ["Charlotte Tilbury", "Rare Beauty", "MAC", "Dior", "NARS", "Fenty Beauty"],
    names: ["Matte Revolution Lipstick", "Soft Pinch Liquid Blush", "Velvet Lip Liner", "Lip Glow Oil", "Satin Lipstick", "Plumping Lip Gloss"],
    materials: ["Vegan Formula", "Cruelty-Free"], sizes: null, priceRange: [12, 38],
    tags: ["makeup", "lips", "lipstick", "beauty", "gift"],
  },
  {
    category: "Makeup", subcategory: "Face",
    brands: ["Charlotte Tilbury", "NARS", "Fenty Beauty", "Hourglass", "Ilia", "Rare Beauty"],
    names: ["Hollywood Flawless Filter", "Radiant Foundation", "Soft Matte Concealer", "Cream Bronzer", "Setting Powder", "Liquid Highlighter"],
    materials: ["Vegan Formula", "Cruelty-Free", "SPF 15"], sizes: null, priceRange: [18, 49],
    tags: ["makeup", "face", "foundation", "concealer", "beauty"],
  },
  {
    category: "Makeup", subcategory: "Eyes",
    brands: ["Charlotte Tilbury", "Benefit", "Urban Decay", "MAC", "Stila", "Ilia"],
    names: ["Volumising Mascara", "Eyeshadow Palette", "Liquid Eyeliner", "Brow Gel", "Cream Eyeshadow Stick", "Lash-Lifting Mascara"],
    materials: ["Vegan Formula", "Cruelty-Free", "Smudge-Proof"], sizes: null, priceRange: [14, 52],
    tags: ["makeup", "eyes", "mascara", "eyeshadow", "beauty"],
  },

  // ───────── Skincare ─────────
  {
    category: "Skincare", subcategory: "Serums",
    brands: ["The Ordinary", "Drunk Elephant", "Medik8", "Paula's Choice", "Sunday Riley", "The INKEY List"],
    names: ["Vitamin C Serum", "Hyaluronic Acid Serum", "Retinol Night Serum", "Niacinamide Serum", "Glow Drops", "Peptide Serum"],
    materials: ["Vegan Formula", "Fragrance-Free", "Dermatologically Tested"], sizes: null, priceRange: [7, 78],
    tags: ["skincare", "serum", "beauty", "everyday", "treatment"],
  },
  {
    category: "Skincare", subcategory: "Moisturisers",
    brands: ["CeraVe", "La Roche-Posay", "Drunk Elephant", "Tatcha", "Augustinus Bader", "Byoma"],
    names: ["Hydrating Day Cream", "Rich Night Moisturiser", "Gel-Cream Moisturiser", "Barrier Repair Cream", "Water Cream", "Ceramide Moisturiser"],
    materials: ["Fragrance-Free", "Dermatologically Tested", "Non-Comedogenic"], sizes: null, priceRange: [10, 145],
    tags: ["skincare", "moisturiser", "cream", "beauty", "hydrating"],
  },
  {
    category: "Skincare", subcategory: "Cleansers & Masks",
    brands: ["CeraVe", "Fresh", "Drunk Elephant", "Glow Recipe", "Summer Fridays", "The Ordinary"],
    names: ["Gentle Foaming Cleanser", "Hydrating Cleansing Balm", "Clay Detox Mask", "Overnight Glow Mask", "Exfoliating Toner", "Soothing Sheet Mask"],
    materials: ["Vegan Formula", "Fragrance-Free", "Dermatologically Tested"], sizes: null, priceRange: [9, 65],
    tags: ["skincare", "cleanser", "mask", "beauty", "treatment"],
  },

  // ───────── Perfume ─────────
  {
    category: "Perfume", subcategory: "Eau de Parfum",
    brands: ["Chloé", "Marc Jacobs", "YSL", "Jo Malone", "Mugler", "Maison Margiela", "Lancôme", "Prada"],
    names: ["Floral Eau de Parfum", "Replica Beach Walk", "Daisy Eau So Fresh", "Libre Eau de Parfum", "English Pear Cologne", "Angel Nova", "La Vie Est Belle", "Paradoxe EDP"],
    materials: ["Eau de Parfum", "Vegan", "50ml"], sizes: ["30ml", "50ml", "90ml"], priceRange: [42, 175],
    tags: ["perfume", "fragrance", "scent", "eau-de-parfum", "gift"],
  },
  {
    category: "Perfume", subcategory: "Body Mist & Sets",
    brands: ["Sol de Janeiro", "Jo Malone", "The Body Shop", "Victoria's Secret", "Glossier"],
    names: ["Perfume Mist", "Body Fragrance Mist", "Layering Cologne Set", "Hair & Body Mist", "Discovery Fragrance Set"],
    materials: ["Vegan", "Alcohol-Free", "100ml"], sizes: ["100ml", "150ml"], priceRange: [18, 95],
    tags: ["perfume", "fragrance", "body-mist", "scent", "gift", "set"],
  },

  // ───────── Accessories ─────────
  {
    category: "Accessories", subcategory: "Sunglasses",
    brands: ["Le Specs", "Ray-Ban", "Celine", "Quay", "Chimi", "Gucci"],
    names: ["Oversized Cat-Eye Sunglasses", "Round Acetate Sunglasses", "Square Frame Sunglasses", "Slim Rectangle Sunglasses", "Aviator Sunglasses"],
    materials: ["Acetate", "Metal", "UV400 Lenses"], sizes: null, priceRange: [25, 280],
    tags: ["accessories", "sunglasses", "eyewear", "summer", "holiday"],
  },
  {
    category: "Accessories", subcategory: "Scarves & Silk",
    brands: ["& Other Stories", "Mango", "Aspinal of London", "COS", "Acne Studios"],
    names: ["Printed Silk Scarf", "Cashmere Blend Scarf", "Hair Silk Scrunchie Set", "Wool Wrap Scarf", "Skinny Silk Neck Scarf"],
    materials: ["Silk", "Cashmere", "Wool", "Modal"], sizes: null, priceRange: [12, 140],
    tags: ["accessories", "scarf", "silk", "gift", "winter"],
  },
  {
    category: "Accessories", subcategory: "Hats & Belts",
    brands: ["Mango", "Zara", "COS", "Reiss", "Lack of Color"],
    names: ["Wool Felt Fedora", "Woven Straw Hat", "Leather Waist Belt", "Knitted Beanie", "Chain-Detail Belt"],
    materials: ["Wool", "Straw", "Leather", "Cotton"], sizes: null, priceRange: [15, 130],
    tags: ["accessories", "hat", "belt", "summer", "winter"],
  },
];

const DESCRIPTIONS = [
  "An effortless wardrobe staple cut from premium materials with a flattering, considered silhouette. Designed to be worn season after season.",
  "A modern essential that balances comfort and elegance. The kind of piece you reach for again and again, dressed up or down.",
  "Crafted with care and an eye for detail, this piece brings a quiet luxury to your everyday edit.",
  "Thoughtfully designed and beautifully finished — a refined update that feels special without trying too hard.",
  "Soft, supportive and made to move with you. A high-performance piece that looks just as good off-duty as on.",
  "A cult favourite, loved for its silky finish and buildable, long-lasting results.",
];

export function generateCatalog(count = 320): CatalogItem[] {
  const rand = mulberry32(20260628);
  const items: CatalogItem[] = [];
  const now = Date.now();
  const seenNames = new Set<string>();

  for (let i = 0; i < count; i++) {
    const t = TEMPLATES[i % TEMPLATES.length];
    const seed = Math.floor(rand() * 1e9);
    const r = mulberry32(seed);

    const brand = pick(r, t.brands);
    const name = pick(r, t.names);
    const colours = sample(r, COLOURS, 2 + Math.floor(r() * 4));
    const materials = sample(r, t.materials, 1 + Math.floor(r() * 2));
    const sizes = t.sizes ? sample(r, t.sizes, Math.max(2, Math.floor(r() * t.sizes.length))).sort() : [];
    const [lo, hi] = t.priceRange;
    const basePrice = Number((lo + r() * (hi - lo)).toFixed(2));
    const id = `p${String(i + 1).padStart(3, "0")}`;

    // Keep names distinct: if this brand+name already exists, qualify it with
    // the lead colour (e.g. "Mango Satin Slip Dress in Black").
    let displayName = `${brand} ${name}`;
    if (seenNames.has(displayName)) displayName = `${displayName} in ${colours[0]}`;
    let dedupeGuard = 1;
    while (seenNames.has(displayName)) displayName = `${brand} ${name} in ${colours[0]} (${++dedupeGuard})`;
    seenNames.add(displayName);

    // Product imagery is the brand's own company logo (served by domain). With a
    // real feed connected, populate this from the feed's official product images.
    const images = [brandLogoUrl(brand)];

    const daysOld = Math.floor(r() * 120);
    const createdAt = new Date(now - daysOld * 86400000).toISOString();

    items.push({
      id,
      name: displayName,
      brand,
      category: t.category,
      subcategory: t.subcategory,
      description: pick(r, DESCRIPTIONS),
      materials,
      colours,
      sizes,
      images,
      tags: [...t.tags, brand.toLowerCase().replace(/[^a-z]+/g, "-")],
      basePrice,
      baseRating: Number((4 + r() * 0.9).toFixed(1)),
      baseReviews: 20 + Math.floor(r() * 1800),
      createdAt,
      seed,
    });
  }

  return items;
}
