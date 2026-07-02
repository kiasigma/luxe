import express from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "./config.js";
import { searchRouter } from "./routes/search.js";
import { productsRouter } from "./routes/products.js";
import { discoveryRouter } from "./routes/discovery.js";
import { metaRouter } from "./routes/meta.js";
import { alertsRouter } from "./routes/alerts.js";
import { getCatalog } from "./data/catalog.js";

const app = express();

app.use(cors({ origin: config.corsOrigin === "*" ? true : config.corsOrigin.split(",") }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => res.json({ status: "ok", service: "luxe-api" }));

app.use("/api/search", searchRouter);
app.use("/api/products", productsRouter);
app.use("/api", discoveryRouter); // /api/suggest, /api/discovery
app.use("/api", metaRouter); // /api/retailers, /api/categories, /api/config
app.use("/api/alerts", alertsRouter);

// 404 for unknown API routes
app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));

// Central error handler
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(config.port, async () => {
  // Warm the catalogue cache so the first request is instant.
  const catalog = await getCatalog();
  console.log(`\n  ✦ Luxe API ready on http://localhost:${config.port}`);
  console.log(`  ✦ ${catalog.length} products across all retailers\n`);
});
