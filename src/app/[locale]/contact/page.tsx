import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/config";
import Section from "@/components/ui/Section";
import CTAButton from "@/components/ui/CTAButton";
import { localePath, whatsappLink } from "@/lib/utils";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });
  return { title: t("title"), description: t("sub") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "contactPage" });
  const tCta = await getTranslations({ locale, namespace: "cta" });
  const tWa = await getTranslations({ locale, namespace: "whatsapp" });
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

      <Section bg="white">
        <div className="grid gap-10 md:grid-cols-2 max-w-5xl mx-auto">
          <div className="space-y-6">
            <Field label={t("businessName")} value={t("businessNameValue")} />
            <Field
              label={t("emailLabel")}
              value={CONTACT_EMAIL}
              href={`mailto:${CONTACT_EMAIL}`}
            />
            <Field
              label={t("phoneLabel")}
              value={CONTACT_PHONE}
              href={`tel:${CONTACT_PHONE.replace(/\s+/g, "")}`}
            />
            <Field label={t("hoursLabel")} value={t("hours")} />
            <Field label={t("addressLabel")} value={t("address")} />

            <div className="flex flex-wrap gap-3 pt-2">
              <CTAButton
                href={whatsappLink(tWa("prefilled"))}
                variant="whatsapp"
                external
              >
                {tCta("whatsapp")}
              </CTAButton>
              <CTAButton href={lp("/book-call")} variant="primary">
                {tCta("primary")}
              </CTAButton>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-navy-deep mb-4">
              {t("formTitle")}
            </h2>
            <form
              action="/api/lead"
              method="post"
              className="space-y-3 rounded-2xl border border-bglight bg-white p-6 shadow-sm"
            >
              <input type="hidden" name="source" value="contact" />
              <input
                type="text"
                name="name"
                required
                placeholder={t("name")}
                className="w-full rounded-md border border-bglight px-3 py-2 text-sm"
                aria-label={t("name")}
              />
              <input
                type="email"
                name="email"
                required
                placeholder={t("email")}
                className="w-full rounded-md border border-bglight px-3 py-2 text-sm"
                aria-label={t("email")}
              />
              <textarea
                name="message"
                rows={5}
                required
                placeholder={t("message")}
                className="w-full rounded-md border border-bglight px-3 py-2 text-sm"
                aria-label={t("message")}
              />
              <button type="submit" className="btn-primary w-full justify-center">
                {t("send")}
              </button>
            </form>
          </div>
        </div>
      </Section>
    </>
  );
}

function Field({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-navy/60">
        {label}
      </div>
      {href ? (
        <a
          href={href}
          className="block mt-1 text-navy-deep font-semibold hover:text-gold"
        >
          {value}
        </a>
      ) : (
        <div className="mt-1 text-navy-deep font-semibold">{value}</div>
      )}
    </div>
  );
}
