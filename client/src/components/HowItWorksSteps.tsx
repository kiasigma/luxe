import type { ReactNode } from "react";
import { SearchIcon, CopyIcon, ExternalIcon, SparkleIcon } from "./icons";

/**
 * The 4-step "how to actually get the item" flow, shared by the full
 * How it works page and the first-visit welcome tutorial so the wording
 * stays identical everywhere.
 */
export interface TutorialStep {
  icon: ReactNode;
  title: string;
  body: string;
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    icon: <SearchIcon className="h-5 w-5" />,
    title: "Find what you want",
    body: "Browse the categories or search for any item you love.",
  },
  {
    icon: <CopyIcon className="h-5 w-5" />,
    title: "Copy the code",
    body: "Open the item and tap “Copy code” — that copies the exact product name.",
  },
  {
    icon: <ExternalIcon className="h-5 w-5" />,
    title: "Go to the website",
    body: "Hit “Go to website” to jump to the best-priced store for that item.",
  },
  {
    icon: <SparkleIcon className="h-5 w-5" />,
    title: "Paste & enjoy",
    body: "Paste the code into their search, open your item, check out — done!",
  },
];

/** Vertical numbered list of the steps (used in the welcome modal). */
export function StepList({ compact = false }: { compact?: boolean }) {
  return (
    <ol className="flex flex-col gap-3">
      {TUTORIAL_STEPS.map((step, i) => (
        <li key={step.title} className="flex items-start gap-3">
          <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-2xl bg-blush-100 text-blush-500">
            {step.icon}
            <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-blush-500 text-[9px] font-bold text-white">
              {i + 1}
            </span>
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">{step.title}</p>
            {!compact && <p className="mt-0.5 text-[13px] leading-snug text-ink-muted">{step.body}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
