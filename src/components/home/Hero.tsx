import type { Locale } from "@/i18n/config";
import { localePath } from "@/lib/utils";
import {
  AutomationLog,
  GhostButton,
  GoldButton,
  Reveal,
  SectionEyebrow,
} from "@/components/system";
import HeroHeadline from "./HeroHeadline";

const COPY = {
  en: {
    badge: "50+ companies automated",
    h1a: "We build systems that work for you,",
    h1b: "and websites that bring you clients.",
    sub: "One technical partner for automation, web, and mobile — built to save you hours and win you customers.",
    cta: "Book a free consultation",
    secondary: "View our work",
  },
  ar: {
    badge: "أكثر من 50 شركة موتمتة",
    h1a: "بنبني أنظمة بتشتغل مكانك،",
    h1b: "ومواقع بتجيبلك عملاء.",
    sub: "شريك تقني واحد للأتمتة والمواقع والتطبيقات — يوفّر وقتك ويكسبك عملاء.",
    cta: "احجز استشارة مجانية",
    secondary: "شاهد أعمالنا",
  },
} as const;

/** P1 §1 — navy gradient hero with grid overlay, gold-accented headline, AutomationLog. */
export default function Hero({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  return (
    <section className="relative overflow-hidden bg-navy-deep text-cream">
      <div className="bg-hero-grid pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="hero-parallax pointer-events-none absolute inset-x-0 top-0 h-[65%] bg-[radial-gradient(ellipse_70%_100%_at_50%_0%,rgba(30,58,95,0.5),transparent_75%)]"
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pb-10 pt-32 md:pb-12 md:pt-40 lg:grid-cols-2">
        <div>
          <Reveal as="div" delay={0}>
            <span className="inline-flex items-center gap-2 rounded-pill border border-line bg-panel/60 px-3 py-1.5 font-mono text-xs text-bodydark">
              <span className="h-2 w-2 rounded-full bg-gold" aria-hidden />
              {t.badge}
            </span>
          </Reveal>
          <Reveal as="div" delay={0.08} className="mt-6">
            <HeroHeadline firstLine={t.h1a} secondLine={t.h1b} />
          </Reveal>
          <Reveal as="p" delay={0.16} className="mt-6 max-w-xl text-lg leading-relaxed text-bodydark">
            {t.sub}
          </Reveal>
          <Reveal as="div" delay={0.24} className="mt-8 flex flex-wrap items-center gap-4">
            <GoldButton href={localePath(locale, "/book-call")} size="lg">
              {t.cta}
            </GoldButton>
            <GhostButton href={localePath(locale, "/case-studies")} size="lg">
              {t.secondary}
            </GhostButton>
          </Reveal>
        </div>
        <Reveal as="div" delay={0.2} className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md">
            <SectionEyebrow className="mb-3 ms-1">automation.live</SectionEyebrow>
            <AutomationLog startDelay={600} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
