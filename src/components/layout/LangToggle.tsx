"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { locales, type Locale } from "@/i18n/config";

/** Tiny inline SVG flags so we don't depend on emoji rendering or external assets. */
function FlagUK({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 30"
      className={className}
      width="20"
      height="14"
      aria-hidden="true"
      focusable="false"
    >
      <clipPath id="uk-c">
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id="uk-t">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath="url(#uk-c)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path
          d="M0,0 L60,30 M60,0 L0,30"
          clipPath="url(#uk-t)"
          stroke="#C8102E"
          strokeWidth="4"
        />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}

function FlagEG({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 40"
      className={className}
      width="20"
      height="14"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="60" height="40" fill="#fff" />
      <rect width="60" height="13.34" y="0" fill="#CE1126" />
      <rect width="60" height="13.34" y="26.66" fill="#000" />
      {/* Stylised Eagle of Saladin in gold */}
      <circle cx="30" cy="20" r="3.2" fill="#C09300" />
    </svg>
  );
}

const flagFor = (loc: Locale) => (loc === "ar" ? <FlagEG /> : <FlagUK />);
const labelFor = (loc: Locale) => (loc === "ar" ? "العربية" : "English");

export default function LangToggle({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();

  // Strip current locale prefix to get the path that should remain
  const stripped = stripLocale(pathname);

  return (
    <div
      className="flex items-center gap-1 text-sm font-semibold"
      role="group"
      aria-label="Language toggle"
    >
      {locales.map((loc) => {
        const href = loc === "en" ? stripped || "/" : `/${loc}${stripped}`;
        const active = loc === currentLocale;
        return (
          <Link
            key={loc}
            href={href}
            title={`Switch to ${labelFor(loc)}`}
            aria-label={`Switch to ${labelFor(loc)}`}
            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
              active
                ? "bg-gold text-navy-deep"
                : "text-current hover:text-gold"
            }`}
            aria-current={active ? "page" : undefined}
          >
            <span className="inline-block leading-none rounded-sm overflow-hidden ring-1 ring-black/10 align-middle">
              {flagFor(loc)}
            </span>
            <span>{loc.toUpperCase()}</span>
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
