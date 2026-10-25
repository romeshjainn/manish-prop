import Link from "next/link";
import { getProjectCounts } from "@/lib/content";
import { projectStatusLabel } from "@/lib/labels";
import type { ProjectStatus } from "@/lib/types";
import { StatusDot } from "./badges";

export async function ProjectStatusTabs({ current }: { current: ProjectStatus | "all" }) {
  const counts = await getProjectCounts();
  const total = counts.completed + counts.ongoing + counts.upcoming;
  const tabs: { key: ProjectStatus | "all"; href: string; label: string; count: number }[] = [
    { key: "all", href: "/projects", label: "All projects", count: total },
    ...(["completed", "ongoing", "upcoming"] as const).map((s) => ({
      key: s,
      href: `/projects/${s}`,
      label: projectStatusLabel[s],
      count: counts[s],
    })),
  ];

  return (
    <nav aria-label="Project status" className="container-x">
      <ul className="-mx-4 flex gap-1 overflow-x-auto border-b border-line px-4 sm:mx-0 sm:px-0">
        {tabs.map((t) => {
          const active = t.key === current;
          return (
            <li key={t.key} className="shrink-0">
              <Link
                href={t.href}
                aria-current={active ? "page" : undefined}
                className={`relative inline-flex min-h-13 items-center gap-2.5 px-4 text-[0.9375rem] transition-colors ${
                  active ? "font-semibold text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {t.key !== "all" && <StatusDot status={t.key} />}
                {t.label}
                <span className="rounded-full bg-paper-2 px-2 py-0.5 text-xs tabular-nums text-ink-2">{t.count}</span>
                {active && <span aria-hidden className="absolute inset-x-0 -bottom-px h-0.5 bg-ink" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
