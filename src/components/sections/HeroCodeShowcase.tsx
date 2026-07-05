"use client";

import { Trophy, Star, BadgeCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { PulseBeams, type BeamPath } from "@/components/ui/pulse-beams";

/**
 * Visual block extracted from <AboutShowcase /> so the Hero can reuse the
 * animated developer.js code window + floating trust badges. Wrapped in a
 * <PulseBeams /> for the connecting animated SVG accents (brand gold/navy).
 */

const HERO_BEAMS: BeamPath[] = [
  {
    path: "M269 220.5H16.5C10.9772 220.5 6.5 224.977 6.5 230.5V398.5",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "80%", y2: "100%" },
      animate: {
        x1: ["0%", "0%", "200%"],
        x2: ["0%", "0%", "180%"],
        y1: ["80%", "0%", "0%"],
        y2: ["100%", "20%", "20%"],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 2,
        delay: 0.4,
      },
    },
    connectionPoints: [
      { cx: 6.5, cy: 398.5, r: 6 },
      { cx: 269, cy: 220.5, r: 6 },
    ],
  },
  {
    path: "M568 200H841C846.523 200 851 195.523 851 190V40",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "80%", y2: "100%" },
      animate: {
        x1: ["20%", "100%", "100%"],
        x2: ["0%", "90%", "90%"],
        y1: ["80%", "80%", "-20%"],
        y2: ["100%", "100%", "0%"],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 2,
        delay: 0.9,
      },
    },
    connectionPoints: [
      { cx: 851, cy: 34, r: 6.5 },
      { cx: 568, cy: 200, r: 6 },
    ],
  },
  {
    path: "M425.5 274V333C425.5 338.523 421.023 343 415.5 343H152C146.477 343 142 347.477 142 353V426.5",
    gradientConfig: {
      initial: { x1: "0%", x2: "0%", y1: "80%", y2: "100%" },
      animate: {
        x1: ["20%", "100%", "100%"],
        x2: ["0%", "90%", "90%"],
        y1: ["80%", "80%", "-20%"],
        y2: ["100%", "100%", "0%"],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 2,
        delay: 1.4,
      },
    },
    connectionPoints: [
      { cx: 142, cy: 427, r: 6.5 },
      { cx: 425.5, cy: 274, r: 6 },
    ],
  },
  {
    path: "M380 168V17C380 11.4772 384.477 7 390 7H414",
    gradientConfig: {
      initial: { x1: "-40%", x2: "-10%", y1: "0%", y2: "20%" },
      animate: {
        x1: ["40%", "0%", "0%"],
        x2: ["10%", "0%", "0%"],
        y1: ["0%", "0%", "180%"],
        y2: ["20%", "20%", "200%"],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
        repeatDelay: 2,
        delay: 1.9,
      },
    },
    connectionPoints: [
      { cx: 420.5, cy: 6.5, r: 6 },
      { cx: 380, cy: 168, r: 6 },
    ],
  },
];

export default function HeroCodeShowcase() {
  const t = useTranslations("aboutShowcase");

  return (
    <PulseBeams
      beams={HERO_BEAMS}
      width={858}
      height={434}
      baseColor="rgba(255,255,255,0.07)"
      accentColor="rgba(212,162,76,0.45)"
      gradientColors={{ start: "#D4A24C", middle: "#F4C97A", end: "#1E3A5F" }}
      className="min-h-[460px] py-6"
    >
      <div className="relative mx-auto w-full max-w-xl px-2">
        {/* Code window */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d1420]/95 shadow-navy backdrop-blur-sm">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px animate-gradient-x bg-gradient-to-r from-navy via-gold to-navy bg-[length:200%_100%]"
          />
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-yellow-300" />
            <span className="h-3 w-3 rounded-full bg-green-400" />
            <span className="ms-3 font-mono text-xs text-white/50">
              developer.js
            </span>
          </div>
          <pre
            dir="ltr"
            className="overflow-x-auto p-5 font-mono text-[13.5px] leading-7 text-white/90"
          >
            <code>
              <span className="text-white/40">{"// MubarmiJ"}</span>
              {"\n"}
              <span className="text-gold">class</span>{" "}
              <span className="text-amber-200">Developer</span>{" "}
              <span className="text-white/70">{"{"}</span>
              {"\n  "}
              <span className="text-gold">constructor</span>
              <span className="text-white/70">(</span>
              <span className="text-orange-300">name</span>
              <span className="text-white/70">) {"{"}</span>
              {"\n    "}
              <span className="text-sky-300">this</span>
              <span className="text-white/70">.</span>name{" "}
              <span className="text-white/50">=</span> name
              <span className="text-white/70">;</span>
              {"\n    "}
              <span className="text-sky-300">this</span>
              <span className="text-white/70">.</span>skills{" "}
              <span className="text-white/50">=</span>{" "}
              <span className="text-white/70">[];</span>
              {"\n    "}
              <span className="text-sky-300">this</span>
              <span className="text-white/70">.</span>potential{" "}
              <span className="text-white/50">=</span>{" "}
              <span className="text-amber-200">Infinity</span>
              <span className="text-white/70">;</span>
              {"\n  "}
              <span className="text-white/70">{"}"}</span>
              {"\n\n  "}
              <span className="text-amber-200">learn</span>
              <span className="text-white/70">(</span>
              <span className="text-orange-300">topic</span>
              <span className="text-white/70">) {"{"}</span>
              {"\n    "}
              <span className="text-sky-300">this</span>
              <span className="text-white/70">.</span>skills
              <span className="text-white/70">.</span>push
              <span className="text-white/70">(</span>topic
              <span className="text-white/70">);</span>
              {"\n    "}
              <span className="text-gold">return</span>{" "}
              <span className="text-emerald-300">{`"Level Up! 🚀"`}</span>
              <span className="text-white/70">;</span>
              {"\n  "}
              <span className="text-white/70">{"}"}</span>
              {"\n"}
              <span className="text-white/70">{"}"}</span>
              {"\n"}
              <span className="text-gold">const</span>{" "}
              <span className="text-orange-300">you</span>{" "}
              <span className="text-white/50">=</span>{" "}
              <span className="text-gold">new</span>{" "}
              <span className="text-amber-200">Developer</span>
              <span className="text-white/70">(</span>
              <span className="text-emerald-300">{`"you"`}</span>
              <span className="text-white/70">);</span>
              <span
                aria-hidden="true"
                className="ms-1 inline-block h-5 w-2 animate-blink-caret bg-gold align-text-bottom"
              />
            </code>
          </pre>
        </div>

        {/* Floating badge — top */}
        <div className="float-y absolute -top-4 right-2 z-10 lg:-right-6">
          <div className="shadow-navy flex items-center gap-3 rounded-xl border border-white/10 bg-[#0d1420]/95 px-4 py-3 backdrop-blur">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/15 text-gold">
              <Trophy size={18} />
            </span>
            <div>
              <div className="text-sm font-semibold text-white">
                {t("badge1Title")}
              </div>
              <div className="text-xs text-white/60">{t("badge1Sub")}</div>
              <div className="mt-1 flex gap-0.5 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={11} fill="currentColor" stroke="none" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating badge — bottom */}
        <div className="float-y-delay absolute -bottom-5 left-2 z-10 lg:-left-6">
          <div className="shadow-navy flex items-center gap-3 rounded-xl border border-white/10 bg-[#0d1420]/95 px-4 py-3 backdrop-blur">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-whatsapp/15 text-whatsapp">
              <BadgeCheck size={18} />
            </span>
            <div>
              <div className="text-sm font-semibold text-white">
                {t("badge2Title")}
              </div>
              <div className="text-xs text-white/60">{t("badge2Sub")}</div>
            </div>
            <span className="ms-2 inline-flex items-center gap-1.5 rounded-full border border-whatsapp/30 bg-whatsapp/10 px-2 py-0.5 text-[10.5px] font-semibold text-whatsapp">
              <span className="pulse-dot" style={{ background: "#25d366" }} />
              {t("badge2Chip")}
            </span>
          </div>
        </div>
      </div>
    </PulseBeams>
  );
}
