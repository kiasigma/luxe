interface RetailerLogoProps {
  logo: string;
  accent?: string;
  name?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Renders a tasteful monogram for a retailer (no external brand assets needed).
 * The accent colour tints a soft background so each retailer stays recognisable.
 */
export function RetailerLogo({ logo, accent = "#1c1a1d", name, size = "md" }: RetailerLogoProps) {
  const dim =
    size === "sm" ? "h-8 w-8 text-[11px]" : size === "lg" ? "h-12 w-12 text-sm" : "h-10 w-10 text-xs";
  return (
    <span
      className={`flex ${dim} shrink-0 items-center justify-center rounded-2xl font-bold tracking-tight`}
      style={{ backgroundColor: `${accent}14`, color: accent }}
      aria-label={name}
      title={name}
    >
      {logo}
    </span>
  );
}
