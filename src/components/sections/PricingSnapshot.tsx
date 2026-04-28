import { useTranslations } from "next-intl";
import type { Locale } from "@/i18n/config";
import { localePath, whatsappLink } from "@/lib/utils";
import CTAButton from "@/components/ui/CTAButton";

export default function PricingSnapshot({ locale }: { locale: Locale }) {
  const t = useTranslations("pricing");
  const tCta = useTranslations("cta");
  const tWa = useTranslations("whatsapp");
  const lp = (p: string) => localePath(locale, p);

  const cards = [
    { name: t("starter"), price: t("starterPrice"), badge: undefined, highlight: false },
    { name: t("business"), price: t("businessPrice"), badge: t("businessBadge"), highlight: true },
    { name: t("bundle"), price: t("bundlePrice"), badge: t("bundleBadge"), highlight: false },
  ];

  return (
    <section className="section bg-bglight">
      <div className="container mx-auto">
        <h2 className="section-title text-center">{t("title")}</h2>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {cards.map((c) => (
            <div
              key={c.name}
              className={`rounded-2xl bg-white p-7 flex flex-col border ${
                c.highlight ? "border-gold shadow-gold scale-[1.03]" : "border-bglight"
              }`}
            >
              {c.badge && (
                <span className="self-start text-xs font-bold uppercase tracking-wide bg-gold text-navy-deep px-3 py-1 rounded-full">
                  {c.badge}
                </span>
              )}
              <h3 className="mt-3 font-display text-lg font-bold text-navy-deep">
                {c.name}
              </h3>
              <p className="mt-2 text-2xl font-display font-extrabold text-navy">
                {c.price}
              </p>
              <div className="mt-auto pt-6">
                <CTAButton href={lp("/pricing")} variant="primary" className="w-full justify-center">
                  {tCta("primary")}
                </CTAButton>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center flex flex-col items-center gap-3">
          <p className="font-semibold text-navy">{t("customNeed")}</p>
          <CTAButton href={whatsappLink(tWa("prefilled"))} variant="whatsapp" external>
            {tCta("whatsapp")}
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
