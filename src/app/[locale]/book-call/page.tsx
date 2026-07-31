import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/config";
import { CALENDLY_URL, CONTACT_EMAIL, CONTACT_PHONE, SITE_URL } from "@/lib/site";
import { localePath } from "@/lib/utils";
import { GhostButton, SectionEyebrow, Shell, WhatsAppButton } from "@/components/system";
import { GoldPeriod } from "@/components/system/Typo";
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
        <Shell className="sect grid gap-10 lg:grid-cols-[1fr_340px]">
          <div className="rounded-card border border-hair bg-surface p-6 sm:p-8">
            <SectionEyebrow>{t.formTitle}</SectionEyebrow>
            <div className="mt-6">
              <ConsultationForm locale={locale} />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-card border border-hair bg-surface p-6">
              <h2 className="mono text-eyebrow uppercase text-accent">{t.quickTitle}</h2>
              <div className="mt-4 flex flex-col gap-3">
                <WhatsAppButton message={t.waMsg} dot className="w-full">
                  {t.whatsapp}
                </WhatsAppButton>
                {CALENDLY_URL ? (
                  <GhostButton href={CALENDLY_URL} external className="w-full">
                    {t.calendly}
                  </GhostButton>
                ) : null}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="focus-gold flex items-center justify-between gap-3 rounded-btn border border-hair px-4 py-2.5 transition-colors hover:border-hairhov"
                >
                  <span className="mono text-eyebrow uppercase text-accent">{t.emailLabel}</span>
                  <span className="mono ltr-island truncate text-[13px] text-fgbody">
                    {CONTACT_EMAIL}
                  </span>
                </a>
                <a
                  href={phoneHref}
                  className="focus-gold flex items-center justify-between gap-3 rounded-btn border border-hair px-4 py-2.5 transition-colors hover:border-hairhov"
                >
                  <span className="mono text-eyebrow uppercase text-accent">{t.callLabel}</span>
                  <span className="mono ltr-island truncate text-[13px] text-fgbody">
                    {CONTACT_PHONE}
                  </span>
                </a>
              </div>
            </div>

            <div className="rounded-card border border-hair bg-surface p-6">
              <h2 className="mono text-eyebrow uppercase text-accent">{t.stepsTitle}</h2>
              <ol className="mt-5 border-t border-hair">
                {t.steps.map((step, i) => (
                  <li key={step} className="flex gap-3 border-b border-hair py-4">
                    <span className="mono ltr-island shrink-0 text-[11px] text-fgfaint">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[14.5px] leading-relaxed text-fgbody">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </Shell>
      </section>
    </>
  );
}
