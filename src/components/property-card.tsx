import Link from "next/link";
import { Bath, BedDouble, MapPin, Ruler } from "lucide-react";
import type { Property } from "@/lib/types";
import { formatArea, formatPrice } from "@/lib/format";
import { propertyTypeLabel } from "@/lib/labels";
import { AvailabilityBadge, ListingTypeBadge } from "./badges";
import { CoverImage } from "./media";
import { DemoBadge } from "./ui";

export function PropertyCard({
  property: p,
  priority = false,
  headingLevel: H = "h3",
}: {
  property: Property;
  priority?: boolean;
  headingLevel?: "h2" | "h3";
}) {
  const href = `/properties/${p.slug}`;
  return (
    <article className="group relative flex h-full flex-col bg-card ring-1 ring-line transition-shadow duration-300 hover:shadow-[0_18px_40px_-24px_rgb(28_28_26/0.45)]">
      <div className="relative">
        <CoverImage
          image={p.images[0]}
          label={p.title}
          priority={priority}
          sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
          className="aspect-[4/3]"
          imgClassName="transition-transform duration-700 ease-out-soft group-hover:scale-[1.035]"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <ListingTypeBadge type={p.listingType} />
          <AvailabilityBadge status={p.status} />
          {p.isDemo && <DemoBadge />}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{propertyTypeLabel[p.type]}</p>
        </div>
        <H className="mt-2 text-lg leading-snug font-semibold text-balance">
          {/* The whole card is clickable via the stretched link. */}
          <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none after:focus-visible:outline-2 after:focus-visible:outline-forest">
            {p.title}
          </Link>
        </H>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
          <MapPin aria-hidden className="size-4 shrink-0" />
          {p.location.locality}, {p.location.city}
        </p>

        <dl className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-2">
          {p.bedrooms !== undefined && (
            <div className="flex items-center gap-1.5">
              <BedDouble aria-hidden className="size-4 text-muted" />
              <dt className="sr-only">Bedrooms</dt>
              <dd>{p.bedrooms} bed</dd>
            </div>
          )}
          {p.bathrooms !== undefined && (
            <div className="flex items-center gap-1.5">
              <Bath aria-hidden className="size-4 text-muted" />
              <dt className="sr-only">Bathrooms</dt>
              <dd>{p.bathrooms} bath</dd>
            </div>
          )}
          {p.area && (
            <div className="flex items-center gap-1.5">
              <Ruler aria-hidden className="size-4 text-muted" />
              <dt className="sr-only">{p.area.label ?? "Area"}</dt>
              <dd>{formatArea(p.area)}</dd>
            </div>
          )}
        </dl>

        <div className="mt-auto pt-6">
          <div className="flex items-end justify-between gap-4 border-t border-line pt-4">
            <p className="font-display text-[1.65rem] leading-none">{formatPrice(p.price, p.listingType)}</p>
            <span aria-hidden className="text-sm font-medium text-forest underline-offset-4 group-hover:underline">
              View details
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
