/**
 * Content access layer.
 *
 * Every page reads properties, projects and services through these async
 * functions — never by importing the data files directly. To move to a CMS or
 * database later, re-implement these functions; pages and components stay
 * unchanged.
 */
import { previewMode } from "@/config/site";
import { projects as allProjects } from "@/content/projects";
import { properties as allProperties } from "@/content/properties";
import { services as allServices, strengths as allStrengths } from "@/content/services";
import type { Project, ProjectStatus, Property } from "./types";

const visible = <T extends { isDemo: boolean }>(items: T[]) =>
  previewMode ? items : items.filter((i) => !i.isDemo);

/** Listings that may be shown in search results: available or under offer. */
export function isListed(p: Property) {
  return p.status === "available" || p.status === "under-offer";
}

const byNewest = (a: Property, b: Property) => b.listedOn.localeCompare(a.listedOn);

/** All publishable properties, including sold/rented (for detail pages). */
export async function getAllProperties(): Promise<Property[]> {
  return visible(allProperties);
}

/** Properties currently on the market. */
export async function getListedProperties(): Promise<Property[]> {
  return visible(allProperties).filter(isListed).sort(byNewest);
}

export async function getFeaturedProperties(limit = 6): Promise<Property[]> {
  const listed = visible(allProperties).filter((p) => p.status === "available").sort(byNewest);
  const featured = listed.filter((p) => p.featured);
  return (featured.length ? featured : listed).slice(0, limit);
}

export async function getPropertyBySlug(slug: string): Promise<Property | undefined> {
  return visible(allProperties).find((p) => p.slug === slug);
}

export async function getSimilarProperties(property: Property, limit = 3): Promise<Property[]> {
  const listed = (await getListedProperties()).filter((p) => p.id !== property.id);
  const score = (p: Property) =>
    (p.listingType === property.listingType ? 4 : 0) +
    (p.type === property.type ? 2 : 0) +
    (p.location.locality === property.location.locality ? 1 : 0);
  return listed
    .map((p) => ({ p, s: score(p) }))
    .filter(({ s }) => s >= 4)
    .sort((a, b) => b.s - a.s)
    .slice(0, limit)
    .map(({ p }) => p);
}

export async function getPropertiesForProject(slug: string): Promise<Property[]> {
  return (await getListedProperties()).filter((p) => p.projectSlug === slug);
}

const statusOrder: Record<ProjectStatus, number> = { ongoing: 0, upcoming: 1, completed: 2 };

export async function getProjects(status?: ProjectStatus): Promise<Project[]> {
  return visible(allProjects)
    .filter((p) => !status || p.status === status)
    .sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  const list = await getProjects();
  const featured = list.filter((p) => p.featured);
  return (featured.length ? featured : list).slice(0, limit);
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  return visible(allProjects).find((p) => p.slug === slug);
}

export async function getProjectCounts(): Promise<Record<ProjectStatus, number>> {
  const list = await getProjects();
  return {
    completed: list.filter((p) => p.status === "completed").length,
    ongoing: list.filter((p) => p.status === "ongoing").length,
    upcoming: list.filter((p) => p.status === "upcoming").length,
  };
}

export async function getServices() {
  return allServices.filter((s) => s.confirmed || previewMode);
}

export async function getStrengths() {
  return allStrengths.filter((s) => s.confirmed || previewMode);
}
