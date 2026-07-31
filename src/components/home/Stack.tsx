import type { Locale } from "@/i18n/config";
import { STACK, STACK_COPY } from "@/lib/content/stack";
import { HairCell, HairGrid, MonoChip, SectionEyebrow, Shell } from "@/components/system";
import { GoldPeriod } from "@/components/system/Typo";

/** Dark band. Tool names stay Latin in both locales; only labels localize. */
export default function Stack({ locale, index }: { locale: Locale; index: string }) {
  const t = STACK_COPY[locale];

  return (
    <section className="surf-dark sect">
      <Shell>
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div className="min-w-0 lg:max-w-[16em]">
            <SectionEyebrow index={index}>{t.eyebrow}</SectionEyebrow>
            <h2 className="mt-3.5 font-display text-d2 font-bold text-fg">
              {t.title}
              <GoldPeriod />
            </h2>
          </div>
          <p className="max-w-[27em] text-[15.5px] leading-relaxed text-fgmuted">{t.lede}</p>
        </div>

        <HairGrid cols={1} mdCols={2} lgCols={5} className="mt-10 border-t border-hair">
          {STACK.map((group, i) => (
            <HairCell key={group.label.en} className="px-0 py-6 md:px-5 lg:pe-5 lg:ps-5">
              <div className="flex items-baseline gap-2">
                <span className="mono ltr-island text-eyebrow text-gold">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-[15.5px] font-semibold tracking-[-0.01em] text-fg">
                  {group.label[locale]}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-[7px]">
                {group.items.map((item) => (
                  <MonoChip key={item} interactive>
                    {item}
                  </MonoChip>
                ))}
              </div>
            </HairCell>
          ))}
        </HairGrid>
      </Shell>
    </section>
  );
}
