/**
 * Deterministic navy-gradient placeholder for clients that don't have a cover
 * image uploaded yet. Same slug -> same gradient, different slugs vary.
 */

const GRADIENT_VARIANTS = [
  "linear-gradient(135deg, #0A1628 0%, #1E3A5F 50%, #0A1628 100%)",
  "linear-gradient(135deg, #061020 0%, #2C4A6E 100%)",
  "linear-gradient(135deg, #0A1628 0%, #112944 50%, #1E3A5F 100%)",
  "linear-gradient(160deg, #0A1628 0%, #243E5C 100%)",
  "linear-gradient(135deg, #1A2F4A 0%, #0A1628 100%)",
  "linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)",
];

export function gradientForSlug(slug: string | undefined | null): string {
  const key = (slug || "default").toString();
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash += key.charCodeAt(i);
  return GRADIENT_VARIANTS[hash % GRADIENT_VARIANTS.length];
}

export function initialsForName(name: string | undefined | null): string {
  if (!name) return "MJ";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((w) => w[0] || "")
    .join("")
    .toUpperCase();
}

/**
 * Choose the best object-fit for a cover image based on its natural aspect
 * ratio. Landscape images (>= 1.1 aspect) look great filling the container
 * (`cover`). Portrait / squareish images would get badly cropped, so we
 * fall back to `contain` and let the brand-gradient backdrop fill the gap.
 */
export function coverFit(
  media: { width?: number; height?: number } | null | undefined,
): "cover" | "contain" {
  const w = media?.width;
  const h = media?.height;
  if (!w || !h) return "cover";
  return w / h >= 1.1 ? "cover" : "contain";
}
