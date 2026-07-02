import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "../lib/hooks";

export interface PriceAlert {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  threshold: number;
  priceWhenSet: number;
  createdAt: string;
}

interface AlertsContextValue {
  alerts: PriceAlert[];
  hasAlert: (productId: string) => boolean;
  addAlert: (alert: Omit<PriceAlert, "id" | "createdAt">) => void;
  removeAlert: (id: string) => void;
}

const AlertsContext = createContext<AlertsContextValue | null>(null);

export function AlertsProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useLocalStorage<PriceAlert[]>("luxe.alerts", []);

  const hasAlert = (productId: string) => alerts.some((a) => a.productId === productId);

  const addAlert = (alert: Omit<PriceAlert, "id" | "createdAt">) =>
    setAlerts((prev) => [
      { ...alert, id: `${alert.productId}-${Date.now().toString(36)}`, createdAt: new Date().toISOString() },
      ...prev.filter((a) => a.productId !== alert.productId),
    ]);

  const removeAlert = (id: string) => setAlerts((prev) => prev.filter((a) => a.id !== id));

  const value = useMemo<AlertsContextValue>(
    () => ({ alerts, hasAlert, addAlert, removeAlert }),
    [alerts],
  );

  return <AlertsContext.Provider value={value}>{children}</AlertsContext.Provider>;
}

export function useAlerts(): AlertsContextValue {
  const ctx = useContext(AlertsContext);
  if (!ctx) throw new Error("useAlerts must be used within AlertsProvider");
  return ctx;
}
