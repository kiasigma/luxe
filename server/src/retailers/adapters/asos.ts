import { createDemoAdapter } from "../baseAdapter.js";

/**
 * ASOS adapter.
 *
 * Production note: replace the body of `fetchOffers` (via createDemoAdapter or a
 * custom implementation) with a call to the ASOS affiliate product feed
 * (e.g. through Awin/Skimlinks). The mapping target is `RawOffer`.
 */
export const asosAdapter = createDemoAdapter(
  {
    id: "asos",
    name: "ASOS",
    logo: "AS",
    accent: "#1a1a1a",
    homepage: "https://www.asos.com",
  },
  { priceFactor: 0.92, saleChance: 0.45, coverage: 0.78, freeDeliveryChance: 0.6 },
);
