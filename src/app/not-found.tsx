import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="container-x py-24 md:py-36">
      <p className="eyebrow">Page not found</p>
      <h1 className="mt-5 max-w-3xl font-display text-display text-balance">
        This page has <em className="italic">moved on.</em>
      </h1>
      <p className="mt-6 max-w-lg text-lg text-muted">
        The listing or page you were looking for is not available. It may have been sold, rented or renamed.
      </p>
      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/properties">Browse properties</ButtonLink>
        <ButtonLink href="/projects" variant="outline">
          View projects
        </ButtonLink>
      </div>
    </div>
  );
}
