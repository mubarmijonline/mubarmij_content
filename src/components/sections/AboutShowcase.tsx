import { Trophy, Star, BadgeCheck, Target, UserRound, Globe2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Reveal from "@/components/effects/Reveal";

/**
 * "About us" showcase block: animated developer-style code card with floating
 * trust badges on the left, and a feature list on the right. All brand colours
 * (navy + gold) are reused from the existing palette — no new colour system.
 */
export default function AboutShowcase() {
  const t = useTranslations("aboutShowcase");

  const features = [
    {
      Icon: Target,
      title: t("f1Title"),
      body: t("f1Body"),
    },
    {
      Icon: UserRound,
      title: t("f2Title"),
      body: t("f2Body"),
    },
    {
      Icon: Globe2,
      title: t("f3Title"),
      body: t("f3Body"),
    },
  ];

  return (
    <section className="section bg-navy-deep text-white relative overflow-hidden">
      {/* Subtle drifting grid + ambient glows so the dark card feels alive */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none bg-grid-drift"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -top-24 -right-16 w-72 h-72 rounded-full bg-gold/20 blur-3xl float-y"
        style={{ animationDuration: "9s" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 w-80 h-80 rounded-full bg-navy/40 blur-3xl float-y"
        style={{ animationDuration: "11s" }}
        aria-hidden="true"
      />

      <div className="container mx-auto relative grid lg:grid-cols-2 gap-12 items-center">
        {/* LEFT — code card + floating badges */}
        <Reveal className="relative">
          <div className="relative mx-auto max-w-xl">
            {/* Code window */}
            <div className="relative rounded-2xl border border-white/10 bg-[#0d1420]/95 backdrop-blur-sm shadow-navy overflow-hidden">
              {/* Top accent line */}
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-navy via-gold to-navy bg-[length:200%_100%] animate-gradient-x"
              />
              {/* Window header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-yellow-300" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-3 text-xs text-white/50 font-mono">
                  developer.js
                </span>
              </div>
              {/* Code body */}
              <pre
                dir="ltr"
                className="text-[13.5px] leading-7 font-mono p-5 overflow-x-auto text-white/90"
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
                  {"\n"}
                  {"\n  "}
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
                  {"\n"}
                  <span className="text-orange-300">you</span>
                  <span className="text-white/70">.</span>learn
                  <span className="text-white/70">(</span>
                  <span className="text-emerald-300">{`"programming"`}</span>
                  <span className="text-white/70">);</span>
                  <span
                    aria-hidden="true"
                    className="inline-block w-2 h-5 align-text-bottom ml-1 bg-gold animate-blink-caret"
                  />
                </code>
              </pre>
            </div>

            {/* Floating badges */}
            <div
              className="absolute -top-4 right-2 lg:-right-6 z-10 float-y"
              aria-hidden="false"
            >
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0d1420]/95 backdrop-blur px-4 py-3 shadow-navy">
                <span className="w-9 h-9 rounded-lg bg-gold/15 text-gold flex items-center justify-center">
                  <Trophy size={18} />
                </span>
                <div>
                  <div className="text-sm font-semibold text-white">
                    {t("badge1Title")}
                  </div>
                  <div className="text-xs text-white/60">
                    {t("badge1Sub")}
                  </div>
                  <div className="mt-1 flex gap-0.5 text-gold">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={11} fill="currentColor" stroke="none" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div
              className="absolute -bottom-5 left-2 lg:-left-6 z-10 float-y-delay"
              aria-hidden="false"
            >
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0d1420]/95 backdrop-blur px-4 py-3 shadow-navy">
                <span className="w-9 h-9 rounded-lg bg-whatsapp/15 text-whatsapp flex items-center justify-center">
                  <BadgeCheck size={18} />
                </span>
                <div>
                  <div className="text-sm font-semibold text-white">
                    {t("badge2Title")}
                  </div>
                  <div className="text-xs text-white/60">
                    {t("badge2Sub")}
                  </div>
                </div>
                <span className="ml-2 inline-flex items-center gap-1.5 text-[10.5px] font-semibold text-whatsapp bg-whatsapp/10 border border-whatsapp/30 rounded-full px-2 py-0.5">
                  <span className="pulse-dot" style={{ background: "#25d366" }} />
                  {t("badge2Chip")}
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* RIGHT — heading + description + features */}
        <div>
          <Reveal>
            <div className="inline-flex items-center gap-2 text-gold text-xs font-semibold uppercase tracking-[0.2em]">
              <span className="inline-block w-6 h-px bg-gold" />
              {t("eyebrow")}
            </div>
            <h2 className="mt-3 font-display rtl:font-arabic-display text-3xl md:text-5xl font-extrabold leading-tight">
              {t("heading")}
            </h2>
            <p className="mt-5 text-white/80 leading-relaxed max-w-xl">
              {t("body")}
            </p>
          </Reveal>

          <ul className="mt-8 space-y-6">
            {features.map(({ Icon, title, body }, i) => (
              <Reveal as="li" key={title} delayMs={120 + i * 120}>
                <div className="flex items-start gap-4">
                  <span className="shrink-0 w-12 h-12 rounded-xl bg-gold/10 text-gold border border-gold/30 flex items-center justify-center">
                    <Icon size={22} />
                  </span>
                  <div>
                    <h3 className="font-display rtl:font-arabic-display font-bold text-lg text-white">
                      {title}
                    </h3>
                    <p className="mt-1 text-white/70 leading-relaxed">{body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
