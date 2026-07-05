import type { Locale } from "@/i18n/config";
import { Reveal, SectionEyebrow, Stagger, StaggerItem } from "@/components/system";

const UI = {
  en: { eyebrow: "Why MubarmiJ", title: "What makes us different" },
  ar: { eyebrow: "ليه مبرمج", title: "اللي بيفرّقنا" },
} as const;

/** Light section: service.differentiators with gold checkmarks. */
export default function Differentiators({ locale, items }: { locale: Locale; items?: string[] | null }) {
  const list = items ?? [];
  if (!list.length) return null;
  const ui = UI[locale];
  return (
    <section className="bg-bglight px-4 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>{ui.eyebrow}</SectionEyebrow>
          <h2 className="mt-3 text-balance font-sans text-3xl font-semibold tracking-[-0.02em] text-navy-deep md:text-4xl">
            {ui.title}
          </h2>
        </Reveal>
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2">
          {list.map((d) => (
            <StaggerItem
              key={d}
              className="flex items-center gap-4 rounded-tile border border-neutral-200 bg-white p-5 shadow-sm"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold" aria-hidden>
                <svg viewBox="0 0 20 20" className="h-5 w-5 fill-current">
                  <path d="M16.7 5.3a1 1 0 010 1.4l-7 7a1 1 0 01-1.4 0l-3-3a1 1 0 111.4-1.4l2.3 2.29 6.3-6.29a1 1 0 011.4 0z" />
                </svg>
              </span>
              <p className="font-medium text-navy-deep">{d}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
