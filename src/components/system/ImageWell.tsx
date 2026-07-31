import Image from "next/image";
import type { ReactNode } from "react";

import { cn, cmsMedia } from "@/lib/utils";

/**
 * The design's image slot: a fixed-height `#F1F4F8` well that an image fills.
 *
 * Every CMS image on the site goes through here. `cmsMedia()` normalises the
 * absolute CMS host to a same-origin path (nginx serves /api/media in prod, a
 * dev rewrite in next.config.mjs covers local), which is what lets next/image
 * handle the file instead of the raw <img> tags this replaces.
 *
 * With no `src` it renders the fallback — never a broken image, never a
 * zero-height cell that would collapse the surrounding hairline grid.
 */
export function ImageWell({
  src,
  alt,
  height,
  ratio,
  priority,
  sizes = "(max-width: 768px) 100vw, 50vw",
  fallback,
  fit = "cover",
  className,
  imgClassName,
}: {
  src?: string | null;
  alt: string;
  /** Fixed pixel height, as the design specifies (310, 190, 300…). */
  height?: number;
  /** Or an aspect ratio, e.g. "16 / 10". Ignored when `height` is set. */
  ratio?: string;
  priority?: boolean;
  sizes?: string;
  fallback?: ReactNode;
  fit?: "cover" | "contain";
  className?: string;
  imgClassName?: string;
}) {
  const url = cmsMedia(src);

  return (
    <div
      className={cn("relative overflow-hidden bg-well", className)}
      style={height ? { height } : ratio ? { aspectRatio: ratio } : undefined}
    >
      {url ? (
        <Image
          src={url}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn(fit === "cover" ? "object-cover" : "object-contain", imgClassName)}
        />
      ) : (
        (fallback ?? <WellFallback label={alt} />)
      )}
    </div>
  );
}

/** Initials mark used when a client has no cover image. */
export function WellFallback({ label }: { label: string }) {
  const initials = label
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="ltr-island font-display text-[clamp(32px,6vw,64px)] font-bold text-fgfaint">
        {initials}
      </span>
    </div>
  );
}
