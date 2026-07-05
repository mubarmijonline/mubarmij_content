import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/config";
import { CALENDLY_URL, CONTACT_EMAIL, CONTACT_PHONE, SITE_URL } from "@/lib/site";
import { localePath } from "@/lib/utils";
import { GhostButton, Reveal, SectionEyebrow, WhatsAppButton } from "@/components/system";
import ConsultationForm from "@/components/book-call/ConsultationForm";

export const revalidate = 300;

const COPY = {
  en: {
    eyebrow: "Book a call",
    title: "Let's talk about your project",
    sub: "Pick a time and channel that suits you. We come prepared with ideas — not a slide-deck sales pitch.",
    formTitle: "Request a consultation",
    quickTitle: "Prefer something faster?",
    whatsapp: "Chat on WhatsApp",
    waMsg: "Hi MubarmiJ! I'd like to book a consultation.",
    calendly: "Pick a slot on Calendly",
    emailLabel: "Email",
    callLabel: "Call",
    stepsTitle: "What happens next",
    steps: [
      "We confirm your slot and send a calendar invite.",
      "A 30-minute call to understand your goals and constraints.",
      "You get a clear scope, timeline, and quote — no obligation.",
    ],
  },
  ar: {
    eyebrow: "احجز مكالمة",
    title: "خلّينا نتكلّم عن مشروعك",
    sub: "اختار الوقت والوسيلة اللي تناسبك. هنيجي محضّرين أفكار — مش عرض بيع ممل.",
    formTitle: "اطلب استشارة",
    quickTitle: "تفضّل حاجة أسرع؟",
    whatsapp: "تواصل على واتساب",
    waMsg: "أهلاً مبرمج! حابب أحجز استشارة.",
    calendly: "اختار موعد على Calendly",
    emailLabel: "إيميل",
    callLabel: "اتصال",
    stepsTitle: "اللي بيحصل بعد كده",
    steps: [
      "بنأكّد موعدك ونبعتلك دعوة على التقويم.",
      "مكالمة 30 دقيقة نفهم فيها أهدافك وقيودك.",
      "هتاخد نطاق واضح وجدول زمني وعرض سعر — من غير أي التزام.",
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
  const path = "/book-call";
  return {
    title: t.title,
    description: t.sub,
    alternates: {
      canonical: `${SITE_URL}${localePath(locale, path)}`,
      languages: { en: `${SITE_URL}${path}`, ar: `${SITE_URL}/ar${path}`, "x-default": `${SITE_URL}${path}` },
    },
  };
}

export default async function BookCallPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = COPY[locale];
  const phoneHref = `tel:${CONTACT_PHONE.replace(/\s+/g, "")}`;

  return (
    <>
      <section className="relative overflow-hidden bg-navy-deep">
        <div className="bg-hero-grid pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:py-24">
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

      <section className="bg-cream py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-[1fr_360px]">
          {/* Consultation form */}
          <div className="rounded-tile border border-neutral-200 bg-white p-6 sm:p-8">
            <SectionEyebrow>{t.formTitle}</SectionEyebrow>
            <div className="mt-6">
              <ConsultationForm locale={locale} />
            </div>
          </div>

          {/* Quick channels + next steps */}
          <aside className="space-y-6">
            <div className="rounded-tile border border-neutral-200 bg-white p-6">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold-dim">{t.quickTitle}</h2>
              <div className="mt-4 flex flex-col gap-3">
                <WhatsAppButton message={t.waMsg} className="w-full">
                  {t.whatsapp}
                </WhatsAppButton>
                {CALENDLY_URL ? (
                  <GhostButton href={CALENDLY_URL} external className="w-full border-neutral-300 text-navy hover:bg-navy/5">
                    {t.calendly}
                  </GhostButton>
                ) : null}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="flex items-center justify-between gap-3 rounded-tile border border-neutral-200 px-4 py-2.5 text-sm text-navy-deep transition-colors hover:border-gold focus-gold"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-gold-dim">{t.emailLabel}</span>
                  <span className="truncate">{CONTACT_EMAIL}</span>
                </a>
                <a
                  href={phoneHref}
                  dir="ltr"
                  className="flex items-center justify-between gap-3 rounded-tile border border-neutral-200 px-4 py-2.5 text-sm text-navy-deep transition-colors hover:border-gold focus-gold"
                >
                  <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-gold-dim">{t.callLabel}</span>
                  <span className="truncate">{CONTACT_PHONE}</span>
                </a>
              </div>
            </div>

            <div className="rounded-tile border border-neutral-200 bg-white p-6">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.2em] text-gold-dim">{t.stepsTitle}</h2>
              <ol className="mt-4 space-y-4">
                {t.steps.map((step, i) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-navy-deep font-mono text-sm text-gold">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed text-neutral-600">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
