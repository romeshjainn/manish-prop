import type { Metadata } from "next";
import Image from "next/image";
import { business } from "@/config/business";
import { siteImages } from "@/content/site-images";
import { Paragraphs } from "@/components/detail-parts";
import { EnquiryBand } from "@/components/enquiry-band";
import { CoverImage } from "@/components/media";
import { Breadcrumbs } from "@/components/seo";
import { ContentNeeded, PageHeader, TextLink } from "@/components/ui";
import { getServices, getStrengths } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: `About ${business.name}: who we are, what we do and how we work.`,
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const [strengths, services] = await Promise.all([getStrengths(), getServices()]);
  const { founder } = business;

  return (
    <>
      <PageHeader
        eyebrow="About us"
        title={
          <>
            About <em className="italic">{business.name}</em>
          </>
        }
        intro={business.description}
      >
        <Breadcrumbs items={[{ label: "About", href: "/about" }]} />
      </PageHeader>

      <section className="container-x grid gap-12 pb-20 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <CoverImage image={siteImages.about} sizes="(min-width: 1024px) 40vw, 100vw" className="aspect-[4/5]" priority />
        </div>
        <div className="lg:col-span-7 lg:pt-6">
          <h2 className="font-display text-headline">Who we are</h2>
          <div className="mt-6">
            {business.about ? (
              <Paragraphs text={business.about} />
            ) : (
              <ContentNeeded>
                Add a short, factual introduction in <code>business.about</code> (src/config/business.ts): what the
                business does, where it works, and how it started — in the owner’s own words. Nothing is invented here
                on the owner’s behalf.
              </ContentNeeded>
            )}
          </div>

          {business.activities.length > 0 ? (
            <div className="mt-12">
              <h3 className="eyebrow">What we do</h3>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {business.activities.map((a) => (
                  <li key={a} className="py-4 text-lg">
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            services.length > 0 && (
              <div className="mt-10">
                <TextLink href="/services">See the services we offer</TextLink>
              </div>
            )
          )}
          {business.activities.length === 0 && <ContentNeeded className="mt-6">
            List confirmed business activities in <code>business.activities</code> (e.g. “Resale of residential
            property”, “Development of residential projects”) only once the owner confirms them.
          </ContentNeeded>}

          {business.serviceAreas.length > 0 ? (
            <div className="mt-12">
              <h3 className="eyebrow">Areas we work in</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {business.serviceAreas.map((a) => (
                  <li key={a} className="rounded-full border border-line-strong px-4 py-2 text-sm">
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <ContentNeeded className="mt-6">
              Add the localities and cities served in <code>business.serviceAreas</code>. Location keywords are used
              for SEO only once these are confirmed.
            </ContentNeeded>
          )}
        </div>
      </section>

      {founder ? (
        <section aria-labelledby="founder-title" className="bg-paper-2 py-20 md:py-28">
          <div className="container-x grid gap-12 lg:grid-cols-12 lg:items-center">
            {founder.photo && (
              <div className="lg:col-span-4">
                <Image
                  src={founder.photo.src}
                  alt={founder.photo.alt}
                  width={founder.photo.width}
                  height={founder.photo.height}
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="w-full object-cover"
                />
              </div>
            )}
            <div className={founder.photo ? "lg:col-span-7 lg:col-start-6" : "lg:col-span-8"}>
              <p className="eyebrow">{founder.role}</p>
              <h2 id="founder-title" className="mt-4 font-display text-headline">
                {founder.name}
              </h2>
              <div className="mt-6">
                <Paragraphs text={founder.bio} />
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="container-x pb-12">
          <ContentNeeded>
            To introduce Manish, add <code>business.founder</code> with a bio and (optionally) a genuine photograph. No
            biography is shown until then.
          </ContentNeeded>
        </div>
      )}

      {business.credentials.length > 0 && (
        <section aria-labelledby="credentials-title" className="container-x py-20">
          <h2 id="credentials-title" className="font-display text-headline">
            Registrations
          </h2>
          <dl className="mt-8 grid gap-px bg-line ring-1 ring-line sm:grid-cols-2">
            {business.credentials.map((c) => (
              <div key={c.label} className="bg-card p-6">
                <dt className="text-sm text-muted">{c.label}</dt>
                <dd className="mt-1 text-lg font-medium">
                  {c.url ? (
                    <a href={c.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                      {c.value}
                    </a>
                  ) : (
                    c.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {strengths.length > 0 && (
        <section aria-labelledby="approach-title" className="container-x py-20 md:py-28">
          <h2 id="approach-title" className="max-w-2xl font-display text-headline">
            How we work
          </h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {strengths.map((s, i) => (
              <li key={s.title} className="border-t border-ink pt-6">
                <span className="text-sm text-muted tabular-nums">0{i + 1}</span>
                <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      <EnquiryBand title="Talk to us about your property plans" />
    </>
  );
}
