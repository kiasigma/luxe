import { useState } from "react";
import { Modal } from "./Modal";
import { useAlerts } from "../context/AlertsContext";
import type { Product } from "../types";
import { formatPrice } from "../lib/format";
import { BellIcon, CheckIcon } from "./icons";

interface PriceAlertModalProps {
  open: boolean;
  onClose: () => void;
  product: Product;
}

/** "Notify me when this drops below £X" — with friendly preset suggestions. */
export function PriceAlertModal({ open, onClose, product }: PriceAlertModalProps) {
  const { addAlert, hasAlert } = useAlerts();
  const current = product.lowestPrice;
  const [threshold, setThreshold] = useState(Math.floor(current * 0.9));
  const [done, setDone] = useState(false);

  const presets = [0.95, 0.9, 0.8].map((m) => Math.floor(current * m));

  const save = () => {
    addAlert({
      productId: product.id,
      productName: product.name,
      productImage: product.images[0],
      threshold,
      priceWhenSet: current,
    });
    setDone(true);
    setTimeout(() => {
      setDone(false);
      onClose();
    }, 1100);
  };

  return (
    <Modal open={open} onClose={onClose} title="Create price alert">
      {done ? (
        <div className="flex flex-col items-center gap-3 py-8 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-sage-100 text-sage-400">
            <CheckIcon className="h-7 w-7" />
          </span>
          <p className="font-display text-lg text-ink">You're all set</p>
          <p className="text-sm text-ink-muted">
            We'll watch this and let you know the moment it drops below {formatPrice(threshold)}.
          </p>
        </div>
      ) : (
        <>
          <p className="mb-5 text-sm leading-relaxed text-ink-muted">
            Currently <span className="font-semibold text-ink">{formatPrice(current)}</span> at{" "}
            {product.offers[0]?.retailerName}. We'll notify you when the best price drops below your target.
          </p>

          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
            Notify me below
          </label>
          <div className="mb-4 flex items-center gap-2 rounded-2xl border border-ink/10 px-4 py-3 focus-within:border-blush-300 focus-within:ring-4 focus-within:ring-blush-100">
            <span className="text-lg font-semibold text-ink-muted">£</span>
            <input
              type="number"
              min={1}
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full bg-transparent text-lg font-semibold text-ink focus:outline-none"
            />
          </div>

          <div className="mb-6 flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => setThreshold(p)}
                className={`chip !py-1.5 text-xs ${threshold === p ? "border-blush-300 bg-blush-50 text-ink" : ""}`}
              >
                Below {formatPrice(p)}
              </button>
            ))}
          </div>

          <button onClick={save} className="btn-primary w-full">
            <BellIcon className="h-4 w-4" />
            {hasAlert(product.id) ? "Update alert" : "Create alert"}
          </button>
        </>
      )}
    </Modal>
  );
}
