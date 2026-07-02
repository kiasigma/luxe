/**
 * Which brands each multi-brand retailer actually stocks.
 *
 * A retailer only appears as an offer for a product when it genuinely carries
 * that brand — e.g. CeraVe is stocked by LookFantastic but NOT Sephora, so a
 * CeraVe product never links you to Sephora. Brands not stocked by any retailer
 * here are direct-to-consumer and show only their own brand store.
 */
const RETAILER_BRANDS: Record<string, string[]> = {
  // High-street + sportswear marketplace (fashion only).
  asos: [
    "Adidas", "Nike", "New Balance", "Puma", "Asics", "Dr. Martens", "Birkenstock",
    "Vagabond", "Levi's", "Calvin Klein", "Ray-Ban", "Le Specs", "Quay", "Chimi",
    "Lounge", "Lack of Color", "Veja",
  ],
  // Luxury designer fashion + a little luxury beauty.
  "net-a-porter": [
    "Ganni", "Reformation", "Self-Portrait", "Rixo", "Realisation Par", "Toteme",
    "Acne Studios", "Jimmy Choo", "Stuart Weitzman", "Aeyde", "Bottega Veneta",
    "Gucci", "Celine", "Marc Jacobs", "Longchamp", "Coach", "Wolford", "Frame",
    "AGOLDE", "Citizens of Humanity", "Veja", "Charlotte Tilbury", "Augustinus Bader",
    "Sunday Riley", "Tatcha", "Drunk Elephant", "Hourglass",
  ],
  // Full department store — wide fashion + prestige beauty (no drugstore).
  nordstrom: [
    "Reformation", "Ganni", "Self-Portrait", "Levi's", "AGOLDE", "Frame",
    "Citizens of Humanity", "Sam Edelman", "Stuart Weitzman", "Jimmy Choo",
    "Birkenstock", "Veja", "New Balance", "Adidas", "Nike", "Asics", "Marc Jacobs",
    "Longchamp", "Coach", "Bottega Veneta", "Gucci", "Ray-Ban", "Le Specs", "Quay",
    "Calvin Klein", "Wolford", "Alo Yoga", "Sweaty Betty", "Varley", "Vagabond",
    "Dr. Martens", "Monica Vinader", "Charlotte Tilbury", "NARS", "MAC", "Dior",
    "Fenty Beauty", "Hourglass", "Ilia", "Drunk Elephant", "Tatcha", "Sunday Riley",
    "Augustinus Bader", "Fresh", "Jo Malone", "YSL", "Lancôme", "Glow Recipe",
    "Summer Fridays", "Sol de Janeiro", "Rare Beauty",
  ],
  // Prestige beauty (no mass/drugstore brands).
  sephora: [
    "Charlotte Tilbury", "Rare Beauty", "NARS", "Fenty Beauty", "Hourglass", "Ilia",
    "Benefit", "Urban Decay", "Dior", "MAC", "Drunk Elephant", "Tatcha", "Glow Recipe",
    "Summer Fridays", "Sol de Janeiro", "Glossier", "Fresh", "YSL", "Lancôme",
    "Sunday Riley", "Chloé", "Marc Jacobs", "Mugler", "Maison Margiela", "Prada",
  ],
  // Indie + prestige beauty (no drugstore, no big counter brands).
  "cult-beauty": [
    "The Ordinary", "Drunk Elephant", "Charlotte Tilbury", "NARS", "Fenty Beauty",
    "Hourglass", "Ilia", "Benefit", "Urban Decay", "Medik8", "Paula's Choice",
    "Sunday Riley", "The INKEY List", "Byoma", "Tatcha", "Glow Recipe",
    "Summer Fridays", "Sol de Janeiro", "Glossier", "Fresh", "Rare Beauty",
    "Augustinus Bader", "Stila", "Maison Margiela", "Mugler",
  ],
  // Broad beauty incl. drugstore (CeraVe, La Roche-Posay) and prestige.
  lookfantastic: [
    "CeraVe", "La Roche-Posay", "The Ordinary", "Drunk Elephant", "Medik8",
    "Paula's Choice", "Sunday Riley", "The INKEY List", "Byoma", "Charlotte Tilbury",
    "NARS", "Fenty Beauty", "Hourglass", "Ilia", "Benefit", "Urban Decay", "Tatcha",
    "Glow Recipe", "Summer Fridays", "Sol de Janeiro", "Glossier", "Fresh",
    "Rare Beauty", "Augustinus Bader", "MAC", "Stila",
  ],
};

const SETS = new Map<string, Set<string>>(
  Object.entries(RETAILER_BRANDS).map(([id, brands]) => [id, new Set(brands)]),
);

/** Does this retailer actually stock this brand? */
export function retailerCarries(retailerId: string, brand: string): boolean {
  return SETS.get(retailerId)?.has(brand) ?? false;
}
