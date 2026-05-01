// Site-wide constants. Brand-locked values.

export const WHATSAPP_NUMBER = "201200588803";
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@mubarmijonline.com";
export const CONTACT_PHONE =
  process.env.NEXT_PUBLIC_CONTACT_PHONE || "+201200588803";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.mubarmijonline.com";

export const META_PIXEL_ID =
  process.env.NEXT_PUBLIC_META_PIXEL_ID || "26702056632740424";
export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID;
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
export const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;
export const LINKEDIN_PARTNER_ID = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID;
export const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL;

export const CLIENT_LOGOS: { src: string; alt: string; darkCard?: boolean }[] = [
  { src: "/images/almal3ab.png", alt: "Al Mal3ab" },
  { src: "/images/amwally_logo.png", alt: "Amwally" },
  { src: "/images/eltime_logo.png", alt: "Eltime" },
  { src: "/images/fantazia_logo.png", alt: "Fantazia", darkCard: true },
  { src: "/images/masargp_logo.png", alt: "Masar GP" },
  { src: "/images/menus_logo.png", alt: "Menus" },
  { src: "/images/ogs_hub.png", alt: "OG's HUB" },
  { src: "/images/padel_swift_logo.png", alt: "Padel Swift" },
  { src: "/images/ramyrafaat_logo.png", alt: "Ramy Rafaat" },
];
