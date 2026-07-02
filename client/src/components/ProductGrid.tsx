import { Fragment } from "react";
import type { Product } from "../types";
import { ProductCard } from "./ProductCard";
import { SkeletonGrid } from "./SkeletonCard";
import { AdSlot } from "./AdSlot";
import { biggestDropId } from "../lib/badges";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  /** Insert an unobtrusive ad row after this many items (0 = never). */
  adEvery?: number;
}

export function ProductGrid({ products, loading, adEvery = 0 }: ProductGridProps) {
  if (loading) return <SkeletonGrid count={8} />;

  const topDropId = biggestDropId(products);

  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product, i) => (
        <Fragment key={product.id}>
          <ProductCard product={product} index={i} isBiggestDrop={product.id === topDropId} />
          {adEvery > 0 && (i + 1) % adEvery === 0 && (
            <AdSlot
              variant="native"
              className="col-span-2 flex md:col-span-3 lg:col-span-4"
              label="Sponsored"
            />
          )}
        </Fragment>
      ))}
    </div>
  );
}
