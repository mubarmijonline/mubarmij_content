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

/**
 * Hosted player: native MP4 when available, hls.js (lazy) for HLS streams.
 *
 * Deliberately not `controls`. The native bar is a full-width desktop chrome
 * strip pinned across the bottom of a 9:16 video — it covered the caption and
 * looked bolted on. This exposes only what a reel needs: tap to play/pause, a
 * mute toggle, and a progress line, all as overlays the caption can sit above.
 */
function HostedPlayer({
  reel,
  onComplete,
  children,
}: {
  reel: ReelItem;
  onComplete: () => void;
  /** Caption overlay, rendered above the controls. */
  children?: React.ReactNode;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mp4 = cmsMedia(reel.playback?.mp4);
  const hls = reel.playback?.hls || undefined;

  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [waiting, setWaiting] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || mp4 || !hls) return; // MP4 path is handled declaratively below

    let instance: { destroy: () => void } | undefined;
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = hls;
      return;
    }
    let cancelled = false;
    import("hls.js")
      .then(({ default: Hls }) => {
        if (cancelled) return;
        if (Hls.isSupported()) {
          const h = new Hls({ enableWorker: true });
          instance = h;
          h.loadSource(hls);
          h.attachMedia(video);
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

  const toggle = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  }, []);

  return (
    <div className="group relative h-full w-full bg-black">
      <video
        ref={videoRef}
        src={mp4 || undefined}
        poster={cmsMedia(reel.thumbnail?.url) || undefined}
        // metadata, not auto: the poster carries the first paint and the file
        // only streams what playback actually needs.
        preload="metadata"
        autoPlay
        playsInline
        onEnded={onComplete}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onWaiting={() => setWaiting(true)}
        onPlaying={() => setWaiting(false)}
        onCanPlay={() => setWaiting(false)}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          if (v.duration) setProgress((v.currentTime / v.duration) * 100);
        }}
        className="h-full w-full bg-black object-contain"
      />

      {/* Tap surface. A button so it is keyboard reachable. */}
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause" : "Play"}
        className="absolute inset-0 flex items-center justify-center focus-gold"
      >
        {!playing ? (
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg backdrop-blur">
            <svg viewBox="0 0 24 24" aria-hidden="true" className="ms-1 h-7 w-7 fill-current">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        ) : null}
      </button>

      {waiting && playing ? (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="h-9 w-9 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        </span>
      ) : null}

      {/* Caption sits above the controls, inside the same gradient. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent pt-16">
        <div className="pointer-events-auto px-4 pb-3">{children}</div>

        <div className="flex items-center gap-3 px-4 pb-4">
          <button
            type="button"
            onClick={() => {
              const v = videoRef.current;
              if (!v) return;
              v.muted = !v.muted;
              setMuted(v.muted);
            }}
            aria-label={muted ? "Unmute" : "Mute"}
            className="pointer-events-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25 focus-gold"
          >
            {muted ? (
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.6 3l2.7-2.7-1.4-1.4L15.2 10.6 12.5 7.9l-1.4 1.4 2.7 2.7-2.7 2.7 1.4 1.4 2.7-2.7 2.7 2.7 1.4-1.4-2.7-2.7z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05A4.47 4.47 0 0 0 16.5 12zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            )}
          </button>

          <span className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/25">
            <span
              className="block h-full rounded-full bg-white transition-[width] duration-200"
              style={{ width: `${progress}%` }}
            />
          </span>
        </div>
      </div>
    </div>
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm md:p-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label={t.close}
        className="absolute end-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-hair bg-well/80 text-fg transition-colors hover:bg-well focus-gold"
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
          className="absolute start-2 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-hair bg-well/80 text-fg transition-colors hover:bg-well focus-gold md:flex"
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
          className="absolute end-2 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-hair bg-well/80 text-fg transition-colors hover:bg-well focus-gold md:flex"
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
        // The video is the surface. Height-first so a portrait reel fills the
        // screen instead of sitting in a card with a text panel bolted below,
        // which is what pushed the caption off-screen on a phone.
        className="relative aspect-[9/16] max-h-[86vh] w-auto max-w-[min(94vw,430px)] overflow-hidden rounded-card bg-black shadow-2xl outline-none"
      >
        {reel.source === "embed" && reel.embedUrl ? (
          <>
            <iframe
              key={reel.id}
              src={toEmbedSrc(reel.embedUrl)}
              title={reel.title}
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
              className="h-full w-full"
            />
            <Caption
              reel={reel}
              locale={locale}
              t={t}
              index={index}
              total={total}
              onCta={onCta}
            />
          </>
        ) : (
          <HostedPlayer
            key={reel.id}
            reel={reel}
            onComplete={() => trackEvent({ event: "reel_complete", reelId: reel.id, locale })}
          >
            <Caption
              reel={reel}
              locale={locale}
              t={t}
              index={index}
              total={total}
              onCta={onCta}
            />
          </HostedPlayer>
        )}
      </div>
    </div>,
    document.body,
  );
}

/** Title, client and actions, laid over the video rather than beneath it. */
function Caption({
  reel,
  locale,
  t,
  index,
  total,
  onCta,
}: {
  reel: ReelItem;
  locale: Locale;
  t: (typeof COPY)[Locale];
  index: number;
  total: number;
  onCta: () => void;
}) {
  return (
    <div className="text-white">
      <div className="flex items-center justify-between gap-3">
        {reel.client?.name ? (
          <span className="mono text-[10.5px] uppercase text-gold">{reel.client.name}</span>
        ) : (
          <span />
        )}
        {total > 1 ? (
          <span className="mono ltr-island text-[10.5px] text-white/70">
            {t.counter(index + 1, total)}
          </span>
        ) : null}
      </div>

      <h2 className="mt-1.5 font-display text-[17px] font-semibold leading-snug">{reel.title}</h2>
      {reel.description ? (
        <p className="mt-1 line-clamp-2 text-[13.5px] leading-relaxed text-white/75">
          {reel.description}
        </p>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <a
          href={localePath(locale, "/book-call")}
          onClick={onCta}
          className="focus-gold inline-flex items-center rounded-btn bg-white px-4 py-2 font-display text-[13.5px] font-semibold text-ink transition-colors hover:bg-gold"
        >
          {t.cta}
        </a>
        {reel.client?.slug ? (
          <a
            href={localePath(locale, `/case-studies/${reel.client.slug}`)}
            onClick={onCta}
            className="focus-gold inline-flex items-center rounded-btn border border-white/35 px-4 py-2 font-display text-[13.5px] font-semibold text-white transition-colors hover:border-white"
          >
            {t.caseStudy}
          </a>
        ) : null}
      </div>
    </div>
  );
}
