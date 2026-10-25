import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Info, MapPin } from "lucide-react";
import { AvailabilityBadge, ListingTypeBadge, ProjectStatusBadge } from "@/components/badges";
import { ContactActions } from "@/components/contact-actions";
import { CheckList, DetailSection, DocumentList, FactGrid, Paragraphs } from "@/components/detail-parts";
import { EnquiryForm } from "@/components/enquiry-form";
import { Gallery } from "@/components/gallery";
import { LocationBlock } from "@/components/location-block";
import { PropertyCard } from "@/components/property-card";
import { Breadcrumbs } from "@/components/seo";
import { DemoBadge } from "@/components/ui";
import { getAllProperties, getProjectBySlug, getPropertyBySlug, getSimilarProperties, isListed } from "@/lib/content";
import { isDeliveryConfigured } from "@/lib/enquiry-delivery";
import { formatAmountFull, formatArea, formatPrice } from "@/lib/format";
import { availabilityLabel, listingTypeLabel, propertyTypeLabel } from "@/lib/labels";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllProperties()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/properties/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getPropertyBySlug(slug);
  if (!p) return {};
  const title = `${p.title}, ${p.location.locality}`;
  return {
    title,
    description: `${listingTypeLabel[p.listingType]} · ${formatPrice(p.price, p.listingType)}. ${p.summary}`,
    alternates: { canonical: `/properties/${p.slug}` },
    // Sold / rented pages stay online for old links but drop out of search engines.
    ...(!isListed(p) && { robots: { index: false, follow: true } }),
    openGraph: { title, description: p.summary, images: p.images[0] ? [{ url: p.images[0].src, alt: p.images[0].alt }] : undefined },
  };
}

export default async function PropertyPage({ params }: PageProps<"/properties/[slug]">) {
  const { slug } = await params;
  const p = await getPropertyBySlug(slug);
  if (!p) notFound();

  const [project, similar] = await Promise.all([
    p.projectSlug ? getProjectBySlug(p.projectSlug) : undefined,
    getSimilarProperties(p),
  ]);
  const onMarket = isListed(p);
  const deliveryReady = isDeliveryConfigured();

  const facts = [
    { label: "Price", value: formatPrice(p.price, p.listingType) },
    { label: "Listing", value: listingTypeLabel[p.listingType] },
    { label: "Type", value: propertyTypeLabel[p.type] },
    p.area && { label: p.area.label ?? "Area", value: formatArea(p.area) },
    p.bedrooms !== undefined && { label: "Bedrooms", value: p.bedrooms },
    p.bathrooms !== undefined && { label: "Bathrooms", value: p.bathrooms },
    p.furnishing && { label: "Furnishing", value: p.furnishing.replace("-", " ").replace(/^./, (c) => c.toUpperCase()) },
    { label: "Status", value: availabilityLabel[p.status] },
  ].filter(Boolean) as { label: string; value: React.ReactNode }[];

  return (
    <article className="pb-24">
      <div className="container-x pt-8 md:pt-10">
        <Breadcrumbs
          items={[
            { label: "Properties", href: "/properties" },
            { label: p.title, href: `/properties/${p.slug}` },
          ]}
        />

        {!onMarket && (
          <div role="note" className="mt-6 flex gap-3 border border-danger/40 bg-danger/5 p-4">
            <Info aria-hidden className="mt-0.5 size-5 shrink-0 text-danger" />
            <p>
              <strong className="font-semibold">This property is {availabilityLabel[p.status].toLowerCase()}.</strong>{" "}
              It is kept here for reference only.{" "}
              <Link href="/properties" className="underline underline-offset-4">
                See properties currently available
              </Link>
              .
            </p>
          </div>
        )}

        <header className="mt-8 grid gap-6 md:mt-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <div className="flex flex-wrap gap-2">
              <ListingTypeBadge type={p.listingType} />
              <AvailabilityBadge status={p.status} />
              {p.isDemo && <DemoBadge />}
            </div>
            <h1 className="mt-5 font-display text-headline text-balance">{p.title}</h1>
            <p className="mt-4 flex items-center gap-2 text-lg text-muted">
              <MapPin aria-hidden className="size-5 shrink-0" />
              {p.location.locality}, {p.location.city}
            </p>
          </div>
          <div className="lg:col-span-4 lg:text-right">
            <p className="font-display text-5xl leading-none">{formatPrice(p.price, p.listingType)}</p>
            {p.price.kind === "fixed" && p.price.amount >= 1_00_000 && (
              <p className="mt-2 text-sm text-muted tabular-nums">{formatAmountFull(p.price.amount)}</p>
            )}
            <a href="#enquire" className="mt-5 inline-flex min-h-12 items-center rounded-[2px] bg-forest px-6 font-medium text-paper lg:hidden">
              Enquire about this property
            </a>
          </div>
        </header>
      </div>

      <div className="container-x mt-8 md:mt-10">
        <Gallery images={p.images} title={p.title} />
      </div>

      <div className="container-x mt-12 grid gap-12 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-7 xl:col-span-8">
          <FactGrid facts={facts} />
          <p className="mt-10 font-display text-3xl leading-snug text-balance md:text-[2.1rem]">{p.summary}</p>

          <DetailSection id="description" title="About this property">
            <Paragraphs text={p.description} />
          </DetailSection>

          {p.features.length > 0 && (
            <DetailSection id="features" title="Key features">
              <CheckList items={p.features} />
            </DetailSection>
          )}

          {p.amenities.length > 0 && (
            <DetailSection id="amenities" title="Amenities">
              <CheckList items={p.amenities} />
            </DetailSection>
          )}

          {p.documents && p.documents.length > 0 && (
            <DetailSection id="documents" title="Floor plans & documents">
              <DocumentList documents={p.documents} />
            </DetailSection>
          )}

          <DetailSection id="location" title="Location">
            <LocationBlock location={p.location} title={p.title} />
          </DetailSection>

          {project && (
            <DetailSection id="project" title="Part of a project">
              <Link href={`/projects/${project.slug}`} className="group flex items-center justify-between gap-6 bg-card p-6 ring-1 ring-line hover:ring-ink">
                <span>
                  <ProjectStatusBadge status={project.status} />
                  <span className="mt-3 block font-display text-3xl">{project.name}</span>
                  <span className="mt-1 block text-muted">{project.summary}</span>
                </span>
                <ArrowUpRight aria-hidden className="size-6 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </DetailSection>
          )}
        </div>

        <aside id="enquire" aria-labelledby="enquire-title" className="scroll-mt-24 lg:col-span-5 xl:col-span-4">
          <div className="bg-paper-2 p-6 ring-1 ring-line md:p-8 lg:sticky lg:top-24">
            <h2 id="enquire-title" className="font-display text-3xl">
              {onMarket ? "Enquire about this property" : "Looking for something similar?"}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {onMarket
                ? "Ask a question or arrange a visit. We’ll respond on the number you share."
                : "Tell us what you need and we’ll suggest comparable properties."}
            </p>
            <ContactActions subject={onMarket ? p.title : undefined} className="mt-5 [&>a]:flex-1" />
            <div className="mt-6">
              <EnquiryForm
                deliveryReady={deliveryReady}
                variant="compact"
                subject={onMarket ? p.title : undefined}
                subjectRef={onMarket ? p.id : undefined}
                fixedType={onMarket ? "property" : undefined}
                defaultType={p.listingType === "rent" ? "rent" : "buy"}
              />
            </div>
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section aria-labelledby="similar-title" className="container-x mt-20">
          <div className="flex items-end justify-between gap-6 border-b border-line pb-6">
            <h2 id="similar-title" className="font-display text-headline">
              Similar properties
            </h2>
            <Link href={`/properties?mode=${p.listingType}`} className="hidden min-h-11 items-center text-sm font-medium underline underline-offset-4 sm:inline-flex">
              More {listingTypeLabel[p.listingType].toLowerCase()}
            </Link>
          </div>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((s) => (
              <li key={s.id}>
                <PropertyCard property={s} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
