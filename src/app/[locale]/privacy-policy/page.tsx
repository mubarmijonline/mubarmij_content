import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/config";
import Section from "@/components/ui/Section";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacyPage" });
  return { title: t("title"), description: t("intro") };
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "privacyPage" });

  const sections = Array.from({ length: 10 }, (_, i) => i + 1).map((n) => ({
    title: t(`s${n}Title`),
    body: t(`s${n}`),
  }));

  return (
    <Section bg="white">
      <article className="prose-like max-w-3xl mx-auto">
        <h1 className="section-title">{t("title")}</h1>
        <p className="mt-2 text-sm text-navy/60">{t("updated")}</p>
        <p className="mt-6 text-base leading-relaxed text-navy">{t("intro")}</p>

        {sections.map((s) => (
          <section key={s.title} className="mt-8">
            <h2 className="font-display text-xl font-bold text-navy-deep">
              {s.title}
            </h2>
            <p className="mt-2 text-base leading-relaxed text-navy">{s.body}</p>
          </section>
        ))}

        <p className="mt-10 text-base font-semibold text-navy-deep">
          {t("contact")}
        </p>
      </article>
    </Section>
  );
}
