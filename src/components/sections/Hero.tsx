import { useTranslations } from "next-intl";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/lib/utils";
import CTAButton from "@/components/ui/CTAButton";

export default function Hero({ locale }: { locale: Locale }) {
  const t = useTranslations("hero");
  const tCta = useTranslations("cta");
  const lp = (p: string) => localePath(locale, p);

  return (
    <section className="relative bg-hero-gradient text-white overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
        aria-hidden="true"
      />
      <div className="container mx-auto relative py-20 md:py-28 lg:py-32 grid lg:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-up">
          <span className="inline-block px-3 py-1 rounded-full text-xs md:text-sm font-semibold text-gold border border-gold/40 bg-gold/5">
            {t("badge")}
          </span>
          <h1 className="mt-5 font-display rtl:font-arabic-display text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            {t("headline")}
          </h1>
          <p className="mt-5 text-base md:text-lg text-white/85 leading-relaxed max-w-xl">
            {t("sub")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CTAButton href={lp("/book-call")} variant="primary" size="lg">
              {tCta("primary")}
            </CTAButton>
            <CTAButton href={lp("/case-studies")} variant="secondary" size="lg">
              {tCta("secondary")}
            </CTAButton>
          </div>
        </div>

        <div
          className="hidden lg:block animate-fade-up"
          style={{ animationDelay: "200ms" }}
          aria-hidden="true"
        >
          <div className="relative rounded-2xl bg-navy/40 backdrop-blur-sm border border-white/10 p-6 shadow-navy">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-300" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ms-3 text-xs text-white/60">dashboard.live</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { l: "Leads", v: "248" },
                { l: "Hours saved", v: "1,420" },
                { l: "Conversion", v: "+34%" },
              ].map((s) => (
                <div key={s.l} className="rounded-lg bg-white/5 p-4">
                  <div className="text-xs text-white/60">{s.l}</div>
                  <div className="text-2xl font-bold text-gold">{s.v}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              {[
                "✓ New lead from Google Ads",
                "✓ Invoice auto-sent to client",
                "✓ WhatsApp reply scheduled",
              ].map((n, i) => (
                <div
                  key={i}
                  className="text-sm rounded-md bg-white/5 px-3 py-2 border border-white/10"
                >
                  {n}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
