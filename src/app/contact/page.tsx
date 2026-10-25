import type { Metadata } from "next";
import { Suspense } from "react";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { business } from "@/config/business";
import { ContactForm } from "@/components/contact-form";
import { EnquiryForm } from "@/components/enquiry-form";
import { Breadcrumbs } from "@/components/seo";
import { ContentNeeded, PageHeader } from "@/components/ui";
import { contact, whatsappHref } from "@/lib/contact";
import { isDeliveryConfigured } from "@/lib/enquiry-delivery";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${business.name} about buying, selling or renting property, or about one of our projects.`,
  alternates: { canonical: "/contact" },
};

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 border-b border-line py-5">
      <span className="mt-0.5 text-forest">{icon}</span>
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</h3>
        <div className="mt-1.5 text-lg">{children}</div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const deliveryReady = isDeliveryConfigured();
  const wa = whatsappHref();
  const a = business.address;
  const hasDetails = contact.hasPhone || wa || contact.hasEmail || a || business.hours.length > 0;

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={
          <>
            Tell us what you’re <em className="italic">looking for</em>
          </>
        }
        intro="Share your requirement — buying, selling, renting or a project enquiry — and we’ll get back to you."
      >
        <Breadcrumbs items={[{ label: "Contact", href: "/contact" }]} />
      </PageHeader>

      <div className="container-x grid gap-14 pb-24 lg:grid-cols-12 lg:gap-16">
        <section aria-labelledby="form-title" className="lg:col-span-7">
          <div className="bg-card p-6 ring-1 ring-line sm:p-8 md:p-10">
            <h2 id="form-title" className="font-display text-4xl">
              Send an enquiry
            </h2>
            <p className="mt-2 text-muted">Fields marked * are required.</p>
            <div className="mt-8">
              <Suspense fallback={<EnquiryForm deliveryReady={deliveryReady} />}>
                <ContactForm deliveryReady={deliveryReady} />
              </Suspense>
            </div>
          </div>
          {!deliveryReady && (
            <ContentNeeded className="mt-6">
              No enquiry delivery is configured, so the form{" "}
              {contact.hasWhatsApp ? "hands enquiries over to WhatsApp" : "tells visitors their message was not sent"}.
              Set <code>RESEND_API_KEY</code>, <code>ENQUIRY_EMAIL_TO</code> and <code>ENQUIRY_EMAIL_FROM</code> (email)
              and/or <code>ENQUIRY_WEBHOOK_URL</code> — see README → “Enquiry delivery”.
            </ContentNeeded>
          )}
        </section>

        <section aria-labelledby="details-title" className="lg:col-span-5">
          <h2 id="details-title" className="font-display text-4xl">
            Contact details
          </h2>
          {hasDetails ? (
            <div className="mt-4">
              {contact.telHref && (
                <Row icon={<Phone aria-hidden className="size-5" />} label="Phone">
                  <a href={contact.telHref} className="underline decoration-line-strong underline-offset-4 hover:decoration-ink">
                    {contact.phoneDisplay}
                  </a>
                </Row>
              )}
              {wa && (
                <Row icon={<MessageCircle aria-hidden className="size-5" />} label="WhatsApp">
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="underline decoration-line-strong underline-offset-4 hover:decoration-ink">
                    Message us on WhatsApp
                  </a>
                </Row>
              )}
              {contact.mailtoHref && (
                <Row icon={<Mail aria-hidden className="size-5" />} label="Email">
                  <a href={contact.mailtoHref} className="break-all underline decoration-line-strong underline-offset-4 hover:decoration-ink">
                    {contact.email}
                  </a>
                </Row>
              )}
              {a && (
                <Row icon={<MapPin aria-hidden className="size-5" />} label="Office">
                  <address className="not-italic">
                    {a.line1}
                    {a.line2 && (
                      <>
                        <br />
                        {a.line2}
                      </>
                    )}
                    <br />
                    {a.city}, {a.state} {a.postalCode}
                  </address>
                  {business.officeMap && (
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${business.officeMap.lat}&mlon=${business.officeMap.lng}#map=17/${business.officeMap.lat}/${business.officeMap.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex min-h-10 items-center text-sm underline underline-offset-4"
                    >
                      View on map<span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  )}
                </Row>
              )}
              {business.hours.length > 0 && (
                <Row icon={<Clock aria-hidden className="size-5" />} label="Hours">
                  <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
                    {business.hours.map((h) => (
                      <div key={h.days} className="contents">
                        <dt className="text-muted">{h.days}</dt>
                        <dd>{h.hours}</dd>
                      </div>
                    ))}
                  </dl>
                </Row>
              )}
            </div>
          ) : (
            <>
              <p className="mt-4 leading-relaxed text-muted">Please use the enquiry form and we’ll get back to you.</p>
              <ContentNeeded className="mt-6">
                Phone, WhatsApp, email, address and hours are all empty in src/config/business.ts. Each one appears here
                — and as call / WhatsApp buttons across the site — as soon as it is filled in.
              </ContentNeeded>
            </>
          )}
        </section>
      </div>
    </>
  );
}
