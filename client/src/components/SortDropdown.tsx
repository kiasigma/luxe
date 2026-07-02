import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { SortKey } from "../types";
import { ChevronDown, CheckIcon } from "./icons";

const OPTIONS: { key: SortKey; label: string }[] = [
  { key: "popular", label: "Most Popular" },
  { key: "price-asc", label: "Lowest Price" },
  { key: "price-desc", label: "Highest Price" },
  { key: "discount", label: "Biggest Discount" },
  { key: "newest", label: "Newest" },
  { key: "rating", label: "Best Rated" },
];

export function SortDropdown({ value, onChange }: { value: SortKey; onChange: (v: SortKey) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = OPTIONS.find((o) => o.key === value) ?? OPTIONS[0];

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2.5 text-sm font-medium text-ink shadow-sm transition-all hover:border-ink/20 hover:shadow-soft"
      >
        <span className="text-ink-muted">Sort:</span> {current.label}
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 z-30 mt-2 w-52 overflow-hidden rounded-2xl border border-ink/10 bg-white p-1.5 shadow-lift"
          >
            {OPTIONS.map((o) => (
              <li key={o.key}>
                <button
                  onClick={() => {
                    onChange(o.key);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                    o.key === value ? "bg-blush-50 font-semibold text-ink" : "text-ink-soft hover:bg-ink/5"
                  }`}
                >
                  {o.label}
                  {o.key === value && <CheckIcon className="h-4 w-4 text-blush-500" />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
