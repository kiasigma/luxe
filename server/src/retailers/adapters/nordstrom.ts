import { createDemoAdapter } from "../baseAdapter.js";

/** Nordstrom adapter. */
export const nordstromAdapter = createDemoAdapter(
  {
    id: "nordstrom",
    name: "Nordstrom",
    logo: "ND",
    accent: "#1f3a5f",
    homepage: "https://www.nordstrom.com",
  },
  { priceFactor: 1.05, saleChance: 0.4, coverage: 0.6, freeDeliveryChance: 0.65 },
);
