import { createDemoAdapter } from "../baseAdapter.js";

/** Mango adapter. */
export const mangoAdapter = createDemoAdapter(
  {
    id: "mango",
    name: "Mango",
    logo: "MN",
    accent: "#6b4f3a",
    homepage: "https://shop.mango.com",
  },
  {
    priceFactor: 0.95, saleChance: 0.38, coverage: 0.55, freeDeliveryChance: 0.45,
    categories: ["Clothing", "Shoes", "Handbags", "Jewellery", "Accessories"],
  },
);
