import { useEffect } from "react";

/** Create or update a <meta> tag by name or property. */
function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

interface SeoOptions {
  title: string;
  description?: string;
  canonicalPath?: string;
}

/**
 * Lightweight SEO hook (no extra deps). Sets the document title, meta
 * description, Open Graph and Twitter tags, and a canonical link — all of which
 * drive richer, higher-CTR search results and shareable link previews.
 */
export function useSeo({ title, description, canonicalPath }: SeoOptions) {
  useEffect(() => {
    document.title = title;
    if (description) {
      setMeta("name", "description", description);
      setMeta("property", "og:description", description);
      setMeta("name", "twitter:description", description);
    }
    setMeta("property", "og:title", title);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:card", "summary_large_image");

    const path = canonicalPath ?? window.location.pathname + window.location.search;
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = window.location.origin + path;
  }, [title, description, canonicalPath]);
}

/**
 * Injects a JSON-LD structured-data block and removes it on unmount. Product +
 * AggregateOffer markup makes listings eligible for Google's rich price results
 * (price range, ratings, availability) — a major source of free, high-intent
 * traffic for a price-comparison site.
 */
export function useJsonLd(data: object | null) {
  useEffect(() => {
    if (!data) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [data]);
}
