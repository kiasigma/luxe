import type { RetailerAdapter, RetailerInfo } from "./types.js";
import { asosAdapter } from "./adapters/asos.js";
import { netAPorterAdapter } from "./adapters/netaporter.js";
import { nordstromAdapter } from "./adapters/nordstrom.js";
import { sephoraAdapter } from "./adapters/sephora.js";
import { cultBeautyAdapter } from "./adapters/cultbeauty.js";
import { lookFantasticAdapter } from "./adapters/lookfantastic.js";

/**
 * ⭐ Retailer registry — the multi-brand stockists that provide comparison
 * offers alongside each item's own brand store. (Single-brand retailers like
 * Zara/Mango are represented as brand stores, not here, so they never appear as
 * stockists of other brands.)
 *
 * Add a retailer by importing its adapter and appending it here. Search,
 * comparison, filtering and facets all pick it up automatically.
 */
export const retailerAdapters: RetailerAdapter[] = [
  asosAdapter,
  netAPorterAdapter,
  nordstromAdapter,
  sephoraAdapter,
  cultBeautyAdapter,
  lookFantasticAdapter,
];

export const retailerInfos: RetailerInfo[] = retailerAdapters.map((a) => a.info);

export function getRetailerInfo(id: string): RetailerInfo | undefined {
  return retailerInfos.find((r) => r.id === id);
}
