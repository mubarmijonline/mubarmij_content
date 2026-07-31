import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

import type { Locale } from "@/i18n/config";
import { localePath } from "@/lib/utils";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/site";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  Shell,
  YouTubeIcon,
} from "@/components/system";
import NewsletterForm from "./NewsletterForm";

/**
 * Dark four-column footer.
 *
 * This is one of the few places still reading messages/*.json — the rest of
 * the site carries inline bilingual COPY. Keeping it here preserves the one
 * translation workflow that still functions.
 */
export default function Footer({ locale }: { locale: Locale }) {
  const t = useTranslations();
  const lp = (p: string) => localePath(locale, p);
  const year = new Date().getFullYear();

  const heading = "mono text-eyebrow uppercase text-accent";
  const link = "focus-gold text-[14.5px] text-fgbody transition-colors hover:text-fg";

  return (
    <footer className="surf-dark">
      <Shell className="grid gap-10 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/icon.svg"
              alt=""
              width={38}
              height={38}
              className="h-[38px] w-[38px] shrink-0 rounded-[9px]"
            />
            <span className="font-display text-[19px] font-bold tracking-[-0.02em] text-fg">
              MubarmiJ
            </span>
          </div>
          <p className="mt-4 max-w-[30em] text-[14.5px] leading-relaxed text-fgbody">
            {t("site.tagline")}
          </p>
          <div className="mono ltr-island mt-5 space-y-1 text-[13px] text-fgmuted">
            <div>
              <a href={`tel:${CONTACT_PHONE}`} className="focus-gold hover:text-gold">
                {CONTACT_PHONE}
              </a>
            </div>
            <div>
              <a href={`mailto:${CONTACT_EMAIL}`} className="focus-gold hover:text-gold">
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>
        </div>

        <div>
          <h3 className={heading}>{t("footer.servicesLinks")}</h3>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link href={lp("/services/ecommerce")} className={link}>
                E-commerce
              </Link>
            </li>
            <li>
              <Link href={lp("/services/web-development")} className={link}>
                {t("nav.webDevelopment")}
              </Link>
            </li>
            <li>
              <Link href={lp("/services/mobile-apps")} className={link}>
                {t("nav.mobileApps")}
              </Link>
            </li>
            <li>
              <Link href={lp("/services/automation")} className={link}>
                {t("nav.automation")}
              </Link>
            </li>
            <li>
              <Link href={lp("/services/maintenance")} className={link}>
                {t("nav.maintenance")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className={heading}>{t("footer.quickLinks")}</h3>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link href={lp("/case-studies")} className={link}>
                {t("nav.caseStudies")}
              </Link>
            </li>
            <li>
              <Link href={lp("/about")} className={link}>
                {t("nav.about")}
              </Link>
            </li>
            <li>
              <Link href={lp("/pricing")} className={link}>
                {t("nav.pricing")}
              </Link>
            </li>
            <li>
              <Link href={lp("/reels")} className={link}>
                {t("nav.reels")}
              </Link>
            </li>
            <li>
              <Link href={lp("/blog")} className={link}>
                {t("nav.blog")}
              </Link>
            </li>
            <li>
              <Link href={lp("/resources")} className={link}>
                {t("nav.resources")}
              </Link>
            </li>
            <li>
              <Link href={lp("/contact")} className={link}>
                {t("nav.contact")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className={heading}>{t("footer.newsletter")}</h3>
          <div className="mt-4">
            <NewsletterForm
              locale={locale}
              placeholder={t("footer.newsletterPlaceholder")}
              label={t("footer.subscribe")}
            />
          </div>
          {/* Brand colours, so each channel is recognisable against the dark
              footer. Opacity carries the hover state instead of a fill swap. */}
          <div className="mt-6 flex items-center gap-4">
            <a
              href="#"
              aria-label="Facebook"
              className="focus-gold opacity-80 transition-opacity hover:opacity-100"
            >
              <FacebookIcon size={22} />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="focus-gold opacity-80 transition-opacity hover:opacity-100"
            >
              <InstagramIcon size={22} />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="focus-gold opacity-80 transition-opacity hover:opacity-100"
            >
              <LinkedInIcon size={22} />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="focus-gold opacity-80 transition-opacity hover:opacity-100"
            >
              <YouTubeIcon size={22} />
            </a>
          </div>
        </div>
      </Shell>

      <div className="border-t border-hair">
        <Shell className="mono flex flex-col items-center justify-between gap-2 py-5 text-[11.5px] uppercase text-fgmuted md:flex-row">
          <div>© {year} MubarmiJ {t("footer.rights")}</div>
          <div className="flex gap-5">
            <Link href={lp("/privacy-policy")} className="focus-gold hover:text-gold">
              {t("footer.privacy")}
            </Link>
            <Link href={lp("/terms-of-service")} className="focus-gold hover:text-gold">
              {t("footer.terms")}
            </Link>
          </div>
        </Shell>
      </div>
    </footer>
  );
}
