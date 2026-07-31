import type { Locale } from "@/i18n/config";
import type { ServiceDetail } from "@/lib/v1";
import { localePath } from "@/lib/utils";
import {
  DarkButton,
  GhostButton,
  ImageWell,
  SectionEyebrow,
  Shell,
  SlashList,
  StatCell,
} from "@/components/system";
import { GoldPeriod } from "@/components/system/Typo";

/** The API returns absolute banner URLs; reduce to a same-origin path. */
function bannerPath(url?: string): string | null {
  if (!url) return null;
  try {
    return new URL(url).pathname;
  } catch {
    return url.startsWith("/") ? url : `/${url}`;
  }
}

const UI = {
  en: {
    book: "Book a free consultation",
    roi: "Calculate your ROI",
    work: "View our work",
    included: "What's included",
    timeline: "Timeline",
  },
  ar: {
    book: "احجز استشارة مجانية",
    roi: "احسب العائد",
    work: "شاهد أعمالنا",
    included: "اللي بيتسلّم",
    timeline: "المدة",
  },
} as const;

export default function ServiceHero({ locale, service }: { locale: Locale; service: ServiceDetail }) {
  const ui = UI[locale];
  const hasRoi = service.has_roi_calculator;
  const deliverables = service.deliverables ?? [];
  const banner = bannerPath(service.hero_image_url);

  return (
    <section className="surf-light border-b border-hair">
      <Shell className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
        <div className="animate-rise border-hair py-14 lg:border-e lg:py-16 lg:pe-12">
          {service.tagline ? <SectionEyebrow>{service.tagline}</SectionEyebrow> : null}
          <h1 className="mt-3.5 text-balance font-display text-d1 font-bold text-fg">
            {service.title}
            <GoldPeriod />
          </h1>
          <p className="mt-5 max-w-[32em] text-lede text-fgbody">
            {service.intro || service.summary}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <DarkButton size="lg" href={localePath(locale, "/book-call")}>
              {ui.book}
            </DarkButton>
            {hasRoi ? (
              <GhostButton size="lg" href="#roi">
                {ui.roi}
              </GhostButton>
            ) : (
              <GhostButton size="lg" href={localePath(locale, "/case-studies")}>
                {ui.work}
              </GhostButton>
            )}
          </div>

          {service.duration ? (
            <div className="mt-12 border-t border-hair pt-6">
              <StatCell kind="text" value={service.duration} label={ui.timeline} />
            </div>
          ) : null}
        </div>

        <div className="py-14 lg:ps-12 lg:pt-16">
          {banner ? (
            <div className="overflow-hidden rounded-card border border-hair">
              <ImageWell
                src={banner}
                alt=""
                height={230}
                priority
                sizes="(max-width: 1024px) 100vw, 520px"
              />
            </div>
          ) : null}

          {deliverables.length ? (
            <div className={banner ? "mt-8" : ""}>
              <div className="mono text-eyebrow uppercase text-accent">{ui.included}</div>
              <SlashList className="mt-4" items={deliverables} />
            </div>
          ) : null}
        </div>
      </Shell>
    </section>
  );
}
