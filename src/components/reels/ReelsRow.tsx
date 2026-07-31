"use client";

import { useEffect, useState } from "react";

import type { Locale } from "@/i18n/config";
import type { ReelItem } from "@/lib/v1";
import { localePath } from "@/lib/utils";
import { SectionEyebrow, Shell } from "@/components/system";
import { GoldPeriod, LinkArrow } from "@/components/system/Typo";

import ReelCard from "./ReelCard";
import ReelLightbox from "./ReelLightbox";

const COPY = {
  en: {
    eyebrow: "In motion",
    title: "The work, playing",
    subtitle: "Short clips of the storefronts, apps and automations we've shipped — from real client projects.",
    all: "All reels",
  },
  ar: {
    eyebrow: "شغل متحرك",
    title: "الشغل وهو شغّال",
    subtitle: "مقاطع قصيرة للمتاجر والتطبيقات والأنظمة اللي سلّمناها — من مشاريع عملاء حقيقية.",
    all: "كل الريلز",
  },
} as const;

/**
 * Scroll-snap row of vertical reels with a deep-linkable lightbox.
 * `hideHeader` is used by /reels, which supplies its own page header.
 */
export default function ReelsRow({
  locale,
  reels,
  index,
  showAll = false,
  hideHeader = false,
}: {
  locale: Locale;
  reels: ReelItem[];
  index?: string;
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
    <section className={hideHeader ? "surf-light pb-16" : "surf-light border-b border-hair"}>
      <Shell className={hideHeader ? "" : "sect"}>
        {hideHeader ? null : (
          <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-5">
            <div className="min-w-0 max-w-2xl">
              <SectionEyebrow index={index}>{t.eyebrow}</SectionEyebrow>
              <h2 className="mt-3.5 font-display text-d2 font-bold text-fg">
                {t.title}
                <GoldPeriod />
              </h2>
              <p className="mt-4 text-copy text-fgbody">{t.subtitle}</p>
            </div>
            {showAll ? (
              <LinkArrow href={localePath(locale, "/reels")} locale={locale}>
                {t.all}
              </LinkArrow>
            ) : null}
          </div>
        )}

        <div className={`snap-row pb-2 ${hideHeader ? "" : "mt-10"}`} dir={dir}>
          {reels.map((reel, i) => (
            <ReelCard key={reel.id} reel={reel} index={i} locale={locale} onOpen={setActive} />
          ))}
        </div>
      </Shell>

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
