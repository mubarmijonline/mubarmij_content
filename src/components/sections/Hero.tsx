import { useTranslations } from "next-intl";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/lib/utils";
import CTAButton from "@/components/ui/CTAButton";
import AnimatedWords from "@/components/ui/AnimatedWords";
import MagneticCTA from "@/components/effects/MagneticCTA";
import HeroCodeShowcase from "@/components/sections/HeroCodeShowcase";

export default function Hero({ locale }: { locale: Locale }) {
  const t = useTranslations("hero");
  const tCta = useTranslations("cta");
  const lp = (p: string) => localePath(locale, p);

  return (
    <section className="relative bg-hero-gradient text-white overflow-hidden">
      {/* Drifting grid backdrop */}
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none bg-grid-drift" aria-hidden="true" />
      {/* Three ambient glowing orbs (varying durations) */}
      <div
        className="pointer-events-none absolute -top-32 -left-24 w-80 h-80 rounded-full bg-gold/20 blur-3xl float-y"
        style={{ animationDuration: "8s" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 rounded-full bg-navy/40 blur-3xl float-y"
        style={{ animationDuration: "10s" }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] rounded-full bg-gold/10 blur-3xl float-y"
        style={{ animationDuration: "12s" }}
        aria-hidden="true"
      />
      <div className="container mx-auto relative py-20 md:py-28 lg:py-32 grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-slide-in-left rtl:animate-slide-in-right">
          <p className="font-display font-extrabold text-2xl md:text-3xl mb-3 bg-gradient-to-r from-white via-gold to-white bg-[length:200%_100%] bg-clip-text text-transparent animate-gradient-x">
            MubarmiJ
          </p>
          <span
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs md:text-sm font-semibold text-gold border border-gold/40 bg-gold/5 animate-fade-up"
            style={{ animationDelay: "120ms", animationFillMode: "both" }}
          >
            <span className="pulse-dot" aria-hidden="true" />
            {t("badge")}
          </span>
          <h1 className="mt-5 font-display rtl:font-arabic-display text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            <AnimatedWords text={t("headline")} startDelayMs={250} delayBaseMs={90} />
          </h1>
          <p
            className="mt-5 text-sm md:text-base text-white/85 leading-relaxed max-w-xl animate-fade-up"
            style={{ animationDelay: "900ms", animationFillMode: "both" }}
          >
            {t("subA")}
          </p>
          <p
            className="mt-2 text-sm md:text-base text-white/70 leading-relaxed max-w-xl animate-fade-up"
            style={{ animationDelay: "1000ms", animationFillMode: "both" }}
          >
            {t("subB")}
          </p>
          <div
            className="mt-8 flex flex-wrap gap-3 animate-fade-up"
            style={{ animationDelay: "1100ms", animationFillMode: "both" }}
          >
            <MagneticCTA href={lp("/book-call")}>
              {tCta("primary")}
            </MagneticCTA>
            <CTAButton href={lp("/about")} variant="secondary" size="lg">
              {tCta("secondary")}
            </CTAButton>
          </div>
        </div>

        <div
          className="hidden lg:block animate-slide-in-right rtl:animate-slide-in-left"
          style={{ animationDelay: "200ms", animationFillMode: "both" }}
          aria-hidden="false"
        >
          <HeroCodeShowcase />
        </div>
      </div>
    </section>
  );
}
