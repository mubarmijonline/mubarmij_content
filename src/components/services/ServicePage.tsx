import { notFound } from "next/navigation";

import type { Locale } from "@/i18n/config";
import { getService } from "@/lib/v1";
import { localePath } from "@/lib/utils";
import { CTAPanel } from "@/components/system";

import ServiceHero from "./ServiceHero";
import PainPoints from "./PainPoints";
import ServiceProcess from "./ServiceProcess";
import Capabilities from "./Capabilities";
import Differentiators from "./Differentiators";
import RoiCalculator from "./RoiCalculator";

const CTA = {
  en: {
    title: "Ready to put this to work?",
    sub: "Book a free consultation — we'll map the fastest win for your business.",
    cta: "Book a free consultation",
    wa: "Chat on WhatsApp",
  },
  ar: {
    title: "جاهز نبدأ؟",
    sub: "احجز استشارة مجانية — هنحدّد أسرع مكسب لشغلك.",
    cta: "احجز استشارة مجانية",
    wa: "تواصل على واتساب",
  },
} as const;

/** Shared v2 service page driven by /v1/services/[slug]. */
export default async function ServicePage({ slug, locale }: { slug: string; locale: Locale }) {
  const service = await getService(slug, locale);
  if (!service) notFound();

  const c = CTA[locale];
  const waMsg =
    locale === "ar"
      ? `أهلاً مبرمج! مهتم بخدمة: ${service.title}`
      : `Hi MubarmiJ! I'm interested in: ${service.title}`;

  const ld = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: service.title,
    name: service.title,
    description: service.summary || service.intro,
    provider: { "@type": "Organization", name: "MubarmiJ" },
    areaServed: "EG",
  };

  return (
    <>
      <ServiceHero locale={locale} service={service} />
      <PainPoints locale={locale} items={service.pain_points} />
      <ServiceProcess locale={locale} service={service} />
      <Capabilities locale={locale} types={service.types} />
      {service.has_roi_calculator ? <RoiCalculator locale={locale} /> : null}
      <Differentiators locale={locale} items={service.differentiators} />
      <CTAPanel
        title={c.title}
        subtitle={c.sub}
        ctaHref={localePath(locale, "/book-call")}
        ctaLabel={c.cta}
        whatsappLabel={c.wa}
        whatsappMessage={waMsg}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
