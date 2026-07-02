import { createDemoAdapter } from "../baseAdapter.js";

/** Sephora adapter — beauty focus (makeup, skincare, perfume). */
export const sephoraAdapter = createDemoAdapter(
  {
    id: "sephora",
    name: "Sephora",
    logo: "SP",
    accent: "#d1213d",
    homepage: "https://www.sephora.com",
  },
  {
    priceFactor: 1.0, saleChance: 0.28, coverage: 0.82, freeDeliveryChance: 0.55,
    categories: ["Makeup", "Skincare", "Perfume"],
  },
);
