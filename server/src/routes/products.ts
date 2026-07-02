import { Router } from "express";
import { getCatalog, getProductById, getRelated } from "../data/catalog.js";
import { generateReviews, ratingBreakdown } from "../data/reviews.js";

export const productsRouter = Router();

/** GET /api/products?ids=p001,p002 — batch fetch (used to hydrate wishlist). */
productsRouter.get("/", async (req, res, next) => {
  try {
    const idsParam = typeof req.query.ids === "string" ? req.query.ids : "";
    const ids = idsParam.split(",").map((s) => s.trim()).filter(Boolean);
    const catalog = await getCatalog();
    if (ids.length) {
      const map = new Map(catalog.map((p) => [p.id, p]));
      res.json({ products: ids.map((id) => map.get(id)).filter(Boolean) });
    } else {
      res.json({ products: catalog.slice(0, 24) });
    }
  } catch (err) {
    next(err);
  }
});

/** GET /api/products/:id — full product with offers + related items. */
productsRouter.get("/:id", async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }
    const related = await getRelated(product);
    const reviews = generateReviews(product);
    const breakdown = ratingBreakdown(product.rating, product.reviews);
    res.json({ product, related, reviews, ratingBreakdown: breakdown });
  } catch (err) {
    next(err);
  }
});
