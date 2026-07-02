import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CloseIcon } from "./icons";

/**
 * Dismissible sticky footer anchor ad — one of the highest-RPM placements, kept
 * non-intrusive: it only appears after the user has scrolled (so it never
 * blocks the hero), is clearly labelled, and can be closed for the session.
 */
export function StickyAd() {
  const client = import.meta.env.VITE_ADSENSE_CLIENT;
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem("luxe.anchorAdDismissed") === "1",
  );

  useEffect(() => {
    if (dismissed) return;
    const onScroll = () => setVisible(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed]);

  const close = () => {
    setDismissed(true);
    sessionStorage.setItem("luxe.anchorAdDismissed", "1");
  };

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 30 }}
          className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3"
        >
          <div className="relative flex w-full max-w-3xl items-center justify-center rounded-2xl border border-ink/10 bg-white/95 px-6 py-3 shadow-lift backdrop-blur">
            <span className="absolute left-3 top-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-ink-muted/60">
              Ad
            </span>
            {client ? (
              <ins className="adsbygoogle block w-full" data-ad-client={client} data-ad-format="horizontal" />
            ) : (
              <p className="text-sm text-ink-muted">Sponsored placement — your ad here.</p>
            )}
            <button
              onClick={close}
              aria-label="Close ad"
              className="absolute right-2 top-1.5 grid h-7 w-7 place-items-center rounded-full text-ink-muted transition-colors hover:bg-ink/5 hover:text-ink"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
