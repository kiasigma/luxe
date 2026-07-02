import { useState } from "react";

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  /** Optional pastel gradient shown if the image fails to load. */
  fallbackClass?: string;
  /** Tried if `src` fails to load (e.g. favicon fallback for a missing logo). */
  fallbackSrc?: string;
  /**
   * Logo mode: shows the company logo centred on a clean white card
   * (object-contain), rather than filling the frame (object-cover).
   */
  contain?: boolean;
}

/**
 * Image with a skeleton placeholder and a smooth fade-in once loaded. Tries
 * `src`, then `fallbackSrc`, then a soft pastel gradient.
 */
export function SmartImage({ src, alt, className = "", fallbackClass, fallbackSrc, contain = false }: SmartImageProps) {
  const sources = fallbackSrc ? [src, fallbackSrc] : [src];
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const onError = () => {
    if (index < sources.length - 1) {
      setIndex(index + 1);
      setLoaded(false);
    } else {
      setError(true);
    }
  };

  // A provided high-res logo (first source) can sit larger; the favicon
  // fallback stays a touch smaller to remain crisp.
  const logoSize = index === 0 && fallbackSrc ? "max-h-[74%] max-w-[74%]" : "max-h-[58%] max-w-[58%]";

  return (
    <div
      className={`relative h-full w-full overflow-hidden ${
        contain ? "flex items-center justify-center bg-white" : ""
      } ${className}`}
    >
      {!loaded && !error && <div className="skeleton absolute inset-0" />}
      {error ? (
        <div
          className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-blush-50 via-lilac-50 to-sage-50 ${
            fallbackClass ?? ""
          }`}
        >
          <span className="font-display text-2xl italic text-ink-muted/50">Luxe</span>
        </div>
      ) : contain ? (
        <img
          key={index}
          src={sources[index]}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={onError}
          className={`${logoSize} object-contain transition-all duration-700 ease-silk ${
            loaded ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        />
      ) : (
        <img
          key={index}
          src={sources[index]}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={onError}
          className={`h-full w-full object-cover transition-all duration-700 ease-silk ${
            loaded ? "scale-100 opacity-100" : "scale-105 opacity-0"
          }`}
        />
      )}
    </div>
  );
}
