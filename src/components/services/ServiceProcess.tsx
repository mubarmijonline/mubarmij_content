import type { Locale } from "@/i18n/config";
import type { ServiceDetail } from "@/lib/v1";
import { HairCell, HairGrid, SectionEyebrow, Shell } from "@/components/system";
import { GoldPeriod } from "@/components/system/Typo";

const UI = {
  en: {
    eyebrow: "How it works",
    title: "What actually happens, stage by stage",
    lede: "No black box. Every engagement runs the same four stages, and you know what you get at the end of each one.",
    duration: "Typical timeline",
  },
  ar: {
    eyebrow: "إزاي بتشتغل",
    title: "اللي بيحصل فعليًا، مرحلة مرحلة",
    lede: "مفيش صندوق مقفول. كل تعاون بيمشي بنفس الأربع مراحل، وبتعرف بتاخد إيه في آخر كل واحدة.",
    duration: "المدة المتوقعة",
  },
} as const;

/**
 * The stage-by-stage breakdown of a single service.
 *
 * This is the section that answers "what am I actually buying" — each stage
 * names what happens and what the client ends up holding. Content is CMS-side
 * (`services.ts`), so it stays in step with the catalogue.
 */
export default function ServiceProcess({
  locale,
  service,
}: {
  locale: Locale;
  service: ServiceDetail;
}) {
  const steps = service.process ?? [];
  if (!steps.length) return null;
  const ui = UI[locale];

  return (
    <section className="surf-light border-b border-hair">
      <Shell className="sect">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-5">
          <div className="min-w-0 max-w-[22em]">
            <SectionEyebrow>{ui.eyebrow}</SectionEyebrow>
            <h2 className="mt-3.5 font-display text-d2 font-bold text-fg">
              {ui.title}
              <GoldPeriod />
            </h2>
          </div>
          <p className="max-w-[28em] text-copy text-fgbody">{ui.lede}</p>
        </div>

        <HairGrid cols={1} mdCols={2} lgCols={4} className="mt-10 border-t border-hair">
          {steps.map((step, i) => (
            <HairCell key={step.title} className="py-7">
              <div className="mono text-eyebrow uppercase text-accent">
                <span className="ltr-island">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <h3 className="mt-3 font-display text-[19px] font-semibold tracking-[-0.02em] text-fg">
                {step.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-fgbody">{step.body}</p>
            </HairCell>
          ))}
        </HairGrid>

        {service.duration ? (
          <p className="mono mt-8 text-[11px] uppercase text-fgmuted">
            {ui.duration}: <span className="text-fg">{service.duration}</span>
          </p>
        ) : null}
      </Shell>
    </section>
  );
}
