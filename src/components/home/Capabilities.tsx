import type { Locale } from "@/i18n/config";
import type { ServiceSummary } from "@/lib/v1";
import { Shell, SectionEyebrow, SpecRow } from "@/components/system";
import { GoldPeriod } from "@/components/system/Typo";

const COPY = {
  en: {
    eyebrow: "Capabilities",
    title: "One partner for every layer of the product",
    lede: "Most companies stitch together a designer, a developer and someone for ads. We own the storefront, the app and the operations behind them — and the result.",
    pullTitle: "Design, build, deploy — and run.",
    pullBody:
      "Including the servers. We deploy behind our own hardened Nginx, so speed and uptime stay our responsibility, not your host's.",
  },
  ar: {
    eyebrow: "إمكانياتنا",
    title: "شريك واحد لكل طبقة في المنتج",
    lede: "أغلب الشركات بتجمّع مصمم ومبرمج وحد تاني للإعلانات. إحنا بنمتلك المتجر والتطبيق والعمليات اللي وراهم — والنتيجة كمان.",
    pullTitle: "تصميم، بناء، نشر — وتشغيل.",
    pullBody:
      "بما فيها السيرفرات. بننشر خلف Nginx مؤمّن بتاعنا، فالسرعة والاستقرار يفضلوا مسؤوليتنا مش مسؤولية شركة الاستضافة.",
  },
} as const;

/**
 * The capability rows are the real service catalogue, so adding or reordering
 * a service in the CMS changes this section. `duration` is optional — an
 * absent value leaves the meta cell empty rather than dropping the row.
 */
export default function Capabilities({
  locale,
  index,
  services,
}: {
  locale: Locale;
  index: string;
  services: ServiceSummary[];
}) {
  if (!services.length) return null;
  const t = COPY[locale];

  return (
    <section className="surf-light border-b border-hair">
      <Shell className="grid grid-cols-1 lg:grid-cols-[1fr_1.25fr]">
        <div className="border-hair py-16 lg:border-e lg:pe-10">
          <div className="sticky top-[calc(var(--hdr-h)+24px)]">
            <SectionEyebrow index={index}>{t.eyebrow}</SectionEyebrow>
            <h2 className="mt-3.5 font-display text-d2 font-bold text-fg">
              {t.title}
              <GoldPeriod />
            </h2>
            <p className="mt-4 text-[16.5px] leading-relaxed text-fgbody">{t.lede}</p>

            <div className="mt-7 border-s-[3px] border-gold ps-4">
              <div className="font-display text-[17px] font-semibold text-fg">{t.pullTitle}</div>
              <p className="mt-1.5 text-[15px] leading-relaxed text-fgbody">{t.pullBody}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:ps-12">
          {services.map((s, i) => (
            <SpecRow
              key={s.slug}
              title={s.title}
              meta={s.duration ?? null}
              chips={s.deliverables?.slice(0, 4)}
              className={i < services.length - 1 ? "border-b border-hair py-8" : "py-8"}
            >
              {s.summary}
            </SpecRow>
          ))}
        </div>
      </Shell>
    </section>
  );
}
