import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import type { Product } from "../types";
import { useWishlist } from "../context/WishlistContext";
import { ProductGrid } from "../components/ProductGrid";
import { Modal } from "../components/Modal";
import { PlusIcon, TrashIcon, HeartIcon } from "../components/icons";

export function Wishlist() {
  const { saved, collections, createCollection, deleteCollection, totalSaved } = useWishlist();
  const [productMap, setProductMap] = useState<Record<string, Product>>({});
  const [active, setActive] = useState<string>("all"); // "all" | collection id
  const [loading, setLoading] = useState(true);
  const [newOpen, setNewOpen] = useState(false);
  const [newName, setNewName] = useState("");

  // Hydrate every referenced product id once.
  const allIds = useMemo(() => {
    const set = new Set<string>(saved);
    collections.forEach((c) => c.productIds.forEach((p) => set.add(p)));
    return [...set];
  }, [saved, collections]);

  useEffect(() => {
    document.title = "Wishlist · Dealista";
    if (allIds.length === 0) {
      setProductMap({});
      setLoading(false);
      return;
    }
    setLoading(true);
    api
      .productsByIds(allIds)
      .then((res) => {
        const map: Record<string, Product> = {};
        res.products.forEach((p) => (map[p.id] = p));
        setProductMap(map);
      })
      .finally(() => setLoading(false));
  }, [allIds.join(",")]);

  const activeIds = active === "all" ? saved : collections.find((c) => c.id === active)?.productIds ?? [];
  const activeProducts = activeIds.map((id) => productMap[id]).filter(Boolean) as Product[];

  return (
    <div className="container-luxe py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="section-eyebrow mb-1">Saved by you</p>
          <h1 className="heading-display text-3xl sm:text-4xl">Your wishlist</h1>
          <p className="mt-2 text-sm text-ink-muted">{totalSaved} saved · {collections.length} collections</p>
        </div>
        <button onClick={() => setNewOpen(true)} className="btn-secondary">
          <PlusIcon className="h-4 w-4" /> New collection
        </button>
      </div>

      {/* Collection tabs */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Tab label={`All saved (${saved.length})`} active={active === "all"} onClick={() => setActive("all")} />
        {collections.map((c) => (
          <div key={c.id} className="group relative">
            <Tab label={`${c.name} (${c.productIds.length})`} active={active === c.id} onClick={() => setActive(c.id)} />
            {!["summer", "wedding-guest", "work", "holiday"].includes(c.id) && (
              <button
                onClick={() => {
                  deleteCollection(c.id);
                  if (active === c.id) setActive("all");
                }}
                className="absolute -right-1 -top-1 hidden h-5 w-5 place-items-center rounded-full bg-white text-ink-muted shadow-soft hover:text-blush-500 group-hover:grid"
                aria-label={`Delete ${c.name}`}
              >
                <TrashIcon className="h-3 w-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      {loading ? (
        <ProductGrid products={[]} loading />
      ) : activeProducts.length > 0 ? (
        <ProductGrid products={activeProducts} />
      ) : (
        <EmptyWishlist />
      )}

      <Modal open={newOpen} onClose={() => setNewOpen(false)} title="New collection">
        <p className="mb-4 text-sm text-ink-muted">Name a new collection — Summer, Date Night, Gift Ideas…</p>
        <div className="flex gap-2">
          <input
            value={newName}
            autoFocus
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newName.trim()) {
                const c = createCollection(newName.trim());
                setActive(c.id);
                setNewName("");
                setNewOpen(false);
              }
            }}
            placeholder="Collection name"
            className="input-luxe"
          />
          <button
            onClick={() => {
              if (!newName.trim()) return;
              const c = createCollection(newName.trim());
              setActive(c.id);
              setNewName("");
              setNewOpen(false);
            }}
            className="btn-primary shrink-0"
          >
            Create
          </button>
        </div>
      </Modal>
    </div>
  );
}

function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
        active ? "bg-ink text-white shadow-soft" : "border border-ink/10 bg-white text-ink-soft hover:border-ink/20"
      }`}
    >
      {label}
    </button>
  );
}

function EmptyWishlist() {
  return (
    <div className="flex flex-col items-center justify-center rounded-4xl border border-dashed border-ink/10 bg-white py-20 text-center">
      <span className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-blush-50 text-blush-400">
        <HeartIcon className="h-8 w-8" />
      </span>
      <h3 className="font-display text-2xl text-ink">Nothing saved yet</h3>
      <p className="mt-2 max-w-sm text-sm text-ink-muted">
        Tap the heart on anything you love and it'll appear here, ready to compare.
      </p>
      <Link to="/search?sort=popular" className="btn-primary mt-6">Start browsing</Link>
    </div>
  );
}
