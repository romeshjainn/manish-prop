import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { business } from "@/config/business";
import { siteUrl } from "@/config/site";
import { siteImages } from "@/content/site-images";
import { StatusDot } from "@/components/badges";
import { EnquiryBand } from "@/components/enquiry-band";
import { HeroSearch } from "@/components/hero-search";
import { CoverImage } from "@/components/media";
import { ProjectCard } from "@/components/project-card";
import { PropertyCard } from "@/components/property-card";
import { JsonLd } from "@/components/seo";
import { ServiceIcon } from "@/components/service-icon";
import { ButtonLink, ContentNeeded, SectionHeading, TextLink } from "@/components/ui";
import { contact } from "@/lib/contact";
import {
  getFeaturedProjects,
  getFeaturedProperties,
  getListedProperties,
  getProjectCounts,
  getProjects,
  getServices,
  getStrengths,
} from "@/lib/content";
import { projectStatusDescription, projectStatusLabel } from "@/lib/labels";
import { deriveOptions } from "@/lib/search";
import type { ProjectStatus } from "@/lib/types";

const STATUSES: ProjectStatus[] = ["completed", "ongoing", "upcoming"];

export default async function HomePage() {
  const [featured, listed, featuredProjects, counts, allProjects, services, strengths] = await Promise.all([
    getFeaturedProperties(6),
    getListedProperties(),
    getFeaturedProjects(3),
    getProjectCounts(),
    getProjects(),
    getServices(),
    getStrengths(),
  ]);
  const options = deriveOptions(listed);
  const [leadProject, ...otherProjects] = featuredProjects;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: business.name,
          url: siteUrl,
          description: business.description,
          ...(contact.phoneDisplay && { telephone: contact.phoneDisplay }),
          ...(contact.email && { email: contact.email }),
          ...(business.address && {
            address: {
              "@type": "PostalAddress",
              streetAddress: [business.address.line1, business.address.line2].filter(Boolean).join(", "),
              addressLocality: business.address.city,
              addressRegion: business.address.state,
              postalCode: business.address.postalCode,
              addressCountry: business.address.country,
            },
          }),
          ...(business.social.length && { sameAs: business.social.map((s) => s.href) }),
        }}
      />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section aria-labelledby="hero-title" className="relative">
        <div className="container-x grid gap-10 pt-8 md:pt-12 lg:grid-cols-12 lg:gap-12 lg:pt-16">
          <div className="flex flex-col lg:col-span-5 lg:pb-32">
            <p className="eyebrow">{business.name}</p>
            <h1 id="hero-title" className="mt-6 font-display text-display text-balance">
              Find a place to call <em className="italic text-forest">your own.</em>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted text-pretty md:text-xl">
              Explore properties and real-estate projects with {business.name}, and find options that fit your needs,
              plans and budget.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/properties">
                Explore properties
                <ArrowRight aria-hidden className="size-4" />
              </ButtonLink>
              <ButtonLink href="/projects" variant="outline">
                Discover our projects
              </ButtonLink>
            </div>
          </div>

          <div className="relative lg:col-span-7">
            <CoverImage
              image={siteImages.hero}
              priority
              sizes="(min-width: 1024px) 56vw, 100vw"
              className="aspect-[4/3] sm:aspect-[16/10] lg:aspect-[6/5]"
              tagPosition="top-3 right-3"
            />
            <div aria-hidden className="absolute -bottom-3 -left-3 hidden h-24 w-24 border-b border-l border-ink/70 lg:block" />
          </div>
        </div>

        {listed.length > 0 && (
          <div className="container-x relative z-10 mt-6 lg:-mt-24">
            <div className="bg-card p-3 shadow-[0_30px_60px_-40px_rgb(28_28_26/0.5)] ring-1 ring-line sm:p-4 lg:mr-0 lg:ml-auto lg:w-[88%]">
              <p className="px-1 pb-3 text-sm text-muted">
                Search {listed.length} {listed.length === 1 ? "property" : "properties"} currently on the market
              </p>
              <HeroSearch options={options} />
            </div>
          </div>
        )}
      </section>

      {/* ── Featured properties ─────────────────────────────── */}
      {featured.length > 0 ? (
        <section aria-labelledby="featured-title" className="container-x pt-24 md:pt-32">
          <SectionHeading
            id="featured-title"
            eyebrow="Available now"
            title="Featured properties"
            intro="A selection of listings currently on the market, for sale and for rent."
            action={<TextLink href="/properties">View all {listed.length} properties</TextLink>}
          />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {featured.map((p) => (
              <li key={p.id}>
                <PropertyCard property={p} />
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="container-x pt-24">
          <ContentNeeded>
            No properties are listed yet. Add listings in src/content/properties.ts (see README → “Adding a
            property”).
          </ContentNeeded>
        </section>
      )}

      {/* ── Projects by stage ───────────────────────────────── */}
      {allProjects.length > 0 && (
        <section aria-labelledby="stages-title" className="container-x pt-24 md:pt-32">
          <SectionHeading
            id="stages-title"
            eyebrow="Projects"
            title={
              <>
                Every project, <em className="italic">by stage</em>
              </>
            }
            intro="Developments are grouped by where they are today — finished, being built, or still being planned."
          />
          <ol className="mt-2">
            {STATUSES.map((status, i) => {
              const cover = allProjects.find((p) => p.status === status)?.images[0];
              return (
                <li key={status} className="border-b border-line">
                  <Link
                    href={`/projects/${status}`}
                    className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-x-4 gap-y-2 py-7 md:grid-cols-12 md:gap-6 md:py-9"
                  >
                    <span className="text-sm text-muted tabular-nums md:col-span-1">0{i + 1}</span>
                    <span className="flex items-center gap-3 md:col-span-4">
                      <StatusDot status={status} />
                      <span className="font-display text-4xl transition-transform duration-300 group-hover:translate-x-1 md:text-5xl">
                        {projectStatusLabel[status]}
                      </span>
                    </span>
                    <span className="col-span-2 col-start-2 text-muted md:col-span-4 md:col-start-auto">
                      {projectStatusDescription[status]}
                      <span className="mt-1 block text-sm font-medium text-ink-2">
                        {counts[status] === 0
                          ? "None listed at the moment"
                          : `${counts[status]} ${counts[status] === 1 ? "project" : "projects"}`}
                      </span>
                    </span>
                    <span className="hidden md:col-span-2 md:block">
                      {cover && (
                        <CoverImage
                          image={cover}
                          sizes="12rem"
                          className="aspect-[4/3] grayscale-[35%] transition duration-500 group-hover:grayscale-0"
                          tagPosition="hidden"
                        />
                      )}
                    </span>
                    <span className="row-start-1 col-start-3 flex justify-end md:col-span-1 md:row-start-auto md:col-start-auto">
                      <span className="inline-flex size-11 items-center justify-center rounded-full border border-line-strong transition-colors group-hover:border-ink group-hover:bg-ink group-hover:text-paper">
                        <ArrowUpRight aria-hidden className="size-5" />
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {/* ── Featured projects ───────────────────────────────── */}
      {leadProject && (
        <section aria-labelledby="projects-title" className="container-x pt-24 md:pt-32">
          <SectionHeading
            id="projects-title"
            eyebrow="Featured developments"
            title="Selected projects"
            action={<TextLink href="/projects">All projects</TextLink>}
          />
          <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-10">
            <div className={otherProjects.length ? "lg:col-span-7" : "lg:col-span-12"}>
              <ProjectCard project={leadProject} size="large" />
            </div>
            {otherProjects.length > 0 && (
              <div className="grid gap-12 lg:col-span-5 lg:gap-10">
                {otherProjects.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Why Manish Property ─────────────────────────────── */}
      {strengths.length > 0 && (
        <section aria-labelledby="why-title" className="mt-24 bg-paper-2 py-20 md:mt-32 md:py-28">
          <div className="container-x grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <p className="eyebrow mb-4">Working with us</p>
                <h2 id="why-title" className="font-display text-headline text-balance">
                  Why {business.name}?
                </h2>
              </div>
            </div>
            <ol className="grid gap-px bg-line ring-1 ring-line sm:grid-cols-2 lg:col-span-8">
              {strengths.map((s, i) => (
                <li key={s.title} className="bg-paper-2 p-7 md:p-9">
                  <span className="font-display text-5xl text-bronze">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-6 text-xl font-semibold">{s.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* ── Services ────────────────────────────────────────── */}
      {services.length > 0 && (
        <section aria-labelledby="services-title" className="container-x py-24 md:py-32">
          <SectionHeading
            id="services-title"
            eyebrow="Services"
            title="How we can help"
            action={<TextLink href="/services">All services</TextLink>}
          />
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <li key={s.id} className="border-b border-line sm:pr-10">
                <Link href={`/services#${s.id}`} className="group block py-9">
                  <ServiceIcon name={s.icon} className="size-8 text-forest" />
                  <h3 className="mt-5 flex items-center gap-2 text-xl font-semibold">
                    {s.title}
                    <ArrowUpRight aria-hidden className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted line-clamp-3">{s.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {!services.length && !strengths.length && <div className="h-24" />}

      <EnquiryBand />
    </>
  );
}
