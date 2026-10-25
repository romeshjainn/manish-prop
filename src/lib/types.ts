/**
 * Content model for Manish Property.
 *
 * Every optional field is optional on purpose: only fill a field when the
 * value has been confirmed by the business. Components hide anything that is
 * missing rather than showing a placeholder.
 */

export type ImageKind =
  /** A genuine photograph of this property / project. */
  | "photo"
  /** An architectural rendering supplied by the developer. */
  | "render"
  /** A plan, layout or drawing. */
  | "plan"
  /** Stock photography used only to preview the design. Never genuine. */
  | "illustrative";

export interface MediaImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  kind: ImageKind;
  caption?: string;
}

export interface Location {
  /** Neighbourhood, sector or street-level name. */
  locality: string;
  city: string;
  state?: string;
  /** Full postal address, only if the owner wants it published. */
  address?: string;
  /**
   * Coordinates are shown on a map ONLY when `verified` is true.
   * Do not enter approximate guesses.
   */
  coordinates?: { lat: number; lng: number; verified: boolean };
}

export type AreaUnit = "sqft" | "sqm" | "sqyd" | "acre";

export interface Area {
  value: number;
  unit: AreaUnit;
  /** e.g. "Carpet area", "Super built-up area", "Plot area". */
  label?: string;
}

export type Price =
  | { kind: "fixed"; amount: number }
  | { kind: "starting-from"; amount: number }
  | { kind: "on-request" };

export interface DocumentLink {
  label: string;
  /** Path under /public (e.g. "/documents/brochure.pdf") or an absolute URL. */
  href: string;
  type: "brochure" | "floor-plan" | "site-plan" | "price-list" | "other";
  /** Approximate size shown to visitors, e.g. "2.4 MB". */
  size?: string;
}

/* ------------------------------------------------------------------ */
/* Properties — individual listings                                    */
/* ------------------------------------------------------------------ */

export const PROPERTY_TYPES = [
  "apartment",
  "independent-house",
  "villa",
  "builder-floor",
  "plot",
  "office",
  "shop",
  "warehouse",
] as const;
export type PropertyType = (typeof PROPERTY_TYPES)[number];

export type ListingType = "sale" | "rent";

export type AvailabilityStatus =
  | "available"
  | "under-offer"
  | "sold"
  | "rented"
  | "withdrawn";

export interface Property {
  id: string;
  /** URL segment, lowercase-with-hyphens. Must be unique. */
  slug: string;
  title: string;
  summary: string;
  /** Plain text. Separate paragraphs with a blank line. */
  description: string;
  location: Location;
  type: PropertyType;
  listingType: ListingType;
  price: Price;
  area?: Area;
  bedrooms?: number;
  bathrooms?: number;
  /** Short facts such as "East facing", "2 covered parking". */
  features: string[];
  amenities: string[];
  images: MediaImage[];
  documents?: DocumentLink[];
  status: AvailabilityStatus;
  /** Featured on the homepage (only shown while available). */
  featured?: boolean;
  /** Slug of the project this unit belongs to, if any. */
  projectSlug?: string;
  furnishing?: "unfurnished" | "semi-furnished" | "furnished";
  /** ISO date string; used for "Newest" sorting. */
  listedOn: string;
  /**
   * TRUE for sample records used to preview the design. Demo records are
   * hidden unless preview mode is switched on (see src/config/site.ts).
   */
  isDemo: boolean;
}

/* ------------------------------------------------------------------ */
/* Projects — developments containing multiple units or phases         */
/* ------------------------------------------------------------------ */

export type ProjectStatus = "completed" | "ongoing" | "upcoming";

export const PROJECT_CATEGORIES = [
  "residential",
  "commercial",
  "mixed-use",
  "plots",
] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export interface UnitType {
  name: string;
  /** e.g. "1,150 – 1,320 sq ft" — free text so ranges are possible. */
  size?: string;
  price?: Price;
  /** Free text such as "Few units left" — only when confirmed. */
  availabilityNote?: string;
}

export interface ProjectUpdate {
  /** ISO date string. */
  date: string;
  title: string;
  note?: string;
  image?: MediaImage;
}

export interface Project {
  id: string;
  slug: string;
  name: string;
  tagline?: string;
  summary: string;
  /** Plain text. Separate paragraphs with a blank line. */
  description: string;
  location: Location;
  category: ProjectCategory;
  status: ProjectStatus;
  images: MediaImage[];
  /** Key/value facts, e.g. { label: "Towers", value: "3" }. Verified only. */
  specifications?: { label: string; value: string }[];
  totalUnits?: number;
  landArea?: Area;
  unitTypes?: UnitType[];
  amenities?: string[];
  price?: Price;
  developer?: string;
  /**
   * Regulatory registration (e.g. RERA). Only enter a number the business
   * has supplied and that can be verified on the regulator's website.
   */
  registration?: { authority: string; number: string; url?: string };
  /** Completed projects: the confirmed completion / handover date (YYYY-MM). */
  completedOn?: string;
  /** Ongoing / upcoming projects: a timeline the business has committed to, as free text. */
  expectedTimeline?: string;
  /**
   * Construction progress. Only enter a figure the business has confirmed,
   * with the date it was measured.
   */
  progress?: { percent: number; asOf: string; note?: string };
  updates?: ProjectUpdate[];
  documents?: DocumentLink[];
  featured?: boolean;
  isDemo: boolean;
}

/* ------------------------------------------------------------------ */
/* Business-level content                                              */
/* ------------------------------------------------------------------ */

export type ServiceIcon =
  | "key"
  | "home"
  | "building"
  | "map"
  | "trending"
  | "handshake"
  | "tag";

export interface Service {
  id: string;
  title: string;
  description: string;
  /** Who the service is for. */
  audience: string;
  icon: ServiceIcon;
  /** Pre-selects the enquiry type on the contact form. */
  enquiryType: EnquiryType;
  /**
   * Set to true only once the owner confirms Manish Property offers this.
   * Unconfirmed services appear in preview mode only.
   */
  confirmed: boolean;
}

export interface Strength {
  title: string;
  body: string;
  confirmed: boolean;
}

export const ENQUIRY_TYPES = [
  "buy",
  "rent",
  "sell",
  "let",
  "project",
  "property",
  "other",
] as const;
export type EnquiryType = (typeof ENQUIRY_TYPES)[number];
