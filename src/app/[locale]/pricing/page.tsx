import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/config";
import { SITE_URL } from "@/lib/site";
import { localePath } from "@/lib/utils";
import { getFaq } from "@/lib/v1";
import {
  Accordion,
  CTAPanel,
  DarkButton,
  GhostButton,
  HairCell,
  HairGrid,
  SectionEyebrow,
  Shell,
  SlashList,
} from "@/components/system";
import { GoldPeriod } from "@/components/system/Typo";

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
      <section className="surf-light border-b border-hair">
        <Shell className="sect">
          <SectionEyebrow>{t.eyebrow}</SectionEyebrow>
          <h1 className="mt-3.5 max-w-[16em] font-display text-d1 font-bold text-fg">
            {t.title}
            <GoldPeriod />
          </h1>
          <p className="mt-5 max-w-[40em] text-lede text-fgbody">{t.sub}</p>
        </Shell>
      </section>

      <section className="surf-light border-b border-hair">
        <Shell className="sect">
          <div className="grid items-start gap-6 md:grid-cols-3">
            {t.tiers.map((tier, i) => {
              const featured = i === 1;
              return (
                <div
                  key={tier.name}
                  className={
                    featured
                      ? "relative rounded-card border-2 border-gold bg-surface p-7"
                      : "rounded-card border border-hair bg-surface p-7"
                  }
                >
                  {featured ? (
                    <span className="mono absolute -top-3 start-7 rounded-chip bg-gold px-3 py-1 text-[10.5px] uppercase text-gold-ink">
                      {t.popular}
                    </span>
                  ) : null}
                  <h2 className="font-display text-[21px] font-semibold tracking-[-0.02em] text-fg">
                    {tier.name}
                  </h2>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-fgbody">{tier.desc}</p>
                  <p className="mono mt-5 text-eyebrow uppercase text-accent">{t.from}</p>
                  <SlashList className="mt-4" items={[...tier.features]} />
                  <div className="mt-8">
                    {featured ? (
                      <DarkButton href={localePath(locale, "/book-call")} className="w-full">
                        {t.getQuote}
                      </DarkButton>
                    ) : (
                      <GhostButton href={localePath(locale, "/book-call")} className="w-full">
                        {t.choose}
                      </GhostButton>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Shell>
      </section>

      <section className="surf-subtle border-b border-hair">
        <Shell className="sect">
          <SectionEyebrow>{t.includedTitle}</SectionEyebrow>
          <HairGrid cols={1} mdCols={2} lgCols={4} className="mt-9 border-t border-hair">
            {t.included.map((item) => (
              <HairCell key={item.title} className="py-7 pe-6">
                <h2 className="font-display text-[18px] font-semibold tracking-[-0.02em] text-fg">
                  {item.title}
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-fgbody">{item.body}</p>
              </HairCell>
            ))}
          </HairGrid>
        </Shell>
      </section>

      {faq.length ? (
        <section className="surf-light border-b border-hair">
          <Shell className="sect grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <SectionEyebrow>{t.faqTitle}</SectionEyebrow>
            </div>
            <Accordion items={faq} jsonLd={false} />
          </Shell>
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
