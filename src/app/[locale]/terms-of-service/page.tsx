import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/config";
import { Shell } from "@/components/system";
import { GoldPeriod } from "@/components/system/Typo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "termsPage" });
  return { title: t("title"), description: t("intro") };
}

export default async function TermsOfServicePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "termsPage" });

  const sections = Array.from({ length: 10 }, (_, i) => i + 1).map((n) => ({
    title: t(`s${n}Title`),
    body: t(`s${n}`),
  }));

  return (
    <section className="surf-light border-b border-hair">
      <Shell className="sect">
        <article className="max-w-[46em]">
          <h1 className="font-display text-d1 font-bold text-fg">
            {t("title")}
            <GoldPeriod />
          </h1>
          <p className="mono mt-4 text-[11px] uppercase text-fgmuted">{t("updated")}</p>
          <p className="mt-6 text-copy text-fgbody">{t("intro")}</p>

          <div className="mt-10 border-t border-hair">
            {sections.map((s) => (
              <section key={s.title} className="border-b border-hair py-7">
                <h2 className="font-display text-[19px] font-semibold tracking-[-0.01em] text-fg">
                  {s.title}
                </h2>
                <p className="mt-2.5 text-copy text-fgbody">{s.body}</p>
              </section>
            ))}
          </div>

          <p className="mt-9 font-display text-[16px] font-semibold text-fg">{t("contact")}</p>
        </article>
      </Shell>
    </section>
  );
}
