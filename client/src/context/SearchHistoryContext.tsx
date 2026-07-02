import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "../lib/hooks";

interface RecentProduct {
  id: string;
  name: string;
  image: string;
  price: number;
}

interface SearchHistoryContextValue {
  history: string[];
  recentlyViewed: RecentProduct[];
  addSearch: (term: string) => void;
  clearHistory: () => void;
  addRecentlyViewed: (p: RecentProduct) => void;
}

const SearchHistoryContext = createContext<SearchHistoryContextValue | null>(null);

export function SearchHistoryProvider({ children }: { children: ReactNode }) {
  const [history, setHistory] = useLocalStorage<string[]>("luxe.history", []);
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage<RecentProduct[]>(
    "luxe.recentlyViewed",
    [],
  );

  const addSearch = (term: string) => {
    const t = term.trim();
    if (!t) return;
    setHistory((prev) => [t, ...prev.filter((h) => h.toLowerCase() !== t.toLowerCase())].slice(0, 8));
  };

  const clearHistory = () => setHistory([]);

  const addRecentlyViewed = (p: RecentProduct) =>
    setRecentlyViewed((prev) => [p, ...prev.filter((r) => r.id !== p.id)].slice(0, 12));

  const value = useMemo<SearchHistoryContextValue>(
    () => ({ history, recentlyViewed, addSearch, clearHistory, addRecentlyViewed }),
    [history, recentlyViewed],
  );

  return <SearchHistoryContext.Provider value={value}>{children}</SearchHistoryContext.Provider>;
}

export function useSearchHistory(): SearchHistoryContextValue {
  const ctx = useContext(SearchHistoryContext);
  if (!ctx) throw new Error("useSearchHistory must be used within SearchHistoryProvider");
  return ctx;
}
