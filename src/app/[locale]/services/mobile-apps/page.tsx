import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Smartphone, Code2, Server, LayoutDashboard, Bell, Upload } from "lucide-react";

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
  return { title: t("mobileTitle"), description: t("mobileSub") };
}

export default async function MobileAppsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "servicePage" });
  const tCta = await getTranslations({ locale, namespace: "cta" });
  const tSol = await getTranslations({ locale, namespace: "solutions" });
  const lp = (p: string) => localePath(locale, p);

  const items = tSol.raw("card3Items") as string[];

  const features = [
    { Icon: Smartphone, en: "iOS + Android in one codebase", ar: "iOS وأندرويد بكود واحد" },
    { Icon: Code2, en: "Flutter", ar: "Flutter" },
    { Icon: Server, en: "Real backend, not a wrapper", ar: "Backend حقيقي مش مجرد wrapper" },
    { Icon: LayoutDashboard, en: "Admin dashboard included", ar: "لوحة تحكم إدارية ضمن الباقة" },
    { Icon: Bell, en: "Push notifications & analytics", ar: "إشعارات Push وتحليلات" },
    { Icon: Upload, en: "App Store + Play Store deployment", ar: "نشر على App Store و Play Store" },
  ];

  return (
    <>
      <Section bg="gradient" padded>
        <div className="max-w-3xl mx-auto text-center py-10">
          <h1 className="font-display rtl:font-arabic-display text-3xl md:text-5xl font-extrabold mb-4">
            {t("mobileTitle")}
          </h1>
          <p className="text-white/85 text-lg mb-8">{t("mobileSub")}</p>
          <CTAButton href={lp("/book-call")} variant="primary" size="lg">
            {tCta("primary")}
          </CTAButton>
        </div>
      </Section>

      <Section bg="white">
        <h2 className="section-title text-center">
          {locale === "ar" ? "اللي بنبنيه" : "What we build"}
        </h2>
        <ul className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {items.map((it) => (
            <li
              key={it}
              className="rounded-xl border border-bglight bg-bglight/40 p-5 text-navy-deep font-semibold"
            >
              • {it}
            </li>
          ))}
        </ul>
      </Section>

      <Section bg="light">
        <h2 className="section-title text-center">
          {locale === "ar" ? "إيه اللي هتاخده" : "What you get"}
        </h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ Icon, en, ar }) => (
            <div
              key={en}
              className="rounded-xl bg-white border border-bglight p-6 shadow-sm flex gap-4 items-start"
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

      <Section bg="white">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="section-title">
            {locale === "ar" ? "عندك فكرة تطبيق؟" : "Have an app idea?"}
          </h2>
          <p className="mt-4 text-navy/80">
            {locale === "ar"
              ? "احجز مكالمة 30 دقيقة. هنسمعك ونقولك التكلفة والمدة بصراحة."
              : "Book a 30-minute call. You'll get an honest estimate of cost and timeline."}
          </p>
          <div className="mt-8 flex justify-center">
            <CTAButton href={lp("/book-call")} variant="primary" size="lg">
              {tCta("primary")}
            </CTAButton>
          </div>
        </div>
      </Section>
    </>
  );
}
