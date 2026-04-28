import { WHATSAPP_NUMBER } from "./site";

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
