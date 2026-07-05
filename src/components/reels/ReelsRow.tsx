"use client";

import { useEffect, useState } from "react";

import type { Locale } from "@/i18n/config";
import type { ReelItem } from "@/lib/v1";
import { localePath } from "@/lib/utils";
import { GhostButton, Reveal, SectionEyebrow } from "@/components/system";

import ReelCard from "./ReelCard";
import ReelLightbox from "./ReelLightbox";

const COPY = {
  en: {
    eyebrow: "Watch the work",
    title: "Reels from the workshop",
    subtitle: "Short clips of automations, apps, and builds — straight from real projects.",
    all: "See all reels",
  },
  ar: {
    eyebrow: "شوف الشغل",
    title: "ريلز من الورشة",
    subtitle: "مقاطع قصيرة لأتمتة وتطبيقات وأنظمة — من مشاريع حقيقية.",
    all: "كل الريلز",
  },
} as const;

/**
 * P-Reels — dark scroll-snap row of vertical reels with a deep-linkable lightbox.
 * `showAll` reveals a "See all reels" link (used on the homepage, hidden on /reels).
 */
export default function ReelsRow({
  locale,
  reels,
  showAll = false,
  hideHeader = false,
}: {
  locale: Locale;
  reels: ReelItem[];
  showAll?: boolean;
  hideHeader?: boolean;
}) {
  const [active, setActive] = useState<number | null>(null);
  const t = COPY[locale];
  const dir = locale === "ar" ? "rtl" : "ltr";

  // Open the lightbox from a ?reel=<id> deep link on first paint.
  useEffect(() => {
    if (!reels.length) return;
    const id = new URLSearchParams(window.location.search).get("reel");
    if (!id) return;
    const idx = reels.findIndex((r) => r.id === id);
    if (idx >= 0) setActive(idx);
  }, [reels]);

  if (!reels.length) return null;

  return (
    <section className={`bg-navy-deep px-4 ${hideHeader ? "pb-20 md:pb-28" : "py-20 md:py-28"}`}>
      <div className="mx-auto max-w-6xl">
        {hideHeader ? null : (
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <SectionEyebrow>{t.eyebrow}</SectionEyebrow>
              <h2 className="mt-3 text-balance font-sans text-3xl font-semibold tracking-[-0.02em] text-cream md:text-4xl">
                {t.title}
              </h2>
              <p className="mt-4 text-pretty text-bodydark">{t.subtitle}</p>
            </div>
            {showAll ? (
              <GhostButton href={localePath(locale, "/reels")} className="hidden md:inline-flex">
                {t.all}
              </GhostButton>
            ) : null}
          </Reveal>
        )}

        <div className={`snap-row pb-2 ${hideHeader ? "" : "mt-10"}`} dir={dir}>
          {reels.map((reel, i) => (
            <ReelCard key={reel.id} reel={reel} index={i} locale={locale} onOpen={setActive} />
          ))}
        </div>
      </div>

      {active !== null ? (
        <ReelLightbox
          reels={reels}
          index={active}
          locale={locale}
          onClose={() => setActive(null)}
          onIndexChange={setActive}
        />
      ) : null}
    </section>
  );
}
