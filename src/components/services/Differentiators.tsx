import type { Locale } from "@/i18n/config";
import { SectionEyebrow, Shell, SlashList } from "@/components/system";
import { GoldPeriod } from "@/components/system/Typo";

const UI = {
  en: { eyebrow: "Why MubarmiJ", title: "What makes us different" },
  ar: { eyebrow: "ليه مبرمج", title: "اللي بيفرّقنا" },
} as const;

export default function Differentiators({
  locale,
  items,
}: {
  locale: Locale;
  items?: string[] | null;
}) {
  const list = items ?? [];
  if (!list.length) return null;
  const ui = UI[locale];

  return (
    <section className="surf-light border-b border-hair">
      <Shell className="sect grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <SectionEyebrow>{ui.eyebrow}</SectionEyebrow>
          <h2 className="mt-3.5 font-display text-d2 font-bold text-fg">
            {ui.title}
            <GoldPeriod />
          </h2>
        </div>
        <SlashList className="self-center" items={list} />
      </Shell>
    </section>
  );
}
