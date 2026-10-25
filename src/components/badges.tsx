import type { AvailabilityStatus, ListingType, ProjectStatus } from "@/lib/types";
import { availabilityLabel, listingTypeLabel, projectStatusLabel } from "@/lib/labels";

const statusStyle: Record<ProjectStatus, string> = {
  completed: "bg-forest-soft text-forest-deep",
  ongoing: "bg-bronze-soft text-[#6d4724]",
  upcoming: "bg-slate-soft text-slate",
};

const statusDot: Record<ProjectStatus, string> = {
  completed: "bg-forest",
  ongoing: "bg-bronze",
  upcoming: "border border-slate bg-transparent",
};

export function ProjectStatusBadge({ status, className = "" }: { status: ProjectStatus; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-[2px] px-2.5 py-1 text-xs font-semibold tracking-[0.04em] ${statusStyle[status]} ${className}`}
    >
      <span aria-hidden className={`size-2 rounded-full ${statusDot[status]}`} />
      {projectStatusLabel[status]}
    </span>
  );
}

export function StatusDot({ status }: { status: ProjectStatus }) {
  return <span aria-hidden className={`inline-block size-2.5 rounded-full ${statusDot[status]}`} />;
}

export function ListingTypeBadge({ type, className = "" }: { type: ListingType; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-[2px] px-2.5 py-1 text-xs font-semibold tracking-[0.04em] ${
        type === "sale" ? "bg-ink text-paper" : "bg-paper text-ink ring-1 ring-ink/80 ring-inset"
      } ${className}`}
    >
      {listingTypeLabel[type]}
    </span>
  );
}

export function AvailabilityBadge({ status, className = "" }: { status: AvailabilityStatus; className?: string }) {
  if (status === "available") return null;
  const tone = status === "under-offer" ? "bg-bronze text-paper" : "bg-danger text-paper";
  return (
    <span className={`inline-flex items-center rounded-[2px] px-2.5 py-1 text-xs font-semibold tracking-[0.04em] ${tone} ${className}`}>
      {availabilityLabel[status]}
    </span>
  );
}
