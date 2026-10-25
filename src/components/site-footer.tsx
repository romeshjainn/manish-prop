import Link from "next/link";
import { business } from "@/config/business";
import { contact, whatsappHref } from "@/lib/contact";
import { getListedProperties, getProjectCounts } from "@/lib/content";
import { projectStatusLabel, propertyTypeLabel } from "@/lib/labels";
import type { ProjectStatus } from "@/lib/types";
import { Wordmark } from "./site-header";
import { ContentNeeded } from "./ui";

function FooterList({ title, links }: { title: string; links: { href: string; label: string; external?: boolean }[] }) {
  if (!links.length) return null;
  return (
    <div>
      <h2 className="eyebrow text-paper/70">{title}</h2>
      <ul className="mt-4 space-y-1">
        {links.map((l) => (
          <li key={l.href}>
            {l.external ? (
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center text-paper/90 hover:text-paper hover:underline underline-offset-4">
                {l.label}
              </a>
            ) : (
              <Link href={l.href} className="inline-flex min-h-10 items-center text-paper/90 hover:text-paper hover:underline underline-offset-4">
                {l.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function SiteFooter() {
  const [listed, counts] = await Promise.all([getListedProperties(), getProjectCounts()]);

  const propertyLinks = [
    ...(listed.some((p) => p.listingType === "sale") ? [{ href: "/properties?mode=sale", label: "Properties for sale" }] : []),
    ...(listed.some((p) => p.listingType === "rent") ? [{ href: "/properties?mode=rent", label: "Properties for rent" }] : []),
    ...[...new Set(listed.map((p) => p.type))]
      .slice(0, 4)
      .map((t) => ({ href: `/properties?type=${t}`, label: `${propertyTypeLabel[t]}s` })),
  ];
  if (!propertyLinks.length) propertyLinks.push({ href: "/properties", label: "All properties" });

  const projectLinks = [
    { href: "/projects", label: "All projects" },
    ...(["completed", "ongoing", "upcoming"] as ProjectStatus[]).map((s) => ({
      href: `/projects/${s}`,
      label: `${projectStatusLabel[s]}${counts[s] ? ` (${counts[s]})` : ""}`,
    })),
  ];

  const wa = whatsappHref();
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark bg-ink text-paper">
      <div className="container-x grid gap-12 py-16 md:py-20 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Link href="/" className="inline-flex text-paper [&_.text-muted]:text-paper/65">
            <Wordmark />
          </Link>
          <p className="mt-5 max-w-sm leading-relaxed text-paper/75">{business.description}</p>

          <div className="mt-8 space-y-2 text-paper/90">
            {contact.telHref && (
              <p>
                <a href={contact.telHref} className="inline-flex min-h-10 items-center hover:underline underline-offset-4">
                  {contact.phoneDisplay}
                </a>
              </p>
            )}
            {wa && (
              <p>
                <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center hover:underline underline-offset-4">
                  WhatsApp
                </a>
              </p>
            )}
            {contact.mailtoHref && (
              <p>
                <a href={contact.mailtoHref} className="inline-flex min-h-10 items-center hover:underline underline-offset-4">
                  {contact.email}
                </a>
              </p>
            )}
            {business.address && (
              <address className="pt-2 not-italic leading-relaxed text-paper/75">
                {business.address.line1}
                {business.address.line2 && <>, {business.address.line2}</>}
                <br />
                {business.address.city}, {business.address.state} {business.address.postalCode}
              </address>
            )}
          </div>
          <ContentNeeded className="mt-6 border-paper/30 bg-paper/5 text-paper/85 [&>span]:text-bronze-soft">
            Phone, WhatsApp, email, address and social links are empty in src/config/business.ts, so no contact
            details are shown.
          </ContentNeeded>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-8">
          <FooterList
            title="Explore"
            links={[
              { href: "/", label: "Home" },
              { href: "/about", label: "About" },
              { href: "/services", label: "Services" },
              { href: "/contact", label: "Contact" },
            ]}
          />
          <FooterList title="Properties" links={propertyLinks} />
          <FooterList title="Projects" links={projectLinks} />
          <FooterList title="Follow" links={business.social.map((s) => ({ href: s.href, label: s.label, external: true }))} />
        </div>
      </div>
      <div className="border-t border-paper/15">
        <div className="container-x flex flex-col gap-3 py-6 text-sm text-paper/65 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {business.name}
          </p>
          <ul className="flex gap-6">
            <li>
              <Link href="/privacy" className="inline-flex min-h-10 items-center hover:text-paper">
                Privacy policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="inline-flex min-h-10 items-center hover:text-paper">
                Terms of use
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
