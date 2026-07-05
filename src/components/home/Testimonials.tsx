import type { Locale } from "@/i18n/config";
import type { TestimonialItem } from "@/lib/v1";
import { Reveal, SectionEyebrow, Stagger, StaggerItem, TestimonialCard } from "@/components/system";

const COPY = {
  en: { eyebrow: "Testimonials", title: "Teams that trust us to ship" },
  ar: { eyebrow: "آراء العملاء", title: "فرق بتثق فينا علشان ننفّذ" },
} as const;

/** P1 §7 — light section, up to 3 testimonial cards from /v1/testimonials. Hides when empty. */
export default function Testimonials({
  locale,
  testimonials,
}: {
  locale: Locale;
  testimonials: TestimonialItem[];
}) {
  const valid = testimonials.filter((x) => x.avatar_url && x.company).slice(0, 3);
  if (!valid.length) return null;
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
          {valid.map((item) => (
            <StaggerItem key={item.id} className="h-full">
              <TestimonialCard item={item} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
