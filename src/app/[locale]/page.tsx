import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/config";
import { CLIENT_LOGOS } from "@/lib/site";
import { localePath } from "@/lib/utils";
import { getClients, getFaq, getReels, getTestimonials } from "@/lib/v1";
import { CTAPanel, LogoBar } from "@/components/system";

import Hero from "@/components/home/Hero";
import Problem from "@/components/home/Problem";
import Solutions from "@/components/home/Solutions";
import FeaturedCaseStudies from "@/components/home/FeaturedCaseStudies";
import Process from "@/components/home/Process";
import Testimonials from "@/components/home/Testimonials";
import PricingSnapshot from "@/components/home/PricingSnapshot";
import LeadMagnet from "@/components/home/LeadMagnet";
import FaqSection from "@/components/home/FaqSection";
import ReelsRow from "@/components/reels/ReelsRow";

// Render on every request so CMS changes (logos, profiles, etc.) show up
// immediately without waiting for an ISR window.
export const dynamic = "force-dynamic";
export const revalidate = 0;

const COPY = {
  en: {
    logos: "Trusted by companies like",
    ctaTitle: "Let's build something that works for you.",
    ctaSub: "Tell us where time leaks out — we'll show you what to automate first.",
    ctaLabel: "Book a free consultation",
    waLabel: "Chat on WhatsApp",
    waMsg: "Hi MubarmiJ! I'd like to discuss a project.",
  },
  ar: {
    logos: "موثوق من شركات زي",
    ctaTitle: "خلّينا نبني حاجة بتشتغل مكانك.",
    ctaSub: "قولّنا فين بيضيع وقتك — وهنوريك تبدأ تأتمت إيه الأول.",
    ctaLabel: "احجز استشارة مجانية",
    waLabel: "تواصل على واتساب",
    waMsg: "أهلاً مبرمج! حابب أناقش مشروع.",
  },
} as const;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = COPY[locale];
  const dir = locale === "ar" ? "rtl" : "ltr";

  const [clientsEnv, testimonials, faq, reelsEnv] = await Promise.all([
    getClients(locale, { featured: true, limit: 6 }),
    getTestimonials(locale),
    getFaq(locale),
    getReels(locale, { limit: 12 }),
  ]);
  // Fall back to recent clients when none are flagged featured yet.
  let clients = clientsEnv?.data ?? [];
  if (!clients.length) {
    const recent = await getClients(locale, { limit: 6 });
    clients = recent?.data ?? [];
  }
  const reels = reelsEnv?.data ?? [];
  const logos = CLIENT_LOGOS.map((l) => ({ src: l.src, alt: l.alt }));

  return (
    <>
      <Hero locale={locale} />
      <ReelsRow locale={locale} reels={reels} showAll />
      <LogoBar logos={logos} eyebrow={t.logos} dir={dir} />
      <FeaturedCaseStudies locale={locale} clients={clients} />
      <Solutions locale={locale} />
      <Process locale={locale} />
      <Testimonials locale={locale} testimonials={testimonials} />
      <PricingSnapshot locale={locale} />
      <LeadMagnet locale={locale} />
      <FaqSection locale={locale} items={faq} />
      <Problem locale={locale} />
      <CTAPanel
        title={t.ctaTitle}
        subtitle={t.ctaSub}
        ctaHref={localePath(locale, "/book-call")}
        ctaLabel={t.ctaLabel}
        whatsappLabel={t.waLabel}
        whatsappMessage={t.waMsg}
      />
    </>
  );
}
