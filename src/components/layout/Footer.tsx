import Link from "next/link";
import { useTranslations } from "next-intl";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/lib/utils";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/site";

export default function Footer({ locale }: { locale: Locale }) {
  const t = useTranslations();
  const lp = (p: string) => localePath(locale, p);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-deep text-white">
      <div className="container mx-auto py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="font-display text-2xl font-extrabold">
            Mubarmij<span className="text-gold">.</span>
          </div>
          <p className="mt-3 text-sm text-white/80 leading-relaxed">
            {t("site.tagline")}
          </p>
          <div className="mt-4 space-y-1 text-sm text-white/80">
            <div>{CONTACT_PHONE}</div>
            <div>{CONTACT_EMAIL}</div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">{t("footer.quickLinks")}</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link href={lp("/")}>{t("nav.home")}</Link></li>
            <li><Link href={lp("/about")}>{t("nav.about")}</Link></li>
            <li><Link href={lp("/case-studies")}>{t("nav.caseStudies")}</Link></li>
            <li><Link href={lp("/pricing")}>{t("nav.pricing")}</Link></li>
            <li><Link href={lp("/blog")}>{t("nav.blog")}</Link></li>
            <li><Link href={lp("/contact")}>{t("nav.contact")}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">{t("footer.servicesLinks")}</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link href={lp("/services/automation")}>{t("nav.automation")}</Link></li>
            <li><Link href={lp("/services/web-development")}>{t("nav.webDevelopment")}</Link></li>
            <li><Link href={lp("/services/mobile-apps")}>{t("nav.mobileApps")}</Link></li>
            <li><Link href={lp("/services/maintenance")}>{t("nav.maintenance")}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">{t("footer.newsletter")}</h3>
          <form className="flex gap-2" action="/api/lead" method="post">
            <input type="hidden" name="source" value="newsletter" />
            <input
              type="email"
              name="email"
              required
              placeholder={t("footer.newsletterPlaceholder")}
              className="flex-1 rounded-md px-3 py-2 text-sm text-navy-deep"
              aria-label={t("footer.newsletterPlaceholder")}
            />
            <button type="submit" className="btn-primary text-sm px-4 py-2">
              {t("footer.subscribe")}
            </button>
          </form>
          <div className="flex items-center gap-3 mt-5">
            <a href="#" aria-label="Facebook" className="hover:text-gold"><Facebook size={20} /></a>
            <a href="#" aria-label="Instagram" className="hover:text-gold"><Instagram size={20} /></a>
            <a href="#" aria-label="LinkedIn" className="hover:text-gold"><Linkedin size={20} /></a>
            <a href="#" aria-label="YouTube" className="hover:text-gold"><Youtube size={20} /></a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/70">
          <div>© {year} Mubarmij. {t("footer.rights")}</div>
          <div className="flex gap-4">
            <Link href={lp("/privacy-policy")} className="hover:text-gold">{t("footer.privacy")}</Link>
            <Link href={lp("/terms-of-service")} className="hover:text-gold">{t("footer.terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
