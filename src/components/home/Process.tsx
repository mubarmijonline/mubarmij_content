import type { Locale } from "@/i18n/config";
import { HairCell, HairGrid, SectionEyebrow, Shell } from "@/components/system";
import { GoldPeriod } from "@/components/system/Typo";

const COPY = {
  en: {
    eyebrow: "Process",
    title: "A clear path from idea to revenue",
    steps: [
      { k: "01", when: "week 1", title: "Scope", body: "One call, then a written scope: what ships, what it costs, what it needs from you." },
      { k: "02", when: "weeks 1–2", title: "Design", body: "Clickable screens you approve before a line of production code is written." },
      { k: "03", when: "weeks 2–6", title: "Build", body: "Weekly demos on a live staging link. Integrations, QA, content load, no surprises." },
      { k: "04", when: "launch +", title: "Run", body: "Training, docs, monitoring, and a retainer for the improvements that follow." },
    ],
  },
  ar: {
    eyebrow: "إزاي بنشتغل",
    title: "طريق واضح من الفكرة للإيراد",
    steps: [
      { k: "01", when: "الأسبوع ١", title: "تحديد النطاق", body: "مكالمة واحدة، وبعدها نطاق مكتوب: هيتسلّم إيه، بكام، ومحتاجين منك إيه." },
      { k: "02", when: "الأسبوع ١–٢", title: "التصميم", body: "شاشات قابلة للضغط بتوافق عليها قبل ما نكتب سطر كود إنتاجي." },
      { k: "03", when: "الأسبوع ٢–٦", title: "التنفيذ", body: "عروض أسبوعية على رابط staging شغّال. ربط الأنظمة، اختبار، رفع المحتوى، من غير مفاجآت." },
      { k: "04", when: "بعد الإطلاق", title: "التشغيل", body: "تدريب، توثيق، مراقبة، وعقد صيانة للتحسينات اللي بعد كده." },
    ],
  },
} as const;

export default function Process({ locale, index }: { locale: Locale; index: string }) {
  const t = COPY[locale];

  return (
    <section className="surf-light border-b border-hair">
      <Shell className="sect">
        <SectionEyebrow index={index}>{t.eyebrow}</SectionEyebrow>
        <h2 className="mt-3.5 font-display text-d2 font-bold text-fg">
          {t.title}
          <GoldPeriod />
        </h2>

        <HairGrid cols={1} mdCols={2} lgCols={4} className="mt-10 border-t border-hair">
          {t.steps.map((s) => (
            <HairCell key={s.k} className="py-7 pe-6 md:pe-8">
              <div className="mono text-eyebrow uppercase text-accent">
                <span className="ltr-island">{s.k}</span>
                <span aria-hidden="true"> / </span>
                {s.when}
              </div>
              <h3 className="mt-3 font-display text-[21px] font-semibold tracking-[-0.02em] text-fg">
                {s.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-fgbody">{s.body}</p>
            </HairCell>
          ))}
        </HairGrid>
      </Shell>
    </section>
  );
}
