import { WHATSAPP_NUMBER } from "./site";

/**
 * Tiny `cn` helper (clsx-style) without external deps. Joins truthy
 * class names with a space; later strings win for Tailwind in practice
 * because the JIT picks classes by source order.
 */
export function cn(
  ...inputs: Array<string | number | null | false | undefined | Record<string, unknown>>
): string {
  const out: string[] = [];
  for (const item of inputs) {
    if (!item) continue;
    if (typeof item === "string" || typeof item === "number") {
      out.push(String(item));
    } else if (typeof item === "object") {
      for (const [k, v] of Object.entries(item)) if (v) out.push(k);
    }
  }
  return out.join(" ");
}

export function whatsappLink(prefilledMessage?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  if (!prefilledMessage) return base;
  return `${base}?text=${encodeURIComponent(prefilledMessage)}`;
}

export function localePath(locale: string, path = "/") {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === "en") return clean;
  return `/${locale}${clean === "/" ? "" : clean}`;
}

/**
 * Normalize a CMS media URL for browser use. The /api/v1 API sometimes returns
 * absolute URLs against an internal host (e.g. http://localhost:3000). nginx
 * serves /api/media on the public origin, so we strip the host to a same-origin
 * relative path that works for visitors.
 */
export function cmsMedia(url?: string | null): string {
  if (!url) return "";
  return url.replace(/^https?:\/\/localhost(:\d+)?/i, "").replace(/^https?:\/\/127\.0\.0\.1(:\d+)?/i, "");
}
