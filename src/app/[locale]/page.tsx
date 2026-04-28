import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/config";

import Hero from "@/components/sections/Hero";
import LogoBar from "@/components/sections/LogoBar";
import Problem from "@/components/sections/Problem";
import Solutions from "@/components/sections/Solutions";
import CaseStudiesFeatured from "@/components/sections/CaseStudiesFeatured";
import Process from "@/components/sections/Process";
import PricingSnapshot from "@/components/sections/PricingSnapshot";
import Testimonials from "@/components/sections/Testimonials";
import LeadMagnet from "@/components/sections/LeadMagnet";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero locale={locale} />
      <LogoBar />
      <Problem locale={locale} />
      <Solutions locale={locale} />
      <CaseStudiesFeatured />
      <Process />
      <PricingSnapshot locale={locale} />
      <Testimonials />
      <LeadMagnet />
      <FAQ locale={locale} />
      <FinalCTA locale={locale} />
    </>
  );
}
