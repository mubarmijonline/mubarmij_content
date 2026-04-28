import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n/config";

export default createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: "as-needed", // English at /, Arabic at /ar
  localeDetection: true,
});

export const config = {
  // Match all paths except static assets, api, and Next internals
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
