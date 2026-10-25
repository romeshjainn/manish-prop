import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";
import { getAllProperties, getProjects, isListed } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [properties, projects] = await Promise.all([getAllProperties(), getProjects()]);
  const staticRoutes = [
    "",
    "/properties",
    "/projects",
    "/projects/completed",
    "/projects/ongoing",
    "/projects/upcoming",
    "/services",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
  ];
  return [
    ...staticRoutes.map((path) => ({ url: `${siteUrl}${path}` })),
    ...properties
      .filter(isListed)
      .map((p) => ({ url: `${siteUrl}/properties/${p.slug}`, lastModified: p.listedOn })),
    ...projects.map((p) => ({ url: `${siteUrl}/projects/${p.slug}` })),
  ];
}
