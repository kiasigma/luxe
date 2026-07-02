import { useState } from "react";
import { CopyIcon, CheckIcon } from "./icons";

interface CopyButtonProps {
  /** Text placed on the clipboard (e.g. the product name to paste into search). */
  text: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
}

/** Copies text to the clipboard with a clear "Copied!" confirmation. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for non-secure contexts / older browsers.
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    return true;
  } catch {
    return false;
  }
}

export function CopyButton({
  text,
  label = "Copy product name",
  copiedLabel = "Copied!",
  className = "btn-secondary",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (await copyToClipboard(text)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <button
      type="button"
      onClick={handle}
      aria-live="polite"
      className={`${className} transition-colors ${copied ? "!border-sage-300 !text-sage-400" : ""}`}
    >
      {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
      {copied ? copiedLabel : label}
    </button>
  );
}
