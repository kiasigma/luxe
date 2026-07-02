/**
 * Generates a premium, deterministic brand-logo tile as an inline SVG data URI.
 *
 * Product imagery is rendered as the logo of the brand that makes the item
 * (rather than a photo), which keeps the grid clean, consistent and on-brand,
 * and avoids any reliance on external image hosts. When you connect a real
 * retailer/affiliate feed, swap these for the feed's official product images by
 * populating `CatalogItem.images` from the feed instead.
 */

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Stable hue (0–359) derived from the brand name. */
function brandHue(brand: string): number {
  let h = 0;
  for (let i = 0; i < brand.length; i++) h = (h * 31 + brand.charCodeAt(i)) % 360;
  return h;
}

/**
 * Returns a `data:image/svg+xml,...` URI showing the brand's monogram + wordmark
 * on a soft, pastel, brand-specific gradient. 4:5 aspect to match the grid.
 */
export function brandLogoDataUri(brand: string, category: string): string {
  const hue = brandHue(brand);
  const c1 = `hsl(${hue} 56% 88%)`;
  const c2 = `hsl(${(hue + 38) % 360} 52% 80%)`;
  const ink = `hsl(${hue} 32% 26%)`;
  // A letter is friendlier as a monogram than a symbol; fall back to "L" if the
  // brand starts with a non-letter (e.g. "& Other Stories"). Always XML-escaped.
  const firstChar = brand.trim().charAt(0).toUpperCase();
  const initial = escapeXml(/[A-Z0-9]/.test(firstChar) ? firstChar : "L");
  const display = brand.toUpperCase();
  const name = escapeXml(display);

  // Size the wordmark to its length so short names (e.g. "ZARA") render at a
  // natural width instead of being stretched. Only constrain the width — by
  // shrinking, never stretching — when a long name would otherwise overflow.
  const len = display.length;
  const fontSize = len <= 5 ? 58 : len <= 9 ? 48 : len <= 13 ? 38 : len <= 17 ? 30 : 25;
  const letterSpacing = len <= 5 ? 5 : len <= 9 ? 3 : 2;
  const maxWidth = 500;
  const estWidth = len * fontSize * 0.6 + letterSpacing * Math.max(0, len - 1);
  const fitAttr = estWidth > maxWidth ? ` textLength='${maxWidth}' lengthAdjust='spacingAndGlyphs'` : "";

  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 800'>` +
    `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>` +
    `<stop offset='0' stop-color='${c1}'/><stop offset='1' stop-color='${c2}'/>` +
    `</linearGradient></defs>` +
    `<rect width='640' height='800' fill='url(#g)'/>` +
    `<circle cx='320' cy='298' r='78' fill='rgba(255,255,255,0.4)'/>` +
    `<text x='320' y='300' font-family='Georgia, serif' font-size='84' font-style='italic' ` +
    `fill='${ink}' text-anchor='middle' dominant-baseline='central'>${initial}</text>` +
    `<text x='320' y='474' font-family='Georgia, serif' font-size='${fontSize}' fill='${ink}' ` +
    `text-anchor='middle' letter-spacing='${letterSpacing}'${fitAttr}>${name}</text>` +
    `<text x='320' y='524' font-family='Arial, Helvetica, sans-serif' font-size='19' fill='${ink}' ` +
    `fill-opacity='0.65' text-anchor='middle' letter-spacing='7'>${escapeXml(category.toUpperCase())}</text>` +
    `</svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
