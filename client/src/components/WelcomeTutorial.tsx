import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Modal } from "./Modal";
import { StepList } from "./HowItWorksSteps";
import { SparkleIcon } from "./icons";

const SEEN_KEY = "luxe_tutorial_seen";

/**
 * First-visit tutorial. Pops up once (persisted in localStorage) to show the
 * shopper how the copy-code flow works. Fully skippable — "Maybe later" or the
 * close button dismiss it and it won't show again.
 */
export function WelcomeTutorial() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(SEEN_KEY)) setOpen(true);
    } catch {
      /* ignore private-mode storage errors */
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* ignore */
    }
    setOpen(false);
  };

  return (
    <Modal open={open} onClose={dismiss} title="Welcome to Dealista 👋">
      <div className="mb-4 flex items-center gap-2 rounded-2xl bg-blush-50 px-4 py-3 text-sm text-ink-soft">
        <SparkleIcon className="h-4 w-4 shrink-0 text-blush-500" />
        <span>New here? Here's how to grab any item in 4 quick steps.</span>
      </div>

      <StepList />

      <div className="mt-6 flex flex-col gap-2">
        <button onClick={dismiss} className="btn-primary w-full">
          Got it — start shopping
        </button>
        <div className="flex items-center justify-between">
          <Link
            to="/how-it-works"
            onClick={dismiss}
            className="text-xs font-semibold text-blush-500 hover:underline"
          >
            See the full guide
          </Link>
          <button
            onClick={dismiss}
            className="text-xs font-medium text-ink-muted transition-colors hover:text-ink"
          >
            Maybe later
          </button>
        </div>
      </div>
    </Modal>
  );
}
