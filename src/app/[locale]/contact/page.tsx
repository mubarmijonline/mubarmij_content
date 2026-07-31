import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/config";
import { getAbout } from "@/lib/v1";
import { whatsappLink } from "@/lib/utils";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/site";
import { SectionEyebrow, Shell } from "@/components/system";
import { Arrow, GoldPeriod } from "@/components/system/Typo";
import ContactForm from "@/components/contact/ContactForm";

export const revalidate = 300;

const COPY = {
  en: {
    eyebrow: "Contact",
    title: "Tell us what you sell. We'll tell you what to build",
    lede: "One 30-minute call, then a written scope with a fixed price and a date. No retainer to talk.",
    waLabel: "Fastest",
    waTitle: "WhatsApp us",
    waMsg: "Hi MubarmiJ — I'd like to discuss a project.",
    callLabel: "Call",
    emailLabel: "Email",
    emailTitle: "Send a brief",
    hoursFallback: "Sunday – Thursday, 10:00 – 18:00 (Cairo time)",
  },
  ar: {
    eyebrow: "تواصل معانا",
    title: "قولنا بتبيع إيه، ونقولك تبني إيه",
    lede: "مكالمة 30 دقيقة، وبعدها نطاق مكتوب بسعر ثابت وتاريخ. الكلام مش بفلوس.",
    waLabel: "الأسرع",
    waTitle: "كلمنا واتساب",
    waMsg: "أهلاً مبرمج — عايز أتكلم عن مشروع.",
    callLabel: "اتصال",
    emailLabel: "إيميل",
    emailTitle: "ابعتلنا التفاصيل",
    hoursFallback: "الأحد – الخميس، 10:00 – 18:00 (بتوقيت القاهرة)",
  },
} as const;

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
  const t = COPY[locale];

  // Phone, email and opening hours are CMS-owned, not duplicated in messages.
  const about = await getAbout(locale);
  const phone = about?.contact?.phone || CONTACT_PHONE;
  const email = about?.contact?.email || CONTACT_EMAIL;
  const hours = about?.contact?.hours || t.hoursFallback;

  return (
    <section className="surf-light border-b border-hair">
      <Shell className="grid grid-cols-1 lg:grid-cols-[1.05fr_1fr]">
        <div className="border-hair py-14 lg:border-e lg:py-16 lg:pe-12">
          <SectionEyebrow>{t.eyebrow}</SectionEyebrow>
          <h1 className="mt-3.5 max-w-[15em] text-balance font-display text-d1 font-bold text-fg">
            {t.title}
            <GoldPeriod />
          </h1>
          <p className="mt-5 max-w-[34em] text-lede text-fgbody">{t.lede}</p>

          <div className="mt-10 border-t border-hair">
            <ContactRow
              locale={locale}
              href={whatsappLink(t.waMsg)}
              external
              label={t.waLabel}
              title={t.waTitle}
              value={phone}
            />
            <ContactRow
              locale={locale}
              href={`tel:${phone.replace(/\s+/g, "")}`}
              label={t.callLabel}
              title={hours}
              value={phone}
            />
            <ContactRow
              locale={locale}
              href={`mailto:${email}`}
              label={t.emailLabel}
              title={t.emailTitle}
              value={email}
            />
          </div>
        </div>

        <div className="py-14 lg:ps-12 lg:pt-16">
          <ContactForm locale={locale} />
        </div>
      </Shell>
    </section>
  );
}

function ContactRow({
  locale,
  href,
  external,
  label,
  title,
  value,
}: {
  locale: Locale;
  href: string;
  external?: boolean;
  label: string;
  title: string;
  value: string;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="focus-gold group flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-hair py-5 transition-colors hover:bg-paper-subtle"
    >
      <span className="min-w-0">
        <span className="mono block text-eyebrow uppercase text-accent">{label}</span>
        <span className="mt-1 block font-display text-[17px] font-semibold text-fg">{title}</span>
      </span>
      <span className="mono ltr-island flex items-center gap-2 text-[13px] text-fgmuted transition-colors group-hover:text-fg">
        {value}
        <Arrow locale={locale} />
      </span>
    </a>
  );
}
