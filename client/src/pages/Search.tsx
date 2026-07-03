import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { api, type SearchQuery } from "../lib/api";
import type { Product, SearchResult, SortKey } from "../types";
import { ProductGrid } from "../components/ProductGrid";
import { FiltersSidebar, emptyFilters, type FilterValues } from "../components/FiltersSidebar";
import { SortDropdown } from "../components/SortDropdown";
import { AdSlot } from "../components/AdSlot";
import { useSeo } from "../lib/seo";
import { SlidersIcon, CloseIcon } from "../components/icons";

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";
  const sort = (searchParams.get("sort") as SortKey) ?? "popular";

  const [filters, setFilters] = useState<FilterValues>(() => ({
    ...emptyFilters,
    saleOnly: searchParams.get("saleOnly") === "true",
    newOnly: searchParams.get("newOnly") === "true",
  }));
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const fetchId = useRef(0);

  // Reset filters + page when the core query (search term / category) changes.
  useEffect(() => {
    setFilters({
      ...emptyFilters,
      saleOnly: searchParams.get("saleOnly") === "true",
      newOnly: searchParams.get("newOnly") === "true",
    });
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, category]);

  const query = useMemo<SearchQuery>(
    () => ({
      q: q || undefined,
      category: category || undefined,
      brand: filters.brand,
      colour: filters.colour,
      size: filters.size,
      material: filters.material,
      retailer: filters.retailer,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      saleOnly: filters.saleOnly || undefined,
      freeDelivery: filters.freeDelivery || undefined,
      newOnly: filters.newOnly || undefined,
      minRating: filters.bestRated ? 4.5 : undefined,
      sort,
      page,
      pageSize: 24,
    }),
    [q, category, filters, sort, page],
  );

  useEffect(() => {
    const id = ++fetchId.current;
    if (page === 1) setLoading(true);
    else setLoadingMore(true);
    window.scrollTo({ top: page === 1 ? 0 : window.scrollY, behavior: "smooth" });

    api
      .search(query)
      .then((res) => {
        if (id !== fetchId.current) return; // ignore stale response
        setResult(res);
        setItems((prev) => (page === 1 ? res.products : [...prev, ...res.products]));
      })
      .catch(() => id === fetchId.current && setResult(null))
      .finally(() => {
        if (id !== fetchId.current) return;
        setLoading(false);
        setLoadingMore(false);
      });
  }, [query, page]);

  const label = q || category || "All products";
  useSeo({
    title: `${label} — compare prices · Dealista`,
    description: `Compare the best prices on ${label.toLowerCase()} across leading retailers. Filter by brand, colour, size, price and more, then jump straight to the deal.`,
  });

  const setSort = (next: SortKey) => {
    const sp = new URLSearchParams(searchParams);
    sp.set("sort", next);
    setSearchParams(sp, { replace: true });
    setPage(1);
  };

  const total = result?.total ?? 0;
  const hasMore = items.length < total;
  const heading = q ? `“${q}”` : category || "All products";

  return (
    <div className="container-luxe py-6">
      {/* Header */}
      <div className="mb-6">
        <p className="section-eyebrow mb-1">{q ? "Search results" : "Browse"}</p>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="heading-display text-3xl sm:text-4xl">{heading}</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDrawerOpen(true)}
              className="btn-secondary !py-2.5 lg:hidden"
            >
              <SlidersIcon className="h-4 w-4" /> Filters
            </button>
            <SortDropdown value={sort} onChange={setSort} />
          </div>
        </div>
        {!loading && (
          <p className="mt-2 text-sm text-ink-muted">
            {total.toLocaleString()} {total === 1 ? "product" : "products"} compared
          </p>
        )}
      </div>

      <div className="flex gap-8">
        {/* Sidebar (desktop) */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-32 space-y-4">
            <div className="rounded-3xl border border-ink/5 bg-white p-4 shadow-soft">
              <FiltersSidebar
                facets={result?.facets ?? null}
                values={filters}
                onChange={(next) => {
                  setFilters(next);
                  setPage(1);
                }}
                onClear={() => {
                  setFilters(emptyFilters);
                  setPage(1);
                }}
              />
            </div>
            {/* High-viewability sticky ad — sits beside results, not over them */}
            <AdSlot variant="halfpage" className="flex" />
          </div>
        </aside>

        {/* Results */}
        <div className="min-w-0 flex-1">
          {loading ? (
            <ProductGrid products={[]} loading />
          ) : items.length === 0 ? (
            <EmptyState query={heading} />
          ) : (
            <>
              <ProductGrid products={items} adEvery={12} />
              {hasMore && (
                <div className="mt-10 flex justify-center">
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={loadingMore}
                    className="btn-secondary min-w-[200px]"
                  >
                    {loadingMore ? "Loading…" : "Load more"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/30 backdrop-blur-sm lg:hidden"
            onClick={() => setDrawerOpen(false)}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-y-0 left-0 w-[86%] max-w-sm overflow-y-auto bg-canvas p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-xl text-ink">Filters</h2>
                <button onClick={() => setDrawerOpen(false)} className="grid h-9 w-9 place-items-center rounded-full hover:bg-ink/5">
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>
              <FiltersSidebar
                facets={result?.facets ?? null}
                values={filters}
                onChange={(next) => {
                  setFilters(next);
                  setPage(1);
                }}
                onClear={() => {
                  setFilters(emptyFilters);
                  setPage(1);
                }}
              />
              <button onClick={() => setDrawerOpen(false)} className="btn-primary mt-5 w-full">
                Show {total} results
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-4xl border border-dashed border-ink/10 bg-white py-20 text-center">
      <span className="mb-4 text-5xl">🔍</span>
      <h3 className="font-display text-2xl text-ink">No matches for {query}</h3>
      <p className="mt-2 max-w-sm text-sm text-ink-muted">
        Try removing a filter or searching something broader like “dress”, “serum” or “handbag”.
      </p>
    </div>
  );
}
