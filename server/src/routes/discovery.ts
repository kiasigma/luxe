import { Router } from "express";
import { getCatalog } from "../data/catalog.js";
import {
  POPULAR_BRANDS,
  POPULAR_CATEGORIES,
  TRENDING_SEARCHES,
  autocomplete,
} from "../services/suggestService.js";

export const discoveryRouter = Router();

/** GET /api/suggest?q=bla — autocomplete suggestions. */
discoveryRouter.get("/suggest", async (req, res, next) => {
  try {
    const q = typeof req.query.q === "string" ? req.query.q : "";
    res.json({ suggestions: await autocomplete(q) });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/discovery — everything the homepage needs in one call:
 * trending searches, popular categories/brands, price drops, editor's picks,
 * and new-in. Designed to make every section invite another click.
 */
discoveryRouter.get("/discovery", async (_req, res, next) => {
  try {
    const catalog = await getCatalog();

    const priceDropped = [...catalog]
      .filter((p) => p.bestDiscount > 0)
      .sort((a, b) => b.bestDiscount - a.bestDiscount)
      .slice(0, 12);

    const editorsPicks = [...catalog]
      .filter((p) => p.rating >= 4.5)
      .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
      .slice(0, 12);

    const newIn = [...catalog]
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .slice(0, 12);

    const trendingProducts = [...catalog]
      .sort((a, b) => b.reviews - a.reviews)
      .slice(0, 12);

    res.json({
      trendingSearches: TRENDING_SEARCHES,
      popularCategories: POPULAR_CATEGORIES,
      popularBrands: POPULAR_BRANDS,
      priceDropped,
      editorsPicks,
      newIn,
      trendingProducts,
    });
  } catch (err) {
    next(err);
  }
});
