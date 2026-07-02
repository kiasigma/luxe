import { Router } from "express";
import { retailerInfos } from "../retailers/registry.js";
import { POPULAR_CATEGORIES } from "../services/suggestService.js";
import { config } from "../config.js";

export const metaRouter = Router();

/** GET /api/retailers — list of integrated retailers (one per adapter). */
metaRouter.get("/retailers", (_req, res) => {
  res.json({ retailers: retailerInfos });
});

/** GET /api/categories — the canonical category taxonomy. */
metaRouter.get("/categories", (_req, res) => {
  res.json({ categories: POPULAR_CATEGORIES });
});

/** GET /api/config — public runtime config the client needs (currency etc.). */
metaRouter.get("/config", (_req, res) => {
  res.json({ currency: config.currency, currencySymbol: config.currencySymbol });
});
