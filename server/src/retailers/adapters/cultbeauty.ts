import { createDemoAdapter } from "../baseAdapter.js";

/** Cult Beauty adapter. */
export const cultBeautyAdapter = createDemoAdapter(
  {
    id: "cult-beauty",
    name: "Cult Beauty",
    logo: "CB",
    accent: "#b48ead",
    homepage: "https://www.cultbeauty.co.uk",
  },
  {
    priceFactor: 0.93, saleChance: 0.42, coverage: 0.72, freeDeliveryChance: 0.5,
    categories: ["Makeup", "Skincare", "Perfume"],
  },
);
