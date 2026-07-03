import { useState } from "react";
import { useLocalStorage } from "../lib/hooks";
import { ArrowRight, CheckIcon } from "./icons";

/**
 * Email capture for price-drop alerts & weekly edits. Building an owned audience
 * is the cheapest durable traffic + revenue channel (re-engagement, repeat
 * visits, higher ad impressions). Wire `onSubmit` to your ESP (Klaviyo,
 * Mailchimp, Beehiiv…) — here it persists locally so the flow is demoable.
 */
export function NewsletterSignup() {
  const [subscribed, setSubscribed] = useLocalStorage("luxe.subscribed", false);
  const [email, setEmail] = useState("");
  const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);

  return (
    <section className="container-luxe">
      <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-blush-100 via-lilac-50 to-sage-50 px-6 py-12 text-center shadow-soft sm:px-10">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/40 blur-2xl" />
        <p className="section-eyebrow mb-2">Be first to know</p>
        <h2 className="heading-display text-2xl sm:text-3xl">Get the best price drops in your inbox</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink-soft">
          Weekly edits, exclusive deals and instant alerts when the things you love go on sale.
        </p>

        {subscribed ? (
          <p className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-sage-400 shadow-soft">
            <CheckIcon className="h-4 w-4" /> You're subscribed — welcome to Dealista.
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (valid) setSubscribed(true);
            }}
            className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              aria-label="Email address"
              className="input-luxe flex-1 !rounded-full !py-3.5"
            />
            <button type="submit" disabled={!valid} className="btn-primary shrink-0 disabled:opacity-40">
              Subscribe <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}
        <p className="mt-3 text-xs text-ink-muted">No spam, unsubscribe anytime.</p>
      </div>
    </section>
  );
}
