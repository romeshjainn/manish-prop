"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { projectCategoryLabel } from "@/lib/labels";
import { PROJECT_CATEGORIES, type Project, type ProjectCategory } from "@/lib/types";
import { ProjectCard } from "./project-card";

export function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <ul className="grid gap-x-8 gap-y-16 md:grid-cols-2">
      {projects.map((p, i) => (
        <li key={p.id}>
          <ProjectCard project={p} priority={i < 2} headingLevel="h2" />
        </li>
      ))}
    </ul>
  );
}

/** Category filter (?category=) on top of a status-filtered list. */
export function ProjectDirectory({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const categories = PROJECT_CATEGORIES.filter((c) => projects.some((p) => p.category === c));
  const raw = params.get("category");
  const category = categories.includes(raw as ProjectCategory) ? (raw as ProjectCategory) : undefined;
  const shown = category ? projects.filter((p) => p.category === category) : projects;

  const select = (c?: ProjectCategory) =>
    router.push(c ? `${pathname}?category=${c}` : pathname, { scroll: false });

  return (
    <div>
      {categories.length > 1 && (
        <fieldset className="mb-10 flex flex-wrap items-center gap-2">
          <legend className="sr-only">Filter by category</legend>
          {[undefined, ...categories].map((c) => (
            <label
              key={c ?? "all"}
              className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-line-strong px-4 text-sm has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-paper has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-forest"
            >
              <input type="radio" name="category" className="sr-only" checked={category === c} onChange={() => select(c)} />
              {c ? projectCategoryLabel[c] : "All categories"}
            </label>
          ))}
          <p aria-live="polite" className="ml-auto text-sm text-muted">
            {shown.length} {shown.length === 1 ? "project" : "projects"}
          </p>
        </fieldset>
      )}
      <ProjectGrid projects={shown} />
    </div>
  );
}
