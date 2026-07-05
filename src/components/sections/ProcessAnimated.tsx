"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

const STEP_ICONS = [
  "/process-icons/discovery.png",
  "/process-icons/proposal.png",
  "/process-icons/build.png",
  "/process-icons/launch.png",
];

/**
 * Scroll-driven Process timeline. The vertical/horizontal rail fills as the
 * section enters the viewport and each step "lights up" in sequence.
 *
 * Falls back to a non-animated layout when the user prefers reduced motion.
 */
export default function ProcessAnimated() {
  const t = useTranslations("process");
  const steps = [t("step1"), t("step2"), t("step3"), t("step4")];

  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 40%"],
  });

  // Rail width 0% → 100% as the section scrolls through the viewport.
  const railWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="section bg-white">
      <div className="container mx-auto" ref={ref}>
        <h2 className="section-title text-center max-w-3xl mx-auto">
          {t("title")}
        </h2>

        {/* Animated progress rail behind the steps */}
        <div className="relative mt-12">
          <div
            aria-hidden="true"
            className="absolute top-6 left-0 right-0 mx-auto h-[3px] max-w-[92%] rounded-full bg-bglight overflow-hidden hidden md:block"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-gold via-gold to-gold/60"
              style={reduce ? { width: "100%" } : { width: railWidth }}
            />
          </div>

          <ol className="relative grid gap-6 md:grid-cols-4">
            {steps.map((step, idx) => {
              const start = idx / steps.length;
              const end = (idx + 0.6) / steps.length;
              return (
                <Step
                  key={idx}
                  idx={idx}
                  step={step}
                  scrollYProgress={scrollYProgress}
                  start={start}
                  end={end}
                  reduce={!!reduce}
                />
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

type StepProps = {
  idx: number;
  step: string;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  start: number;
  end: number;
  reduce: boolean;
};

function Step({ idx, step, scrollYProgress, start, end, reduce }: StepProps) {
  // Each card fades + lifts in based on its slice of section progress.
  const opacity = useTransform(scrollYProgress, [start, end], [0.25, 1]);
  const y = useTransform(scrollYProgress, [start, end], [24, 0]);
  const numberScale = useTransform(scrollYProgress, [start, end], [0.85, 1]);
  const numberGlow = useTransform(
    scrollYProgress,
    [start, end],
    ["0 0 0 rgba(212,162,76,0)", "0 0 24px rgba(212,162,76,0.55)"],
  );

  return (
    <motion.li
      style={
        reduce
          ? undefined
          : { opacity, y }
      }
      className="relative rounded-xl border border-bglight bg-bglight/40 p-6 card-lift hover:border-gold/40"
    >
      <motion.span
        style={
          reduce
            ? undefined
            : { scale: numberScale, boxShadow: numberGlow }
        }
        className="absolute top-4 ltr:right-4 rtl:left-4 inline-flex w-12 h-12 items-center justify-center rounded-full bg-gold text-navy-deep font-display font-extrabold text-lg"
        aria-hidden="true"
      >
        {idx + 1}
      </motion.span>
      <div className="mb-3 flex h-16 w-16 items-center justify-center">
        <Image
          src={STEP_ICONS[idx]}
          alt=""
          width={64}
          height={64}
          className="h-16 w-16 object-contain"
        />
      </div>
      <div className="text-sm font-semibold uppercase tracking-wide text-gold">
        Step {idx + 1}
      </div>
      <p className="mt-2 font-display rtl:font-arabic-display font-bold text-lg text-navy-deep pr-14 rtl:pr-0 rtl:pl-14">
        {step}
      </p>
    </motion.li>
  );
}
