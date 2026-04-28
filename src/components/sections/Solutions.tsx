import { useTranslations } from "next-intl";
import { Bot, Globe, Smartphone } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/lib/utils";
import CTAButton from "@/components/ui/CTAButton";

export default function Solutions({ locale }: { locale: Locale }) {
  const t = useTranslations("solutions");
  const tCta = useTranslations("cta");
  const lp = (p: string) => localePath(locale, p);

  return (
    <section className="section bg-bglight">
      <div className="container mx-auto">
        <h2 className="section-title text-center max-w-3xl mx-auto">{t("title")}</h2>

        <div className="mt-12 grid lg:grid-cols-12 gap-6 items-stretch">
          {/* Card 1 — AUTOMATION (larger) */}
          <article className="lg:col-span-5 rounded-2xl bg-white border border-gold shadow-gold p-7 flex flex-col">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-xl bg-gold/10 text-gold flex items-center justify-center">
                <Bot size={28} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wide bg-gold text-navy-deep px-3 py-1 rounded-full">
                {t("highRoi")}
              </span>
            </div>
            <h3 className="mt-5 font-display rtl:font-arabic-display text-2xl font-bold text-navy-deep">
              {t("card1Title")}
            </h3>
            <ul className="mt-4 space-y-2 text-navy/80">
              <li>• WhatsApp Bots</li>
              <li>• CRM متصل / CRM integration</li>
              <li>• Lead Management</li>
              <li>• Workflow Automation</li>
              <li>• System Integrations</li>
            </ul>
            <div className="mt-5 inline-block self-start text-sm font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-full">
              {t("card1Result")}
            </div>
            <div className="mt-auto pt-6">
              <CTAButton href={lp("/services/automation")} variant="primary">
                {tCta("primary")}
              </CTAButton>
            </div>
          </article>

          {/* Card 2 — WEB */}
          <article className="lg:col-span-3.5 lg:col-span-3 rounded-2xl bg-white border border-bglight p-6 flex flex-col">
            <div className="w-14 h-14 rounded-xl bg-navy/10 text-navy flex items-center justify-center">
              <Globe size={28} />
            </div>
            <h3 className="mt-5 font-display rtl:font-arabic-display text-xl font-bold text-navy-deep">
              {t("card2Title")}
            </h3>
            <ul className="mt-4 space-y-2 text-navy/80 text-sm">
              <li>• Landing Pages</li>
              <li>• مواقع شركات</li>
              <li>• E-commerce</li>
              <li>• لوحات تحكم Custom</li>
              <li>• SEO</li>
            </ul>
            <div className="mt-5 inline-block self-start text-sm font-semibold text-navy bg-bglight px-3 py-1.5 rounded-full">
              {t("card2Price")}
            </div>
            <div className="mt-auto pt-6">
              <CTAButton href={lp("/pricing")} variant="leadmagnet">
                {tCta("primary")}
              </CTAButton>
            </div>
          </article>

          {/* Card 3 — MOBILE */}
          <article className="lg:col-span-4 rounded-2xl bg-white border border-bglight p-6 flex flex-col">
            <div className="w-14 h-14 rounded-xl bg-navy/10 text-navy flex items-center justify-center">
              <Smartphone size={28} />
            </div>
            <h3 className="mt-5 font-display rtl:font-arabic-display text-xl font-bold text-navy-deep">
              {t("card3Title")}
            </h3>
            <ul className="mt-4 space-y-2 text-navy/80 text-sm">
              <li>• iOS + Android</li>
              <li>• React Native + Flutter</li>
              <li>• Backend متكامل</li>
              <li>• Admin Dashboard</li>
              <li>• App Store deployment</li>
            </ul>
            <div className="mt-5 inline-block self-start text-xs font-semibold text-navy bg-bglight px-3 py-1.5 rounded-full">
              {t("card3Eligibility")}
            </div>
            <div className="mt-auto pt-6">
              <CTAButton href={lp("/book-call")} variant="leadmagnet">
                {tCta("primary")}
              </CTAButton>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
