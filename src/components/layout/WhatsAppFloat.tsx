"use client";

import { useTranslations } from "next-intl";
import { whatsappLink } from "@/lib/utils";
import { WhatsAppGlyphOnGreen } from "@/components/system";

export default function WhatsAppFloat() {
  const t = useTranslations("whatsapp");
  return (
    <a
      href={whatsappLink(t("prefilled"))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("tooltip")}
      className="group fixed bottom-5 end-5 z-50 rounded-full shadow-lift transition-transform hover:scale-105 focus-gold"
      data-event="click_whatsapp_float"
    >
      <WhatsAppGlyphOnGreen size={52} className="block" />
      <span className="mono absolute bottom-full end-0 mb-2 hidden whitespace-nowrap rounded-chip bg-ink px-2.5 py-1.5 text-[11px] text-white opacity-0 transition-opacity group-hover:opacity-100 md:block">
        {t("tooltip")}
      </span>
    </a>
  );
}
