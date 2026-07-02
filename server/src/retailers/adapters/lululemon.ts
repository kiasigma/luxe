import { createDemoAdapter } from "../baseAdapter.js";

/** Lululemon adapter — activewear & athleisure focus (clothing + shoes). */
export const lululemonAdapter = createDemoAdapter(
  {
    id: "lululemon",
    name: "Lululemon",
    logo: "LL",
    accent: "#c2362f",
    homepage: "https://www.lululemon.co.uk",
  },
  {
    priceFactor: 1.02, saleChance: 0.22, coverage: 0.55, freeDeliveryChance: 0.65,
    categories: ["Clothing", "Shoes"],
  },
);
