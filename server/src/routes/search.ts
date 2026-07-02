import { Router } from "express";
import { search, type SearchParams } from "../services/searchService.js";
import type { SortKey } from "../types.js";

export const searchRouter = Router();

/** Parse a query param that may be a comma-separated list. */
function list(value: unknown): string[] | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;
  return value.split(",").map((s) => s.trim()).filter(Boolean);
}

function num(value: unknown): number | undefined {
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function bool(value: unknown): boolean | undefined {
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  return undefined;
}

/**
 * GET /api/search
 * Full search with filtering, sorting, pagination and facets.
 */
searchRouter.get("/", async (req, res, next) => {
  try {
    const q = req.query;
    const params: SearchParams = {
      q: typeof q.q === "string" ? q.q : undefined,
      category: typeof q.category === "string" ? q.category : undefined,
      brand: list(q.brand),
      colour: list(q.colour),
      size: list(q.size),
      material: list(q.material),
      retailer: list(q.retailer),
      minPrice: num(q.minPrice),
      maxPrice: num(q.maxPrice),
      saleOnly: bool(q.saleOnly),
      freeDelivery: bool(q.freeDelivery),
      newOnly: bool(q.newOnly),
      minRating: num(q.minRating),
      sort: (typeof q.sort === "string" ? q.sort : "popular") as SortKey,
      page: num(q.page) ?? 1,
      pageSize: num(q.pageSize) ?? 24,
    };
    const result = await search(params);
    res.json(result);
  } catch (err) {
    next(err);
  }
});
