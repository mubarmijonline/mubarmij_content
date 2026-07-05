"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import type { Locale } from "@/i18n/config";
import type { ReelItem } from "@/lib/v1";
import { cmsMedia, localePath } from "@/lib/utils";
import { trackEvent } from "@/lib/v1-client";

const COPY = {
  en: {
    close: "Close",
    prev: "Previous reel",
    next: "Next reel",
    caseStudy: "View case study",
    cta: "Book a consultation",
    counter: (i: number, n: number) => `${i} of ${n}`,
  },
  ar: {
    close: "إغلاق",
    prev: "الريل السابق",
    next: "الريل التالي",
    caseStudy: "شاهد دراسة الحالة",
    cta: "احجز استشارة",
    counter: (i: number, n: number) => `${i} من ${n}`,
  },
} as const;

/** Convert a YouTube/Vimeo watch URL into an autoplay embed src. */
function toEmbedSrc(url: string): string {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (u.pathname.startsWith("/embed/")) return url;
      const id = u.searchParams.get("v") || u.pathname.split("/").filter(Boolean).pop() || "";
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
    }
    if (host === "vimeo.com") {
      const id = u.pathname.split("/").filter(Boolean).pop() || "";
      return `https://player.vimeo.com/video/${id}?autoplay=1`;
    }
    if (host === "player.vimeo.com") return url;
    return url;
  } catch {
    return url;
  }
}

/** Hosted player: native MP4 when available, hls.js (lazy) for HLS streams. */
function HostedPlayer({ reel, onComplete }: { reel: ReelItem; onComplete: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mp4 = cmsMedia(reel.playback?.mp4);
  const hls = reel.playback?.hls || undefined;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || mp4 || !hls) return; // MP4 path is handled declaratively below

    // Safari / iOS play HLS natively.
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hls;
      return;
    }

    let cancelled = false;
    let instance: { destroy: () => void } | null = null;
    import("hls.js")
      .then(({ default: Hls }) => {
        if (cancelled) return;
        if (Hls.isSupported()) {
          const h = new Hls({ enableWorker: true });
          h.loadSource(hls);
          h.attachMedia(video);
          instance = h;
        } else {
          video.src = hls;
        }
      })
      .catch(() => {
        video.src = hls;
      });

    return () => {
      cancelled = true;
      instance?.destroy();
    };
  }, [mp4, hls]);

  return (
    <video
      ref={videoRef}
      src={mp4 || undefined}
      poster={cmsMedia(reel.thumbnail?.url) || undefined}
      controls
      autoPlay
      playsInline
      onEnded={onComplete}
      className="h-full w-full bg-black object-contain"
    />
  );
}

export default function ReelLightbox({
  reels,
  index,
  locale,
  onClose,
  onIndexChange,
}: {
  reels: ReelItem[];
  index: number;
  locale: Locale;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}) {
  const t = COPY[locale];
  const dir = locale === "ar" ? "rtl" : "ltr";
  const isRtl = locale === "ar";
  const dialogRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const reel = reels[index];
  const total = reels.length;

  const goPrev = useCallback(() => {
    onIndexChange((index - 1 + total) % total);
  }, [index, total, onIndexChange]);

  const goNext = useCallback(() => {
    onIndexChange((index + 1) % total);
  }, [index, total, onIndexChange]);

  // Portal target (avoid SSR mismatch).
  useEffect(() => setMounted(true), []);

  // Body scroll lock.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Deep-link: reflect the open reel in the URL (?reel=id) without history spam.
  useEffect(() => {
    if (!reel) return;
    const url = new URL(window.location.href);
    url.searchParams.set("reel", reel.id);
    window.history.replaceState(null, "", url.toString());
    return () => {
      const u = new URL(window.location.href);
      u.searchParams.delete("reel");
      window.history.replaceState(null, "", u.toString());
    };
  }, [reel]);

  // Analytics: a play impression per opened reel.
  useEffect(() => {
    if (!reel) return;
    trackEvent({ event: "reel_play", reelId: reel.id, locale });
  }, [reel, locale]);

  // Keyboard: Esc closes, arrows navigate (RTL-aware), Tab is trapped.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (isRtl) goPrev();
        else goNext();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (isRtl) goNext();
        else goPrev();
        return;
      }
      if (e.key === "Tab") {
        const root = dialogRef.current;
        if (!root) return;
        const focusable = root.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),video,iframe,[tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, goPrev, goNext, isRtl]);

  // Move focus into the dialog on open.
  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  const onCta = useCallback(() => {
    if (reel) trackEvent({ event: "reel_cta_click", reelId: reel.id, locale });
  }, [reel, locale]);

  if (!mounted || !reel) return null;

  return createPortal(
    <div
      dir={dir}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-deep/90 p-4 backdrop-blur-sm md:p-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label={t.close}
        className="absolute end-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-panel/80 text-cream transition-colors hover:bg-panel focus-gold"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-none stroke-current stroke-2">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>

      {/* Prev */}
      {total > 1 ? (
        <button
          type="button"
          onClick={goPrev}
          aria-label={t.prev}
          className="absolute start-2 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-panel/80 text-cream transition-colors hover:bg-panel focus-gold md:flex"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-none stroke-current stroke-2 rtl:-scale-x-100">
            <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ) : null}

      {/* Next */}
      {total > 1 ? (
        <button
          type="button"
          onClick={goNext}
          aria-label={t.next}
          className="absolute end-2 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-panel/80 text-cream transition-colors hover:bg-panel focus-gold md:flex"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-none stroke-current stroke-2 rtl:-scale-x-100">
            <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      ) : null}

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={reel.title}
        tabIndex={-1}
        className="flex max-h-full w-full max-w-sm flex-col overflow-hidden rounded-tile border border-line bg-panel shadow-2xl outline-none"
      >
        <div className="relative aspect-[9/16] w-full shrink-0 bg-black">
          {reel.source === "embed" && reel.embedUrl ? (
            <iframe
              key={reel.id}
              src={toEmbedSrc(reel.embedUrl)}
              title={reel.title}
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
              className="h-full w-full"
            />
          ) : (
            <HostedPlayer
              key={reel.id}
              reel={reel}
              onComplete={() => trackEvent({ event: "reel_complete", reelId: reel.id, locale })}
            />
          )}
        </div>

        <div className="flex flex-col gap-3 p-5">
          <div className="flex items-center justify-between gap-3">
            {reel.client?.name ? (
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-gold-dim">
                {reel.client.name}
              </span>
            ) : (
              <span />
            )}
            {total > 1 ? (
              <span className="font-mono text-[11px] text-bodydark">{t.counter(index + 1, total)}</span>
            ) : null}
          </div>

          <h2 className="text-lg font-medium text-cream">{reel.title}</h2>
          {reel.description ? <p className="text-sm text-bodydark">{reel.description}</p> : null}

          <div className="mt-1 flex flex-wrap items-center gap-3">
            <a
              href={localePath(locale, "/book-call")}
              onClick={onCta}
              className="inline-flex items-center justify-center rounded-pill bg-gold px-5 py-2.5 text-sm font-medium text-gold-ink transition-colors hover:bg-gold-light focus-gold"
            >
              {t.cta}
            </a>
            {reel.client?.slug ? (
              <a
                href={localePath(locale, `/case-studies/${reel.client.slug}`)}
                onClick={onCta}
                className="inline-flex items-center justify-center rounded-pill border border-line px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:border-gold/60 focus-gold"
              >
                {t.caseStudy}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
