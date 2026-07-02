import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "../lib/hooks";

export interface Collection {
  id: string;
  name: string;
  productIds: string[];
  createdAt: string;
}

interface WishlistState {
  /** Default "saved" hearts plus any custom collections. */
  saved: string[];
  collections: Collection[];
}

interface WishlistContextValue extends WishlistState {
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;
  createCollection: (name: string) => Collection;
  addToCollection: (collectionId: string, productId: string) => void;
  removeFromCollection: (collectionId: string, productId: string) => void;
  deleteCollection: (collectionId: string) => void;
  totalSaved: number;
}

const STARTER_COLLECTIONS: Collection[] = [
  { id: "summer", name: "Summer", productIds: [], createdAt: new Date().toISOString() },
  { id: "wedding-guest", name: "Wedding Guest", productIds: [], createdAt: new Date().toISOString() },
  { id: "work", name: "Work", productIds: [], createdAt: new Date().toISOString() },
  { id: "holiday", name: "Holiday", productIds: [], createdAt: new Date().toISOString() },
];

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useLocalStorage<string[]>("luxe.saved", []);
  const [collections, setCollections] = useLocalStorage<Collection[]>(
    "luxe.collections",
    STARTER_COLLECTIONS,
  );

  const isSaved = (id: string) => saved.includes(id);

  const toggleSaved = (id: string) =>
    setSaved((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [id, ...prev]));

  const createCollection = (name: string): Collection => {
    const collection: Collection = {
      id: `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36)}`,
      name,
      productIds: [],
      createdAt: new Date().toISOString(),
    };
    setCollections((prev) => [...prev, collection]);
    return collection;
  };

  const addToCollection = (collectionId: string, productId: string) =>
    setCollections((prev) =>
      prev.map((c) =>
        c.id === collectionId && !c.productIds.includes(productId)
          ? { ...c, productIds: [productId, ...c.productIds] }
          : c,
      ),
    );

  const removeFromCollection = (collectionId: string, productId: string) =>
    setCollections((prev) =>
      prev.map((c) =>
        c.id === collectionId
          ? { ...c, productIds: c.productIds.filter((p) => p !== productId) }
          : c,
      ),
    );

  const deleteCollection = (collectionId: string) =>
    setCollections((prev) => prev.filter((c) => c.id !== collectionId));

  const value = useMemo<WishlistContextValue>(
    () => ({
      saved,
      collections,
      isSaved,
      toggleSaved,
      createCollection,
      addToCollection,
      removeFromCollection,
      deleteCollection,
      totalSaved: saved.length,
    }),
    [saved, collections],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
