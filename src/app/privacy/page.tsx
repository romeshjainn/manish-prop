import type { Metadata } from "next";
import { business } from "@/config/business";
import { ContactLine, LegalBody } from "@/components/legal";
import { Breadcrumbs } from "@/components/seo";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: `How ${business.name} handles the information you share through this website.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader title="Privacy policy" intro="How we handle the information you share through this website.">
        <Breadcrumbs items={[{ label: "Privacy policy", href: "/privacy" }]} />
      </PageHeader>
      <LegalBody>
        <section>
          <h2>What we collect</h2>
          <p>
            When you send an enquiry we receive the details you enter: your name, phone number, and — if you choose to
            give them — your email address, budget, preferred location and message, along with the property or project
            you asked about.
          </p>
          <p>
            We do not ask for identity documents, financial details or any sensitive personal information through this
            website.
          </p>
        </section>
        <section>
          <h2>How we use it</h2>
          <p>
            We use your details only to respond to your enquiry and to follow up about your property requirement. We do
            not sell your information.
          </p>
        </section>
        <section>
          <h2>Where it goes</h2>
          <p>
            The website itself does not store enquiries in a database. Each enquiry is passed directly to {business.name}
            {" "}(for example by email). If you choose to contact us on WhatsApp, your message is handled by WhatsApp under
            its own terms.
          </p>
        </section>
        <section>
          <h2>Cookies and analytics</h2>
          <p>This website does not use advertising or analytics cookies.</p>
        </section>
        <section>
          <h2>Your choices</h2>
          <p>You can ask us to tell you what information we hold about you, or to delete it, at any time.</p>
          <ContactLine />
        </section>
      </LegalBody>
    </>
  );
}
