import { StarIcon } from "./icons";
import { formatReviews } from "../lib/format";

interface StarRatingProps {
  rating: number;
  reviews?: number;
  size?: "sm" | "md";
  showCount?: boolean;
}

export function StarRating({ rating, reviews, size = "sm", showCount = true }: StarRatingProps) {
  const dim = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5 text-blush-400">
        {[0, 1, 2, 3, 4].map((i) => (
          <StarIcon key={i} className={dim} filled={i < Math.round(rating)} />
        ))}
      </div>
      <span className="text-xs font-semibold text-ink-soft">{rating.toFixed(1)}</span>
      {showCount && reviews != null && (
        <span className="text-xs text-ink-muted">({formatReviews(reviews)})</span>
      )}
    </div>
  );
}
