"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X, ChevronDown } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/lib/utils";
import LangToggle from "./LangToggle";
import CTAButton from "../ui/CTAButton";

type Props = { locale: Locale };

export default function Header({ locale }: Props) {
  const t = useTranslations("nav");
  const tCta = useTranslations("cta");
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  const lp = (p: string) => localePath(locale, p);

  const services = [
    { href: lp("/services/automation"), label: t("automation") },
    { href: lp("/services/web-development"), label: t("webDevelopment") },
    { href: lp("/services/mobile-apps"), label: t("mobileApps") },
    { href: lp("/services/maintenance"), label: t("maintenance") },
  ];

  const links = [
    { href: lp("/"), label: t("home") },
    { href: lp("/resources"), label: t("resources") },
    { href: lp("/blog"), label: t("blog") },
    { href: lp("/about"), label: t("about") },
    { href: lp("/contact"), label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-bglight">
      <div className="container mx-auto flex items-center justify-between h-16 md:h-20">
        <Link href={lp("/")} className="group flex items-center gap-2.5" title="MubarmiJ — Home">
          <Image
            src="/icon.svg"
            alt="MubarmiJ logo"
            width={36}
            height={36}
            className="rounded-lg shrink-0"
            priority
          />
          <span className="font-display font-extrabold text-xl bg-gradient-to-r from-navy-deep via-navy to-gold bg-[length:200%_100%] bg-clip-text text-transparent animate-gradient-x">
            MubarmiJ
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6" aria-label="Main">
          <Link href={lp("/")} className="text-sm font-semibold hover:text-gold" title={t("home")}>
            {t("home")}
          </Link>
          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              type="button"
              className="text-sm font-semibold hover:text-gold inline-flex items-center gap-1"
              aria-haspopup="true"
              aria-expanded={servicesOpen}
              onClick={() => setServicesOpen((s) => !s)}
            >
              {t("services")}
              <ChevronDown size={16} />
            </button>
            {servicesOpen && (
              // pt-2 keeps a visible gap while staying inside the hover area,
              // so the dropdown no longer collapses when the cursor crosses it.
              <div className="absolute top-full ltr:left-0 rtl:right-0 pt-2 z-50">
                <div className="w-72 bg-white border border-bglight rounded-lg shadow-navy py-2">
                  {services.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      title={s.label}
                      className="flex items-center w-full h-11 px-4 text-sm whitespace-nowrap overflow-hidden text-ellipsis hover:bg-bglight hover:text-gold"
                      onClick={() => setServicesOpen(false)}
                    >
                      {s.label}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          {links.slice(1).map((l) => (
            <Link key={l.href} href={l.href} title={l.label} className="text-sm font-semibold hover:text-gold">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <LangToggle currentLocale={locale} />
          <CTAButton href={lp("/book-call")} variant="primary" className="text-sm">
            {tCta("primary")}
          </CTAButton>
        </div>

        <button
          type="button"
          className="lg:hidden p-2"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-bglight bg-white">
          <div className="container mx-auto py-4 flex flex-col gap-2">
            {links.map((l) => (
              <Link key={l.href} href={l.href} title={l.label} className="py-2 font-semibold" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <details className="py-1">
              <summary className="cursor-pointer font-semibold">{t("services")}</summary>
              <div className="ps-4 pt-2 flex flex-col gap-2">
                {services.map((s) => (
                  <Link key={s.href} href={s.href} title={s.label} onClick={() => setOpen(false)}>
                    {s.label}
                  </Link>
                ))}
              </div>
            </details>
            <div className="flex items-center justify-between pt-2">
              <LangToggle currentLocale={locale} />
              <CTAButton href={lp("/book-call")} variant="primary" className="text-sm">
                {tCta("primary")}
              </CTAButton>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
