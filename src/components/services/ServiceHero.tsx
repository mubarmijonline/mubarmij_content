import type { Locale } from "@/i18n/config";
import type { ServiceDetail } from "@/lib/v1";
import { localePath } from "@/lib/utils";
import { GhostButton, GoldButton, Reveal, SectionEyebrow } from "@/components/system";

/** Resolve hero banner to a same-origin path (the API returns an absolute URL). */
function bannerPath(url?: string): string | null {
  if (!url) return null;
  try {
    return new URL(url).pathname;
  } catch {
    return url.startsWith("/") ? url : `/${url}`;
  }
}

const UI = {
  en: { book: "Book a free consultation", roi: "Calculate your ROI", work: "View our work", included: "What's included" },
  ar: { book: "احجز استشارة مجانية", roi: "احسب العائد", work: "شاهد أعمالنا", included: "اللي بتتضمنه" },
} as const;

/** v2 service hero — full-bleed banner (hero_image_url) with dark navy overlay, or a dark navy fallback. */
export default function ServiceHero({ locale, service }: { locale: Locale; service: ServiceDetail }) {
  const ui = UI[locale];
  const hasRoi = service.has_roi_calculator;
  const deliverables = service.deliverables ?? [];
  const banner = bannerPath(service.hero_image_url);

  return (
    <section className="relative overflow-hidden bg-navy-deep text-cream">
      {banner ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={banner}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-navy-deep/60" aria-hidden />
          <div
            className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/85 to-navy-deep/20 rtl:bg-gradient-to-l"
            aria-hidden
          />
        </>
      ) : (
        <>
          <div className="bg-hero-grid pointer-events-none absolute inset-0" aria-hidden />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[65%] bg-[radial-gradient(ellipse_70%_100%_at_50%_0%,rgba(30,58,95,0.5),transparent_75%)]"
            aria-hidden
          />
        </>
      )}

      <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-32 md:pb-28 md:pt-40">
        <div className="max-w-2xl">
          {service.tagline ? <SectionEyebrow>{service.tagline}</SectionEyebrow> : null}
          <Reveal as="h1" delay={0.05} className="mt-4 text-balance font-sans text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-cream">
            {service.title}
          </Reveal>
          <Reveal as="p" delay={0.13} className="mt-6 max-w-xl text-lg leading-relaxed text-bodydark">
            {service.intro || service.summary}
          </Reveal>
          <Reveal as="div" delay={0.21} className="mt-8 flex flex-wrap items-center gap-4">
            <GoldButton href={localePath(locale, "/book-call")} size="lg">
              {ui.book}
            </GoldButton>
            {hasRoi ? (
              <GhostButton href="#roi" size="lg">
                {ui.roi}
              </GhostButton>
            ) : (
              <GhostButton href={localePath(locale, "/case-studies")} size="lg">
                {ui.work}
              </GhostButton>
            )}
          </Reveal>

          {!hasRoi && deliverables.length ? (
            <Reveal as="div" delay={0.28} className="mt-10 w-full max-w-xl rounded-tile border border-line bg-navy-deep/70 p-6 backdrop-blur">
              <SectionEyebrow>{ui.included}</SectionEyebrow>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-cream/90">
                    <svg viewBox="0 0 20 20" className="mt-1 h-4 w-4 shrink-0 fill-gold" aria-hidden>
                      <path d="M16.7 5.3a1 1 0 010 1.4l-7 7a1 1 0 01-1.4 0l-3-3a1 1 0 111.4-1.4l2.3 2.29 6.3-6.29a1 1 0 011.4 0z" />
                    </svg>
                    {d}
                  </li>
                ))}
              </ul>
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
