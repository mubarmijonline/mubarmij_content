import type { Locale } from "@/i18n/config";
import type { ServiceDetail } from "@/lib/v1";
import { HairCell, HairGrid, SectionEyebrow, Shell } from "@/components/system";
import { GoldPeriod } from "@/components/system/Typo";

const UI = {
  en: { eyebrow: "What we build", title: "Capabilities" },
  ar: { eyebrow: "اللي بنبنيه", title: "الإمكانيات" },
} as const;

/** Dark band listing service.types on the hairline grid. */
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
    <section className="surf-dark sect">
      <Shell>
        <SectionEyebrow>{ui.eyebrow}</SectionEyebrow>
        <h2 className="mt-3.5 font-display text-d2 font-bold text-fg">
          {ui.title}
          <GoldPeriod />
        </h2>

        <HairGrid cols={1} mdCols={2} lgCols={4} className="mt-10 border-t border-hair">
          {list.map((type, i) => (
            <HairCell key={type.title} className="py-7">
              <span className="mono ltr-island text-eyebrow text-gold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 font-display text-[19px] font-semibold leading-snug tracking-[-0.01em] text-fg">
                {type.title}
              </h3>
            </HairCell>
          ))}
        </HairGrid>
      </Shell>
    </section>
  );
}
