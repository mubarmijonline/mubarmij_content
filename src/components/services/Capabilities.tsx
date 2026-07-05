import type { Locale } from "@/i18n/config";
import type { ServiceDetail } from "@/lib/v1";
import { BentoTile, Reveal, SectionEyebrow, Stagger, StaggerItem } from "@/components/system";

const UI = {
  en: { eyebrow: "What we build", title: "Capabilities" },
  ar: { eyebrow: "اللي بنبنيه", title: "الإمكانيات" },
} as const;

/** Dark bento of service.types (mono-numbered tiles). */
export default function Capabilities({
  locale,
  types,
}: {
  locale: Locale;
  types?: ServiceDetail["types"] | null;
}) {
  const list = types ?? [];
  if (!list.length) return null;
  const ui = UI[locale];
  return (
    <section className="bg-navy-deep px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>{ui.eyebrow}</SectionEyebrow>
          <h2 className="mt-3 text-balance font-sans text-3xl font-semibold tracking-[-0.02em] text-cream md:text-4xl">
            {ui.title}
          </h2>
        </Reveal>
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((type, i) => (
            <StaggerItem key={type.title} className="h-full">
              <BentoTile className="flex h-full flex-col">
                <span className="font-mono text-sm font-medium text-gold-dim">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-lg font-semibold leading-snug text-cream">{type.title}</h3>
              </BentoTile>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
