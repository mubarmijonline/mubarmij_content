import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Globe, Gauge, Search, ShoppingCart, LayoutDashboard, Wrench } from "lucide-react";

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
  return { title: t("webDevTitle"), description: t("webDevSub") };
}

export default async function WebDevelopmentPage({
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

  const items = tSol.raw("card2Items") as string[];

  const features = [
    { Icon: Gauge, en: "Lightning-fast loads", ar: "تحميل سريع جداً" },
    { Icon: Search, en: "SEO-ready structure", ar: "بنية جاهزة للسيو" },
    { Icon: ShoppingCart, en: "E-commerce that converts", ar: "متجر إلكتروني بيبيع" },
    { Icon: LayoutDashboard, en: "Custom admin dashboards", ar: "لوحات تحكم مخصصة" },
    { Icon: Globe, en: "Bilingual EN / AR", ar: "ثنائي اللغة عربي / إنجليزي" },
    { Icon: Wrench, en: "3 months free support", ar: "3 شهور دعم مجاني" },
  ];

  return (
    <>
      <Section bg="gradient" padded>
        <div className="max-w-3xl mx-auto text-center py-10">
          <h1 className="font-display rtl:font-arabic-display text-3xl md:text-5xl font-extrabold mb-4">
            {t("webDevTitle")}
          </h1>
          <p className="text-white/85 text-lg mb-8">{t("webDevSub")}</p>
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
          {locale === "ar" ? "إيه اللي بيميّز شغلنا" : "What makes our sites different"}
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
            {locale === "ar" ? "جاهز نبدأ؟" : "Ready to start?"}
          </h2>
          <p className="mt-4 text-navy/80">
            {locale === "ar"
              ? "احجز مكالمة مجانية 30 دقيقة، وهنرجعلك بـ proposal مكتوب في 3 أيام عمل."
              : "Book a free 30-minute call. You'll have a written proposal in 3 business days."}
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
