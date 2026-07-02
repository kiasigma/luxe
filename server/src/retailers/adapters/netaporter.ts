import { createDemoAdapter } from "../baseAdapter.js";

/** Net-a-Porter adapter — premium positioning, fewer discounts. */
export const netAPorterAdapter = createDemoAdapter(
  {
    id: "net-a-porter",
    name: "Net-a-Porter",
    logo: "NP",
    accent: "#2f2f2f",
    homepage: "https://www.net-a-porter.com",
  },
  {
    priceFactor: 1.18, saleChance: 0.2, coverage: 0.5, freeDeliveryChance: 0.7,
    categories: ["Clothing", "Shoes", "Handbags", "Jewellery", "Accessories"],
  },
);
