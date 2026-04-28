import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, defaultLocale, type Locale } from "./config";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = (await requestLocale) as Locale | undefined;
  if (!locale || !locales.includes(locale)) {
    if (locale) notFound();
    locale = defaultLocale;
  }
  const messages = (await import(`../../messages/${locale}.json`)).default;
  return { locale, messages };
});
