import { Link } from "react-router-dom";
import type { Product } from "../types";
import { ProductCard } from "./ProductCard";
import { SkeletonCard } from "./SkeletonCard";
import { ArrowRight } from "./icons";
import { biggestDropId } from "../lib/badges";

interface ProductRailProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  products: Product[];
  loading?: boolean;
  viewAllTo?: string;
}

/** Horizontally-scrolling, snap-aligned rail used across the homepage. */
export function ProductRail({ eyebrow, title, subtitle, products, loading, viewAllTo }: ProductRailProps) {
  const topDropId = biggestDropId(products);
  return (
    <section className="py-4">
      <div className="container-luxe">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            {eyebrow && <p className="section-eyebrow mb-1.5">{eyebrow}</p>}
            <h2 className="heading-display text-2xl sm:text-3xl">{title}</h2>
            {subtitle && <p className="mt-1.5 text-sm text-ink-muted">{subtitle}</p>}
          </div>
          {viewAllTo && (
            <Link to={viewAllTo} className="btn-ghost shrink-0 whitespace-nowrap text-blush-500 hover:bg-blush-50">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>

      <div className="-mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-4 no-scrollbar sm:gap-6 sm:px-8 lg:mx-auto lg:max-w-7xl">
        {(loading ? Array.from({ length: 6 }) : products).map((p, i) => (
          <div key={loading ? i : (p as Product).id} className="w-[44%] shrink-0 snap-start sm:w-64">
            {loading ? (
              <SkeletonCard />
            ) : (
              <ProductCard product={p as Product} index={i} isBiggestDrop={(p as Product).id === topDropId} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
