import Link from "next/link";
import { MapPin } from "lucide-react";
import { getProjects } from "@/lib/content";
import { formatDate } from "@/lib/format";
import { projectCategoryLabel, projectStatusDescription, projectStatusLabel } from "@/lib/labels";
import type { Project, ProjectStatus } from "@/lib/types";
import { ProjectStatusBadge } from "./badges";
import { EnquiryBand } from "./enquiry-band";
import { CoverImage } from "./media";
import { projectFacts } from "./project-card";
import { ProjectProgress } from "./project-progress";
import { ProjectStatusTabs } from "./project-status-tabs";
import { Breadcrumbs } from "./seo";
import { ButtonLink, ContentNeeded, DemoBadge, PageHeader } from "./ui";

const headings: Record<ProjectStatus, { title: React.ReactNode; intro: string; empty: string }> = {
  completed: {
    title: (
      <>
        Completed <em className="italic">projects</em>
      </>
    ),
    intro: "Finished developments, shown as built. Completion dates are listed only where they have been confirmed.",
    empty: "Completed projects will be shown here once their details and photographs are published.",
  },
  ongoing: {
    title: (
      <>
        Under <em className="italic">construction</em>
      </>
    ),
    intro: "Developments being built now. Progress figures appear only when they have been measured and confirmed — otherwise we simply show the status.",
    empty: "There are no projects under construction listed right now.",
  },
  upcoming: {
    title: (
      <>
        Upcoming <em className="italic">projects</em>
      </>
    ),
    intro: "Planned developments that are not yet under construction or open for sale. Register your interest to hear when details are confirmed.",
    empty: "No upcoming projects have been announced yet.",
  },
};

function ProjectFeature({ project: p, flip }: { project: Project; flip: boolean }) {
  const facts = projectFacts(p);
  const secondary = p.status === "completed" ? p.images.slice(1, 3) : [];
  const latest = p.updates?.[0];
  return (
    <article className="grid gap-8 border-b border-line py-14 first:pt-0 md:py-20 lg:grid-cols-12 lg:items-center lg:gap-14">
      <div className={`lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
        <Link href={`/projects/${p.slug}`} tabIndex={-1} aria-hidden className="group block">
          <CoverImage
            image={p.images[0]}
            label={p.name}
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="aspect-[4/3]"
            imgClassName="transition-transform duration-[900ms] ease-out-soft group-hover:scale-[1.02]"
          />
        </Link>
        {secondary.length > 0 && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {secondary.map((img) => (
              <CoverImage key={img.src} image={img} sizes="(min-width: 1024px) 29vw, 50vw" className="aspect-[16/10]" />
            ))}
          </div>
        )}
      </div>

      <div className="lg:col-span-5">
        <div className="flex flex-wrap items-center gap-2">
          <ProjectStatusBadge status={p.status} />
          {p.isDemo && <DemoBadge />}
        </div>
        <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          <span className="text-xs font-semibold uppercase tracking-[0.14em]">{projectCategoryLabel[p.category]}</span>
          <span className="inline-flex items-center gap-1">
            <MapPin aria-hidden className="size-3.5" />
            {p.status === "upcoming" ? "Proposed location: " : ""}
            {p.location.locality}, {p.location.city}
          </span>
        </p>
        <h2 className="mt-3 font-display text-4xl md:text-5xl">
          <Link href={`/projects/${p.slug}`} className="hover:underline decoration-1 underline-offset-8">
            {p.name}
          </Link>
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-muted">{p.summary}</p>

        {p.status === "upcoming" && (
          <p className="mt-5 border-l-2 border-slate pl-4 text-sm leading-relaxed text-ink-2">
            Planned development — not yet under construction or available to buy.
          </p>
        )}
        {p.status === "ongoing" && (
          <div className="mt-6">
            <ProjectProgress project={p} />
          </div>
        )}

        {facts.length > 0 && (
          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-line pt-5 text-sm">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="text-muted">{f.label}</dt>
                <dd className="mt-0.5 font-medium">{f.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {p.status === "ongoing" && p.amenities && p.amenities.length > 0 && (
          <p className="mt-5 text-sm text-muted">
            <span className="font-semibold text-ink">Facilities:</span> {p.amenities.join(" · ")}
          </p>
        )}

        {latest && (
          <p className="mt-5 text-sm text-muted">
            <span className="font-semibold text-ink">Latest update ({formatDate(latest.date)}):</span> {latest.title}
          </p>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={`/projects/${p.slug}`} variant="outline">
            View project
          </ButtonLink>
          {p.status !== "completed" && (
            <ButtonLink href={`/projects/${p.slug}#enquire`}>
              {p.status === "upcoming" ? "Register interest" : "Enquire about units"}
            </ButtonLink>
          )}
        </div>
      </div>
    </article>
  );
}

export async function ProjectStatusPage({ status }: { status: ProjectStatus }) {
  const projects = await getProjects(status);
  const h = headings[status];
  return (
    <>
      <PageHeader eyebrow={projectStatusDescription[status]} title={h.title} intro={h.intro}>
        <Breadcrumbs
          items={[
            { label: "Projects", href: "/projects" },
            { label: projectStatusLabel[status], href: `/projects/${status}` },
          ]}
        />
      </PageHeader>
      <ProjectStatusTabs current={status} />
      <div className="container-x py-14 pb-24 md:py-20">
        {projects.length ? (
          projects.map((p, i) => <ProjectFeature key={p.id} project={p} flip={i % 2 === 1} />)
        ) : (
          <div className="border border-dashed border-line-strong px-6 py-16 text-center">
            <p className="font-display text-3xl">{h.empty}</p>
            <ButtonLink href="/projects" variant="outline" className="mt-8">
              See all projects
            </ButtonLink>
            <ContentNeeded className="mx-auto mt-8 max-w-lg text-left">
              Add projects with status “{status}” in src/content/projects.ts.
            </ContentNeeded>
          </div>
        )}
      </div>
      <EnquiryBand
        title={status === "upcoming" ? "Hear about new projects first" : "Ask us about a project"}
        body={
          status === "upcoming"
            ? "Share your requirements and we’ll contact you when confirmed details of upcoming projects are available."
            : "Ask about availability, configurations and pricing. We’ll share what is confirmed."
        }
        href="/contact?type=project"
      />
    </>
  );
}
