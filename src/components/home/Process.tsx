"use client";

import { motion, useReducedMotion } from "framer-motion";

import type { Locale } from "@/i18n/config";
import { EASE } from "@/lib/motion";
import { Reveal, SectionEyebrow, Stagger, StaggerItem } from "@/components/system";

const COPY = {
  en: {
    eyebrow: "How it works",
    title: "A clear path from idea to impact",
    steps: [
      { k: "01", title: "Discover", body: "We map your workflows, goals, and where time leaks out." },
      { k: "02", title: "Design", body: "We blueprint the solution and the experience around it." },
      { k: "03", title: "Build", body: "We develop, integrate your tools, and test everything." },
      { k: "04", title: "Launch & support", body: "We ship, train your team, and keep it running." },
    ],
  },
  ar: {
    eyebrow: "إزاي بنشتغل",
    title: "طريق واضح من الفكرة للأثر",
    steps: [
      { k: "٠١", title: "الاكتشاف", body: "بنرسم خرائط شغلك وأهدافك وأماكن ضياع الوقت." },
      { k: "٠٢", title: "التصميم", body: "بنرسم الحل والتجربة المحيطة بيه." },
      { k: "٠٣", title: "البناء", body: "بنطوّر، ونربط أدواتك، ونختبر كل حاجة." },
      { k: "٠٤", title: "الإطلاق والدعم", body: "بنطلق، وندرّب فريقك، ونحافظ على تشغيله." },
    ],
  },
} as const;

/** P1 §6 — dark 4-step timeline with a gold progress line (transform-only scaleX draw). */
export default function Process({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  const reduce = useReducedMotion();
  const isRtl = locale === "ar";

  return (
    <section className="bg-navy px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <SectionEyebrow>{t.eyebrow}</SectionEyebrow>
          <h2 className="mt-3 text-balance font-sans text-3xl font-semibold tracking-[-0.02em] text-cream md:text-4xl">
            {t.title}
          </h2>
        </Reveal>

        <div className="relative mt-14">
          {/* progress line (md+) */}
          <div className="pointer-events-none absolute inset-x-0 top-5 hidden h-px bg-line md:block" aria-hidden>
            <motion.div
              className="h-px bg-gradient-to-r from-gold-dim via-gold to-gold-light"
              style={{ transformOrigin: isRtl ? "right" : "left" }}
              initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={reduce ? { duration: 0 } : { duration: 1.1, ease: EASE }}
            />
          </div>

          <Stagger className="grid gap-10 md:grid-cols-4 md:gap-6">
            {t.steps.map((s) => (
              <StaggerItem key={s.k} className="relative">
                <span className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-gold/60 bg-navy-deep font-mono text-sm font-medium text-gold">
                  {s.k}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-cream">{s.title}</h3>
                <p className="mt-2 leading-relaxed text-bodydark">{s.body}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
