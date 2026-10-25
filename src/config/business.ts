/**
 * BUSINESS PROFILE — the single source of truth for Manish Property's details.
 *
 * Rules:
 *  - Leave a value as `null` (or an empty array) until the owner supplies it.
 *  - Never enter a placeholder phone number, email or address: any contact
 *    action whose value is null is hidden automatically across the site.
 *  - Phone / WhatsApp numbers: full international format, digits only,
 *    e.g. "919876543210" for +91 98765 43210.
 */

export interface SocialLink {
  label: "Instagram" | "Facebook" | "YouTube" | "LinkedIn" | "X";
  href: string;
}

export interface BusinessProfile {
  name: string;
  /** Short line shown under the wordmark in the footer and in metadata. */
  tagline: string;
  /** One or two sentences used in the footer and as the default meta description. */
  description: string;
  /** Path to a logo in /public. When null, the typographic wordmark is used. */
  logo: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  } | null;
  /** Coordinates of the office, only if the owner wants a map shown. */
  officeMap: { lat: number; lng: number } | null;
  /** Areas the business actually works in, e.g. ["Sector 21", "Ring Road"]. */
  serviceAreas: string[];
  /** e.g. [{ days: "Mon – Sat", hours: "10:00 am – 7:00 pm" }] */
  hours: { days: string; hours: string }[];
  social: SocialLink[];
  /** Introduction to Manish, written or approved by Manish. */
  founder: {
    name: string;
    role: string;
    bio: string;
    photo?: { src: string; alt: string; width: number; height: number };
  } | null;
  /** Longer "About" introduction — paragraphs separated by a blank line. */
  about: string | null;
  /** What the business actually does, confirmed by the owner (About page). */
  activities: string[];
  /** Verifiable credentials only (e.g. a RERA agent registration). */
  credentials: { label: string; value: string; url?: string }[];
  locale: string;
  currency: string;
}

export const business: BusinessProfile = {
  name: "Manish Property",
  tagline: "Property, presented clearly.",
  description:
    "Explore available properties and real-estate projects with Manish Property, and speak to us directly about what you are looking for.",
  logo: null,

  // ── Owner to supply ───────────────────────────────────────────────
  phone: null,
  whatsapp: null,
  email: null,
  address: null,
  officeMap: null,
  serviceAreas: [],
  hours: [],
  social: [],
  founder: null,
  about: null,
  activities: [],
  credentials: [],
  // ──────────────────────────────────────────────────────────────────

  locale: "en-IN",
  currency: "INR",
};
