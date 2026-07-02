/**
 * Central runtime configuration. Everything is overridable via environment
 * variables so the same build runs in dev, staging and production.
 */
export const config = {
  port: Number(process.env.PORT ?? 4000),
  /** Comma-separated list of allowed origins, or "*" for any. */
  corsOrigin: process.env.CORS_ORIGIN ?? "*",
  /** Affiliate tag appended to outbound retailer links for tracking. */
  affiliateTag: process.env.AFFILIATE_TAG ?? "luxe",
  /** Default currency for the demo catalogue. */
  currency: process.env.CURRENCY ?? "GBP",
  currencySymbol: process.env.CURRENCY_SYMBOL ?? "£",
};

export type AppConfig = typeof config;
