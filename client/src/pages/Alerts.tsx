import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAlerts } from "../context/AlertsContext";
import { formatPrice } from "../lib/format";
import { BellIcon, TrashIcon, CheckIcon, ArrowRight } from "../components/icons";

interface CheckResult {
  productId: string;
  currentPrice?: number;
  triggered: boolean;
  retailer?: string;
}

export function Alerts() {
  const { alerts, removeAlert } = useAlerts();
  const [results, setResults] = useState<Record<string, CheckResult>>({});

  useEffect(() => {
    document.title = "Price alerts · Luxe";
    if (alerts.length === 0) return;
    api
      .checkAlerts(alerts.map((a) => ({ productId: a.productId, threshold: a.threshold })))
      .then((res) => {
        const map: Record<string, CheckResult> = {};
        res.results.forEach((r) => (map[r.productId] = r));
        setResults(map);
      })
      .catch(() => setResults({}));
  }, [alerts]);

  return (
    <div className="container-luxe py-8">
      <div className="mb-6">
        <p className="section-eyebrow mb-1">Never miss a drop</p>
        <h1 className="heading-display text-3xl sm:text-4xl">Price alerts</h1>
        <p className="mt-2 text-sm text-ink-muted">
          We watch these for you and check the live price across every retailer.
        </p>
      </div>

      {alerts.length === 0 ? (
        <EmptyAlerts />
      ) : (
        <div className="space-y-3">
          {alerts.map((a) => {
            const r = results[a.productId];
            const triggered = r?.triggered;
            const current = r?.currentPrice ?? a.priceWhenSet;
            const distance = current - a.threshold;
            return (
              <div
                key={a.id}
                className={`flex flex-wrap items-center gap-4 rounded-3xl border bg-white p-4 shadow-soft transition-colors sm:p-5 ${
                  triggered ? "border-sage-300 bg-sage-50/50" : "border-ink/5"
                }`}
              >
                <Link to={`/product/${a.productId}`} className="aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-2xl bg-ink/5">
                  <img src={a.productImage} alt={a.productName} className="h-full w-full object-cover" loading="lazy" />
                </Link>

                <div className="min-w-0 flex-1">
                  <Link to={`/product/${a.productId}`} className="line-clamp-1 font-medium text-ink hover:text-blush-500">
                    {a.productName}
                  </Link>
                  <p className="mt-1 text-xs text-ink-muted">
                    Alert when below <span className="font-semibold text-ink">{formatPrice(a.threshold)}</span>
                    {r?.retailer && <> · now at {r.retailer}</>}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-ink">{formatPrice(current)}</p>
                  {triggered ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-sage-400">
                      <CheckIcon className="h-3.5 w-3.5" /> Target reached!
                    </span>
                  ) : (
                    <span className="text-xs text-ink-muted">{formatPrice(distance)} to go</span>
                  )}
                </div>

                <button
                  onClick={() => removeAlert(a.id)}
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink-muted transition-colors hover:bg-blush-50 hover:text-blush-500"
                  aria-label="Remove alert"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EmptyAlerts() {
  return (
    <div className="flex flex-col items-center justify-center rounded-4xl border border-dashed border-ink/10 bg-white py-20 text-center">
      <span className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-lilac-50 text-lilac-400">
        <BellIcon className="h-8 w-8" />
      </span>
      <h3 className="font-display text-2xl text-ink">No alerts yet</h3>
      <p className="mt-2 max-w-sm text-sm text-ink-muted">
        On any product, tap “Price alert” and we'll tell you the moment it drops below your target.
      </p>
      <Link to="/search?sort=popular" className="btn-primary mt-6">
        Find something to watch <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
