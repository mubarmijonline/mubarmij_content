"use client";

import { useState } from "react";

import type { Locale } from "@/i18n/config";
import type { ReelItem } from "@/lib/v1";
import { cmsMedia } from "@/lib/utils";

const COPY = {
  en: { play: "Play reel", watch: "Watch the reel" },
  ar: { play: "تشغيل الريل", watch: "شاهد الريل" },
} as const;

/**
 * A single featured 9:16 reel that plays inline (object-contain, so the full
 * vertical video is shown — never cropped). Poster → click → autoplaying video.
 */
export default function FeaturedReel({ reel, locale }: { reel: ReelItem; locale: Locale }) {
  const [playing, setPlaying] = useState(false);
  const t = COPY[locale];
  const poster = cmsMedia(reel.thumbnail?.url);
  const mp4 = reel.playback?.mp4 ? cmsMedia(reel.playback.mp4) : undefined;

  return (
    <div className="relative w-full max-w-[280px] overflow-hidden rounded-tile border border-line bg-navy-deep shadow-xl">
      <div className="relative aspect-[9/16]">
        {playing && mp4 ? (
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
            src={mp4}
            poster={poster}
            controls
            autoPlay
            playsInline
            className="h-full w-full bg-navy-deep object-contain"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`${t.play}: ${reel.title}`}
            className="group block h-full w-full"
          >
            {poster ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={poster} alt={reel.thumbnail?.alt || reel.title} className="h-full w-full object-cover" />
            ) : null}
            <span className="absolute inset-0 bg-gradient-to-t from-navy-deep/70 via-transparent to-transparent" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cream/95 text-navy-deep shadow-lg transition-transform duration-200 group-hover:scale-110">
                <svg viewBox="0 0 24 24" aria-hidden="true" className="ms-1 h-7 w-7 fill-current">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
