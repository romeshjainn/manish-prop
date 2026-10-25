import type { Metadata } from "next";
import { Suspense } from "react";
import { business } from "@/config/business";
import { EnquiryBand } from "@/components/enquiry-band";
import { ProjectDirectory, ProjectGrid } from "@/components/project-directory";
import { ProjectStatusTabs } from "@/components/project-status-tabs";
import { Breadcrumbs } from "@/components/seo";
import { ContentNeeded, PageHeader } from "@/components/ui";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: `Completed, ongoing and upcoming real-estate projects by ${business.name}.`,
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <>
      <PageHeader
        eyebrow="Developments"
        title="Projects"
        intro="Developments grouped by stage: completed and photographed as built, under construction with confirmed updates, and planned for the future."
      >
        <Breadcrumbs items={[{ label: "Projects", href: "/projects" }]} />
      </PageHeader>
      <ProjectStatusTabs current="all" />
      <div className="container-x py-12 pb-24 md:py-16 md:pb-32">
        {projects.length ? (
          <Suspense fallback={<ProjectGrid projects={projects} />}>
            <ProjectDirectory projects={projects} />
          </Suspense>
        ) : (
          <>
            <p className="text-lg text-muted">Project information will be published here soon.</p>
            <ContentNeeded className="mt-6">Add projects in src/content/projects.ts.</ContentNeeded>
          </>
        )}
      </div>
      <EnquiryBand
        title="Interested in a project?"
        body="Ask about availability, configurations and pricing — we’ll share what is confirmed and tell you plainly what isn’t yet."
        href="/contact?type=project"
      />
    </>
  );
}
