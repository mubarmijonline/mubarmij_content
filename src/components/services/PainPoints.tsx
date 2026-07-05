import type { Locale } from "@/i18n/config";
import { Reveal, SectionEyebrow, Stagger, StaggerItem } from "@/components/system";

const UI = {
  en: { eyebrow: "Sound familiar?", title: "The problems we solve" },
  ar: { eyebrow: "بيحصلك ده؟", title: "المشاكل اللي بنحلها" },
} as const;

/** Light section: service.pain_points as red-x cards. */
export default function PainPoints({ locale, items }: { locale: Locale; items?: string[] | null }) {
  const list = items ?? [];
  if (!list.length) return null;
  const ui = UI[locale];
  return (
    <section className="bg-cream px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>{ui.eyebrow}</SectionEyebrow>
          <h2 className="mt-3 text-balance font-sans text-3xl font-semibold tracking-[-0.02em] text-navy-deep md:text-4xl">
            {ui.title}
          </h2>
        </Reveal>
        <Stagger className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <StaggerItem
              key={p}
              className="flex items-start gap-3 rounded-tile border border-neutral-200 bg-white p-5 shadow-sm"
            >
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500" aria-hidden>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </span>
              <p className="leading-relaxed text-navy-deep">{p}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
