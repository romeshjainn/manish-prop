import type { Metadata } from "next";
import { business } from "@/config/business";
import { ProjectStatusPage } from "@/components/project-status-page";

export const metadata: Metadata = {
  title: "Ongoing projects",
  description: `Real-estate projects by ${business.name} currently under construction, with confirmed progress updates.`,
  alternates: { canonical: "/projects/ongoing" },
};

export default function OngoingProjectsPage() {
  return <ProjectStatusPage status="ongoing" />;
}
