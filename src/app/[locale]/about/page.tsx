import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/config";
import Section from "@/components/ui/Section";
import CTAButton from "@/components/ui/CTAButton";
import AboutShowcase from "@/components/sections/AboutShowcase";
import { localePath } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("title"), description: t("sub") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });
  const tCta = await getTranslations({ locale, namespace: "cta" });
  const lp = (p: string) => localePath(locale, p);

  return (
    <>
      <Section bg="gradient" padded>
        <div className="max-w-3xl mx-auto text-center py-10">
          <p className="font-display font-extrabold text-2xl md:text-3xl mb-3">
            MubarmiJ
          </p>
          <h1 className="font-display rtl:font-arabic-display text-3xl md:text-5xl font-extrabold mb-4">
            {t("title")}
          </h1>
          <p className="text-white/80 text-lg">{t("sub")}</p>
        </div>
      </Section>

      <AboutShowcase />

      <Section bg="white">
        <h2 className="section-title text-center">{t("missionTitle")}</h2>
        <p className="mt-4 max-w-2xl mx-auto text-center text-lg text-navy/80">
          {t("mission")}
        </p>
      </Section>

      <Section bg="light">
        <h2 className="section-title text-center">{t("valuesTitle")}</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { title: t("value1Title"), body: t("value1") },
            { title: t("value2Title"), body: t("value2") },
            { title: t("value3Title"), body: t("value3") },
          ].map((v) => (
            <div
              key={v.title}
              className="rounded-2xl bg-white border border-bglight p-6 shadow-sm"
            >
              <h3 className="font-display font-bold text-navy-deep mb-2">
                {v.title}
              </h3>
              <p className="text-navy/80 text-sm leading-relaxed">{v.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section bg="white">
        <h2 className="section-title text-center">{t("statsTitle")}</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3 max-w-3xl mx-auto">
          {[t("stat1"), t("stat2"), t("stat3")].map((s) => (
            <div key={s} className="rounded-xl bg-bglight p-6 text-center">
              <p className="font-display font-extrabold text-navy-deep text-lg">
                {s}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <CTAButton href={lp("/book-call")} variant="primary" size="lg">
            {tCta("primary")}
          </CTAButton>
        </div>
      </Section>
    </>
  );
}
