import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/config";
import { SITE_URL } from "@/lib/site";
import { localePath } from "@/lib/utils";
import { getFaq } from "@/lib/v1";
import {
  CTAPanel,
  FaqAccordion,
  GhostButton,
  GoldButton,
  Reveal,
  SectionEyebrow,
  Stagger,
  StaggerItem,
} from "@/components/system";

export const revalidate = 300;

const COPY = {
  en: {
    eyebrow: "Pricing",
    title: "Plans scoped to your goals, not a price list",
    sub: "Every project is custom-quoted after a short call — but here's how our engagements are usually shaped, and what's always included.",
    popular: "Most requested",
    from: "Custom quote",
    getQuote: "Get a quote",
    choose: "Talk to us",
    includedTitle: "What every engagement includes",
    included: [
      { title: "Discovery & scoping call", body: "We map the problem, the users, and the fastest path to value before a line of code." },
      { title: "Clear milestones", body: "Fixed checkpoints with demos, so you always see progress and never lose control." },
      { title: "Clean, owned code", body: "You own the repo, the infrastructure, and the accounts. No lock-in, ever." },
      { title: "Post-launch support", body: "A support window after launch plus optional maintenance to keep things humming." },
    ],
    faqTitle: "Pricing questions",
    ctaTitle: "Not sure which fits?",
    ctaSub: "Tell us what you're trying to achieve and we'll recommend the smallest plan that gets you there.",
    ctaLabel: "Book a free consultation",
    waLabel: "Chat on WhatsApp",
    waMsg: "Hi MubarmiJ! I'd like a quote for a project.",
    tiers: [
      {
        name: "Launch",
        desc: "A website that turns visitors into leads.",
        features: ["Landing or multi-page site", "Mobile-first & fast", "SEO & analytics foundations", "Lead capture forms"],
      },
      {
        name: "Automate",
        desc: "Put your busywork on autopilot.",
        features: ["Lead capture → CRM", "WhatsApp & email follow-ups", "Invoices, reports & integrations", "Dashboards you actually use"],
      },
      {
        name: "Partner",
        desc: "Web, apps, and automation from one team.",
        features: ["Everything in Launch", "Mobile app (iOS & Android)", "Custom backend & APIs", "Priority support & maintenance"],
      },
    ],
  },
  ar: {
    eyebrow: "الأسعار",
    title: "باقات مفصّلة على أهدافك، مش قائمة أسعار",
    sub: "كل مشروع بنحدّد سعره بعد مكالمة قصيرة — بس دي طريقة تقسيم شغلنا عادةً، واللي بيكون موجود دايمًا.",
    popular: "الأكثر طلبًا",
    from: "عرض سعر مخصّص",
    getQuote: "اطلب عرض سعر",
    choose: "كلّمنا",
    includedTitle: "اللي بيكون موجود في كل مشروع",
    included: [
      { title: "مكالمة استكشاف وتحديد نطاق", body: "بنفهم المشكلة والمستخدمين وأسرع طريق للقيمة قبل أول سطر كود." },
      { title: "مراحل واضحة", body: "نقاط مراجعة ثابتة مع عروض حيّة، فدايمًا شايف التقدّم ومتحكّم." },
      { title: "كود نضيف وملكك", body: "إنت بتملك الكود والبنية التحتية والحسابات. مفيش ارتباط إجباري أبدًا." },
      { title: "دعم بعد الإطلاق", body: "فترة دعم بعد الإطلاق، وصيانة اختيارية تخلّي كل حاجة شغّالة." },
    ],
    faqTitle: "أسئلة عن الأسعار",
    ctaTitle: "مش متأكد أنهي باقة تناسبك؟",
    ctaSub: "قولّنا عايز توصل لإيه وهنرشّحلك أصغر باقة توصّلك هناك.",
    ctaLabel: "احجز استشارة مجانية",
    waLabel: "تواصل على واتساب",
    waMsg: "أهلاً مبرمج! عايز عرض سعر لمشروع.",
    tiers: [
      {
        name: "الانطلاق",
        desc: "موقع بيحوّل الزوار لعملاء محتملين.",
        features: ["لاندنج أو موقع متعدد الصفحات", "سريع ومتجاوب مع الموبايل", "أساسيات SEO والتحليلات", "نماذج التقاط العملاء"],
      },
      {
        name: "الأتمتة",
        desc: "حطّ شغلك الروتيني على الطيار الآلي.",
        features: ["التقاط العملاء → CRM", "متابعات واتساب وإيميل", "فواتير وتقارير وتكاملات", "لوحات تحكّم بتستخدمها فعلاً"],
      },
      {
        name: "الشريك",
        desc: "ويب وتطبيقات وأتمتة من فريق واحد.",
        features: ["كل ما في باقة الانطلاق", "تطبيق موبايل (iOS و Android)", "باك إند و APIs مخصّصة", "دعم وصيانة بأولوية"],
      },
    ],
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = COPY[locale];
  const path = "/pricing";
  return {
    title: t.title,
    description: t.sub,
    alternates: {
      canonical: `${SITE_URL}${localePath(locale, path)}`,
      languages: { en: `${SITE_URL}${path}`, ar: `${SITE_URL}/ar${path}`, "x-default": `${SITE_URL}${path}` },
    },
  };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = COPY[locale];
  const faq = await getFaq(locale);

  return (
    <>
      {/* Hero — dark */}
      <section className="relative overflow-hidden bg-navy-deep">
        <div className="bg-hero-grid pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:py-28">
          <Reveal>
            <SectionEyebrow>{t.eyebrow}</SectionEyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-4 text-balance font-sans text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-tight tracking-[-0.02em] text-cream">
              {t.title}
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-bodydark sm:text-lg">
              {t.sub}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Tiers — light */}
      <section className="bg-cream py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Stagger className="grid items-start gap-6 md:grid-cols-3">
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
                  <p className="mt-4 font-mono text-sm uppercase tracking-[0.12em] text-gold-dim">{t.from}</p>
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
                      <GhostButton href={localePath(locale, "/book-call")} className="w-full border-neutral-300 text-navy hover:bg-navy/5">
                        {t.choose}
                      </GhostButton>
                    )}
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* What's included — light continuation */}
      <section className="bg-bglight py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <Reveal className="mx-auto max-w-2xl text-center">
            <SectionEyebrow>{t.includedTitle}</SectionEyebrow>
          </Reveal>
          <Stagger className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.included.map((item) => (
              <StaggerItem key={item.title} className="rounded-tile border border-neutral-200 bg-white p-6">
                <h3 className="font-semibold text-navy-deep">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">{item.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* FAQ — cream */}
      {faq.length ? (
        <section className="bg-cream py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4">
            <Reveal className="text-center">
              <SectionEyebrow>{t.faqTitle}</SectionEyebrow>
            </Reveal>
            <div className="mt-8">
              <FaqAccordion items={faq} jsonLd={false} />
            </div>
          </div>
        </section>
      ) : null}

      <CTAPanel
        title={t.ctaTitle}
        subtitle={t.ctaSub}
        ctaHref={localePath(locale, "/book-call")}
        ctaLabel={t.ctaLabel}
        whatsappLabel={t.waLabel}
        whatsappMessage={t.waMsg}
      />
    </>
  );
}
