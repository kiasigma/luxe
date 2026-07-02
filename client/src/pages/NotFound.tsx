import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="container-luxe flex flex-col items-center py-28 text-center">
      <span className="font-display text-7xl italic text-blush-300">404</span>
      <h1 className="mt-3 font-display text-3xl text-ink">This page slipped away</h1>
      <p className="mt-2 max-w-sm text-ink-muted">
        The link may be broken or the page may have moved — let's get you back to the good stuff.
      </p>
      <Link to="/" className="btn-primary mt-6">Back to home</Link>
    </div>
  );
}
