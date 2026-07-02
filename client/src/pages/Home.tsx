import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../lib/api";
import type { Discovery } from "../types";
import { SearchBar } from "../components/SearchBar";
import { ProductRail } from "../components/ProductRail";
import { AdSlot } from "../components/AdSlot";
import { NewsletterSignup } from "../components/NewsletterSignup";
import { useSeo } from "../lib/seo";
import { SparkleIcon, ArrowRight, TagIcon } from "../components/icons";

export function Home() {
  const [data, setData] = useState<Discovery | null>(null);

  useSeo({
    title: "Luxe · Compare the best prices on women's fashion & beauty",
    description:
      "Instantly compare prices on dresses, handbags, shoes, jewellery, makeup, skincare and perfume across leading retailers. Find the best deal, set price alerts and save your favourites.",
    canonicalPath: "/",
  });

  useEffect(() => {
    api.discovery().then(setData).catch(() => setData(null));
  }, []);

  return (
    <div className="pb-10">
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden">
        {/* Soft pastel ambience */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-blush-200/40 blur-3xl" />
          <div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-lilac-200/40 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-sage-100/50 blur-3xl" />
        </div>

        <div className="container-luxe pt-14 pb-10 text-center sm:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-3xl"
          >
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-1.5 text-xs font-medium text-ink-soft shadow-sm">
              <SparkleIcon className="h-3.5 w-3.5 text-blush-400" />
              Comparing prices across {/* retailers */}8 leading retailers
            </span>

            <h1 className="heading-display text-balance text-4xl leading-[1.05] sm:text-6xl">
              Find the <span className="italic text-blush-500">best price</span>,
              <br className="hidden sm:block" /> everywhere.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-balance text-base text-ink-soft sm:text-lg">
              One beautiful place to compare women's fashion &amp; beauty — dresses,
              handbags, skincare, makeup and more — across every retailer.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-8 max-w-2xl"
          >
            <SearchBar size="lg" trending={data?.trendingSearches ?? []} />

            {/* Trending searches */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs font-medium text-ink-muted">Trending:</span>
              {(data?.trendingSearches ?? ["Black dress", "Gold hoops", "Vitamin C serum", "White trainers"])
                .slice(0, 6)
                .map((t) => (
                  <Link key={t} to={`/search?q=${encodeURIComponent(t)}`} className="chip !py-1.5 text-xs">
                    {t}
                  </Link>
                ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ---------- Popular categories ---------- */}
      <section className="container-luxe py-8">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="section-eyebrow mb-1.5">Browse</p>
            <h2 className="heading-display text-2xl sm:text-3xl">Popular categories</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {(data?.popularCategories ?? []).map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
            >
              <Link
                to={`/search?category=${encodeURIComponent(c.category)}`}
                className="group flex flex-col items-center justify-center gap-2 rounded-3xl border border-ink/5 bg-white p-6 shadow-soft transition-all duration-500 ease-silk hover:-translate-y-1.5 hover:shadow-lift"
              >
                <span className="text-3xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                  {c.icon}
                </span>
                <span className="text-sm font-semibold text-ink">{c.name}</span>
              </Link>
            </motion.div>
          ))}
          {!data && Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-28 rounded-3xl" />)}
        </div>
      </section>

      {/* ---------- Recently price dropped ---------- */}
      <ProductRail
        eyebrow="Don't miss out"
        title="Recently price dropped"
        subtitle="Hand-picked deals where the price just fell."
        products={data?.priceDropped ?? []}
        loading={!data}
        viewAllTo="/search?saleOnly=true&sort=discount"
      />

      {/* ---------- Editor's picks ---------- */}
      <ProductRail
        eyebrow="Curated"
        title="Editor's picks"
        subtitle="The pieces our team is loving right now."
        products={data?.editorsPicks ?? []}
        loading={!data}
        viewAllTo="/search?sort=rating"
      />

      {/* Unobtrusive ad break */}
      <div className="container-luxe my-6">
        <AdSlot variant="leaderboard" className="flex" />
      </div>

      {/* ---------- Popular brands ---------- */}
      <section className="container-luxe py-8">
        <p className="section-eyebrow mb-1.5">Loved by shoppers</p>
        <h2 className="heading-display mb-5 text-2xl sm:text-3xl">Popular brands</h2>
        <div className="flex flex-wrap gap-3">
          {(data?.popularBrands ?? []).map((b) => (
            <Link
              key={b}
              to={`/search?q=${encodeURIComponent(b)}`}
              className="group flex items-center gap-3 rounded-2xl border border-ink/5 bg-white px-5 py-3.5 shadow-soft transition-all duration-300 ease-silk hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blush-100 to-lilac-100 text-sm font-bold text-ink">
                {b.charAt(0)}
              </span>
              <span className="text-sm font-medium text-ink">{b}</span>
              <ArrowRight className="h-4 w-4 text-ink-muted transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
          {!data && Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton h-16 w-44 rounded-2xl" />)}
        </div>
      </section>

      {/* ---------- New in ---------- */}
      <ProductRail
        eyebrow="Fresh"
        title="New in"
        subtitle="Just landed across our retailers."
        products={data?.newIn ?? []}
        loading={!data}
        viewAllTo="/search?sort=newest"
      />

      {/* ---------- Value prop band ---------- */}
      <section className="container-luxe mt-10">
        <div className="grid gap-4 rounded-4xl bg-white p-8 shadow-soft sm:grid-cols-3 sm:p-10">
          {[
            { icon: <TagIcon className="h-6 w-6" />, title: "One price check", body: "Compare every retailer at a glance — no more tab-hopping." },
            { icon: <span className="text-xl">🔔</span>, title: "Smart alerts", body: "Set a target price and we'll tell you the moment it drops." },
            { icon: <span className="text-xl">💖</span>, title: "Save the looks", body: "Build collections for Summer, Work, Wedding Guest and more." },
          ].map((f) => (
            <div key={f.title} className="flex flex-col gap-2">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blush-50 text-blush-500">{f.icon}</span>
              <h3 className="font-display text-lg text-ink">{f.title}</h3>
              <p className="text-sm leading-relaxed text-ink-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Newsletter capture ---------- */}
      <div className="mt-12">
        <NewsletterSignup />
      </div>
    </div>
  );
}
