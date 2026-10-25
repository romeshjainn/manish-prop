import { formatDate } from "@/lib/format";
import type { Project } from "@/lib/types";

/** Renders only confirmed progress; otherwise a plain status note. */
export function ProjectProgress({ project }: { project: Project }) {
  if (project.status !== "ongoing") return null;
  const progress = project.progress;
  if (!progress) {
    return (
      <p className="border-l-2 border-bronze pl-4 text-sm leading-relaxed text-ink-2">
        Under construction. Progress updates are published here once confirmed.
      </p>
    );
  }
  const pct = Math.max(0, Math.min(100, Math.round(progress.percent)));
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 text-sm">
        <span className="font-semibold" id={`progress-${project.slug}`}>
          Construction progress
        </span>
        <span className="font-display text-2xl tabular-nums">{pct}%</span>
      </div>
      <div
        role="progressbar"
        aria-labelledby={`progress-${project.slug}`}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="mt-2 h-1.5 bg-line"
      >
        <div className="h-full bg-bronze" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-xs text-muted">
        As of {formatDate(progress.asOf)}
        {progress.note ? ` · ${progress.note}` : ""}
      </p>
    </div>
  );
}
