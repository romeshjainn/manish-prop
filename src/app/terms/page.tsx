import type { Metadata } from "next";
import { business } from "@/config/business";
import { LegalBody } from "@/components/legal";
import { Breadcrumbs } from "@/components/seo";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Terms of use",
  description: `Terms for using the ${business.name} website.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <PageHeader title="Terms of use" intro="Please read these terms before relying on information from this website.">
        <Breadcrumbs items={[{ label: "Terms of use", href: "/terms" }]} />
      </PageHeader>
      <LegalBody>
        <section>
          <h2>Property information</h2>
          <p>
            We aim to keep listings and project details accurate and up to date. Prices, availability, sizes,
            specifications and timelines can change, and the information on this website does not form part of any
            offer or contract.
          </p>
          <p>Please confirm all details with us — and verify documents independently — before making any decision.</p>
        </section>
        <section>
          <h2>Images</h2>
          <p>
            Photographs marked “Illustrative image” and renderings marked “Artist’s impression” are for general
            representation only and may not show the actual property or project.
          </p>
        </section>
        <section>
          <h2>Projects</h2>
          <p>
            Upcoming projects are planned developments. Registering interest does not reserve a unit or create any
            obligation for you or for {business.name}.
          </p>
        </section>
        <section>
          <h2>Use of this website</h2>
          <p>
            You may browse and share pages from this website for personal use. Please do not copy listings or images for
            commercial use without permission.
          </p>
        </section>
      </LegalBody>
    </>
  );
}
