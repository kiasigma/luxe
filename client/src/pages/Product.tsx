import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../lib/api";
import type { Product as ProductType, Review, RatingBreakdown } from "../types";
import { SmartImage } from "../components/SmartImage";
import { RetailerLogo } from "../components/RetailerLogo";
import { StarRating } from "../components/StarRating";
import { WishlistButton } from "../components/WishlistButton";
import { PriceAlertModal } from "../components/PriceAlertModal";
import { CollectionModal } from "../components/CollectionModal";
import { ProductRail } from "../components/ProductRail";
import { AdSlot } from "../components/AdSlot";
import { Reviews } from "../components/Reviews";
import { CopyButton, copyToClipboard } from "../components/CopyButton";
import { useSearchHistory } from "../context/SearchHistoryContext";
import { useAlerts } from "../context/AlertsContext";
import { useSeo, useJsonLd } from "../lib/seo";
import { formatPrice, discountPercent, sinceShort } from "../lib/format";
import { brandLogoPath } from "../lib/brand";
import {
  BellIcon, ExternalIcon, TruckIcon, CheckIcon, ChevronRight, TagIcon, HeartIcon,
} from "../components/icons";

const COLOUR_HEX: Record<string, string> = {
  Black: "#1c1a1d", White: "#f4f1ef", Beige: "#e6d8c3", "Blush Pink": "#f1adc1",
  "Sage Green": "#9cc1a8", "Powder Blue": "#aecbe0", Lilac: "#c2abe3", Cream: "#f3ece0",
  Camel: "#c19a6b", Burgundy: "#7b2236", Navy: "#27344f", Lavender: "#cdb4e3",
  Terracotta: "#c66b4e", Gold: "#d4af6a", Silver: "#c9cdd2",
  Olive: "#7d7d4a", Charcoal: "#3a3a3f", "Rose Gold": "#b76e79", Emerald: "#2e8b57", Chocolate: "#5b3a29",
};

export function Product() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<{
    product: ProductType;
    related: ProductType[];
    reviews: Review[];
    ratingBreakdown: RatingBreakdown;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [activeColour, setActiveColour] = useState(0);
  const [activeSize, setActiveSize] = useState<string | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const { addRecentlyViewed } = useSearchHistory();
  const { hasAlert } = useAlerts();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setActiveImage(0);
    window.scrollTo({ top: 0 });
    api
      .product(id)
      .then((res) => {
        setData(res);
        // Title/meta are handled by useSeo below (keeps SEO in one place).
        addRecentlyViewed({
          id: res.product.id,
          name: res.product.name,
          image: res.product.images[0],
          price: res.product.lowestPrice,
        });
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // SEO + structured data (must run before any early return).
  const p = data?.product;
  useSeo({
    title: p ? `${p.name} — compare ${p.offers.length} prices · Dealista` : "Dealista",
    description: p
      ? `Compare ${p.offers.length} retailer prices for the ${p.name}. Best price from ${formatPrice(
          p.lowestPrice,
        )}${p.bestDiscount > 0 ? `, save up to ${p.bestDiscount}%` : ""}. Updated regularly.`
      : undefined,
  });
  useJsonLd(
    p
      ? {
          "@context": "https://schema.org/",
          "@type": "Product",
          name: p.name,
          brand: { "@type": "Brand", name: p.brand },
          category: p.category,
          description: p.description,
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: p.rating,
            reviewCount: p.reviews,
          },
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: p.offers[0]?.currency ?? "GBP",
            lowPrice: p.lowestPrice,
            highPrice: Math.max(...p.offers.map((o) => o.price)),
            offerCount: p.offers.length,
            offers: p.offers.map((o) => ({
              "@type": "Offer",
              price: o.price,
              priceCurrency: o.currency,
              availability: o.inStock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
              seller: { "@type": "Organization", name: o.retailerName },
              url: o.url,
            })),
          },
        }
      : null,
  );

  if (loading) return <ProductSkeleton />;
  if (!data) return <NotFoundInline />;

  const { product, related, reviews, ratingBreakdown } = data;
  const best = product.offers[0];

  return (
    <div className="container-luxe py-6">
      {/* Breadcrumb */}
      <nav className="mb-5 flex items-center gap-1.5 text-xs text-ink-muted">
        <Link to="/" className="hover:text-ink">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to={`/search?category=${product.category}`} className="hover:text-ink">{product.category}</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate text-ink-soft">{product.subcategory}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-12">
        {/* ---------- Gallery ---------- */}
        <div className="flex flex-col gap-4 sm:flex-row-reverse">
          <motion.div
            key={activeImage}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            className="relative aspect-[4/5] flex-1 overflow-hidden rounded-4xl bg-white shadow-soft"
          >
            <SmartImage
              src={brandLogoPath(product.brand)}
              fallbackSrc={product.images[activeImage]}
              alt={`${product.brand} logo`}
              contain
            />
            <WishlistButton productId={product.id} />
            {product.bestDiscount > 0 && (
              <span className="absolute left-4 top-4 rounded-full bg-blush-500 px-3 py-1 text-xs font-bold text-white shadow-sm">
                −{product.bestDiscount}% off
              </span>
            )}
          </motion.div>

          {/* Thumbnails — only shown when a feed provides multiple real images */}
          {product.images.length > 1 && (
            <div className="flex gap-3 sm:flex-col">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-2xl transition-all sm:w-20 ${
                    activeImage === i ? "ring-2 ring-blush-400 ring-offset-2" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <SmartImage src={img} alt={`${product.name} view ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ---------- Buy box ---------- */}
        <div className="lg:py-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{product.brand}</p>
          <h1 className="heading-display mt-1.5 text-2xl sm:text-3xl">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3">
            <StarRating rating={product.rating} reviews={product.reviews} size="md" />
            {product.isNew && (
              <span className="rounded-full bg-sage-100 px-2.5 py-1 text-[11px] font-semibold text-sage-400">New in</span>
            )}
          </div>

          {/* Best price */}
          <div className="mt-6 flex items-end gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">Best price</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-ink">{formatPrice(product.lowestPrice)}</span>
                {best?.originalPrice && (
                  <span className="text-lg text-ink-muted line-through">{formatPrice(best.originalPrice)}</span>
                )}
              </div>
            </div>
            <span className="mb-1 text-sm text-ink-muted">at {best?.retailerName}</span>
          </div>

          {/* Colours */}
          {product.colours.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-semibold text-ink">
                Colour: <span className="font-normal text-ink-soft">{product.colours[activeColour]}</span>
              </p>
              <div className="flex flex-wrap gap-2.5">
                {product.colours.map((c, i) => (
                  <button
                    key={c}
                    onClick={() => setActiveColour(i)}
                    title={c}
                    className={`grid h-9 w-9 place-items-center rounded-full ring-1 ring-ink/10 transition-all hover:scale-110 ${
                      activeColour === i ? "ring-2 ring-blush-400 ring-offset-2" : ""
                    }`}
                    style={{ backgroundColor: COLOUR_HEX[c] ?? "#ddd" }}
                  >
                    {activeColour === i && (
                      <CheckIcon className="h-4 w-4" style={{ color: ["White", "Cream", "Gold", "Beige"].includes(c) ? "#1c1a1d" : "#fff" }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-semibold text-ink">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setActiveSize(s === activeSize ? null : s)}
                    className={`min-w-[48px] rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${
                      activeSize === s ? "border-ink bg-ink text-white" : "border-ink/15 text-ink-soft hover:border-ink/40"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ---- Get this item: the clear copy-code flow ---- */}
          <div className="mt-7 rounded-4xl border-2 border-blush-200 bg-blush-50/60 p-5 shadow-soft">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="font-display text-lg text-ink">Get this item</h2>
              <Link to="/how-it-works" className="text-xs font-semibold text-blush-500 hover:underline">
                How it works
              </Link>
            </div>

            {/* Step 1 — copy the code */}
            <div className="flex items-start gap-3">
              <StepNum n={1} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">Copy the code</p>
                <p className="mb-2 text-xs text-ink-muted">
                  This is the item's exact name — you'll paste it into the store's search.
                </p>
                <div className="flex items-stretch gap-2">
                  <span className="flex min-w-0 flex-1 items-center truncate rounded-2xl border-2 border-dashed border-blush-300 bg-white px-4 font-mono text-sm font-semibold text-ink">
                    {product.name}
                  </span>
                  <CopyButton
                    text={product.name}
                    label="Copy code"
                    copiedLabel="Copied!"
                    className="btn-primary shrink-0 !rounded-2xl !bg-blush-500 !px-5 !py-3 text-sm hover:!bg-blush-500"
                  />
                </div>
              </div>
            </div>

            {/* Step 2 — go to the store */}
            <div className="mt-4 flex items-start gap-3">
              <StepNum n={2} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">Go to the website</p>
                <p className="mb-2 text-xs text-ink-muted">
                  Opens {best?.retailerName} — the best price at {formatPrice(product.lowestPrice)}.
                </p>
                <a
                  href={best?.url}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  onClick={() => copyToClipboard(product.name)}
                  className="btn-primary w-full !py-3.5 text-base"
                >
                  Go to {best?.retailerName} <ExternalIcon className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Step 3 — paste & enjoy */}
            <div className="mt-4 flex items-start gap-3">
              <StepNum n={3} />
              <div>
                <p className="text-sm font-semibold text-ink">Paste &amp; enjoy</p>
                <p className="text-xs text-ink-muted">
                  Paste the code into their search, open your item and check out.
                </p>
              </div>
            </div>
          </div>

          {/* Save / price alert */}
          <div className="mt-4 flex gap-3">
            <button onClick={() => setCollectionOpen(true)} className="btn-secondary flex-1">
              <HeartIcon className="h-4 w-4" /> Save
            </button>
            <button onClick={() => setAlertOpen(true)} className="btn-secondary flex-1">
              <BellIcon className="h-4 w-4" /> {hasAlert(product.id) ? "Alert set" : "Price alert"}
            </button>
          </div>

          {/* Trust line */}
          <div className="mt-5 flex items-center gap-2 rounded-2xl bg-sage-50 px-4 py-3 text-sm text-sage-400">
            <TagIcon className="h-4 w-4" />
            <span className="font-medium text-ink-soft">
              Compared across {product.offers.length} retailers — you're seeing the lowest price.
            </span>
          </div>
        </div>
      </div>

      {/* ---------- Price comparison ---------- */}
      <section className="mt-14">
        <h2 className="heading-display mb-1 text-2xl">Price comparison</h2>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="max-w-md text-sm text-ink-muted">
            Ranked by total price. Visiting a retailer copies the product name for you —
            just paste it into their search to find the exact item.
          </p>
          <CopyButton text={product.name} label="Copy product name" className="btn-secondary !py-2 text-sm" />
        </div>

        <div className="overflow-hidden rounded-4xl border border-ink/5 bg-white shadow-soft">
          {product.offers.map((offer, i) => {
            const disc = discountPercent(offer.price, offer.originalPrice);
            return (
              <div
                key={offer.retailerId}
                className={`flex flex-wrap items-center gap-4 px-5 py-4 transition-colors hover:bg-canvas sm:px-6 ${
                  i > 0 ? "border-t border-ink/5" : ""
                }`}
              >
                <RetailerLogo logo={offer.retailerLogo} name={offer.retailerName} size="lg" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-ink">{offer.retailerName}</span>
                    {i === 0 && (
                      <span className="rounded-full bg-sage-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sage-400">
                        Best price
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex items-center gap-3 text-xs text-ink-muted">
                    <span className="inline-flex items-center gap-1">
                      <TruckIcon className="h-3.5 w-3.5" /> {offer.shipping}
                    </span>
                    {offer.rating && <StarRating rating={offer.rating} reviews={offer.reviews} showCount={false} />}
                    <span className={offer.inStock ? "text-sage-400" : "text-blush-500"}>
                      {offer.inStock ? "In stock" : "Out of stock"}
                    </span>
                    <span className="hidden sm:inline">· checked {sinceShort(offer.lastChecked)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-2">
                    {disc > 0 && <span className="text-xs font-semibold text-blush-500">−{disc}%</span>}
                    <span className="text-xl font-bold text-ink">{formatPrice(offer.price)}</span>
                  </div>
                  {offer.originalPrice && (
                    <span className="text-xs text-ink-muted line-through">{formatPrice(offer.originalPrice)}</span>
                  )}
                </div>
                <a
                  href={offer.url}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  onClick={() => copyToClipboard(product.name)}
                  className="btn-primary !py-2.5 text-sm"
                >
                  Visit Website <ExternalIcon className="h-3.5 w-3.5" />
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------- Details ---------- */}
      <section className="mt-14 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="heading-display mb-3 text-2xl">Description</h2>
          <p className="leading-relaxed text-ink-soft">{product.description}</p>

          <h3 className="mt-6 mb-2 text-sm font-semibold uppercase tracking-wide text-ink-muted">Materials</h3>
          <div className="flex flex-wrap gap-2">
            {product.materials.map((m) => (
              <span key={m} className="rounded-full bg-sand-50 px-3 py-1.5 text-sm text-ink-soft">{m}</span>
            ))}
          </div>
        </div>

        <div>
          <h2 className="heading-display mb-3 text-2xl">Product details</h2>
          <dl className="divide-y divide-ink/5 overflow-hidden rounded-3xl border border-ink/5 bg-white">
            <Detail label="Brand" value={product.brand} />
            <Detail label="Category" value={`${product.category} · ${product.subcategory}`} />
            <Detail label="Colours" value={product.colours.join(", ")} />
            {product.sizes.length > 0 && <Detail label="Sizes" value={product.sizes.join(", ")} />}
            <Detail label="Available at" value={`${product.offers.length} retailers`} />
            <Detail label="Rating" value={`${product.rating.toFixed(1)} / 5 (${product.reviews.toLocaleString()} reviews)`} />
          </dl>
        </div>
      </section>

      {/* ---------- Reviews ---------- */}
      <Reviews
        rating={product.rating}
        totalReviews={product.reviews}
        reviews={reviews}
        breakdown={ratingBreakdown}
      />

      <div className="my-12"><AdSlot variant="leaderboard" className="flex" /></div>

      {/* ---------- Related ---------- */}
      {related.length > 0 && (
        <ProductRail eyebrow="You might also like" title="More to compare" products={related} />
      )}

      <PriceAlertModal open={alertOpen} onClose={() => setAlertOpen(false)} product={product} />
      <CollectionModal open={collectionOpen} onClose={() => setCollectionOpen(false)} productId={product.id} />
    </div>
  );
}

/** Numbered pink step badge used in the "Get this item" panel. */
function StepNum({ n }: { n: number }) {
  return (
    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blush-500 text-sm font-bold text-white shadow-sm">
      {n}
    </span>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-3.5">
      <dt className="text-sm text-ink-muted">{label}</dt>
      <dd className="text-right text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="container-luxe py-6">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-12">
        <div className="skeleton aspect-[4/5] rounded-4xl" />
        <div className="space-y-4">
          <div className="skeleton h-4 w-24 rounded-full" />
          <div className="skeleton h-9 w-3/4 rounded-full" />
          <div className="skeleton h-5 w-40 rounded-full" />
          <div className="skeleton mt-6 h-12 w-48 rounded-full" />
          <div className="skeleton h-12 w-full rounded-full" />
          <div className="skeleton h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}

function NotFoundInline() {
  return (
    <div className="container-luxe flex flex-col items-center py-28 text-center">
      <span className="mb-4 text-5xl">🛍️</span>
      <h1 className="font-display text-3xl text-ink">Product not found</h1>
      <p className="mt-2 text-ink-muted">It may have sold out or moved.</p>
      <Link to="/" className="btn-primary mt-6">Back to home</Link>
    </div>
  );
}
