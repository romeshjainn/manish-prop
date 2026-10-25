import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { siteUrl } from "@/config/site";

/** Serialises JSON-LD safely (escapes "<" so content cannot close the script tag). */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href: string }[] }) {
  const all = [{ label: "Home", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
          {all.map((item, i) => {
            const last = i === all.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-1">
                {last ? (
                  <span aria-current="page" className="text-ink-2">
                    {item.label}
                  </span>
                ) : (
                  <>
                    <Link href={item.href} className="inline-flex min-h-8 items-center hover:text-ink hover:underline underline-offset-4">
                      {item.label}
                    </Link>
                    <ChevronRight aria-hidden className="size-3.5" />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.label,
            item: `${siteUrl}${item.href === "/" ? "" : item.href}`,
          })),
        }}
      />
    </>
  );
}
