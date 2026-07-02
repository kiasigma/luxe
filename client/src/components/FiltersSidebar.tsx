import { useState, type ReactNode } from "react";
import type { SearchResult } from "../types";
import { ChevronDown, CheckIcon } from "./icons";
import { formatPrice } from "../lib/format";

export interface FilterValues {
  brand: string[];
  colour: string[];
  size: string[];
  material: string[];
  retailer: string[];
  minPrice?: number;
  maxPrice?: number;
  saleOnly: boolean;
  freeDelivery: boolean;
  newOnly: boolean;
  bestRated: boolean;
}

export const emptyFilters: FilterValues = {
  brand: [], colour: [], size: [], material: [], retailer: [],
  saleOnly: false, freeDelivery: false, newOnly: false, bestRated: false,
};

/** Pastel-friendly swatch colours for known colour names. */
const COLOUR_HEX: Record<string, string> = {
  Black: "#1c1a1d", White: "#f4f1ef", Beige: "#e6d8c3", "Blush Pink": "#f1adc1",
  "Sage Green": "#9cc1a8", "Powder Blue": "#aecbe0", Lilac: "#c2abe3", Cream: "#f3ece0",
  Camel: "#c19a6b", Burgundy: "#7b2236", Navy: "#27344f", Lavender: "#cdb4e3",
  Terracotta: "#c66b4e", Gold: "#d4af6a", Silver: "#c9cdd2",
  Olive: "#7d7d4a", Charcoal: "#3a3a3f", "Rose Gold": "#b76e79", Emerald: "#2e8b57", Chocolate: "#5b3a29",
};

interface FiltersSidebarProps {
  facets: SearchResult["facets"] | null;
  values: FilterValues;
  onChange: (next: FilterValues) => void;
  onClear: () => void;
}

export function FiltersSidebar({ facets, values, onChange, onClear }: FiltersSidebarProps) {
  const toggle = (key: keyof FilterValues, value: string) => {
    const current = values[key] as string[];
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onChange({ ...values, [key]: next });
  };

  const activeCount =
    values.brand.length + values.colour.length + values.size.length +
    values.material.length + values.retailer.length +
    [values.saleOnly, values.freeDelivery, values.newOnly, values.bestRated].filter(Boolean).length +
    (values.minPrice != null || values.maxPrice != null ? 1 : 0);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1 pb-2">
        <h3 className="font-display text-lg text-ink">Filters</h3>
        {activeCount > 0 && (
          <button onClick={onClear} className="text-xs font-medium text-blush-500 hover:underline">
            Clear all ({activeCount})
          </button>
        )}
      </div>

      {/* Quick toggles */}
      <Section title="Refine" defaultOpen>
        <div className="space-y-2">
          <Toggle label="Sale only" checked={values.saleOnly} onChange={(v) => onChange({ ...values, saleOnly: v })} />
          <Toggle label="Free delivery" checked={values.freeDelivery} onChange={(v) => onChange({ ...values, freeDelivery: v })} />
          <Toggle label="New in" checked={values.newOnly} onChange={(v) => onChange({ ...values, newOnly: v })} />
          <Toggle label="Best rated (4.5+)" checked={values.bestRated} onChange={(v) => onChange({ ...values, bestRated: v })} />
        </div>
      </Section>

      <Section title="Price" defaultOpen>
        <div className="flex items-center gap-2">
          <PriceInput
            placeholder={facets ? formatPrice(facets.priceRange.min) : "Min"}
            value={values.minPrice}
            onChange={(v) => onChange({ ...values, minPrice: v })}
          />
          <span className="text-ink-muted">–</span>
          <PriceInput
            placeholder={facets ? formatPrice(facets.priceRange.max) : "Max"}
            value={values.maxPrice}
            onChange={(v) => onChange({ ...values, maxPrice: v })}
          />
        </div>
      </Section>

      {facets && facets.colours.length > 0 && (
        <Section title="Colour" defaultOpen>
          <div className="flex flex-wrap gap-2.5">
            {facets.colours.map((c) => {
              const selected = values.colour.includes(c.value);
              return (
                <button
                  key={c.value}
                  onClick={() => toggle("colour", c.value)}
                  title={`${c.value} (${c.count})`}
                  aria-pressed={selected}
                  className={`grid h-8 w-8 place-items-center rounded-full ring-1 ring-ink/10 transition-all hover:scale-110 ${
                    selected ? "ring-2 ring-blush-400 ring-offset-2" : ""
                  }`}
                  style={{ backgroundColor: COLOUR_HEX[c.value] ?? "#ddd" }}
                >
                  {selected && (
                    <CheckIcon
                      className="h-4 w-4"
                      style={{ color: c.value === "White" || c.value === "Cream" || c.value === "Gold" ? "#1c1a1d" : "#fff" }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </Section>
      )}

      {facets && facets.sizes.length > 0 && (
        <Section title="Size">
          <div className="flex flex-wrap gap-2">
            {facets.sizes.map((s) => (
              <Chip key={s.value} label={s.value} selected={values.size.includes(s.value)} onClick={() => toggle("size", s.value)} />
            ))}
          </div>
        </Section>
      )}

      {facets && facets.brands.length > 0 && (
        <CheckSection
          title="Brand"
          items={facets.brands}
          selected={values.brand}
          onToggle={(v) => toggle("brand", v)}
        />
      )}

      {facets && facets.retailers.length > 0 && (
        <CheckSection
          title="Retailer"
          items={facets.retailers.map((r) => ({ value: r.value.split("::")[0], label: r.value.split("::")[1], count: r.count }))}
          selected={values.retailer}
          onToggle={(v) => toggle("retailer", v)}
        />
      )}

      {facets && facets.materials.length > 0 && (
        <CheckSection
          title="Material"
          items={facets.materials}
          selected={values.material}
          onToggle={(v) => toggle("material", v)}
        />
      )}
    </div>
  );
}

/* ---------- building blocks ---------- */

function Section({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-ink/5 py-3 last:border-0">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between px-1 py-1 text-left">
        <span className="text-sm font-semibold text-ink">{title}</span>
        <ChevronDown className={`h-4 w-4 text-ink-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-1 pt-3">{children}</div>}
    </div>
  );
}

function CheckSection({
  title, items, selected, onToggle,
}: {
  title: string;
  items: { value: string; label?: string; count: number }[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <Section title={title}>
      <ul className="max-h-52 space-y-0.5 overflow-y-auto pr-1">
        {items.map((item) => {
          const checked = selected.includes(item.value);
          return (
            <li key={item.value}>
              <button onClick={() => onToggle(item.value)} className="flex w-full items-center gap-2.5 rounded-xl px-2 py-1.5 text-left transition-colors hover:bg-ink/5">
                <span className={`grid h-4.5 w-4.5 shrink-0 place-items-center rounded-md border transition-colors ${checked ? "border-blush-400 bg-blush-400 text-white" : "border-ink/20"}`} style={{ height: 18, width: 18 }}>
                  {checked && <CheckIcon className="h-3 w-3" />}
                </span>
                <span className={`flex-1 truncate text-sm ${checked ? "font-medium text-ink" : "text-ink-soft"}`}>
                  {item.label ?? item.value}
                </span>
                <span className="text-xs text-ink-muted">{item.count}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} className="flex w-full items-center justify-between rounded-xl px-2 py-1.5 text-left transition-colors hover:bg-ink/5">
      <span className={`text-sm ${checked ? "font-medium text-ink" : "text-ink-soft"}`}>{label}</span>
      <span className={`relative h-6 w-10 rounded-full transition-colors ${checked ? "bg-blush-400" : "bg-ink/15"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${checked ? "translate-x-[18px]" : "translate-x-0.5"}`} />
      </span>
    </button>
  );
}

function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={`min-w-[44px] rounded-xl border px-3 py-1.5 text-sm font-medium transition-all ${
        selected ? "border-ink bg-ink text-white" : "border-ink/15 text-ink-soft hover:border-ink/30"
      }`}
    >
      {label}
    </button>
  );
}

function PriceInput({ value, placeholder, onChange }: { value?: number; placeholder: string; onChange: (v?: number) => void }) {
  return (
    <input
      type="number"
      inputMode="numeric"
      min={0}
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
      className="input-luxe !py-2 !text-sm"
    />
  );
}
