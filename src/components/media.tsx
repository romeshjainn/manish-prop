import Image from "next/image";
import type { MediaImage } from "@/lib/types";

/**
 * Shown when a listing or project has no photograph yet: a quiet
 * architectural line drawing rather than a broken image.
 */
export function ImageFallback({ label, className = "" }: { label?: string; className?: string }) {
  return (
    <div
      className={`relative flex size-full items-center justify-center overflow-hidden bg-paper-2 ${className}`}
      role="img"
      aria-label={label ? `${label} — photograph coming soon` : "Photograph coming soon"}
    >
      <svg viewBox="0 0 200 120" className="absolute inset-0 size-full text-line-strong" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <g fill="none" stroke="currentColor" strokeWidth="0.6">
          <path d="M30 100V55l35-25 35 25v45M100 100V40h50v60M150 100V65h25v35" />
          <path d="M10 100h180" />
          <path d="M48 100V75h14v25M112 52h10v10h-10zM130 52h10v10h-10zM112 72h10v10h-10zM130 72h10v10h-10zM158 74h9v9h-9z" />
        </g>
      </svg>
      <span className="relative mt-16 text-xs font-medium uppercase tracking-[0.16em] text-muted">Photo coming soon</span>
    </div>
  );
}

/** Small marker so preview photography is never mistaken for a real project. */
export function IllustrativeTag({ className = "" }: { className?: string }) {
  return (
    <span
      className={`pointer-events-none absolute rounded-[2px] bg-ink/70 px-1.5 py-0.5 text-[0.625rem] font-medium uppercase tracking-[0.12em] text-paper ${className}`}
    >
      Illustrative image
    </span>
  );
}

export function CoverImage({
  image,
  sizes,
  priority = false,
  label,
  className = "",
  imgClassName = "",
  tagPosition = "bottom-2 right-2",
}: {
  image?: MediaImage;
  sizes: string;
  priority?: boolean;
  label?: string;
  className?: string;
  imgClassName?: string;
  tagPosition?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-paper-2 ${className}`}>
      {image ? (
        <>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes={sizes}
            priority={priority}
            className={`object-cover ${imgClassName}`}
          />
          {image.kind === "illustrative" && <IllustrativeTag className={tagPosition} />}
        </>
      ) : (
        <ImageFallback label={label} />
      )}
    </div>
  );
}
