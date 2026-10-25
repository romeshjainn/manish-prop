import type { Metadata } from "next";
import { business } from "@/config/business";
import { ProjectStatusPage } from "@/components/project-status-page";

export const metadata: Metadata = {
  title: "Completed projects",
  description: `Completed real-estate developments by ${business.name}, shown as built.`,
  alternates: { canonical: "/projects/completed" },
};

export default function CompletedProjectsPage() {
  return <ProjectStatusPage status="completed" />;
}
