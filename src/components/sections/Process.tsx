import { useTranslations } from "next-intl";

export default function Process() {
  const t = useTranslations("process");
  const steps = [t("step1"), t("step2"), t("step3"), t("step4")];

  return (
    <section className="section bg-white">
      <div className="container mx-auto">
        <h2 className="section-title text-center max-w-3xl mx-auto">{t("title")}</h2>

        <ol className="mt-12 grid gap-6 md:grid-cols-4">
          {steps.map((step, idx) => (
            <li
              key={idx}
              className="relative rounded-xl border border-bglight bg-bglight/40 p-6"
            >
              <span
                className="absolute top-4 ltr:right-4 rtl:left-4 text-6xl font-display font-extrabold text-gold/20 leading-none"
                aria-hidden="true"
              >
                {idx + 1}
              </span>
              <div className="text-sm font-semibold uppercase tracking-wide text-gold">
                Step {idx + 1}
              </div>
              <p className="mt-2 font-display rtl:font-arabic-display font-bold text-lg text-navy-deep">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
