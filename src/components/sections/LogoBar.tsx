import { getTranslations } from "next-intl/server";
import { CLIENT_LOGOS } from "@/lib/site";
import { getClientLogos, mediaUrl } from "@/lib/cms";
import { localePath } from "@/lib/utils";
import type { Locale } from "@/i18n/config";
import LogoBarClient, { type LogoItem } from "./LogoBarClient";

export default async function LogoBar({ locale = "en" }: { locale?: Locale } = {}) {
  const t = await getTranslations("logoBar");

  const cmsLogos = await getClientLogos();

  const logos: LogoItem[] =
    cmsLogos.length > 0
      ? cmsLogos.map((l) => ({
          src: mediaUrl(l.logo),
          alt: l.name || l.logo?.alt || "Client logo",
          darkCard: !!l.darkCard,
          // The logo becomes clickable unless the profile is explicitly
          // saved as a `draft` in the CMS. New entries default to `draft`,
          // so they need to be set to `published` to go live; entries that
          // existed before the field was added stay visible automatically.
          href:
            l.publishStatus !== "draft" && l.slug
              ? localePath(locale, `/clients/${l.slug}`)
              : undefined,
        }))
      : CLIENT_LOGOS;

  return <LogoBarClient logos={logos} title={t("title")} />;
}
