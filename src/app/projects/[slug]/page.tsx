import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExternalLink, MapPin } from "lucide-react";
import { ProjectStatusBadge } from "@/components/badges";
import { ContactActions } from "@/components/contact-actions";
import { CheckList, DetailSection, DocumentList, FactGrid, Paragraphs } from "@/components/detail-parts";
import { EnquiryForm } from "@/components/enquiry-form";
import { Gallery } from "@/components/gallery";
import { LocationBlock } from "@/components/location-block";
import { CoverImage } from "@/components/media";
import { ProjectCard } from "@/components/project-card";
import { ProjectProgress } from "@/components/project-progress";
import { PropertyCard } from "@/components/property-card";
import { Breadcrumbs } from "@/components/seo";
import { DemoBadge } from "@/components/ui";
import { getProjectBySlug, getProjects, getPropertiesForProject } from "@/lib/content";
import { isDeliveryConfigured } from "@/lib/enquiry-delivery";
import { formatArea, formatDate, formatNumber, formatPrice } from "@/lib/format";
import { projectCategoryLabel, projectStatusLabel } from "@/lib/labels";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProjectBySlug(slug);
  if (!p) return {};
  const title = `${p.name} — ${projectStatusLabel[p.status]} ${projectCategoryLabel[p.category].toLowerCase()} project, ${p.location.locality}`;
  return {
    title,
    description: p.summary,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { title: p.name, description: p.summary, images: p.images[0] ? [{ url: p.images[0].src, alt: p.images[0].alt }] : undefined },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const p = await getProjectBySlug(slug);
  if (!p) notFound();

  const [units, siblings] = await Promise.all([getPropertiesForProject(p.slug), getProjects(p.status)]);
  const more = siblings.filter((s) => s.id !== p.id).slice(0, 2);
  const deliveryReady = isDeliveryConfigured();

  const details = [
    { label: "Status", value: projectStatusLabel[p.status] },
    { label: "Category", value: projectCategoryLabel[p.category] },
    p.status === "completed" && p.completedOn && { label: "Completed", value: formatDate(p.completedOn) },
    p.status !== "completed" && p.expectedTimeline && { label: "Timeline", value: p.expectedTimeline },
    p.totalUnits && { label: "Total units", value: formatNumber(p.totalUnits) },
    p.landArea && { label: p.landArea.label ?? "Land area", value: formatArea(p.landArea) },
    p.price && p.status !== "upcoming" && { label: "Pricing", value: formatPrice(p.price) },
    p.developer && { label: "Developer", value: p.developer },
    ...(p.specifications ?? []),
    p.registration && {
      label: `${p.registration.authority} registration`,
      value: p.registration.url ? (
        <a href={p.registration.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline underline-offset-4">
          {p.registration.number}
          <ExternalLink aria-hidden className="size-3.5" />
          <span className="sr-only">(verify on the regulator’s website, opens in a new tab)</span>
        </a>
      ) : (
        p.registration.number
      ),
    },
  ].filter(Boolean) as { label: string; value: React.ReactNode }[];

  const ctaTitle =
    p.status === "upcoming" ? "Register your interest" : p.status === "ongoing" ? "Enquire about this project" : "Ask about this project";

  return (
    <article className="pb-24">
      <div className="container-x pt-8 md:pt-10">
        <Breadcrumbs
          items={[
            { label: "Projects", href: "/projects" },
            { label: projectStatusLabel[p.status], href: `/projects/${p.status}` },
            { label: p.name, href: `/projects/${p.slug}` },
          ]}
        />
        <header className="mt-8 grid gap-8 md:mt-12 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <div className="flex flex-wrap gap-2">
              <ProjectStatusBadge status={p.status} />
              {p.isDemo && <DemoBadge />}
            </div>
            <h1 className="mt-5 font-display text-display text-balance">{p.name}</h1>
            {p.tagline && <p className="mt-4 font-display text-2xl italic text-ink-2 md:text-3xl">{p.tagline}</p>}
          </div>
          <div className="text-muted lg:col-span-4 lg:text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.14em]">{projectCategoryLabel[p.category]}</p>
            <p className="mt-2 inline-flex items-center gap-1.5 text-lg text-ink-2">
              <MapPin aria-hidden className="size-4" />
              {p.status === "upcoming" ? "Proposed: " : ""}
              {p.location.locality}, {p.location.city}
            </p>
            <a href="#enquire" className="mt-5 flex min-h-12 items-center justify-center rounded-[2px] bg-forest px-6 font-medium text-paper lg:hidden">
              {ctaTitle}
            </a>
          </div>
        </header>
      </div>

      <div className="container-x mt-10">
        <Gallery images={p.images} title={p.name} />
      </div>

      <div className="container-x mt-12 grid gap-12 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-7 xl:col-span-8">
          {p.status === "upcoming" && (
            <p role="note" className="mb-10 border-l-2 border-slate bg-slate-soft/60 p-4 leading-relaxed">
              <strong className="font-semibold">This is a planned development.</strong> It is not yet under construction
              or available to buy. Details may change before launch; registering interest does not reserve a unit.
            </p>
          )}

          <p className="font-display text-3xl leading-snug text-balance md:text-[2.1rem]">{p.summary}</p>

          <DetailSection id="overview" title="Overview">
            <Paragraphs text={p.description} />
          </DetailSection>

          {p.status === "ongoing" && (
            <DetailSection id="progress" title="Construction">
              <ProjectProgress project={p} />
              {p.updates && p.updates.length > 0 && (
                <ol className="mt-10 border-l border-line">
                  {p.updates.map((u) => (
                    <li key={u.date + u.title} className="relative pb-10 pl-8 last:pb-0">
                      <span aria-hidden className="absolute top-1.5 -left-[5px] size-2.5 rounded-full bg-bronze" />
                      <p className="text-sm text-muted">
                        <time dateTime={u.date}>{formatDate(u.date)}</time>
                      </p>
                      <h3 className="mt-1 text-lg font-semibold">{u.title}</h3>
                      {u.note && <p className="mt-1 text-muted">{u.note}</p>}
                      {u.image && (
                        <CoverImage image={u.image} sizes="(min-width: 1024px) 40vw, 90vw" className="mt-4 aspect-[16/9] max-w-xl" />
                      )}
                    </li>
                  ))}
                </ol>
              )}
            </DetailSection>
          )}

          <DetailSection id="details" title="Project details">
            <FactGrid facts={details} />
          </DetailSection>

          {p.unitTypes && p.unitTypes.length > 0 && (
            <DetailSection id="configurations" title={p.status === "upcoming" ? "Planned configurations" : "Configurations"}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[28rem] text-left">
                  <thead>
                    <tr className="border-b border-ink text-xs uppercase tracking-[0.12em] text-muted">
                      <th scope="col" className="py-3 pr-4 font-semibold">Type</th>
                      <th scope="col" className="py-3 pr-4 font-semibold">Size</th>
                      {p.status !== "upcoming" && <th scope="col" className="py-3 pr-4 font-semibold">Price</th>}
                      <th scope="col" className="py-3 font-semibold">Availability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.unitTypes.map((u) => (
                      <tr key={u.name} className="border-b border-line">
                        <th scope="row" className="py-4 pr-4 font-display text-xl font-normal">{u.name}</th>
                        <td className="py-4 pr-4">{u.size ?? "—"}</td>
                        {p.status !== "upcoming" && <td className="py-4 pr-4">{u.price ? formatPrice(u.price) : "On request"}</td>}
                        <td className="py-4 text-muted">{u.availabilityNote ?? (p.status === "upcoming" ? "Not yet released" : "Ask us")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DetailSection>
          )}

          {p.amenities && p.amenities.length > 0 && (
            <DetailSection id="amenities" title={p.status === "upcoming" ? "Planned amenities" : "Amenities & facilities"}>
              <CheckList items={p.amenities} />
            </DetailSection>
          )}

          {p.documents && p.documents.length > 0 && (
            <DetailSection id="documents" title="Brochures & plans">
              <DocumentList documents={p.documents} />
            </DetailSection>
          )}

          <DetailSection id="location" title="Location">
            <LocationBlock location={p.location} title={p.name} />
          </DetailSection>
        </div>

        <aside id="enquire" aria-labelledby="enquire-title" className="scroll-mt-24 lg:col-span-5 xl:col-span-4">
          <div className="bg-paper-2 p-6 ring-1 ring-line md:p-8 lg:sticky lg:top-24">
            <h2 id="enquire-title" className="font-display text-3xl">
              {ctaTitle}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {p.status === "upcoming"
                ? "We’ll contact you when confirmed details are available."
                : "Ask about availability, configurations, pricing or a site visit."}
            </p>
            <ContactActions subject={p.name} className="mt-5 [&>a]:flex-1" />
            <div className="mt-6">
              <EnquiryForm
                deliveryReady={deliveryReady}
                variant="compact"
                subject={p.name}
                subjectRef={p.id}
                fixedType="project"
                submitLabel={p.status === "upcoming" ? "Register interest" : "Send enquiry"}
              />
            </div>
          </div>
        </aside>
      </div>

      {units.length > 0 && (
        <section aria-labelledby="units-title" className="container-x mt-20">
          <div className="border-b border-line pb-6">
            <h2 id="units-title" className="font-display text-headline">
              Available in {p.name}
            </h2>
            <p className="mt-3 text-muted">
              {units.length} {units.length === 1 ? "unit is" : "units are"} currently listed in this project.
            </p>
          </div>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {units.map((u) => (
              <li key={u.id}>
                <PropertyCard property={u} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {more.length > 0 && (
        <section aria-labelledby="more-title" className="container-x mt-24">
          <h2 id="more-title" className="border-b border-line pb-6 font-display text-headline">
            More {projectStatusLabel[p.status].toLowerCase()} projects
          </h2>
          <div className="mt-10 grid gap-12 md:grid-cols-2">
            {more.map((m) => (
              <ProjectCard key={m.id} project={m} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
