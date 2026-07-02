import type { RetailerInfo } from "../retailers/types.js";

/**
 * Brand stores.
 *
 * Every product is sold by the brand that makes it, on the brand's own website.
 * That brand store is the primary, best-priced offer and its link points to the
 * brand's homepage (e.g. a Sweaty Betty item links to sweatybetty.com), so the
 * "Best Deal" retailer always matches the item's brand.
 */

/** Curated official homepages for the brands in the catalogue. */
const HOMEPAGES: Record<string, string> = {
  "Reformation": "https://www.thereformation.com",
  "& Other Stories": "https://www.stories.com",
  "Ganni": "https://www.ganni.com",
  "Mango": "https://shop.mango.com",
  "Zara": "https://www.zara.com",
  "Self-Portrait": "https://www.self-portrait.com",
  "Rixo": "https://www.rixo.co.uk",
  "Realisation Par": "https://www.realisationpar.com",
  "COS": "https://www.cos.com",
  "Arket": "https://www.arket.com",
  "Massimo Dutti": "https://www.massimodutti.com",
  "Uniqlo": "https://www.uniqlo.com",
  "Reiss": "https://www.reiss.com",
  "Whistles": "https://www.whistles.com",
  "Levi's": "https://www.levi.com",
  "AGOLDE": "https://www.agolde.com",
  "Frame": "https://www.frame-store.com",
  "Citizens of Humanity": "https://www.citizensofhumanity.com",
  "Lululemon": "https://www.lululemon.co.uk",
  "Gymshark": "https://www.gymshark.com",
  "Alo Yoga": "https://www.aloyoga.com",
  "Sweaty Betty": "https://www.sweatybetty.com",
  "Adidas": "https://www.adidas.co.uk",
  "Nike": "https://www.nike.com",
  "Varley": "https://www.varley.com",
  "Girlfriend Collective": "https://www.girlfriend.com",
  "Skims": "https://www.skims.com",
  "Lounge": "https://www.loungeunderwear.com",
  "Calvin Klein": "https://www.calvinklein.com",
  "Jimmy Choo": "https://www.jimmychoo.com",
  "Aeyde": "https://www.aeyde.com",
  "Stuart Weitzman": "https://www.stuartweitzman.com",
  "Sam Edelman": "https://www.samedelman.com",
  "Veja": "https://www.veja-store.com",
  "New Balance": "https://www.newbalance.co.uk",
  "Axel Arigato": "https://www.axelarigato.com",
  "Puma": "https://www.puma.com",
  "Asics": "https://www.asics.com",
  "Dr. Martens": "https://www.drmartens.com",
  "Vagabond": "https://www.vagabond.com",
  "Birkenstock": "https://www.birkenstock.com",
  "Ancient Greek Sandals": "https://www.ancient-greek-sandals.com",
  "Toteme": "https://www.toteme-studio.com",
  "Polène": "https://www.polene-paris.com",
  "Strathberry": "https://www.strathberry.com",
  "DeMellier": "https://www.demellierlondon.com",
  "Wandler": "https://www.wandler.com",
  "Coach": "https://www.coach.com",
  "JW PEI": "https://www.jwpei.com",
  "Marc Jacobs": "https://www.marcjacobs.com",
  "Longchamp": "https://www.longchamp.com",
  "Cult Gaia": "https://www.cultgaia.com",
  "Bottega Veneta": "https://www.bottegaveneta.com",
  "Missoma": "https://www.missoma.com",
  "Astrid & Miyu": "https://www.astridandmiyu.com",
  "Mejuri": "https://www.mejuri.com",
  "Monica Vinader": "https://www.monicavinader.com",
  "Pandora": "https://www.pandora.net",
  "Otiumberg": "https://www.otiumberg.com",
  "Charlotte Tilbury": "https://www.charlottetilbury.com",
  "Rare Beauty": "https://www.rarebeauty.com",
  "MAC": "https://www.maccosmetics.com",
  "Dior": "https://www.dior.com",
  "NARS": "https://www.narscosmetics.com",
  "Fenty Beauty": "https://www.fentybeauty.com",
  "Hourglass": "https://www.hourglasscosmetics.com",
  "Ilia": "https://www.iliabeauty.com",
  "Benefit": "https://www.benefitcosmetics.com",
  "Urban Decay": "https://www.urbandecay.com",
  "Stila": "https://www.stila.com",
  "The Ordinary": "https://theordinary.com",
  "Drunk Elephant": "https://www.drunkelephant.com",
  "Medik8": "https://www.medik8.com",
  "Paula's Choice": "https://www.paulaschoice.com",
  "Sunday Riley": "https://www.sundayriley.com",
  "The INKEY List": "https://www.theinkeylist.com",
  "CeraVe": "https://www.cerave.com",
  "La Roche-Posay": "https://www.laroche-posay.com",
  "Tatcha": "https://www.tatcha.com",
  "Augustinus Bader": "https://www.augustinusbader.com",
  "Byoma": "https://www.byoma.com",
  "Fresh": "https://www.fresh.com",
  "Glow Recipe": "https://www.glowrecipe.com",
  "Summer Fridays": "https://www.summerfridays.com",
  "Chloé": "https://www.chloe.com",
  "YSL": "https://www.yslbeauty.com",
  "Jo Malone": "https://www.jomalone.co.uk",
  "Mugler": "https://www.mugler.com",
  "Maison Margiela": "https://www.maisonmargiela-fragrances.com",
  "Lancôme": "https://www.lancome.com",
  "Prada": "https://www.prada.com",
  "Sol de Janeiro": "https://www.soldejaneiro.com",
  "The Body Shop": "https://www.thebodyshop.com",
  "Victoria's Secret": "https://www.victoriassecret.com",
  "Glossier": "https://www.glossier.com",
  "Le Specs": "https://www.lespecs.com",
  "Ray-Ban": "https://www.ray-ban.com",
  "Celine": "https://www.celine.com",
  "Quay": "https://www.quayaustralia.com",
  "Chimi": "https://www.chimieyewear.com",
  "Gucci": "https://www.gucci.com",
  "Aspinal of London": "https://www.aspinaloflondon.com",
  "Acne Studios": "https://www.acnestudios.com",
  "Lack of Color": "https://www.lackofcolor.com",
};

const slug = (brand: string) =>
  brand.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "");

/** Official homepage for a brand (curated, with a best-effort fallback). */
export function brandHomepage(brand: string): string {
  return HOMEPAGES[brand] ?? `https://www.${slug(brand)}.com`;
}

/** Root domain for a brand, e.g. "Sweaty Betty" → "sweatybetty.com". */
export function brandDomain(brand: string): string {
  try {
    return new URL(brandHomepage(brand)).hostname.replace(/^www\./, "");
  } catch {
    return `${slug(brand)}.com`;
  }
}

/**
 * The company's actual logo, served from Google's favicon service by domain
 * (e.g. Sephora's flame, Lululemon's omega). Crisp at 256px and shown centred
 * on a clean white card. Falls back to a generic mark if a brand has no logo.
 */
export function brandLogoUrl(brand: string): string {
  const domain = brandDomain(brand);
  return `https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=512`;
}

/** Two-letter monogram for the brand store logo. */
export function brandInitials(brand: string): string {
  const words = brand.replace(/[^A-Za-z0-9 ]/g, "").split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return brand.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase();
}

const ACCENTS = ["#1c1a1d", "#7b2236", "#27344f", "#3f5e4e", "#6b4f3a", "#5b3a64", "#b04a6a", "#2f5d62"];
function accentFor(brand: string): string {
  let h = 0;
  for (let i = 0; i < brand.length; i++) h = (h * 31 + brand.charCodeAt(i)) >>> 0;
  return ACCENTS[h % ACCENTS.length];
}

/** A RetailerInfo describing a brand's own store. */
export function brandStoreInfo(brand: string): RetailerInfo {
  return {
    id: `brand-${slug(brand)}`,
    name: brand,
    logo: brandInitials(brand),
    accent: accentFor(brand),
    homepage: brandHomepage(brand),
  };
}

/**
 * Vertically-integrated brands sell only through their own store (no third
 * party stocks them), so they get a single brand-store offer.
 */
export const VERTICAL_BRANDS = new Set([
  "Zara", "Mango", "COS", "Arket", "& Other Stories", "Massimo Dutti", "Uniqlo", "Skims",
]);
