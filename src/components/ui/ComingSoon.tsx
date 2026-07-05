import Link from "next/link";
import { getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/config";
import { localePath, whatsappLink } from "@/lib/utils";
import Section from "@/components/ui/Section";
import CTAButton from "@/components/ui/CTAButton";

type Props = {
  locale: Locale;
  title: string;
  sub?: string;
  /** Optional extra content rendered above the CTAs (e.g. featured items). */
  children?: React.ReactNode;
};

/**
 * Branded "page exists, content in progress" shell — used as a polite landing
 * for routes the nav links to but whose full content isn't ready yet.
 * Always pushes visitors to the real conversion: Book Call / WhatsApp.
 */
export default async function ComingSoon({ locale, title, sub, children }: Props) {
  const t = await getTranslations({ locale, namespace: "comingSoon" });
  const tWa = await getTranslations({ locale, namespace: "whatsapp" });
  const lp = (p: string) => localePath(locale, p);

  return (
    <Section bg="gradient" padded>
      <div className="max-w-3xl mx-auto text-center py-12 md:py-20">
        <span className="inline-block text-xs uppercase tracking-widest font-bold text-gold mb-4">
          {t("badge")}
        </span>
        <h1 className="font-display text-3xl md:text-5xl font-extrabold leading-tight mb-4">
          {title}
        </h1>
        {sub && <p className="text-lg md:text-xl text-white/80 mb-6">{sub}</p>}
        <p className="text-white/70 mb-8">{t("sub")}</p>

        {children && <div className="mb-10 text-start">{children}</div>}

        <div className="flex flex-wrap items-center justify-center gap-4">
          <CTAButton href={lp("/book-call")} variant="primary" size="lg">
            {t("primaryCta")}
          </CTAButton>
          <CTAButton
            href={whatsappLink(tWa("prefilled"))}
            variant="whatsapp"
            external
            size="lg"
          >
            {t("secondaryCta")}
          </CTAButton>
        </div>

        <div className="mt-10">
          <Link
            href={lp("/")}
            className="text-sm text-white/70 hover:text-gold underline-offset-4 hover:underline"
          >
            {t("backHome")}
          </Link>
        </div>
      </div>
    </Section>
  );
}
