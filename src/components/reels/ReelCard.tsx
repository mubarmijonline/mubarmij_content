"use client";

import type { Locale } from "@/i18n/config";
import type { ReelItem } from "@/lib/v1";
import { cmsMedia } from "@/lib/utils";

const COPY = {
  en: { play: "Play reel", watch: "Watch" },
  ar: { play: "تشغيل الريل", watch: "شاهد" },
} as const;

const CATEGORY_LABEL: Record<string, { en: string; ar: string }> = {
  automation: { en: "Automation", ar: "أتمتة" },
  web: { en: "Web", ar: "ويب" },
  mobile: { en: "Mobile", ar: "موبايل" },
  "behind-the-scenes": { en: "Behind the scenes", ar: "من الكواليس" },
};

function fmtDuration(seconds?: number): string | null {
  if (!seconds || seconds <= 0) return null;
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** P-Reels — a single 9:16 video card. Opens the lightbox on click/Enter. */
export default function ReelCard({
  reel,
  index,
  locale,
  onOpen,
}: {
  reel: ReelItem;
  index: number;
  locale: Locale;
  onOpen: (index: number) => void;
}) {
  const t = COPY[locale];
  const thumb = cmsMedia(reel.thumbnail?.url);
  const duration = fmtDuration(reel.durationSeconds);
  const category = CATEGORY_LABEL[reel.category]?.[locale] ?? reel.category;

  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`${t.play}: ${reel.title}`}
      className="group relative block w-[230px] shrink-0 snap-start overflow-hidden rounded-tile border border-line bg-panel text-start shadow-sm transition-transform duration-200 hover:-translate-y-1 focus-gold md:w-[260px]"
    >
      <div className="relative aspect-[9/16] overflow-hidden bg-navy">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt={reel.thumbnail?.alt || reel.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}

        {/* Gradient scrim for legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/10 to-transparent" />

        {/* Play affordance */}
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream/95 text-navy-deep shadow-lg backdrop-blur transition-transform duration-200 group-hover:scale-110">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="ms-1 h-6 w-6 fill-current">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>

        {/* Duration badge */}
        {duration ? (
          <span className="absolute bottom-3 end-3 rounded-pill bg-navy-deep/80 px-2 py-0.5 font-mono text-[11px] font-medium text-cream backdrop-blur">
            {duration}
          </span>
        ) : null}

        {/* Category eyebrow */}
        <span className="absolute top-3 start-3 font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-gold-light">
          {category}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3 className="line-clamp-2 text-sm font-medium text-cream">{reel.title}</h3>
        {reel.client?.name ? (
          <p className="mt-1 text-xs text-bodydark">{reel.client.name}</p>
        ) : null}
      </div>
    </button>
  );
}
