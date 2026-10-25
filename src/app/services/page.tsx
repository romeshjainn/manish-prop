import type { Metadata } from "next";
import { business } from "@/config/business";
import { siteImages } from "@/content/site-images";
import { EnquiryBand } from "@/components/enquiry-band";
import { CoverImage } from "@/components/media";
import { Breadcrumbs } from "@/components/seo";
import { ServiceIcon } from "@/components/service-icon";
import { ButtonLink, ContentNeeded, PageHeader } from "@/components/ui";
import { getServices } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description: `Property services offered by ${business.name}.`,
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const services = await getServices();
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title={
          <>
            How we can <em className="italic">help</em>
          </>
        }
        intro="Whether you are buying, selling, renting or exploring a project, start with a conversation about what you need."
      >
        <Breadcrumbs items={[{ label: "Services", href: "/services" }]} />
      </PageHeader>

      <div className="container-x">
        <CoverImage image={siteImages.services} sizes="100vw" className="aspect-[16/9] md:aspect-[21/8]" priority />
        <ContentNeeded className="mt-6">
          Services marked as unconfirmed in src/content/services.ts are shown in preview only. Set{" "}
          <code>confirmed: true</code> for each service {business.name} actually offers.
        </ContentNeeded>
      </div>

      <div className="container-x py-16 md:py-24">
        {services.length ? (
          <ol>
            {services.map((s, i) => (
              <li key={s.id} id={s.id} className="scroll-mt-28 border-t border-line py-12 md:py-16">
                <article className="grid gap-8 md:grid-cols-12">
                  <div className="flex items-start gap-5 md:col-span-5">
                    <span className="pt-2 text-sm text-muted tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <ServiceIcon name={s.icon} className="size-9 text-forest" />
                      <h2 className="mt-5 font-display text-4xl md:text-5xl">{s.title}</h2>
                    </div>
                  </div>
                  <div className="md:col-span-6 md:col-start-7">
                    <p className="text-lg leading-relaxed text-ink-2">{s.description}</p>
                    <p className="mt-6 border-l-2 border-bronze pl-4 text-muted">
                      <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-ink">Who it helps</span>
                      {s.audience}
                    </p>
                    <ButtonLink href={`/contact?type=${s.enquiryType}`} variant="outline" className="mt-8">
                      Enquire about {s.title.toLowerCase()}
                    </ButtonLink>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        ) : (
          <div className="border border-dashed border-line-strong px-6 py-16 text-center">
            <p className="font-display text-3xl">Service details are being prepared.</p>
            <p className="mx-auto mt-3 max-w-md text-muted">Please get in touch and tell us what you need.</p>
            <ButtonLink href="/contact" className="mt-8">
              Contact us
            </ButtonLink>
          </div>
        )}
      </div>

      <EnquiryBand />
    </>
  );
}
