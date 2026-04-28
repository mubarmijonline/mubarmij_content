"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { locales, type Locale } from "@/i18n/config";

export default function LangToggle({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();

  // Strip current locale prefix to get the path that should remain
  const stripped = stripLocale(pathname);

  return (
    <div className="flex items-center gap-1 text-sm font-semibold" role="group" aria-label="Language toggle">
      {locales.map((loc) => {
        const href = loc === "en" ? stripped || "/" : `/${loc}${stripped}`;
        const active = loc === currentLocale;
        return (
          <Link
            key={loc}
            href={href}
            className={`px-2 py-1 rounded transition-colors ${
              active
                ? "bg-gold text-navy-deep"
                : "text-current hover:text-gold"
            }`}
            aria-current={active ? "page" : undefined}
          >
            {loc.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}

function stripLocale(pathname: string): string {
  for (const loc of locales) {
    if (loc === "en") continue;
    if (pathname === `/${loc}`) return "";
    if (pathname.startsWith(`/${loc}/`)) return pathname.slice(`/${loc}`.length);
  }
  return pathname === "/" ? "" : pathname;
}
