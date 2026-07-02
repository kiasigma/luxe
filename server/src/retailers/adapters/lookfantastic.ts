import { createDemoAdapter } from "../baseAdapter.js";

/** LookFantastic adapter. */
export const lookFantasticAdapter = createDemoAdapter(
  {
    id: "lookfantastic",
    name: "LookFantastic",
    logo: "LF",
    accent: "#e75480",
    homepage: "https://www.lookfantastic.com",
  },
  {
    priceFactor: 0.9, saleChance: 0.48, coverage: 0.72, freeDeliveryChance: 0.6,
    categories: ["Makeup", "Skincare", "Perfume"],
  },
);
