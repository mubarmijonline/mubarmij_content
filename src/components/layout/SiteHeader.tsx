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
    allServices: string;
    work: string;
    pricing: string;
    resources: string;
    blog: string;
    about: string;
    book: string;
    whatsapp: string;
    whatsappMsg: string;
    menu: string;
    close: string;
    language: string;
    svc: ServiceItem[];
  }
> = {
  en: {
    home: "Home",
    services: "Services",
    allServices: "All services",
    work: "Work",
    pricing: "Pricing",
    resources: "Resources",
    blog: "Blog",
    about: "About",
    book: "Book a call",
    whatsapp: "WhatsApp us",
    whatsappMsg: "Hi MubarmiJ — I'd like to discuss a project.",
    menu: "Menu",
    close: "Close",
    language: "Language",
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
    allServices: "كل الخدمات",
    work: "أعمالنا",
    pricing: "الأسعار",
    resources: "موارد",
    blog: "المدونة",
    about: "من نحن",
    book: "احجز مكالمة",
    whatsapp: "كلمنا واتساب",
    whatsappMsg: "أهلاً مبرمج — عايز أتكلم عن مشروع.",
    menu: "القائمة",
    close: "إغلاق",
    language: "اللغة",
    svc: [
      { label: "E-commerce", desc: "متاجر مبنية عشان تبيع", href: "/services/ecommerce" },
      { label: "Web Development", desc: "مواقع بتجيب عملاء", href: "/services/web-development" },
      { label: "Mobile Apps", desc: "تطبيقات iOS وأندرويد", href: "/services/mobile-apps" },
      { label: "Automation", desc: "أنظمة بتشتغل بدالك ٢٤/٧", href: "/services/automation" },
      { label: "الصيانة", desc: "سريع وآمن وأونلاين دايمًا", href: "/services/maintenance" },
    ],
  },
};

/**
 * Strip the locale prefix so the language toggle and the active-route check
 * both work off a plain path.
 *
 * usePathname() returns the *internal* route, which next-intl's `as-needed`
 * prefixing rewrites to /en/... even though the browser URL has no prefix.
 * Handling only /ar meant the English toggle built /ar/en/<path> — a 404 on
 * every page except the homepage — and no nav item ever matched as active.
 */
function barePath(p: string): string {
  const rest = p.replace(/^\/(en|ar)(?=\/|$)/, "");
  return rest || "/";
}

export function SiteHeader({ locale }: { locale: Locale }) {
  const t = LABELS[locale];
  const pathname = usePathname() || "/";
  const bare = barePath(pathname);
  const other: Locale = locale === "en" ? "ar" : "en";
  const toggleHref = localePath(other, bare);

  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  const links: NavItem[] = [
    { label: t.work, href: "/case-studies" },
    { label: t.pricing, href: "/pricing" },
    { label: t.resources, href: "/resources" },
    { label: t.blog, href: "/blog" },
    { label: t.about, href: "/about" },
    { label: t.book, href: "/book-call" },
  ];

  const onServices = bare.startsWith("/services");
  const isActive = (href: string) => (href === "/" ? bare === "/" : bare.startsWith(href));

  // Condense on scroll. rAF-throttled and passive so it never fights the
  // scroller; the only thing that changes is padding and the shadow.
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

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

  return (
    <header
      className={cn(
        "surf-light sticky top-0 z-50 border-t-[3px] border-t-gold bg-white/[0.92] backdrop-blur-[14px] transition-shadow duration-300",
        scrolled ? "shadow-nav" : "border-b border-b-hair",
      )}
    >
      <div
        className={cn(
          "shell flex items-center gap-6 transition-[padding] duration-300 lg:gap-8",
          scrolled ? "py-2" : "py-3.5",
        )}
      >
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
            className={cn(
              "rounded-[9px] transition-all duration-300",
              scrolled ? "h-8 w-8" : "h-[38px] w-[38px]",
            )}
          />
          <span className="font-display text-[19px] font-bold tracking-[-0.02em] text-fg">
            MubarmiJ
          </span>
        </Link>

        <nav aria-label="Primary" className="ms-auto hidden items-center gap-1 xl:flex">
          <NavLink href={localePath(locale, "/")} active={isActive("/")}>
            {t.home}
          </NavLink>

          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => {
              clearTimeout(closeTimer.current);
              setServicesOpen(true);
            }}
            onMouseLeave={() => {
              closeTimer.current = setTimeout(() => setServicesOpen(false), 140);
            }}
          >
            <button
              type="button"
              aria-expanded={servicesOpen}
              aria-haspopup="true"
              onClick={() => setServicesOpen((v) => !v)}
              className={cn(navLinkBase, onServices ? "text-fg" : "text-fgbody hover:text-fg")}
            >
              {t.services}
              <svg
                viewBox="0 0 24 24"
                className={cn("h-3.5 w-3.5 transition-transform duration-200", servicesOpen && "rotate-180")}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <Underline show={onServices} />
            </button>

            {servicesOpen ? (
              <div className="animate-rise absolute start-1/2 top-full z-10 mt-3 w-[560px] -translate-x-1/2 rounded-card border border-hair bg-white p-2 shadow-lift rtl:translate-x-1/2">
                <div className="grid grid-cols-2 gap-1">
                  {t.svc.map((s) => (
                    <Link
                      key={s.href}
                      href={localePath(locale, s.href)}
                      className={cn(
                        "focus-gold group flex flex-col rounded-chip px-3.5 py-3 transition-colors hover:bg-paper-subtle",
                        isActive(s.href) && "bg-paper-subtle",
                      )}
                      onClick={() => setServicesOpen(false)}
                    >
                      <span className="font-display text-[14.5px] font-semibold text-fg group-hover:text-gold-deep">
                        {s.label}
                      </span>
                      <span className="mt-0.5 text-[13px] leading-snug text-fgmuted">{s.desc}</span>
                    </Link>
                  ))}
                </div>
                <Link
                  href={localePath(locale, "/services")}
                  onClick={() => setServicesOpen(false)}
                  className="focus-gold mono mt-1 flex items-center justify-between rounded-chip border-t border-hair px-3.5 py-3 text-[11px] uppercase text-fgmuted transition-colors hover:text-fg"
                >
                  {t.allServices}
                  <span aria-hidden="true">{locale === "ar" ? "←" : "→"}</span>
                </Link>
              </div>
            ) : null}
          </div>

          {links.map((l) => (
            <NavLink key={l.href} href={localePath(locale, l.href)} active={isActive(l.href)}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-3 xl:ms-0">
          <Link
            href={toggleHref}
            className="mono focus-gold ltr-island hidden rounded-chip border border-hair px-2.5 py-1.5 text-[11px] text-fgmuted transition-colors hover:border-hairhov hover:text-fg sm:block"
            aria-label={other === "ar" ? "التبديل إلى العربية" : "Switch to English"}
          >
            {locale === "en" ? "AR" : "EN"}
          </Link>

          <a
            href={whatsappLink(t.whatsappMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="focus-gold hidden shrink-0 items-center gap-2.5 rounded-btn bg-ink px-5 py-[11px] font-display text-[14.5px] font-semibold text-white transition-colors hover:bg-gold hover:text-ink sm:inline-flex"
          >
            <WhatsAppIcon size={18} />
            {t.whatsapp}
          </a>

          <button
            type="button"
            className="focus-gold rounded-chip border border-hairbtn p-2 text-fg transition-colors hover:border-ink xl:hidden"
            aria-label={t.menu}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(true)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="surf-light fixed inset-0 z-50 flex flex-col bg-white xl:hidden">
          <div className="flex shrink-0 items-center justify-between border-b border-hair px-5 py-3.5">
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

          <nav className="flex-1 overflow-y-auto px-5 pb-6" aria-label="Mobile">
            <MobileLink href={localePath(locale, "/")} active={isActive("/")}>
              {t.home}
            </MobileLink>

            <p className="mono pt-6 text-eyebrow uppercase text-accent">{t.services}</p>
            {t.svc.map((s) => (
              <Link
                key={s.href}
                href={localePath(locale, s.href)}
                className={cn(
                  "flex flex-col border-b border-hair py-3",
                  isActive(s.href) ? "text-fg" : "text-fgbody",
                )}
              >
                <span className="text-[16px] font-medium">{s.label}</span>
                <span className="mt-0.5 text-[13px] text-fgmuted">{s.desc}</span>
              </Link>
            ))}
            <Link
              href={localePath(locale, "/services")}
              className="mono flex items-center gap-2 py-3 text-[11px] uppercase text-fgmuted"
            >
              {t.allServices}
              <span aria-hidden="true">{locale === "ar" ? "←" : "→"}</span>
            </Link>

            <div className="h-3" />
            {links.map((l) => (
              <MobileLink key={l.href} href={localePath(locale, l.href)} active={isActive(l.href)}>
                {l.label}
              </MobileLink>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-3 border-t border-hair px-5 py-4">
            <Link
              href={toggleHref}
              className="mono ltr-island rounded-btn border border-hairbtn px-4 py-3 text-[13px] text-fg"
            >
              {locale === "en" ? "AR" : "EN"}
            </Link>
            <a
              href={whatsappLink(t.whatsappMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-2.5 rounded-btn bg-ink px-5 py-3 font-display text-[15px] font-semibold text-white"
            >
              <WhatsAppIcon size={18} />
              {t.whatsapp}
            </a>
          </div>
        </div>
      ) : null}
    </header>
  );
}

const navLinkBase =
  "focus-gold relative inline-flex items-center gap-1.5 rounded-chip px-3 py-2 text-[14.5px] font-medium transition-colors";

/** Gold rule under the current route. A real element, so it flips under RTL. */
function Underline({ show }: { show: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-x-3 bottom-0 h-[2px] rounded-full bg-gold transition-transform duration-200",
        show ? "scale-x-100" : "scale-x-0",
      )}
    />
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(navLinkBase, active ? "text-fg" : "text-fgbody hover:text-fg")}
    >
      {children}
      <Underline show={active} />
    </Link>
  );
}

function MobileLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center justify-between border-b border-hair py-3.5 text-[17px] font-medium",
        active ? "text-fg" : "text-fgbody",
      )}
    >
      {children}
      {active ? <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold" /> : null}
    </Link>
  );
}
