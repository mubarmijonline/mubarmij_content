import { getTranslations } from "next-intl/server";
import { CLIENT_LOGOS } from "@/lib/site";
import { getClientLogos, mediaUrl } from "@/lib/cms";
import LogoBarClient, { type LogoItem } from "./LogoBarClient";

export default async function LogoBar() {
  const t = await getTranslations("logoBar");

  const cmsLogos = await getClientLogos();

  const logos: LogoItem[] =
    cmsLogos.length > 0
      ? cmsLogos.map((l) => ({
          src: mediaUrl(l.logo),
          alt: l.name || l.logo?.alt || "Client logo",
          darkCard: !!l.darkCard,
        }))
      : CLIENT_LOGOS;

  return <LogoBarClient logos={logos} title={t("title")} />;
}
