import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/lib/utils";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/site";
import NewsletterForm from "./NewsletterForm";

export default function Footer({ locale }: { locale: Locale }) {
  const t = useTranslations();
  const lp = (p: string) => localePath(locale, p);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-deep text-white">
      <div className="container mx-auto py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-1 flex items-center gap-3">
            <Image
              src="/icon.svg"
              alt="MubarmiJ"
              width={40}
              height={40}
              className="rounded-lg shrink-0"
            />
            <span className="font-display text-2xl font-extrabold text-white">MubarmiJ</span>
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
            <li><Link href={lp("/")} title={t("nav.home")}>{t("nav.home")}</Link></li>
            <li><Link href={lp("/about")} title={t("nav.about")}>{t("nav.about")}</Link></li>
            <li><Link href={lp("/resources")} title={t("nav.resources")}>{t("nav.resources")}</Link></li>
            <li><Link href={lp("/blog")} title={t("nav.blog")}>{t("nav.blog")}</Link></li>
            <li><Link href={lp("/contact")} title={t("nav.contact")}>{t("nav.contact")}</Link></li>
            <li><Link href={lp("/privacy-policy")} title={t("footer.privacy")}>{t("footer.privacy")}</Link></li>
            <li><Link href={lp("/terms-of-service")} title={t("footer.terms")}>{t("footer.terms")}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">{t("footer.servicesLinks")}</h3>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link href={lp("/services/automation")} title={t("nav.automation")}>{t("nav.automation")}</Link></li>
            <li><Link href={lp("/services/web-development")} title={t("nav.webDevelopment")}>{t("nav.webDevelopment")}</Link></li>
            <li><Link href={lp("/services/mobile-apps")} title={t("nav.mobileApps")}>{t("nav.mobileApps")}</Link></li>
            <li><Link href={lp("/services/maintenance")} title={t("nav.maintenance")}>{t("nav.maintenance")}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">{t("footer.newsletter")}</h3>
          <NewsletterForm
            locale={locale}
            placeholder={t("footer.newsletterPlaceholder")}
            label={t("footer.subscribe")}
          />
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
          <div>© {year} MubarmiJ {t("footer.rights")}</div>
          <div className="flex gap-4">
            <Link href={lp("/privacy-policy")} title={t("footer.privacy")} className="hover:text-gold">{t("footer.privacy")}</Link>
            <Link href={lp("/terms-of-service")} title={t("footer.terms")} className="hover:text-gold">{t("footer.terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
