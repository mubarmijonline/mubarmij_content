import type { Locale } from "@/i18n/config";
import type { FaqItem } from "@/lib/v1";
import { FaqAccordion, Reveal, SectionEyebrow } from "@/components/system";

const COPY = {
  en: { eyebrow: "FAQ", title: "Questions, answered" },
  ar: { eyebrow: "الأسئلة الشائعة", title: "أسئلة وإجابتها" },
} as const;

/** P1 §10 — light FAQ section from /v1/faq (FaqAccordion emits FAQPage JSON-LD). */
export default function FaqSection({ locale, items }: { locale: Locale; items: FaqItem[] }) {
  if (!items.length) return null;
  const t = COPY[locale];
  return (
    <section className="bg-cream px-4 py-20 md:py-28">
      <div className="mx-auto max-w-3xl">
        <Reveal className="mb-10 text-center">
          <SectionEyebrow>{t.eyebrow}</SectionEyebrow>
          <h2 className="mt-3 text-balance font-sans text-3xl font-semibold tracking-[-0.02em] text-navy-deep md:text-4xl">
            {t.title}
          </h2>
        </Reveal>
        <FaqAccordion items={items} />
      </div>
    </section>
  );
}
