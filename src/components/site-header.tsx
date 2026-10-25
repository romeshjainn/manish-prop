import Image from "next/image";
import Link from "next/link";
import { business } from "@/config/business";
import { contact } from "@/lib/contact";
import { DesktopNav, MobileNav } from "./site-nav";
import { ButtonLink } from "./ui";

export function Wordmark({ className = "" }: { className?: string }) {
  if (business.logo) {
    return <Image src={business.logo} alt={business.name} width={180} height={48} className={`h-10 w-auto ${className}`} priority />;
  }
  const [first, ...rest] = business.name.split(" ");
  return (
    <span className={`flex items-baseline gap-2 leading-none ${className}`}>
      <span aria-hidden className="relative top-[-0.1em] inline-block size-2.5 rotate-45 bg-forest" />
      <span className="font-display text-[1.75rem] tracking-tight">{first}</span>
      {rest.length > 0 && (
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.28em] text-muted">{rest.join(" ")}</span>
      )}
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/92 backdrop-blur-md supports-[backdrop-filter]:bg-paper/85">
      <div className="container-x flex h-18 items-center justify-between gap-6">
        <Link href="/" className="inline-flex min-h-11 items-center" aria-label={`${business.name} — home`}>
          <Wordmark />
        </Link>
        <DesktopNav />
        <div className="flex items-center gap-2">
          <ButtonLink href="/contact" className="hidden min-h-11 px-5 sm:inline-flex">
            Enquire now
          </ButtonLink>
          <MobileNav
            brand={business.name}
            phone={contact.telHref && contact.phoneDisplay ? { href: contact.telHref, label: contact.phoneDisplay } : null}
          />
        </div>
      </div>
    </header>
  );
}
