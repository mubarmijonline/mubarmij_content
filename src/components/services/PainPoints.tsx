import type { Locale } from "@/i18n/config";
import { HairCell, HairGrid, SectionEyebrow, Shell } from "@/components/system";
import { GoldPeriod } from "@/components/system/Typo";

const UI = {
  en: { eyebrow: "Sound familiar?", title: "The problems we solve" },
  ar: { eyebrow: "بيحصلك ده؟", title: "المشاكل اللي بنحلها" },
} as const;

export default function PainPoints({ locale, items }: { locale: Locale; items?: string[] | null }) {
  const list = items ?? [];
  if (!list.length) return null;
  const ui = UI[locale];

  return (
    <section className="surf-subtle border-b border-hair">
      <Shell className="sect">
        <SectionEyebrow>{ui.eyebrow}</SectionEyebrow>
        <h2 className="mt-3.5 font-display text-d2 font-bold text-fg">
          {ui.title}
          <GoldPeriod />
        </h2>

        <HairGrid cols={1} mdCols={2} lgCols={3} className="mt-10 border-t border-hair">
          {list.map((p, i) => (
            <HairCell key={p} className="py-6">
              <div className="flex gap-4">
                <span className="mono ltr-island shrink-0 text-[11px] text-fgfaint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-[15.5px] leading-relaxed text-fgbody">{p}</p>
              </div>
            </HairCell>
          ))}
        </HairGrid>
      </Shell>
    </section>
  );
}
