import { Router } from "express";
import { getProductById } from "../data/catalog.js";

export const alertsRouter = Router();

/**
 * POST /api/alerts/check
 * Body: { items: [{ productId, threshold }] }
 *
 * Alerts themselves live in the client (localStorage) so the demo needs no
 * auth/DB, but evaluation is a server concern: this endpoint reports the live
 * lowest price for each watched product and whether the threshold is met. In
 * production a worker would run this on a schedule and dispatch notifications.
 */
alertsRouter.post("/check", async (req, res, next) => {
  try {
    const items: { productId: string; threshold: number }[] = Array.isArray(req.body?.items)
      ? req.body.items
      : [];
    const results = await Promise.all(
      items.map(async ({ productId, threshold }) => {
        const product = await getProductById(productId);
        if (!product) return { productId, found: false, triggered: false };
        return {
          productId,
          found: true,
          currentPrice: product.lowestPrice,
          threshold,
          triggered: product.lowestPrice <= threshold,
          retailer: product.offers[0]?.retailerName,
        };
      }),
    );
    res.json({ results });
  } catch (err) {
    next(err);
  }
});
