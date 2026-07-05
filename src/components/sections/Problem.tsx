import { useTranslations } from "next-intl";
import { FileX2, Filter, Smartphone } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/lib/utils";
import CTAButton from "@/components/ui/CTAButton";
import Reveal from "@/components/effects/Reveal";

export default function Problem({ locale }: { locale: Locale }) {
  const t = useTranslations("problem");
  const cards = [
    { Icon: FileX2, title: t("card1Title"), body: t("card1Body") },
    { Icon: Filter, title: t("card2Title"), body: t("card2Body") },
    { Icon: Smartphone, title: t("card3Title"), body: t("card3Body") },
  ];

  return (
    <section className="section bg-white">
      <div className="container mx-auto">
        <h2 className="section-title text-center max-w-3xl mx-auto">
          {t("title")}
        </h2>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {cards.map(({ Icon, title, body }, idx) => (
            <Reveal
              key={title}
              delayMs={idx * 100}
              className="card-lift rounded-xl border border-bglight bg-bglight/40 p-6 hover:shadow-navy hover:border-gold/40"
            >
              <div className="w-12 h-12 rounded-lg bg-gold/10 text-gold flex items-center justify-center mb-4">
                <Icon size={24} />
              </div>
              <h3 className="font-display rtl:font-arabic-display text-xl font-bold text-navy-deep">
                {title}
              </h3>
              <p className="mt-2 text-navy/80 leading-relaxed">{body}</p>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 text-center">
          <CTAButton href={localePath(locale, "/book-call")} variant="primary" size="lg">
            {t("cta")}
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
