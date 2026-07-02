import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { Product, Review } from "../types";
import { api } from "../lib/api";
import { SmartImage } from "./SmartImage";
import { WishlistButton } from "./WishlistButton";
import { RetailerLogo } from "./RetailerLogo";
import { StarRating } from "./StarRating";
import { TruckIcon, ChevronDown, ChevronRight } from "./icons";
import { formatPrice, formatReviews } from "../lib/format";
import { isExpectedToDrop } from "../lib/badges";
import { brandLogoPath } from "../lib/brand";

interface ProductCardProps {
  product: Product;
  index?: number;
  /** When true, shows the "Biggest Price Drop" badge (set by the parent list). */
  isBiggestDrop?: boolean;
}

/**
 * The premium product card — image fade-in, hover lift, discount badge,
 * retailer + delivery, rating, and a "View item" CTA that opens the product
 * page (where the shopper copies the code and heads to the store).
 */
export function ProductCard({ product, index = 0, isBiggestDrop = false }: ProductCardProps) {
  const best = product.offers[0];
  const original = best?.originalPrice;
  const freeDelivery = product.offers.some((o) => o.freeDelivery);
  const expectedToDrop = isExpectedToDrop(product);

  // Reviews stay collapsed (no clutter) until the shopper opens them; fetched once.
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const toggleReviews = () => {
    const next = !reviewsOpen;
    setReviewsOpen(next);
    if (next && reviews === null && !loadingReviews) {
      setLoadingReviews(true);
      api
        .product(product.id)
        .then((r) => setReviews(r.reviews))
        .catch(() => setReviews([]))
        .finally(() => setLoadingReviews(false));
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: Math.min(index * 0.04, 0.3) }}
      className="group card card-hover flex flex-col overflow-hidden"
    >
      <Link to={`/product/${product.id}`} className="relative block aspect-[4/5] overflow-hidden">
        <SmartImage
          src={brandLogoPath(product.brand)}
          fallbackSrc={product.images[0]}
          alt={`${product.brand} logo`}
          contain
          className="transition-transform duration-700 ease-silk group-hover:scale-[1.03]"
        />
        <WishlistButton productId={product.id} />

        {/* Badges */}
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
          {isBiggestDrop && (
            <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
              ↓ Biggest Price Drop
            </span>
          )}
          {product.bestDiscount > 0 && (
            <span className="rounded-full bg-blush-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
              −{product.bestDiscount}%
            </span>
          )}
          {product.isNew && (
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-ink shadow-sm backdrop-blur">
              New in
            </span>
          )}
          {product.sponsored && (
            <span className="rounded-full bg-lilac-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-lilac-500">
              Sponsored
            </span>
          )}
        </div>

        {/* Retailer count chip slides up on hover */}
        <div className="pointer-events-none absolute inset-x-3 bottom-3 z-10 translate-y-3 opacity-0 transition-all duration-300 ease-silk group-hover:translate-y-0 group-hover:opacity-100">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-ink shadow-soft backdrop-blur">
            Compare {product.offers.length} retailer{product.offers.length > 1 ? "s" : ""}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2.5 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
            {product.brand}
          </span>
          <StarRating rating={product.rating} showCount={false} />
        </div>

        <Link to={`/product/${product.id}`}>
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-ink transition-colors group-hover:text-blush-500">
            {product.name}
          </h3>
        </Link>

        {/* Lowest price + retailer */}
        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[10px] font-medium uppercase tracking-wide text-ink-muted">from</span>
              <span className="text-lg font-bold text-ink">{formatPrice(product.lowestPrice)}</span>
              {original && (
                <span className="text-xs text-ink-muted line-through">{formatPrice(original)}</span>
              )}
              <span className="rounded-full bg-sage-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-sage-400">
                Best Deal
              </span>
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-ink-muted">
              <span>at {best?.retailerName}</span>
              {freeDelivery && (
                <span className="inline-flex items-center gap-0.5 text-sage-400">
                  <TruckIcon className="h-3 w-3" /> Free
                </span>
              )}
            </div>
            {expectedToDrop && (
              <div className="mt-1 text-[10px] font-medium text-lilac-500">Expected to drop soon</div>
            )}
          </div>
          <RetailerLogo logo={best?.retailerLogo ?? "?"} name={best?.retailerName} size="sm" />
        </div>

        {/* Tapping the card (image or title) opens the product page, where the
            shopper copies the code and heads to the store. */}
        <Link
          to={`/product/${product.id}`}
          className="btn-primary mt-1 w-full !py-2.5 text-[13px]"
        >
          View item <ChevronRight className="h-3.5 w-3.5" />
        </Link>

        {/* Reviews — collapsed by default so the grid stays clean */}
        <button
          onClick={toggleReviews}
          aria-expanded={reviewsOpen}
          className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-full py-1.5 text-xs font-medium text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
        >
          {reviewsOpen ? "Hide reviews" : `Read reviews (${formatReviews(product.reviews)})`}
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${reviewsOpen ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence initial={false}>
          {reviewsOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="space-y-2 pt-1">
                {loadingReviews && (
                  <>
                    <div className="skeleton h-12 rounded-2xl" />
                    <div className="skeleton h-12 rounded-2xl" />
                  </>
                )}
                {reviews?.slice(0, 2).map((r) => (
                  <div key={r.id} className="rounded-2xl bg-canvas p-3">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-ink">{r.author}</span>
                      <StarRating rating={r.rating} showCount={false} />
                    </div>
                    <p className="line-clamp-2 text-xs leading-relaxed text-ink-soft">{r.body}</p>
                  </div>
                ))}
                {reviews && reviews.length > 0 && (
                  <Link
                    to={`/product/${product.id}`}
                    className="block py-1 text-center text-xs font-semibold text-blush-500 hover:underline"
                  >
                    See all {formatReviews(product.reviews)} reviews
                  </Link>
                )}
                {reviews && reviews.length === 0 && !loadingReviews && (
                  <p className="py-2 text-center text-xs text-ink-muted">No reviews yet.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}
