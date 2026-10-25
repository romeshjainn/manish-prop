import { MapPin } from "lucide-react";
import type { Location } from "@/lib/types";

/**
 * Shows locality text always, and an OpenStreetMap embed only when the
 * coordinates have been marked as verified.
 */
export function LocationBlock({ location, title }: { location: Location; title: string }) {
  const coords = location.coordinates?.verified ? location.coordinates : null;
  const d = 0.008;
  const bbox = coords ? [coords.lng - d, coords.lat - d, coords.lng + d, coords.lat + d].join(",") : "";

  return (
    <div>
      <p className="flex items-start gap-2 text-lg">
        <MapPin aria-hidden className="mt-1 size-5 shrink-0 text-forest" />
        <span>
          {location.address ? `${location.address}, ` : ""}
          {location.locality}, {location.city}
          {location.state ? `, ${location.state}` : ""}
        </span>
      </p>
      {coords ? (
        <div className="mt-5">
          <div className="aspect-[16/9] overflow-hidden ring-1 ring-line">
            <iframe
              title={`Map showing the location of ${title}`}
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${coords.lat},${coords.lng}`}
              className="size-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
          <a
            href={`https://www.openstreetmap.org/?mlat=${coords.lat}&mlon=${coords.lng}#map=16/${coords.lat}/${coords.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex min-h-10 items-center text-sm underline underline-offset-4"
          >
            Open larger map<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted">The exact location is shared on enquiry.</p>
      )}
    </div>
  );
}
