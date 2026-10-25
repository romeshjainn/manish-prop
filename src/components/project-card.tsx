import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Project } from "@/lib/types";
import { formatDate, formatNumber, formatPrice } from "@/lib/format";
import { projectCategoryLabel } from "@/lib/labels";
import { ProjectStatusBadge } from "./badges";
import { CoverImage } from "./media";
import { DemoBadge } from "./ui";

/** Key facts that are only rendered when the value exists. */
export function projectFacts(p: Project): { label: string; value: string }[] {
  const facts: { label: string; value: string }[] = [];
  if (p.totalUnits) facts.push({ label: "Units", value: formatNumber(p.totalUnits) });
  if (p.unitTypes?.length) facts.push({ label: "Configurations", value: p.unitTypes.map((u) => u.name).join(", ") });
  if (p.status === "completed" && p.completedOn) facts.push({ label: "Completed", value: formatDate(p.completedOn) });
  if (p.status !== "completed" && p.expectedTimeline) facts.push({ label: "Timeline", value: p.expectedTimeline });
  if (p.price && p.status !== "upcoming") facts.push({ label: "Pricing", value: formatPrice(p.price) });
  return facts;
}

export function ProjectCard({
  project: p,
  size = "default",
  priority = false,
  headingLevel: H = "h3",
}: {
  project: Project;
  size?: "default" | "large";
  priority?: boolean;
  headingLevel?: "h2" | "h3";
}) {
  const facts = projectFacts(p).slice(0, 2);
  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative">
        <CoverImage
          image={p.images[0]}
          label={p.name}
          priority={priority}
          sizes={size === "large" ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"}
          className={size === "large" ? "aspect-[4/3] lg:aspect-[16/11]" : "aspect-[4/3]"}
          imgClassName="transition-transform duration-[900ms] ease-out-soft group-hover:scale-[1.03]"
        />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <ProjectStatusBadge status={p.status} />
          {p.isDemo && <DemoBadge />}
        </div>
      </div>
      <div className="flex flex-1 flex-col pt-5">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          <span className="font-semibold uppercase tracking-[0.14em] text-xs">{projectCategoryLabel[p.category]}</span>
          <span aria-hidden className="h-3 w-px bg-line-strong" />
          <span className="inline-flex items-center gap-1">
            <MapPin aria-hidden className="size-3.5" />
            {p.location.locality}, {p.location.city}
          </span>
        </div>
        <H className={`mt-3 font-display text-balance ${size === "large" ? "text-4xl md:text-5xl" : "text-3xl"}`}>
          <Link href={`/projects/${p.slug}`} className="after:absolute after:inset-0">
            {p.name}
          </Link>
        </H>
        <p className="mt-3 max-w-xl leading-relaxed text-muted text-pretty">{p.summary}</p>
        {facts.length > 0 && (
          <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-4 text-sm">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="text-muted">{f.label}</dt>
                <dd className="mt-0.5 font-medium text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <span aria-hidden className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-forest">
          View project
          <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );
}
