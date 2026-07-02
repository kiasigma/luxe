/**
 * Monetisation surfaces. Clearly-labelled, on-brand ad placements that respect
 * the shopping experience. Wire up Google AdSense by setting VITE_ADSENSE_CLIENT
 * (and per-slot data-ad-slot ids) — the layout/spacing stays identical.
 *
 * Placement strategy (revenue without hurting UX):
 *   • leaderboard — between homepage content sections
 *   • rectangle / halfpage — sticky in the search sidebar (high viewability)
 *   • native — blends into the product grid every ~12 cards
 *   • in-content — a single unit on the product page, below the comparison
 *   • anchor — dismissible sticky footer (see StickyAd)
 */
type AdVariant = "leaderboard" | "rectangle" | "halfpage" | "native" | "inline";

interface AdSlotProps {
  variant?: AdVariant;
  label?: string;
  className?: string;
}

const MIN_HEIGHT: Record<AdVariant, string> = {
  leaderboard: "min-h-[120px]",
  rectangle: "min-h-[250px]",
  halfpage: "min-h-[420px]",
  native: "min-h-[160px]",
  inline: "min-h-[96px]",
};

export function AdSlot({ variant = "inline", label = "Advertisement", className = "" }: AdSlotProps) {
  const client = import.meta.env.VITE_ADSENSE_CLIENT;

  return (
    <aside
      className={`overflow-hidden rounded-3xl border border-dashed border-ink/10 bg-white/60 ${className}`}
      aria-label={label}
    >
      <div className={`flex ${MIN_HEIGHT[variant]} flex-col items-center justify-center gap-1 px-6 py-5 text-center`}>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-muted/70">{label}</span>
        {client ? (
          <ins
            className="adsbygoogle block w-full"
            data-ad-client={client}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        ) : (
          <p className="text-sm text-ink-muted">
            Sponsored placements appear here — never between you and a great deal.
          </p>
        )}
      </div>
    </aside>
  );
}
