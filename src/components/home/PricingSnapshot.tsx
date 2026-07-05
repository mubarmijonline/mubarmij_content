import type { Locale } from "@/i18n/config";
import { localePath } from "@/lib/utils";
import { GhostButton, GoldButton, Reveal, SectionEyebrow, Stagger, StaggerItem } from "@/components/system";

const COPY = {
  en: {
    eyebrow: "Pricing",
    title: "Simple plans, scoped to your goals",
    popular: "Most requested",
    seeAll: "See full pricing",
    choose: "Choose",
    getQuote: "Get a quote",
    tiers: [
      {
        name: "Launch",
        desc: "A website that turns visitors into leads.",
        features: ["Landing or multi-page site", "Mobile-first & fast", "SEO & analytics foundations"],
      },
      {
        name: "Automate",
        desc: "Put your busywork on autopilot.",
        features: ["Lead capture → CRM", "WhatsApp follow-ups", "Invoices, reports & integrations"],
      },
      {
        name: "Partner",
        desc: "Web, apps, and automation from one team.",
        features: ["Everything in Launch", "Mobile app (iOS & Android)", "Priority support & maintenance"],
      },
    ],
  },
  ar: {
    eyebrow: "الأسعار",
    title: "باقات بسيطة، مفصّلة على أهدافك",
    popular: "الأكثر طلبًا",
    seeAll: "كل تفاصيل الأسعار",
    choose: "اختر",
    getQuote: "اطلب عرض سعر",
    tiers: [
      {
        name: "الانطلاق",
        desc: "موقع بيحوّل الزوار لعملاء محتملين.",
        features: ["لاندنج أو موقع متعدد الصفحات", "سريع ومتجاوب مع الموبايل", "أساسيات SEO والتحليلات"],
      },
      {
        name: "الأتمتة",
        desc: "حطّ شغلك الروتيني على الطيار الآلي.",
        features: ["التقاط العملاء → CRM", "متابعات واتساب", "فواتير وتقارير وتكاملات"],
      },
      {
        name: "الشريك",
        desc: "ويب وتطبيقات وأتمتة من فريق واحد.",
        features: ["كل ما في باقة الانطلاق", "تطبيق موبايل (iOS و Android)", "دعم وصيانة بأولوية"],
      },
    ],
  },
} as const;

/** P1 §8 — light pricing snapshot; middle tile uses the single gold accent + CTA. */
export default function PricingSnapshot({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  return (
    <section className="bg-bglight px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>{t.eyebrow}</SectionEyebrow>
          <h2 className="mt-3 text-balance font-sans text-3xl font-semibold tracking-[-0.02em] text-navy-deep md:text-4xl">
            {t.title}
          </h2>
        </Reveal>

        <Stagger className="mt-12 grid items-start gap-6 md:grid-cols-3">
          {t.tiers.map((tier, i) => {
            const featured = i === 1;
            return (
              <StaggerItem
                key={tier.name}
                className={
                  featured
                    ? "relative rounded-tile border-2 border-gold bg-white p-7 shadow-md md:-mt-4"
                    : "rounded-tile border border-neutral-200 bg-white p-7 shadow-sm"
                }
              >
                {featured ? (
                  <span className="absolute -top-3 start-7 inline-flex items-center rounded-pill bg-gold px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-gold-ink">
                    {t.popular}
                  </span>
                ) : null}
                <h3 className="text-xl font-semibold text-navy-deep">{tier.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">{tier.desc}</p>
                <ul className="mt-5 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-navy-deep">
                      <svg viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 fill-gold" aria-hidden>
                        <path d="M16.7 5.3a1 1 0 010 1.4l-7 7a1 1 0 01-1.4 0l-3-3a1 1 0 111.4-1.4l2.3 2.29 6.3-6.29a1 1 0 011.4 0z" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-7">
                  {featured ? (
                    <GoldButton href={localePath(locale, "/book-call")} className="w-full">
                      {t.getQuote}
                    </GoldButton>
                  ) : (
                    <GhostButton href={localePath(locale, "/pricing")} className="w-full border-neutral-300 text-navy hover:bg-navy/5">
                      {t.choose}
                    </GhostButton>
                  )}
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>

        <Reveal className="mt-10 text-center">
          <a href={localePath(locale, "/pricing")} className="font-medium text-navy underline-offset-4 hover:text-gold hover:underline focus-gold">
            {t.seeAll}
          </a>
        </Reveal>
      </div>
    </section>
  );
}
