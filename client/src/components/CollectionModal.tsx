import { useState } from "react";
import { Modal } from "./Modal";
import { useWishlist } from "../context/WishlistContext";
import { CheckIcon, PlusIcon } from "./icons";

interface CollectionModalProps {
  open: boolean;
  onClose: () => void;
  productId: string;
}

/** Save a product into one or more collections, or spin up a new one. */
export function CollectionModal({ open, onClose, productId }: CollectionModalProps) {
  const { collections, addToCollection, removeFromCollection, createCollection, toggleSaved, isSaved } = useWishlist();
  const [newName, setNewName] = useState("");

  const inCollection = (id: string) => collections.find((c) => c.id === id)?.productIds.includes(productId);

  const create = () => {
    const name = newName.trim();
    if (!name) return;
    const c = createCollection(name);
    addToCollection(c.id, productId);
    if (!isSaved(productId)) toggleSaved(productId);
    setNewName("");
  };

  return (
    <Modal open={open} onClose={onClose} title="Save to collection">
      <ul className="mb-4 max-h-64 space-y-1.5 overflow-y-auto">
        {collections.map((c) => {
          const saved = inCollection(c.id);
          return (
            <li key={c.id}>
              <button
                onClick={() => {
                  if (saved) removeFromCollection(c.id, productId);
                  else {
                    addToCollection(c.id, productId);
                    if (!isSaved(productId)) toggleSaved(productId);
                  }
                }}
                className="flex w-full items-center gap-3 rounded-2xl border border-ink/5 px-4 py-3 text-left transition-colors hover:bg-ink/5"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blush-100 to-lilac-100 text-sm font-semibold text-ink">
                  {c.name.charAt(0)}
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-medium text-ink">{c.name}</span>
                  <span className="block text-xs text-ink-muted">{c.productIds.length} items</span>
                </span>
                <span className={`grid h-6 w-6 place-items-center rounded-full transition-colors ${saved ? "bg-blush-400 text-white" : "border border-ink/15"}`}>
                  {saved && <CheckIcon className="h-4 w-4" />}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center gap-2 rounded-2xl border border-dashed border-ink/15 p-2">
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && create()}
          placeholder="New collection name…"
          className="w-full bg-transparent px-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none"
        />
        <button onClick={create} className="btn-primary !px-4 !py-2 text-xs">
          <PlusIcon className="h-4 w-4" /> Create
        </button>
      </div>
    </Modal>
  );
}
