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
  const t = await getTranslations({ locale, namespace: "resources" });
  return { title: t("title"), description: t("sub") };
}

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "resources" });
  const tCta = await getTranslations({ locale, namespace: "cta" });
  const tLm = await getTranslations({ locale, namespace: "leadMagnet" });
  const lp = (p: string) => localePath(locale, p);

  const isAr = locale === "ar";

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
        <h2 className="section-title text-center mb-10">
          {isAr ? "الدليل المجاني" : "Free Guide"}
        </h2>

        {/* PDF download card */}
        <div className="max-w-3xl mx-auto rounded-2xl border border-gold shadow-gold bg-white p-8 flex flex-col md:flex-row items-center gap-8">
          {/* Icon */}
          <div className="w-24 h-24 rounded-2xl bg-gold/10 text-gold flex items-center justify-center shrink-0">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <polyline points="9 15 12 18 15 15"/>
            </svg>
          </div>

          <div className="flex-1 text-center md:text-start rtl:md:text-end">
            <span className="inline-block text-xs font-bold uppercase tracking-wide text-gold mb-2">
              {isAr ? "📘 مجاني — PDF" : "📘 Free — PDF"}
            </span>
            <h3 className="font-display rtl:font-arabic-display text-2xl font-extrabold text-navy-deep mb-2">
              {(() => {
                const headline = tLm("headline");
                // Split on the first colon so the "10 mistakes…" half drops to a new line.
                const idx = headline.indexOf(":");
                if (idx === -1) return headline;
                return (
                  <>
                    <span className="block">{headline.slice(0, idx + 1)}</span>
                    <span className="block">{" " + headline.slice(idx + 1).trim()}</span>
                  </>
                );
              })()}
            </h3>
            <p className="text-navy/70 text-sm mb-5">{tLm("sub")}</p>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start rtl:md:justify-end">
              <a
                href="/resources/10-mistakes-en.pdf"
                download
                className="btn-primary text-sm"
              >
                {isAr ? "حمّل الـ PDF مجاناً ↓" : "Download PDF free ↓"}
              </a>
              <CTAButton href={lp("/book-call")} variant="secondary">
                {tCta("primary")}
              </CTAButton>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-navy/50">{t("moreSoon")}</p>
      </Section>

      <LeadMagnet />
    </>
  );
}
