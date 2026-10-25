import type { Metadata } from "next";
import { Suspense } from "react";
import { business } from "@/config/business";
import { PROPERTIES_PER_PAGE } from "@/config/site";
import { PropertyCard } from "@/components/property-card";
import { PropertyExplorer } from "@/components/property-explorer";
import { Breadcrumbs } from "@/components/seo";
import { ButtonLink, ContentNeeded, PageHeader } from "@/components/ui";
import { getListedProperties } from "@/lib/content";
import { deriveOptions } from "@/lib/search";

export const metadata: Metadata = {
  title: "Properties for sale and rent",
  description: `Browse properties currently available for sale and rent through ${business.name}. Filter by location, type, budget, size and bedrooms.`,
  alternates: { canonical: "/properties" },
};

export default async function PropertiesPage() {
  const properties = await getListedProperties();
  const options = deriveOptions(properties);

  return (
    <>
      <PageHeader
        eyebrow={`${properties.length} ${properties.length === 1 ? "listing" : "listings"} on the market`}
        title="Properties"
        intro="Homes, plots and commercial spaces currently available. Every listing shows its status clearly, and only properties still on the market appear here."
      >
        <Breadcrumbs items={[{ label: "Properties", href: "/properties" }]} />
      </PageHeader>

      {properties.length === 0 ? (
        <div className="container-x pb-24">
          <div className="border border-dashed border-line-strong px-6 py-16 text-center">
            <h2 className="font-display text-3xl">New listings are being prepared</h2>
            <p className="mx-auto mt-3 max-w-md text-muted">
              There are no properties listed right now. Tell us what you are looking for and we will get in touch when
              something suitable is available.
            </p>
            <ButtonLink href="/contact?type=buy" className="mt-8">
              Share your requirement
            </ButtonLink>
          </div>
          <ContentNeeded className="mt-6">Add listings in src/content/properties.ts.</ContentNeeded>
        </div>
      ) : (
        // The fallback is the unfiltered first page, so the listings are in the
        // static HTML for search engines and visitors without JavaScript.
        <Suspense
          fallback={
            <ul className="container-x grid gap-6 pb-24 sm:grid-cols-2 lg:grid-cols-3">
              {properties.slice(0, PROPERTIES_PER_PAGE).map((p) => (
                <li key={p.id}>
                  <PropertyCard property={p} headingLevel="h2" />
                </li>
              ))}
            </ul>
          }
        >
          <PropertyExplorer properties={properties} options={options} perPage={PROPERTIES_PER_PAGE} />
        </Suspense>
      )}
    </>
  );
}
