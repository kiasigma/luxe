import { useState } from "react";
import type { RatingBreakdown, Review } from "../types";
import { StarRating } from "./StarRating";
import { StarIcon, CheckIcon } from "./icons";
import { formatReviews, timeAgo } from "../lib/format";

interface ReviewsProps {
  rating: number;
  totalReviews: number;
  reviews: Review[];
  breakdown: RatingBreakdown;
}

/** Customer reviews: summary, star distribution and a list of written reviews. */
export function Reviews({ rating, totalReviews, reviews, breakdown }: ReviewsProps) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? reviews : reviews.slice(0, 3);
  const maxCount = Math.max(1, ...breakdown);

  return (
    <section className="mt-14">
      <h2 className="heading-display mb-5 text-2xl">Reviews</h2>

      <div className="grid gap-8 rounded-4xl border border-ink/5 bg-white p-6 shadow-soft sm:grid-cols-[220px_1fr] sm:p-8">
        {/* Summary */}
        <div className="flex flex-col items-center justify-center gap-2 border-ink/5 sm:border-r sm:pr-8">
          <span className="font-display text-5xl text-ink">{rating.toFixed(1)}</span>
          <StarRating rating={rating} showCount={false} size="md" />
          <span className="text-sm text-ink-muted">{formatReviews(totalReviews)} reviews</span>
        </div>

        {/* Distribution */}
        <div className="flex flex-col justify-center gap-2">
          {breakdown.map((count, i) => {
            const stars = 5 - i;
            return (
              <div key={stars} className="flex items-center gap-3">
                <span className="flex w-10 shrink-0 items-center gap-1 text-xs font-medium text-ink-soft">
                  {stars} <StarIcon className="h-3 w-3 text-blush-400" filled />
                </span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink/5">
                  <div
                    className="h-full rounded-full bg-blush-400 transition-all duration-700 ease-silk"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-12 shrink-0 text-right text-xs text-ink-muted">{formatReviews(count)}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Individual reviews */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {visible.map((r) => (
          <article key={r.id} className="rounded-3xl border border-ink/5 bg-white p-5 shadow-soft">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-blush-100 to-lilac-100 text-xs font-bold text-ink">
                  {r.author.charAt(0)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{r.author}</p>
                  {r.verified && (
                    <span className="inline-flex items-center gap-1 text-[11px] text-sage-400">
                      <CheckIcon className="h-3 w-3" /> Verified purchase
                    </span>
                  )}
                </div>
              </div>
              <StarRating rating={r.rating} showCount={false} />
            </div>
            <h4 className="text-sm font-semibold text-ink">{r.title}</h4>
            <p className="mt-1 text-sm leading-relaxed text-ink-soft">{r.body}</p>
            <div className="mt-3 flex items-center gap-3 text-xs text-ink-muted">
              <span>{timeAgo(r.date)}</span>
              <span>·</span>
              <span>{r.helpful} found this helpful</span>
            </div>
          </article>
        ))}
      </div>

      {reviews.length > 3 && (
        <div className="mt-6 flex justify-center">
          <button onClick={() => setShowAll((s) => !s)} className="btn-secondary">
            {showAll ? "Show fewer reviews" : `Read all ${reviews.length} reviews`}
          </button>
        </div>
      )}
    </section>
  );
}
