"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import type { Locale } from "@/i18n/config";
import { cn, localePath, whatsappLink } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/system";

type NavItem = { label: string; href: string };
type ServiceItem = { label: string; desc: string; href: string };

const LABELS: Record<
  Locale,
  {
    home: string;
    services: string;
    work: string;
    pricing: string;
    resources: string;
    blog: string;
    about: string;
    book: string;
    whatsapp: string;
    whatsappMsg: string;
    toggle: string;
    menu: string;
    close: string;
    svc: ServiceItem[];
  }
> = {
  en: {
    home: "Home",
    services: "Services",
    work: "Work",
    pricing: "Pricing",
    resources: "Resources",
    blog: "Blog",
    about: "About",
    book: "Book a call",
    whatsapp: "WhatsApp us",
    whatsappMsg: "Hi MubarmiJ — I'd like to discuss a project.",
    toggle: "EN / AR",
    menu: "Menu",
    close: "Close",
    svc: [
      { label: "E-commerce", desc: "Storefronts built to sell", href: "/services/ecommerce" },
      { label: "Web Development", desc: "Sites that bring clients", href: "/services/web-development" },
      { label: "Mobile Apps", desc: "iOS & Android, built right", href: "/services/mobile-apps" },
      { label: "Automation", desc: "Systems that work for you 24/7", href: "/services/automation" },
      { label: "Maintenance", desc: "Fast, secure, always online", href: "/services/maintenance" },
    ],
  },
  ar: {
    home: "الرئيسية",
    services: "خدماتنا",
    work: "أعمالنا",
    pricing: "الأسعار",
    resources: "موارد",
    blog: "المدونة",
    about: "من نحن",
    book: "احجز مكالمة",
    whatsapp: "كلمنا واتساب",
    whatsappMsg: "أهلاً مبرمج — عايز أتكلم عن مشروع.",
    toggle: "EN / AR",
    menu: "القائمة",
    close: "إغلاق",
    svc: [
      { label: "E-commerce", desc: "متاجر مبنية عشان تبيع", href: "/services/ecommerce" },
      { label: "Web Development", desc: "مواقع بتجيب عملاء", href: "/services/web-development" },
      { label: "Mobile Apps", desc: "تطبيقات iOS وأندرويد", href: "/services/mobile-apps" },
      { label: "Automation", desc: "أنظمة بتشتغل بدالك ٢٤/٧", href: "/services/automation" },
      { label: "الصيانة", desc: "سريع وآمن وأونلاين دايمًا", href: "/services/maintenance" },
    ],
  },
};

/** Strip the /ar prefix so the language toggle lands on the same page. */
function barePath(p: string): string {
  if (p === "/ar") return "/";
  if (p.startsWith("/ar/")) return p.slice(3);
  return p || "/";
}

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = LABELS[locale];
  const pathname = usePathname() || "/";
  const other: Locale = locale === "en" ? "ar" : "en";
  const toggleHref = localePath(other, barePath(pathname));

  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  const links: NavItem[] = [
    { label: t.work, href: localePath(locale, "/case-studies") },
    { label: t.pricing, href: localePath(locale, "/pricing") },
    { label: t.resources, href: localePath(locale, "/resources") },
    { label: t.blog, href: localePath(locale, "/blog") },
    { label: t.about, href: localePath(locale, "/about") },
    { label: t.book, href: localePath(locale, "/book-call") },
  ];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setServicesOpen(false);
        setMobileOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setServicesOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  const navLink = "rounded-chip px-1 py-2 text-[15px] font-medium text-fgbody transition-colors hover:text-fg focus-gold";

  return (
    <header className="surf-light sticky top-0 z-50 border-b border-t-[3px] border-b-hair border-t-gold bg-white/[0.92] backdrop-blur-[14px]">
      <div className="shell flex items-center gap-6 py-3 lg:gap-10">
        <Link
          href={localePath(locale, "/")}
          className="focus-gold flex shrink-0 items-center gap-3"
          aria-label="MubarmiJ"
        >
          {/* The navy/gold tile, not the transparent wordmark — the latter is
              light-on-transparent and disappears against the white header. */}
          <Image
            src="/downloads/logos/mj-logo.svg"
            alt=""
            width={38}
            height={38}
            className="h-[38px] w-[38px] rounded-[9px]"
          />
          <span className="font-display text-[19px] font-bold tracking-[-0.02em] text-fg">MubarmiJ</span>
        </Link>

        <nav aria-label="Primary" className="ms-auto hidden items-center gap-5 lg:flex">
          <Link href={localePath(locale, "/")} className={navLink}>
            {t.home}
          </Link>

          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => {
              clearTimeout(closeTimer.current);
              setServicesOpen(true);
            }}
            onMouseLeave={() => {
              closeTimer.current = setTimeout(() => setServicesOpen(false), 120);
            }}
          >
            <button
              type="button"
              aria-expanded={servicesOpen}
              aria-haspopup="true"
              onClick={() => setServicesOpen((v) => !v)}
              className={cn(navLink, "flex items-center gap-1")}
            >
              {t.services}
              <svg
                viewBox="0 0 24 24"
                className={cn("h-4 w-4 transition-transform", servicesOpen && "rotate-180")}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {servicesOpen ? (
              <div className="animate-rise absolute start-0 top-full z-10 mt-3 w-80 rounded-panel border border-hair bg-white p-2 shadow-lift">
                {t.svc.map((s) => (
                  <Link
                    key={s.href}
                    href={localePath(locale, s.href)}
                    className="focus-gold group flex flex-col rounded-chip px-3 py-2.5 transition-colors hover:bg-paper-subtle"
                    onClick={() => setServicesOpen(false)}
                  >
                    <span className="text-[14.5px] font-semibold text-fg group-hover:text-gold-deep">
                      {s.label}
                    </span>
                    <span className="text-[13px] text-fgmuted">{s.desc}</span>
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          {links.map((l) => (
            <Link key={l.href} href={l.href} className={navLink}>
              {l.label}
            </Link>
          ))}

          <span aria-hidden="true" className="h-5 w-px bg-hair" />

          <Link
            href={toggleHref}
            className="mono focus-gold ltr-island text-[12px] text-fgmuted transition-colors hover:text-fg"
            aria-label={other === "ar" ? "التبديل إلى العربية" : "Switch to English"}
          >
            {t.toggle}
          </Link>

          <a
            href={whatsappLink(t.whatsappMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-gold inline-flex shrink-0 items-center gap-2.5 rounded-btn bg-ink px-5 py-[11px] font-display text-[14.5px] font-semibold text-white transition-colors hover:bg-gold hover:text-ink"
          >
            <WhatsAppIcon size={18} />
            {t.whatsapp}
          </a>
        </nav>

        <button
          type="button"
          className="focus-gold ms-auto rounded-chip border border-hairbtn p-2 text-fg lg:hidden"
          aria-label={t.menu}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {mobileOpen ? (
        <div className="surf-light fixed inset-0 z-50 overflow-y-auto bg-white px-5 py-4 lg:hidden">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-3">
              <Image
                src="/downloads/logos/mj-logo.svg"
                alt=""
                width={34}
                height={34}
                className="h-[34px] w-[34px] rounded-[9px]"
              />
              <span className="font-display text-[18px] font-bold text-fg">MubarmiJ</span>
            </span>
            <button
              type="button"
              className="focus-gold rounded-chip border border-hairbtn p-2 text-fg"
              aria-label={t.close}
              onClick={() => setMobileOpen(false)}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav className="mt-6 flex flex-col" aria-label="Mobile">
            <Link href={localePath(locale, "/")} className="border-b border-hair py-3.5 text-[17px] font-medium text-fg">
              {t.home}
            </Link>
            <p className="mono pt-5 text-eyebrow uppercase text-accent">{t.services}</p>
            {t.svc.map((s) => (
              <Link
                key={s.href}
                href={localePath(locale, s.href)}
                className="border-b border-hair py-3 text-[16px] text-fgbody"
              >
                {s.label}
              </Link>
            ))}
            <div className="h-4" />
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="border-b border-hair py-3.5 text-[17px] font-medium text-fg">
                {l.label}
              </Link>
            ))}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={toggleHref}
                className="mono ltr-island rounded-btn border border-hairbtn px-4 py-2.5 text-[13px] text-fg"
              >
                {t.toggle}
              </Link>
              <a
                href={whatsappLink(t.whatsappMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-btn bg-ink px-5 py-3 font-display text-[15px] font-semibold text-white"
              >
                <WhatsAppIcon size={18} />
                {t.whatsapp}
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
