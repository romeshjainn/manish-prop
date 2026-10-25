import { Check, Download, FileText } from "lucide-react";
import type { DocumentLink } from "@/lib/types";

export function DetailSection({ id, title, children }: { id?: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id ? `${id}-title` : undefined} id={id} className="border-t border-line py-10 md:py-12">
      <h2 id={id ? `${id}-title` : undefined} className="font-display text-3xl md:text-4xl">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function FactGrid({ facts }: { facts: { label: string; value: React.ReactNode }[] }) {
  if (!facts.length) return null;
  return (
    <dl className="grid grid-cols-2 gap-px bg-line ring-1 ring-line sm:grid-cols-3">
      {facts.map((f) => (
        <div key={f.label} className="bg-card p-4 md:p-5">
          <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">{f.label}</dt>
          <dd className="mt-1.5 text-[1.0625rem] font-medium">{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-forest" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function Paragraphs({ text }: { text: string }) {
  return (
    <div className="prose-copy max-w-[68ch] text-[1.0625rem] leading-relaxed text-ink-2">
      {text.split(/\n\s*\n/).map((para, i) => (
        <p key={i}>{para}</p>
      ))}
    </div>
  );
}

export function DocumentList({ documents }: { documents: DocumentLink[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {documents.map((d) => (
        <li key={d.href}>
          <a
            href={d.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex min-h-16 items-center gap-4 bg-card p-4 ring-1 ring-line hover:ring-ink"
          >
            <FileText aria-hidden className="size-6 shrink-0 text-forest" />
            <span className="flex-1">
              <span className="block font-medium">{d.label}</span>
              {d.size && <span className="text-sm text-muted">{d.size}</span>}
            </span>
            <Download aria-hidden className="size-4 text-muted group-hover:text-ink" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
