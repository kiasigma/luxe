# Data Sources — making links & prices real

The demo ships with **synthetic, deterministic data** so the whole app runs
offline. The product links and prices you see are *generated* — they do **not**
resolve to real product pages and do **not** match live retailer prices.

To make links go to the **exact product** and prices match the **retailer's live
price**, connect an official data source. This is a configuration/integration
step — the architecture is already built for it.

## How real data flows in

```
Official feed/API  →  RetailerAdapter.fetchOffers()  →  RawOffer { url, price, … }
                                                              │
                                          aggregator merges offers per product
                                                              │
                                  search · comparison · filters · facets · SEO
```

The two fields that make everything real:

| Field            | Make it real by…                                              |
| ---------------- | ------------------------------------------------------------- |
| `RawOffer.url`   | Use the feed's **canonical/deep-link product URL** (exact item), wrapped with your affiliate tracking. |
| `RawOffer.price` | Use the feed's **current price** (and `salePrice`/`originalPrice`). |

See the fully-commented template: [`server/src/retailers/adapters/_feedTemplate.ts`](server/src/retailers/adapters/_feedTemplate.ts).

## Where to get official, ToS-compliant feeds (no scraping)

You do **not** scrape retailer sites or use unofficial APIs. Use one of:

1. **Affiliate networks** — sign up (free), get approved for a retailer's
   programme, then download their **product datafeed** (CSV/XML/JSON) and use
   deep links:
   - **Awin** (ASOS, Boots, many EU/UK retailers)
   - **Skimlinks / Sovrn Commerce** (broad coverage, single integration)
   - **Rakuten Advertising**
   - **CJ Affiliate (Commission Junction)**
   - **Impact**
2. **Retailer / marketplace product APIs** (need an API key):
   - **eBay** Browse API, **Best Buy** API, **Walmart** API
   - Some brands expose their own catalog API
3. **Shopping data aggregators** with licensed feeds (e.g. via the networks above).

> Most large fashion/beauty retailers (Zara, Net-a-Porter, Sephora, etc.) do not
> offer a keyless public price API. The compliant route is their **affiliate
> programme's product feed**. Always follow each programme's terms.

## Steps to go live for one retailer

1. Join the retailer's affiliate programme (via Awin/Skimlinks/etc.) and get
   approved.
2. Grab your **affiliate/publisher id** and the **product feed URL**.
3. Copy `_feedTemplate.ts` → e.g. `asos.ts`, fill in `info`, `FEED_URL`, the
   field mapping, and `toAffiliateLink()` (use the network's deep-link format).
4. Register it in [`server/src/retailers/registry.ts`](server/src/retailers/registry.ts).
5. (Recommended) Run feed ingestion on a schedule (cron/worker), cache results,
   and stamp each offer's `lastChecked` with the real fetch time — the UI already
   shows "checked N min ago".

That's the entire integration surface. Add as many retailers as you have feeds
for; comparison, filtering, facets and SEO all work automatically.

## Product matching (so the same item lines up across retailers)

To compare the *same* product across retailers, match feed rows on a stable
identifier in this order of preference:

1. **GTIN / EAN / UPC** (best — globally unique)
2. **MPN** (manufacturer part number) + brand
3. Brand + normalised title (fallback)

The template shows a simple brand+title match; swap in GTIN/MPN when your feeds
provide it for reliable, exact grouping.

## Images

Product imagery currently renders the **brand's logo tile** (generated in
[`server/src/data/brandLogo.ts`](server/src/data/brandLogo.ts)) — clean,
consistent, and dependency-free. When a feed provides official product images,
populate `CatalogItem.images` from the feed's image URLs instead and the gallery
will use them (and re-enable multi-image thumbnails automatically).

## Price accuracy & trust

- Show the freshness you actually have — the UI already surfaces "checked N min
  ago" per offer (`Offer.lastChecked`).
- Re-fetch feeds frequently (most networks update 1–4×/day; some hourly).
- Never display a price you can't currently source; hide stale offers instead.
