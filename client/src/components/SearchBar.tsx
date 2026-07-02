import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "../lib/api";
import { useDebounce } from "../lib/hooks";
import { useSearchHistory } from "../context/SearchHistoryContext";
import type { Suggestion } from "../types";
import { SearchIcon, CloseIcon } from "./icons";

interface SearchBarProps {
  size?: "lg" | "md";
  autoFocus?: boolean;
  initialValue?: string;
  /** Kept for compatibility; trending chips render on the page, not in a popup. */
  trending?: string[];
}

const PLACEHOLDER = "Search dresses, handbags, skincare, trainers…";

/**
 * Instant-feel search with type-ahead autocomplete. Fully keyboard-navigable.
 * The dropdown only appears while typing — no empty-state popup on focus.
 */
export function SearchBar({ size = "lg", autoFocus, initialValue = "" }: SearchBarProps) {
  const navigate = useNavigate();
  const { addSearch } = useSearchHistory();
  const [value, setValue] = useState(initialValue);
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [active, setActive] = useState(-1);
  const debounced = useDebounce(value, 160);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    if (debounced.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    api
      .suggest(debounced)
      .then((r) => !cancelled && setSuggestions(r.suggestions))
      .catch(() => !cancelled && setSuggestions([]));
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  // Close on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const submit = (term: string) => {
    const t = term.trim();
    if (!t) return;
    addSearch(t);
    setOpen(false);
    setValue(t);
    inputRef.current?.blur();
    navigate(`/search?q=${encodeURIComponent(t)}`);
  };

  const pickSuggestion = (s: Suggestion) => {
    if (s.type === "product" && s.productId) {
      setOpen(false);
      navigate(`/product/${s.productId}`);
    } else if (s.type === "category") {
      setOpen(false);
      navigate(`/search?category=${encodeURIComponent(s.label)}`);
    } else {
      submit(s.label);
    }
  };

  const showEmptyPanel = !value.trim();
  const flatItems: Suggestion[] = showEmptyPanel ? [] : suggestions;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, flatItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, -1));
    } else if (e.key === "Enter") {
      if (active >= 0 && flatItems[active]) pickSuggestion(flatItems[active]);
      else submit(value);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const big = size === "lg";

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={`flex items-center gap-3 rounded-full border bg-white shadow-soft transition-all duration-300 ease-silk ${
          open ? "border-blush-300 shadow-lift ring-4 ring-blush-100" : "border-ink/10"
        } ${big ? "px-6 py-4" : "px-4 py-2.5"}`}
      >
        <SearchIcon className={`shrink-0 text-ink-muted ${big ? "h-6 w-6" : "h-5 w-5"}`} />
        <input
          ref={inputRef}
          value={value}
          autoFocus={autoFocus}
          onChange={(e) => {
            setValue(e.target.value);
            setActive(-1);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={PLACEHOLDER}
          aria-label="Search products"
          className={`w-full bg-transparent text-ink placeholder:text-ink-muted focus:outline-none ${
            big ? "text-base sm:text-lg" : "text-sm"
          }`}
        />
        {value && (
          <button
            onClick={() => {
              setValue("");
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-ink-muted transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={() => submit(value)}
          className={`btn-primary shrink-0 ${big ? "" : "!px-4 !py-2 text-xs"}`}
        >
          Search
        </button>
      </div>

      <AnimatePresence>
        {open && !showEmptyPanel && (flatItems.length > 0 || debounced.trim().length >= 2) && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-40 mt-3 w-full overflow-hidden rounded-3xl border border-ink/10 bg-white p-2 text-left shadow-lift"
          >
            {/* Live suggestions */}
            {flatItems.length > 0 && (
              <ul className="max-h-[360px] overflow-y-auto">
                {flatItems.map((s, i) => (
                  <li key={`${s.type}-${s.label}`}>
                    <button
                      onMouseEnter={() => setActive(i)}
                      onClick={() => pickSuggestion(s)}
                      className={`flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 text-left transition-colors ${
                        active === i ? "bg-blush-50" : "hover:bg-ink/5"
                      }`}
                    >
                      <SearchIcon className="h-4 w-4 shrink-0 text-ink-muted" />
                      <span className="flex-1 truncate text-sm text-ink">{s.label}</span>
                      {s.sublabel && (
                        <span className="shrink-0 text-xs text-ink-muted">{s.sublabel}</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {flatItems.length === 0 && debounced.trim().length >= 2 && (
              <p className="px-4 py-6 text-center text-sm text-ink-muted">
                No matches yet — try “black dress” or “serum”.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
