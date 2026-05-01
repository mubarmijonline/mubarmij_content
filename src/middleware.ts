import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n/config";

export default createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: "as-needed", // English at /, Arabic at /ar
  // Default is English. Do NOT auto-redirect to /ar based on Accept-Language —
  // visitors switch via the LangToggle. This is the explicit user preference.
  localeDetection: false,
});

export const config = {
  // Match all paths except static assets, api, and Next internals
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
