import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/config";
import Section from "@/components/ui/Section";
import LeadMagnet from "@/components/sections/LeadMagnet";
import CTAButton from "@/components/ui/CTAButton";
import { localePath } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return { title: t("title"), description: t("sub") };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "blog" });
  const tCta = await getTranslations({ locale, namespace: "cta" });
  const lp = (p: string) => localePath(locale, p);

  return (
    <>
      <Section bg="gradient" padded>
        <div className="max-w-3xl mx-auto text-center py-10">
          <h1 className="font-display rtl:font-arabic-display text-3xl md:text-5xl font-extrabold mb-4">
            {t("title")}
          </h1>
          <p className="text-white/85 text-lg">{t("sub")}</p>
        </div>
      </Section>

      <Section bg="white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-navy/80 text-lg">{t("empty")}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <CTAButton href={lp("/resources")} variant="primary">
              {tCta("leadMagnet")}
            </CTAButton>
            <CTAButton href={lp("/book-call")} variant="secondary">
              {tCta("primary")}
            </CTAButton>
          </div>
        </div>
      </Section>

      <LeadMagnet />
    </>
  );
}
