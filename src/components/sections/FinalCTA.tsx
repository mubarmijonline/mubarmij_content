import { useTranslations } from "next-intl";
import { Mail, MapPin, Phone } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { localePath, whatsappLink } from "@/lib/utils";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/site";
import CTAButton from "@/components/ui/CTAButton";

export default function FinalCTA({ locale }: { locale: Locale }) {
  const t = useTranslations("finalCta");
  const tCta = useTranslations("cta");
  const tWa = useTranslations("whatsapp");

  return (
    <section className="section bg-hero-gradient text-white">
      <div className="container mx-auto text-center max-w-3xl">
        <h2 className="font-display rtl:font-arabic-display text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
          {t("title")}
        </h2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <CTAButton href={localePath(locale, "/book-call")} variant="primary" size="lg">
            {t("primary")}
          </CTAButton>
          <CTAButton href={whatsappLink(tWa("prefilled"))} variant="whatsapp" external size="lg">
            {tCta("whatsapp")}
          </CTAButton>
        </div>

        <div className="mt-10 grid sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center justify-center gap-2 text-white/80">
            <Phone size={16} className="text-gold" /> {CONTACT_PHONE}
          </div>
          <div className="flex items-center justify-center gap-2 text-white/80">
            <Mail size={16} className="text-gold" /> {CONTACT_EMAIL}
          </div>
          <div className="flex items-center justify-center gap-2 text-white/80">
            <MapPin size={16} className="text-gold" /> Cairo, Egypt
          </div>
        </div>
      </div>
    </section>
  );
}
