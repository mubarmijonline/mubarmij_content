"use client";

import { useTranslations } from "next-intl";
import { whatsappLink } from "@/lib/utils";

export default function WhatsAppFloat() {
  const t = useTranslations("whatsapp");
  return (
    <a
      href={whatsappLink(t("prefilled"))}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("tooltip")}
      className="fixed z-50 bottom-5 ltr:right-5 rtl:left-5 rounded-full bg-whatsapp shadow-navy text-white p-3.5 hover:scale-105 transition-transform animate-pulse-slow group"
      data-event="click_whatsapp_float"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-7 h-7"
        aria-hidden="true"
      >
        <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.81 11.81 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.69-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.692 5.55l-.999 3.648 3.796-.997zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.074-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
      </svg>
      <span className="hidden md:block absolute bottom-full mb-2 ltr:right-0 rtl:left-0 whitespace-nowrap bg-navy-deep text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
        {t("tooltip")}
      </span>
    </a>
  );
}
