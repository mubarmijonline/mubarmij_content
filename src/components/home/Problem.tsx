import type { Locale } from "@/i18n/config";
import { localePath } from "@/lib/utils";
import { GoldButton, Reveal, SectionEyebrow, Stagger, StaggerItem } from "@/components/system";

const COPY = {
  en: {
    eyebrow: "The problem",
    title: "Running a business shouldn't feel like this",
    cards: [
      {
        title: "Drowning in manual work",
        body: "Your team copies data between apps, sends the same WhatsApp messages, and chases invoices by hand.",
      },
      {
        title: "A website that doesn't sell",
        body: "Visitors land, get confused, and leave. No leads, no calls — just a brochure that sits there.",
      },
      {
        title: "Juggling five vendors",
        body: "A designer here, a developer there, someone for ads — and nobody actually owns the result.",
      },
    ],
    cta: "There's a better way",
  },
  ar: {
    eyebrow: "المشكلة",
    title: "إدارة شركتك المفروض ما تكونش بالشكل ده",
    cards: [
      {
        title: "غارق في الشغل اليدوي",
        body: "فريقك بينقل بيانات بين التطبيقات، وبيبعت نفس رسائل واتساب، وبيجري ورا الفواتير بإيده.",
      },
      {
        title: "موقع لا يبيع",
        body: "الزائر بيدخل، يتلخبط، ويمشي. لا عملاء، لا مكالمات — مجرد كتالوج واقف مكانه.",
      },
      {
        title: "بتتعامل مع خمس جهات",
        body: "مصمّم هنا، مطوّر هناك، حد للإعلانات — ومحدش مسؤول عن النتيجة فعليًا.",
      },
    ],
    cta: "في طريقة أفضل",
  },
} as const;

/** P1 §3 — light section, 3 white pain cards with red-x accents, single wide gold CTA. */
export default function Problem({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  return (
    <section className="bg-cream px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>{t.eyebrow}</SectionEyebrow>
          <h2 className="mt-3 text-balance font-sans text-3xl font-semibold tracking-[-0.02em] text-navy-deep md:text-4xl">
            {t.title}
          </h2>
        </Reveal>
        <Stagger className="mt-12 grid gap-6 md:grid-cols-3">
          {t.cards.map((card) => (
            <StaggerItem
              key={card.title}
              className="flex flex-col rounded-tile border border-neutral-200 bg-white p-6 shadow-sm"
            >
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-500"
                aria-hidden
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </span>
              <h3 className="mt-4 text-lg font-semibold text-navy-deep">{card.title}</h3>
              <p className="mt-2 leading-relaxed text-neutral-500">{card.body}</p>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mt-12 flex justify-center">
          <GoldButton href={localePath(locale, "/book-call")} size="lg">
            {t.cta}
          </GoldButton>
        </Reveal>
      </div>
    </section>
  );
}
