import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/config";
import { getService } from "@/lib/v1";
import ServicePage from "@/components/services/ServicePage";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const service = await getService("automation", locale);
  return { title: service?.title, description: service?.summary || service?.intro };
}

export default async function AutomationPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ServicePage slug="automation" locale={locale} />;
}
