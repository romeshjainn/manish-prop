import { business } from "@/config/business";

/** Digits only, minimum length for a real international number. */
function clean(n: string | null): string | null {
  if (!n) return null;
  const digits = n.replace(/\D/g, "");
  return digits.length >= 10 ? digits : null;
}

const phone = clean(business.phone);
const whatsapp = clean(business.whatsapp);
const email = business.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(business.email) ? business.email : null;

export const contact = {
  hasPhone: phone !== null,
  hasWhatsApp: whatsapp !== null,
  hasEmail: email !== null,
  /** +91 98765 43210 style display for Indian numbers. */
  phoneDisplay: phone ? displayNumber(phone) : null,
  telHref: phone ? `tel:+${phone}` : null,
  email,
  mailtoHref: email ? `mailto:${email}` : null,
};

function displayNumber(d: string): string {
  if (d.startsWith("91") && d.length === 12) return `+91 ${d.slice(2, 7)} ${d.slice(7)}`;
  return `+${d}`;
}

/**
 * wa.me link with an optional prefilled message. Returns null when no
 * WhatsApp number is configured — callers must then hide the action.
 */
export function whatsappHref(subject?: string): string | null {
  if (!whatsapp) return null;
  const text = subject
    ? `Hello ${business.name}, I am interested in ${subject}. Could you please share more details?`
    : `Hello ${business.name}, I would like to know more about your properties.`;
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`;
}
