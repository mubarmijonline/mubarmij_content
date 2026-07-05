"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import type { Locale } from "@/i18n/config";
import { cn, localePath } from "@/lib/utils";

type NavItem = { label: string; href: string };
type ServiceItem = { label: string; desc: string; href: string };

const LABELS: Record<Locale, {
  home: string; services: string; cases: string; pricing: string; resources: string; blog: string; about: string;
  book: string; toggle: string; menu: string; close: string;
  svc: { automation: ServiceItem; web: ServiceItem; mobile: ServiceItem; maintenance: ServiceItem };
}> = {
  en: {
    home: "Home", services: "Services", cases: "Case Studies", pricing: "Pricing",
    resources: "Resources", blog: "Blog", about: "About", book: "Book free consultation",
    toggle: "EN / AR", menu: "Menu", close: "Close",
    svc: {
      automation: { label: "Automation", desc: "Systems that work for you 24/7", href: "/services/automation" },
      web: { label: "Web Development", desc: "Sites that bring clients", href: "/services/web-development" },
      mobile: { label: "Mobile Apps", desc: "iOS & Android, built right", href: "/services/mobile-apps" },
      maintenance: { label: "Maintenance", desc: "Fast, secure, always online", href: "/services/maintenance" },
    },
  },
  ar: {
    home: "الرئيسية", services: "خدماتنا", cases: "دراسات الحالة", pricing: "الأسعار",
    resources: "موارد", blog: "المدونة", about: "من نحن", book: "احجز استشارة مجانية",
    toggle: "EN / AR", menu: "القائمة", close: "إغلاق",
    svc: {
      automation: { label: "Automation", desc: "أنظمة بتشتغل بدالك ٢٤/٧", href: "/services/automation" },
      web: { label: "Web Development", desc: "مواقع بتجيب عملاء", href: "/services/web-development" },
      mobile: { label: "Mobile Apps", desc: "تطبيقات iOS وأندرويد", href: "/services/mobile-apps" },
      maintenance: { label: "الصيانة", desc: "سريع وآمن وأونلاين دايمًا", href: "/services/maintenance" },
    },
  },
};

function barePath(p: string): string {
  if (p === "/ar") return "/";
  if (p.startsWith("/ar/")) return p.slice(3);
  return p || "/";
}

export function PillNav({ locale }: { locale: Locale }) {
  const t = LABELS[locale];
  const pathname = usePathname() || "/";
  const bare = barePath(pathname);
  const other: Locale = locale === "en" ? "ar" : "en";
  const toggleHref = localePath(other, bare);

  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  const links: NavItem[] = [
    { label: t.cases, href: localePath(locale, "/case-studies") },
    { label: t.pricing, href: localePath(locale, "/pricing") },
    { label: t.resources, href: localePath(locale, "/resources") },
    { label: t.blog, href: localePath(locale, "/blog") },
    { label: t.about, href: localePath(locale, "/about") },
  ];
  const services = Object.values(t.svc);

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
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const openDropdown = () => { clearTimeout(closeTimer.current); setServicesOpen(true); };
  const scheduleClose = () => { closeTimer.current = setTimeout(() => setServicesOpen(false), 120); };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 px-4">
      <nav
        aria-label="Primary"
        className="pointer-events-auto mx-auto flex max-w-5xl items-center justify-between gap-4 rounded-pill border border-line bg-panel/90 px-4 py-2.5 backdrop-blur supports-[backdrop-filter]:bg-panel/80"
      >
        <Link href={localePath(locale, "/")} className="flex items-center focus-gold" aria-label="MubarmiJ home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/mubarmij_logo_transparent.png"
            alt="MubarmiJ"
            className="h-11 w-auto"
            decoding="async"
          />
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          <Link href={localePath(locale, "/")} className="nav-link rounded-pill px-3 py-2 text-sm text-bodydark hover:text-cream">
            {t.home}
          </Link>

          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={openDropdown}
            onMouseLeave={scheduleClose}
          >
            <button
              type="button"
              aria-expanded={servicesOpen}
              aria-haspopup="true"
              onClick={() => setServicesOpen((v) => !v)}
              className="flex items-center gap-1 rounded-pill px-3 py-2 text-sm text-bodydark hover:text-cream focus-gold"
            >
              {t.services}
              <svg viewBox="0 0 24 24" className={cn("h-4 w-4 transition-transform", servicesOpen && "rotate-180")} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <AnimatePresence>
              {servicesOpen ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute start-0 top-full mt-3 w-80 rounded-tile border border-line bg-panel p-2 shadow-navy"
                >
                  {services.map((s) => (
                    <Link
                      key={s.href}
                      href={localePath(locale, s.href)}
                      className="group flex flex-col rounded-lg px-3 py-2.5 hover:bg-navy focus-gold"
                      onClick={() => setServicesOpen(false)}
                    >
                      <span className="text-sm font-medium text-cream group-hover:text-gold">{s.label}</span>
                      <span className="text-xs text-bodydark">{s.desc}</span>
                    </Link>
                  ))}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {links.map((l) => (
            <Link key={l.href} href={l.href} className="rounded-pill px-3 py-2 text-sm text-bodydark hover:text-cream focus-gold">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={toggleHref}
            className="hidden rounded-pill px-2.5 py-1.5 font-mono text-xs text-bodydark hover:text-gold focus-gold sm:block"
            aria-label={`Switch to ${other === "ar" ? "Arabic" : "English"}`}
          >
            {t.toggle}
          </Link>
          <Link
            href={localePath(locale, "/book-call")}
            className="hidden rounded-pill bg-gold px-4 py-2 text-sm font-medium text-gold-ink transition-transform hover:scale-[1.03] focus-gold lg:inline-flex"
          >
            {t.book}
          </Link>
          <button
            type="button"
            className="rounded-pill border border-line p-2 text-cream lg:hidden focus-gold"
            aria-label={t.menu}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto fixed inset-0 z-50 bg-navy-deep px-6 py-6 lg:hidden"
          >
            <div className="flex items-center justify-between">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/mubarmij_logo_transparent.png" alt="MubarmiJ" className="h-10 w-auto" decoding="async" />
              <button type="button" className="rounded-pill border border-line p-2 text-cream focus-gold" aria-label={t.close} onClick={() => setMobileOpen(false)}>
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <nav className="mt-8 flex flex-col gap-1" aria-label="Mobile">
              <Link href={localePath(locale, "/")} className="rounded-lg px-3 py-3 text-lg text-cream hover:bg-panel" onClick={() => setMobileOpen(false)}>{t.home}</Link>
              <p className="mt-2 px-3 font-mono text-xs uppercase tracking-widest text-gold-dim">{t.services}</p>
              {services.map((s) => (
                <Link key={s.href} href={localePath(locale, s.href)} className="rounded-lg px-3 py-2.5 text-cream hover:bg-panel" onClick={() => setMobileOpen(false)}>{s.label}</Link>
              ))}
              <div className="my-2 h-px bg-line" />
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="rounded-lg px-3 py-3 text-lg text-cream hover:bg-panel" onClick={() => setMobileOpen(false)}>{l.label}</Link>
              ))}
              <div className="mt-4 flex items-center justify-between">
                <Link href={toggleHref} className="rounded-pill border border-line px-4 py-2 font-mono text-sm text-cream" onClick={() => setMobileOpen(false)}>{t.toggle}</Link>
                <Link href={localePath(locale, "/book-call")} className="rounded-pill bg-gold px-5 py-3 font-medium text-gold-ink" onClick={() => setMobileOpen(false)}>{t.book}</Link>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
