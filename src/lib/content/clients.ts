import type { ClientSummary } from "@/lib/v1";

/**
 * Five of the fifteen client-logos docs are logo-only stubs — no slug, no
 * tagline, no category. They belong in the trusted-by strip (a logo is all
 * they need) but must never reach a card grid, where they'd render as an
 * empty tile, or the sitemap, where they'd 404.
 */
export function hasCaseStudy(c: ClientSummary): boolean {
  return Boolean(c.slug && c.tagline && c.category_label);
}

export function caseStudyClients(clients: ClientSummary[]): ClientSummary[] {
  return clients.filter(hasCaseStudy).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/**
 * Logos for the trusted-by strip. Stubs are welcome here; a logo_url is the
 * only requirement. Deduped by name so a re-import can't double an entry.
 */
export type LogoEntry = { name: string; src: string; darkCard?: boolean };

export function logoEntries(clients: ClientSummary[]): LogoEntry[] {
  const seen = new Set<string>();
  const out: LogoEntry[] = [];
  for (const c of clients) {
    if (!c.logo_url || !c.name) continue;
    const key = c.name.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ name: c.name, src: c.logo_url, darkCard: c.dark_card });
  }
  return out;
}
