export type V1Locale = "en" | "ar"

// Pick locale from Accept-Language. Default 'en'. Fallback aware.
export function pickLocale(req: Request): V1Locale {
  const raw = req.headers.get("accept-language") || ""
  const tag = raw.split(",")[0]?.trim().toLowerCase() || ""
  if (tag.startsWith("ar")) return "ar"
  return "en"
}

// Pick a localized field (`{ en, ar }`) honoring the request locale, with EN fallback.
export function pickLocalized(
  obj: { en?: string | null; ar?: string | null } | undefined | null,
  locale: V1Locale,
): string {
  if (!obj) return ""
  if (locale === "ar" && obj.ar && obj.ar.trim()) return obj.ar
  return obj.en ?? obj.ar ?? ""
}
