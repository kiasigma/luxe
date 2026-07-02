import { motion } from "framer-motion";
import { useWishlist } from "../context/WishlistContext";
import { HeartIcon } from "./icons";

interface WishlistButtonProps {
  productId: string;
  variant?: "floating" | "inline";
  onToggle?: (saved: boolean) => void;
}

/** Heart toggle with a springy, satisfying tap animation. */
export function WishlistButton({ productId, variant = "floating", onToggle }: WishlistButtonProps) {
  const { isSaved, toggleSaved } = useWishlist();
  const saved = isSaved(productId);

  const handle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaved(productId);
    onToggle?.(!saved);
  };

  const floating =
    "absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/85 backdrop-blur shadow-soft";
  const inline =
    "grid h-12 w-12 place-items-center rounded-full border border-ink/10 bg-white shadow-soft";

  return (
    <motion.button
      type="button"
      onClick={handle}
      whileTap={{ scale: 0.82 }}
      whileHover={{ scale: 1.08 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      aria-pressed={saved}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      className={`${variant === "floating" ? floating : inline} transition-colors duration-200 ${
        saved ? "text-blush-500" : "text-ink-soft hover:text-blush-400"
      }`}
    >
      <motion.span
        key={saved ? "on" : "off"}
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 18 }}
      >
        <HeartIcon className="h-5 w-5" filled={saved} />
      </motion.span>
    </motion.button>
  );
}
