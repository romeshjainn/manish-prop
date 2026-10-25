import type { Metadata } from "next";
import { business } from "@/config/business";
import { ProjectStatusPage } from "@/components/project-status-page";

export const metadata: Metadata = {
  title: "Upcoming projects",
  description: `Planned real-estate developments by ${business.name}. Register your interest to hear when details are confirmed.`,
  alternates: { canonical: "/projects/upcoming" },
};

export default function UpcomingProjectsPage() {
  return <ProjectStatusPage status="upcoming" />;
}
