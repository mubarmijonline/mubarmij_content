import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ShieldCheck, RefreshCw, Server, Bug, Activity, LifeBuoy } from "lucide-react";

import type { Locale } from "@/i18n/config";
import Section from "@/components/ui/Section";
import CTAButton from "@/components/ui/CTAButton";
import { localePath } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "servicePage" });
  return { title: t("maintenanceTitle"), description: t("maintenanceSub") };
}

export default async function MaintenancePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "servicePage" });
  const tCta = await getTranslations({ locale, namespace: "cta" });
  const lp = (p: string) => localePath(locale, p);

  const features = [
    { Icon: Server, en: "Hosting, DNS, backups", ar: "استضافة، DNS، نسخ احتياطية" },
    { Icon: RefreshCw, en: "Framework & dependency updates", ar: "تحديث الفريم وورك والمكتبات" },
    { Icon: ShieldCheck, en: "Security patches & SSL", ar: "تحديثات الأمان وشهادات SSL" },
    { Icon: Bug, en: "Bug fixes within SLA", ar: "حل المشاكل خلال SLA محدد" },
    { Icon: Activity, en: "Uptime monitoring & alerts", ar: "مراقبة الـ uptime وتنبيهات" },
    { Icon: LifeBuoy, en: "Priority WhatsApp support", ar: "دعم واتساب بأولوية" },
  ];

  return (
    <>
      <Section bg="gradient" padded>
        <div className="max-w-3xl mx-auto text-center py-10">
          <h1 className="font-display rtl:font-arabic-display text-3xl md:text-5xl font-extrabold mb-4">
            {t("maintenanceTitle")}
          </h1>
          <p className="text-white/85 text-lg mb-8">{t("maintenanceSub")}</p>
          <CTAButton href={lp("/book-call")} variant="primary" size="lg">
            {tCta("primary")}
          </CTAButton>
        </div>
      </Section>

      <Section bg="white">
        <h2 className="section-title text-center">
          {locale === "ar" ? "اللي شامل في الباقة" : "What the retainer covers"}
        </h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ Icon, en, ar }) => (
            <div
              key={en}
              className="rounded-xl bg-bglight/40 border border-bglight p-6 shadow-sm flex gap-4 items-start"
            >
              <div className="w-10 h-10 rounded-lg bg-gold/10 text-gold flex items-center justify-center shrink-0">
                <Icon size={20} />
              </div>
              <div className="font-semibold text-navy-deep">
                {locale === "ar" ? ar : en}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section bg="light">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="section-title">
            {locale === "ar" ? "محتاج عقد دعم؟" : "Need a support retainer?"}
          </h2>
          <p className="mt-4 text-navy/80">
            {locale === "ar"
              ? "كلمنا واتساب وهنجهزلك باقة تناسب موقعك أو نظامك."
              : "Message us on WhatsApp and we'll tailor a retainer to your site or system."}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <CTAButton href={lp("/contact")} variant="primary" size="lg">
              {tCta("primary")}
            </CTAButton>
          </div>
        </div>
      </Section>
    </>
  );
}
