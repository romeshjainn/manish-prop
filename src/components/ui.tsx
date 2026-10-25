import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { previewMode } from "@/config/site";

type Variant = "primary" | "dark" | "outline" | "light" | "outline-light";

const variants: Record<Variant, string> = {
  primary: "bg-forest text-paper hover:bg-forest-deep",
  dark: "bg-ink text-paper hover:bg-ink-2",
  outline: "border border-ink/80 text-ink hover:bg-ink hover:text-paper",
  light: "bg-paper text-ink hover:bg-white",
  "outline-light": "border border-paper/60 text-paper hover:bg-paper hover:text-ink",
};

export function buttonClass(variant: Variant = "primary", extra = "") {
  return `inline-flex min-h-12 items-center justify-center gap-2 rounded-[2px] px-6 text-[0.9375rem] font-medium tracking-[0.01em] transition-colors duration-200 ${variants[variant]} ${extra}`;
}

export function ButtonLink({
  variant = "primary",
  className = "",
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return (
    <Link className={buttonClass(variant, className)} {...props}>
      {children}
    </Link>
  );
}

/** External / protocol links (tel:, wa.me, mailto:) styled as buttons. */
export function ButtonAnchor({
  variant = "primary",
  className = "",
  children,
  ...props
}: ComponentProps<"a"> & { variant?: Variant }) {
  return (
    <a className={buttonClass(variant, className)} {...props}>
      {children}
    </a>
  );
}

export function TextLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link
      href={href}
      className={`group inline-flex min-h-11 items-center gap-1.5 text-[0.9375rem] font-medium text-ink underline decoration-line-strong decoration-1 underline-offset-[6px] transition-colors hover:decoration-ink ${className}`}
    >
      {children}
      <ArrowUpRight aria-hidden className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  action,
  as: Tag = "h2",
  id,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  action?: ReactNode;
  as?: "h1" | "h2";
  id?: string;
}) {
  return (
    <div className="flex flex-col gap-6 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
        <Tag id={id} className="font-display text-headline text-balance">
          {title}
        </Tag>
        {intro && <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted text-pretty">{intro}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/**
 * A note for the site owner about missing business information.
 * Rendered ONLY in preview mode — never on the live site.
 */
export function ContentNeeded({ children, className = "" }: { children: ReactNode; className?: string }) {
  if (!previewMode) return null;
  return (
    <div
      className={`border border-dashed border-bronze/60 bg-bronze-soft/50 px-4 py-3 text-sm leading-relaxed text-ink-2 ${className}`}
    >
      <span className="mr-2 font-semibold uppercase tracking-[0.12em] text-bronze">Content needed</span>
      {children}
    </div>
  );
}

export function DemoBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-[2px] bg-ink/85 px-2 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-paper ${className}`}
    >
      Sample
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="container-x pt-10 pb-10 md:pt-16 md:pb-14">
      {children}
      {eyebrow && <p className="eyebrow mt-8 mb-5">{eyebrow}</p>}
      <h1 className="font-display text-display max-w-5xl text-balance">{title}</h1>
      {intro && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted text-pretty md:text-xl">{intro}</p>}
    </header>
  );
}
