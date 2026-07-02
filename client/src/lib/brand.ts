/**
 * Brand → logo filename slug. Used to look up a high-res logo you've dropped in
 * `client/public/logos/<slug>.png`. Accents are stripped and "&" becomes "and",
 * so "Chloé" → "chloe", "& Other Stories" → "andotherstories".
 */
export function brandSlug(brand: string): string {
  return brand
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "");
}

/** Local path where a provided logo lives (PNG with transparent background). */
export function brandLogoPath(brand: string): string {
  return `/logos/${brandSlug(brand)}.png`;
}
