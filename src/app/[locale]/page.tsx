import { setRequestLocale, getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/config";

import Hero from "@/components/sections/Hero";
import LogoBar from "@/components/sections/LogoBar";
import Problem from "@/components/sections/Problem";
import Solutions from "@/components/sections/Solutions";
import Process from "@/components/sections/Process";
import Testimonials from "@/components/sections/Testimonials";
import LeadMagnet from "@/components/sections/LeadMagnet";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";
import Confetti from "@/components/effects/Confetti";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tWelcome = await getTranslations({ locale, namespace: "welcome" });

  return (
    <>
      <Confetti message={tWelcome("celebrate")} />
      <Hero locale={locale} />
      <LogoBar />
      <Problem locale={locale} />
      <Solutions locale={locale} />
      <Process />
      <Testimonials />
      <LeadMagnet />
      <FAQ locale={locale} />
      <FinalCTA locale={locale} />
    </>
  );
}
