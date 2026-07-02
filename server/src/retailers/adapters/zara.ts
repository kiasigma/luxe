import { createDemoAdapter } from "../baseAdapter.js";

/** Zara adapter — wire to an official feed in production. */
export const zaraAdapter = createDemoAdapter(
  {
    id: "zara",
    name: "Zara",
    logo: "ZA",
    accent: "#111111",
    homepage: "https://www.zara.com",
  },
  {
    priceFactor: 0.98, saleChance: 0.3, coverage: 0.62, freeDeliveryChance: 0.4,
    categories: ["Clothing", "Shoes", "Handbags", "Jewellery", "Accessories"],
  },
);
