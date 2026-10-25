import type { Project } from "@/lib/types";
import { demoImage } from "./demo-images";

/**
 * PROJECTS
 * ────────
 * Add Manish Property's real developments here with `isDemo: false`.
 * Every record below is SAMPLE CONTENT (isDemo: true) used to preview the
 * design; it is hidden on the live site unless preview mode is switched on.
 * Delete the samples once real projects are added.
 *
 * Slugs must not be "completed", "ongoing" or "upcoming" (those are routes).
 */
export const projects: Project[] = [
  {
    id: "demo-prj-aster-court",
    slug: "aster-court",
    name: "Aster Court",
    tagline: "Mid-rise apartments around a shared green",
    summary:
      "A completed residential community of 2 and 3 bedroom apartments arranged around a landscaped central court.",
    description:
      "Aster Court is a sample completed project showing how finished developments are presented on this website. Four mid-rise blocks frame a planted central court, with apartments planned for cross-ventilation and generous balconies.\n\nReplace this record with a real completed project, including genuine photographs of the finished buildings.",
    location: { locality: "Riverside", city: "Sample City" },
    category: "residential",
    status: "completed",
    images: [
      demoImage("brick-apartments", "Four-storey brick apartment building with private balconies"),
      demoImage("apartment-balconies", "Close view of apartment balconies on a painted façade"),
      demoImage("living-room-bright", "Bright living room with large corner windows"),
    ],
    specifications: [
      { label: "Blocks", value: "4" },
      { label: "Floors", value: "Ground + 4" },
    ],
    totalUnits: 96,
    landArea: { value: 2.1, unit: "acre", label: "Site area" },
    unitTypes: [
      { name: "2 BHK", size: "1,050 – 1,120 sq ft" },
      { name: "3 BHK", size: "1,380 – 1,450 sq ft" },
    ],
    amenities: ["Central landscaped court", "Children's play area", "Covered parking", "Power backup for common areas"],
    completedOn: "2023-11",
    featured: true,
    isDemo: true,
  },
  {
    id: "demo-prj-linden-row",
    slug: "the-linden-row",
    name: "The Linden Row",
    tagline: "Pitched-roof family homes on a quiet street",
    summary:
      "A completed row of independent family houses with private gardens and individual parking.",
    description:
      "The Linden Row is a sample completed project of independent houses, each with its own garden and parking. It demonstrates how a low-rise, plotted development is presented.\n\nReplace this record with a real completed project.",
    location: { locality: "Orchard Lane", city: "Sample City" },
    category: "residential",
    status: "completed",
    images: [
      demoImage("suburban-houses", "Row of detached family houses with front lawns and driveways"),
      demoImage("brick-townhouse", "Brick family house with a pitched roof and chimney"),
      demoImage("gabled-house-dusk", "Gabled timber house lit up at dusk"),
    ],
    totalUnits: 24,
    unitTypes: [{ name: "4 BHK independent house", size: "2,400 sq ft built-up" }],
    amenities: ["Private gardens", "Gated street", "Two-car parking per home"],
    completedOn: "2022-06",
    isDemo: true,
  },
  {
    id: "demo-prj-meridian-heights",
    slug: "meridian-heights",
    name: "Meridian Heights",
    tagline: "Apartments with long views over the city",
    summary:
      "An ongoing residential development of 2, 3 and 4 bedroom apartments. Selected units are available now.",
    description:
      "Meridian Heights is a sample ongoing project demonstrating how construction progress, available units and site updates appear. A single residential tower with apartments planned around light, storage and long views.\n\nReplace this record with a real ongoing project. Only add a progress percentage when the business has measured and confirmed it.",
    location: { locality: "Northgate", city: "Sample City" },
    category: "residential",
    status: "ongoing",
    images: [
      demoImage("apartment-block-dark", "Dark-clad apartment tower with balconies against a blue sky"),
      demoImage("open-plan-living", "Open-plan living room with timber feature wall"),
      demoImage("construction-site", "Construction team standing on a concrete slab at a building site"),
    ],
    totalUnits: 140,
    unitTypes: [
      { name: "2 BHK", size: "1,080 sq ft", price: { kind: "starting-from", amount: 7800000 } },
      { name: "3 BHK", size: "1,420 sq ft", price: { kind: "starting-from", amount: 11800000 } },
      { name: "4 BHK", size: "2,050 sq ft", price: { kind: "on-request" } },
    ],
    amenities: ["Rooftop terrace", "Gymnasium", "Visitor parking", "Lifts with power backup"],
    price: { kind: "starting-from", amount: 7800000 },
    expectedTimeline: "Possession timeline to be confirmed by the developer",
    progress: { percent: 45, asOf: "2026-09-30", note: "Structure complete up to the 9th floor (sample figure)" },
    updates: [
      {
        date: "2026-09-30",
        title: "Superstructure progressing",
        note: "Sample update: slab casting continues on upper floors.",
        image: demoImage("construction-site", "Workers on the concrete deck of the building under construction"),
      },
      { date: "2026-05-15", title: "Foundation work completed", note: "Sample update." },
    ],
    featured: true,
    isDemo: true,
  },
  {
    id: "demo-prj-northgate-business-centre",
    slug: "northgate-business-centre",
    name: "Northgate Business Centre",
    tagline: "Office floors with flexible layouts",
    summary:
      "An ongoing commercial development with office floors available for sale and lease.",
    description:
      "Northgate Business Centre is a sample ongoing commercial project. It shows how a project is presented when no progress figure has been supplied: a simple status, without an invented percentage.\n\nReplace this record with a real commercial project.",
    location: { locality: "Station Quarter", city: "Sample City" },
    category: "commercial",
    status: "ongoing",
    images: [
      demoImage("glass-towers", "Glass office towers seen from street level"),
      demoImage("office-interior", "Empty office interior with polished floor and pantry"),
    ],
    unitTypes: [
      { name: "Office floor plate", size: "8,500 sq ft" },
      { name: "Office suite", size: "1,200 – 2,400 sq ft" },
    ],
    amenities: ["Basement parking", "High-speed lifts", "Central reception"],
    featured: true,
    isDemo: true,
  },
  {
    id: "demo-prj-orchard-lane-villas",
    slug: "orchard-lane-villas",
    name: "Orchard Lane Villas",
    tagline: "A planned enclave of contemporary villas",
    summary:
      "A planned villa development. Register your interest to hear when details are released.",
    description:
      "Orchard Lane Villas is a sample upcoming project. Upcoming projects are clearly separated from projects under construction and are not presented as available to purchase.\n\nReplace this record with a real planned project, and only add timelines the business has confirmed.",
    location: { locality: "Orchard Lane", city: "Sample City" },
    category: "residential",
    status: "upcoming",
    images: [
      demoImage("modern-villa-pool", "Contemporary two-storey villa with a pool and lawn"),
      demoImage("white-villa-cantilever", "White villa with cantilevered upper floor over a pool"),
    ],
    unitTypes: [{ name: "4 BHK villa" }, { name: "5 BHK villa" }],
    expectedTimeline: "Launch expected in 2027 (sample)",
    featured: true,
    isDemo: true,
  },
  {
    id: "demo-prj-riverside-plots",
    slug: "riverside-plots",
    name: "Riverside Plots",
    summary:
      "A proposed plotted development. Plot sizes and timelines will be shared once confirmed.",
    description:
      "Riverside Plots is a sample upcoming plotted development. It intentionally has no timeline, pricing or approvals listed — this is how a project with limited confirmed information is shown.",
    location: { locality: "Riverside", city: "Sample City" },
    category: "plots",
    status: "upcoming",
    images: [demoImage("open-field", "Open farmland at sunset")],
    isDemo: true,
  },
];
