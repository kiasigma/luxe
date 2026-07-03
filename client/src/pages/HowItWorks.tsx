import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TUTORIAL_STEPS } from "../components/HowItWorksSteps";
import { useSeo } from "../lib/seo";
import { SparkleIcon, ChevronRight } from "../components/icons";

/**
 * Step-by-step guide explaining the copy-code shopping flow. Reachable from the
 * navbar ("How it works") and from the first-visit welcome tutorial.
 */
export function HowItWorks() {
  useSeo({
    title: "How it works — Dealista",
    description: "Find an item, copy the code, go to the store, paste and enjoy. Here's how to shop with Dealista in four simple steps.",
  });

  return (
    <div className="container-luxe py-10 sm:py-14">
      {/* Hero */}
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blush-100 px-3 py-1 text-xs font-semibold text-blush-500">
          <SparkleIcon className="h-3.5 w-3.5" /> Quick guide
        </span>
        <h1 className="heading-display mt-4 text-3xl sm:text-4xl">How it works</h1>
        <p className="mt-3 text-ink-muted">
          Dealista finds the lowest price for every item — then hands you a code to grab it on the
          store's own site. Four simple steps:
        </p>
      </div>

      {/* Steps */}
      <div className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-2">
        {TUTORIAL_STEPS.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="card flex items-start gap-4 p-6"
          >
            <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-blush-100 text-blush-500">
              {step.icon}
              <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-blush-500 text-[11px] font-bold text-white">
                {i + 1}
              </span>
            </span>
            <div>
              <h2 className="text-base font-semibold text-ink">{step.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-muted">{step.body}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <div className="mx-auto mt-10 flex max-w-4xl flex-col items-center gap-3 rounded-4xl bg-gradient-to-br from-blush-50 to-lilac-50 p-8 text-center">
        <p className="font-display text-xl text-ink">Ready to find something you love?</p>
        <Link to="/" className="btn-primary">
          Start browsing <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
