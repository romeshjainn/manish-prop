import { Mail, MessageCircle, Phone } from "lucide-react";
import { contact, whatsappHref } from "@/lib/contact";
import { ButtonAnchor } from "./ui";

/**
 * Call / WhatsApp / email buttons. Each one renders only when the matching
 * detail is configured in src/config/business.ts.
 */
export function ContactActions({
  subject,
  tone = "light",
  include = ["phone", "whatsapp"],
  className = "",
}: {
  subject?: string;
  tone?: "light" | "dark";
  include?: ("phone" | "whatsapp" | "email")[];
  className?: string;
}) {
  const wa = include.includes("whatsapp") ? whatsappHref(subject) : null;
  const tel = include.includes("phone") ? contact.telHref : null;
  const mail = include.includes("email") ? contact.mailtoHref : null;
  if (!wa && !tel && !mail) return null;
  const variant = tone === "dark" ? "outline-light" : "outline";
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {wa && (
        <ButtonAnchor href={wa} target="_blank" rel="noopener noreferrer" variant={variant}>
          <MessageCircle aria-hidden className="size-4" />
          WhatsApp us
          <span className="sr-only">(opens WhatsApp)</span>
        </ButtonAnchor>
      )}
      {tel && (
        <ButtonAnchor href={tel} variant={variant}>
          <Phone aria-hidden className="size-4" />
          Call {contact.phoneDisplay}
        </ButtonAnchor>
      )}
      {mail && (
        <ButtonAnchor href={mail} variant={variant}>
          <Mail aria-hidden className="size-4" />
          Email us
        </ButtonAnchor>
      )}
    </div>
  );
}

/** Small, unobtrusive WhatsApp button — rendered only if a number is configured. */
export function WhatsAppFloat() {
  const href = whatsappHref();
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed right-4 bottom-4 z-30 inline-flex size-14 items-center justify-center rounded-full bg-forest text-paper shadow-lg transition-transform hover:scale-105 md:right-6 md:bottom-6"
    >
      <MessageCircle aria-hidden className="size-6" />
      <span className="sr-only">Chat with us on WhatsApp (opens WhatsApp)</span>
    </a>
  );
}
