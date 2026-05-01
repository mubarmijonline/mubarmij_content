import "../globals.css";
import type { Metadata, Viewport } from "next";
import { Inter, Poppins, Cairo, Tajawal } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { locales, localeDirection, type Locale } from "@/i18n/config";
import { SITE_URL } from "@/lib/site";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsAppFloat from "@/components/layout/WhatsAppFloat";
import AnalyticsScripts from "@/components/layout/AnalyticsScripts";
import VisitTracker from "@/components/layout/VisitTracker";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});
const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: isAr
        ? "مبرمج — أتمتة، مواقع، تطبيقات موبايل"
        : "MubarmiJ — Automation, Web & Mobile Apps",
      template: isAr ? "%s | مبرمج" : "%s | MubarmiJ",
    },
    description: isAr
      ? "بنبني أنظمة بتشتغل مكانك ومواقع بتجيبلك عملاء — شريك تقني واحد لشركتك."
      : "We build systems that work for you and websites that bring clients — one technical partner for your business.",
    alternates: {
      canonical: locale === "en" ? "/" : `/${locale}`,
      languages: {
        en: "/",
        ar: "/ar",
        "x-default": "/",
      },
    },
    openGraph: {
      type: "website",
      siteName: "MubarmiJ",
      locale: isAr ? "ar_EG" : "en_US",
      url: locale === "en" ? "/" : `/${locale}`,
      title: isAr
        ? "مبرمج — أتمتة، مواقع، تطبيقات موبايل"
        : "MubarmiJ — Automation, Web & Mobile Apps",
      description: isAr
        ? "بنبني أنظمة بتشتغل مكانك ومواقع بتجيبلك عملاء — شريك تقني واحد لشركتك."
        : "We build systems that work for you and websites that bring clients — one technical partner for your business.",
      images: [
        {
          url: "/images/Mubarmij_logo_white_background.jpg",
          width: 1200,
          height: 630,
          alt: "MubarmiJ",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isAr
        ? "مبرمج — أتمتة، مواقع، تطبيقات موبايل"
        : "MubarmiJ — Automation, Web & Mobile Apps",
      description: isAr
        ? "بنبني أنظمة بتشتغل مكانك ومواقع بتجيبلك عملاء."
        : "We build systems that work for you and websites that bring clients.",
      images: ["/images/Mubarmij_logo_white_background.jpg"],
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#0A1628",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = localeDirection[locale];

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${poppins.variable} ${cairo.variable} ${tajawal.variable}`}
    >
      <body className={dir === "rtl" ? "font-arabic" : "font-sans"}>
        <a href="#main" className="skip-link">
          {locale === "ar" ? "تخطّ إلى المحتوى" : "Skip to content"}
        </a>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header locale={locale} />
          <main id="main">{children}</main>
          <Footer locale={locale} />
          <WhatsAppFloat />
        </NextIntlClientProvider>
        <AnalyticsScripts />
        <VisitTracker locale={locale} />
      </body>
    </html>
  );
}
