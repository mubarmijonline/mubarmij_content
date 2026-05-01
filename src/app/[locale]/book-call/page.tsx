import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { MessageCircle, Calendar, Mail, Phone } from "lucide-react";

import type { Locale } from "@/i18n/config";
import { whatsappLink } from "@/lib/utils";
import { CALENDLY_URL, CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/site";
import Section from "@/components/ui/Section";
import CTAButton from "@/components/ui/CTAButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "bookCall" });
  return { title: t("title"), description: t("sub") };
}

export default async function BookCallPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "bookCall" });
  const tWa = await getTranslations({ locale, namespace: "whatsapp" });
  const tCta = await getTranslations({ locale, namespace: "cta" });

  const channels = [
    {
      icon: MessageCircle,
      label: t("whatsapp"),
      sub: t("whatsappSub"),
      href: whatsappLink(tWa("prefilled")),
      cta: tCta("whatsapp"),
      variant: "whatsapp" as const,
      external: true,
      featured: true,
    },
    ...(CALENDLY_URL
      ? [
          {
            icon: Calendar,
            label: t("calendly"),
            sub: t("calendlySub"),
            href: CALENDLY_URL,
            cta: tCta("primary"),
            variant: "primary" as const,
            external: true,
            featured: false,
          },
        ]
      : []),
    {
      icon: Mail,
      label: t("email"),
      sub: t("emailSub"),
      href: `mailto:${CONTACT_EMAIL}`,
      cta: CONTACT_EMAIL,
      variant: "secondary" as const,
      external: true,
      featured: false,
    },
    {
      icon: Phone,
      label: t("phone"),
      sub: t("phoneSub"),
      href: `tel:${CONTACT_PHONE.replace(/\s+/g, "")}`,
      cta: CONTACT_PHONE,
      variant: "secondary" as const,
      external: true,
      featured: false,
    },
  ];

  return (
    <>
      <Section bg="gradient">
        <div className="max-w-3xl mx-auto text-center py-10 md:py-16">
          <h1 className="font-display text-3xl md:text-5xl font-extrabold leading-tight">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/85">{t("sub")}</p>
        </div>
      </Section>

      <Section bg="white">
        <h2 className="section-title text-center">{t("channelsTitle")}</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-2 max-w-4xl mx-auto">
          {channels.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.label}
                className={`rounded-2xl p-6 border flex flex-col gap-4 ${
                  c.featured
                    ? "border-gold bg-gold/5 shadow-gold"
                    : "border-bglight bg-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-navy-deep text-gold p-2">
                    <Icon size={20} />
                  </span>
                  <div>
                    <h3 className="font-display font-bold text-navy-deep">
                      {c.label}
                    </h3>
                    <p className="text-sm text-textmuted">{c.sub}</p>
                  </div>
                </div>
                <CTAButton
                  href={c.href}
                  variant={c.variant}
                  external={c.external}
                  className="w-full justify-center"
                >
                  {c.cta}
                </CTAButton>
              </div>
            );
          })}
        </div>
      </Section>

      <Section bg="light">
        <h2 className="section-title text-center">{t("whatHappensTitle")}</h2>
        <ol className="mt-8 max-w-2xl mx-auto space-y-4">
          {[t("step1"), t("step2"), t("step3")].map((step, i) => (
            <li
              key={step}
              className="flex items-start gap-4 rounded-xl bg-white p-5 border border-bglight"
            >
              <span className="flex-none w-9 h-9 rounded-full bg-navy-deep text-gold font-display font-extrabold flex items-center justify-center">
                {i + 1}
              </span>
              <p className="text-navy">{step}</p>
            </li>
          ))}
        </ol>
      </Section>
    </>
  );
}
