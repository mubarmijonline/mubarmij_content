import { useTranslations } from "next-intl";
import Reveal from "@/components/effects/Reveal";

export default function Process() {
  const t = useTranslations("process");
  const steps = [t("step1"), t("step2"), t("step3"), t("step4")];

  return (
    <section className="section bg-white">
      <div className="container mx-auto">
        <h2 className="section-title text-center max-w-3xl mx-auto">{t("title")}</h2>

        <ol className="mt-12 grid gap-6 md:grid-cols-4">
          {steps.map((step, idx) => (
            <Reveal
              key={idx}
              as="li"
              delayMs={idx * 120}
              className="relative rounded-xl border border-bglight bg-bglight/40 p-6 card-lift hover:border-gold/40"
            >
              <span
                className="absolute top-4 ltr:right-4 rtl:left-4 inline-flex w-12 h-12 items-center justify-center rounded-full bg-gold text-navy-deep font-display font-extrabold text-lg step-glow"
                style={{ animationDelay: `${idx * 0.7}s` }}
                aria-hidden="true"
              >
                {idx + 1}
              </span>
              <div className="text-sm font-semibold uppercase tracking-wide text-gold">
                Step {idx + 1}
              </div>
              <p className="mt-2 font-display rtl:font-arabic-display font-bold text-lg text-navy-deep pr-14 rtl:pr-0 rtl:pl-14">
                {step}
              </p>
            </Reveal>
          ))}
        </ol>
        <div className="mt-10 max-w-3xl mx-auto progress-rail" aria-hidden="true" />
      </div>
    </section>
  );
}
