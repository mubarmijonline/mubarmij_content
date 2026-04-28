import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { MessageSquare, Database, Workflow, Network } from "lucide-react";

import type { Locale } from "@/i18n/config";
import { localePath } from "@/lib/utils";
import CTAButton from "@/components/ui/CTAButton";
import AutomationChecklist from "@/components/automation/AutomationChecklist";
import ROICalculator from "@/components/automation/ROICalculator";
import Process from "@/components/sections/Process";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "automation" });
  return {
    title: t("heroTitle"),
    description: t("heroSub"),
  };
}

export default async function AutomationPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "automation" });
  const tCta = await getTranslations({ locale, namespace: "cta" });
  const lp = (p: string) => localePath(locale, p);

  // JSON-LD Service schema
  const ld = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Process Automation",
    name: t("heroTitle"),
    description: t("heroSub"),
    provider: { "@type": "Organization", name: "Mubarmij Online" },
    areaServed: "EG",
  };

  const types = [
    { Icon: MessageSquare, key: "type1" },
    { Icon: Database, key: "type2" },
    { Icon: Workflow, key: "type3" },
    { Icon: Network, key: "type4" },
  ] as const;

  return (
    <>
      {/* HERO */}
      <section className="bg-hero-gradient text-white">
        <div className="container mx-auto py-20 md:py-28 max-w-4xl text-center">
          <h1 className="font-display rtl:font-arabic-display text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            {t("heroTitle")}
          </h1>
          <p className="mt-5 text-lg text-white/85">{t("heroSub")}</p>
          <div className="mt-8 flex justify-center gap-3 flex-wrap">
            <CTAButton href={lp("/book-call")} variant="primary" size="lg">
              {tCta("primary")}
            </CTAButton>
            <CTAButton href="#roi" variant="secondary" size="lg">
              {t("roiTitle")}
            </CTAButton>
          </div>
        </div>
      </section>

      {/* CHECKLIST */}
      <AutomationChecklist locale={locale} />

      {/* TYPES */}
      <section className="section bg-white">
        <div className="container mx-auto">
          <h2 className="section-title text-center">{t("typesTitle")}</h2>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {types.map(({ Icon, key }) => (
              <div
                key={key}
                className="rounded-xl border border-bglight bg-bglight/40 p-6 hover:shadow-navy hover:-translate-y-1 transition flex flex-col"
              >
                <div className="w-12 h-12 rounded-lg bg-gold/10 text-gold flex items-center justify-center mb-4">
                  <Icon size={24} />
                </div>
                <h3 className="font-display rtl:font-arabic-display text-lg font-bold text-navy-deep">
                  {t(key)}
                </h3>
                <div className="mt-auto pt-5">
                  <CTAButton href={lp("/book-call")} variant="leadmagnet" className="text-sm">
                    {tCta("demo")}
                  </CTAButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI */}
      <div id="roi">
        <ROICalculator />
      </div>

      {/* PROCESS — reused */}
      <Process />

      {/* TECH LOGOS */}
      <section className="section bg-bglight">
        <div className="container mx-auto text-center">
          <h2 className="section-title">Tech we use</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-x-10 gap-y-4 text-navy/70 font-semibold">
            {["n8n", "Make.com", "Zapier", "Twilio", "OpenAI API", "Google Workspace"].map(
              (x) => (
                <span key={x}>{x}</span>
              ),
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ locale={locale} />

      {/* CTA */}
      <FinalCTA locale={locale} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
    </>
  );
}
