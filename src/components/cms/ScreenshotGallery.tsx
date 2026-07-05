"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

export type Shot = {
  src: string;
  alt: string;
  caption?: string;
  /** Original pixel width of the source image, when known. */
  width?: number;
  /** Original pixel height of the source image, when known. */
  height?: number;
};

/** A shot is treated as "portrait" (mobile) when it's noticeably taller than wide. */
function isPortrait(shot: Shot): boolean {
  if (!shot.width || !shot.height) return false;
  return shot.height / shot.width > 1.15;
}

export default function ScreenshotGallery({ shots }: { shots: Shot[] }) {
  const [active, setActive] = useState<number | null>(null);

  // Pick a single layout per gallery so all tiles align nicely. If most
  // images are portrait phone screenshots, switch to a tighter 4-up grid
  // with portrait tiles. Otherwise keep the spacious 2-up landscape grid.
  const allPortrait = useMemo(() => {
    if (!shots || shots.length === 0) return false;
    const portraitCount = shots.filter(isPortrait).length;
    return portraitCount / shots.length >= 0.6;
  }, [shots]);

  if (!shots || shots.length === 0) return null;

  const gridClass = allPortrait
    ? "grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
    : "grid gap-5 md:gap-6 sm:grid-cols-2";

  const tileAspect = allPortrait ? "aspect-[9/16]" : "aspect-[4/3]";
  const objectFit = allPortrait ? "object-cover" : "object-contain p-3";

  return (
    <>
      <div className={gridClass}>
        {shots.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            title={s.caption || s.alt}
            className={`group relative block w-full ${tileAspect} overflow-hidden rounded-2xl border border-bglight bg-gradient-to-br from-bglight to-white focus:outline-none focus-visible:ring-2 focus-visible:ring-gold shadow-sm hover:shadow-xl transition-shadow`}
          >
            <Image
              src={s.src}
              alt={s.alt}
              fill
              className={`${objectFit} transition-transform duration-300 group-hover:scale-[1.03]`}
              sizes={
                allPortrait
                  ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  : "(max-width: 640px) 100vw, 50vw"
              }
              unoptimized={s.src.startsWith("/api/")}
            />
            {s.caption && (
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deep/85 to-transparent text-left text-white text-sm font-semibold p-3">
                {s.caption}
              </span>
            )}
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Screenshot preview"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-deep/90 backdrop-blur-sm p-4"
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            aria-label="Close preview"
            className="absolute top-4 right-4 inline-flex w-10 h-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white"
            onClick={() => setActive(null)}
          >
            <X size={20} />
          </button>
          <div
            className="relative w-[96vw] h-[90vh] max-w-[1600px]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={shots[active].src}
              alt={shots[active].alt}
              fill
              className="object-contain"
              sizes="100vw"
              unoptimized={shots[active].src.startsWith("/api/")}
            />
          </div>
          {shots[active].caption && (
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/90 text-sm md:text-base font-semibold bg-navy-deep/70 rounded-full px-4 py-1.5">
              {shots[active].caption}
            </p>
          )}
        </div>
      )}
    </>
  );
}
