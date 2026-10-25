import { areaInSqft, formatAmount } from "./format";
import type { ListingType, Property, PropertyType } from "./types";
import { PROPERTY_TYPES } from "./types";

/**
 * Property search — URL parameters
 *   q     free text          mode  sale | rent
 *   loc   locality           type  property type
 *   min   min price (INR)    max   max price (INR)
 *   amin  min area (sq ft)   amax  max area (sq ft)
 *   beds  minimum bedrooms   sort  newest | price-asc | price-desc | area-desc
 *   page  1-based page number
 */
export interface SearchFilters {
  q: string;
  mode?: ListingType;
  loc?: string;
  type?: PropertyType;
  min?: number;
  max?: number;
  amin?: number;
  amax?: number;
  beds?: number;
  sort: SortKey;
  page: number;
}

export const SORTS = {
  newest: "Newest first",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  "area-desc": "Largest area",
} as const;
export type SortKey = keyof typeof SORTS;

export const BUDGETS: Record<ListingType, number[]> = {
  sale: [25_00_000, 50_00_000, 75_00_000, 1_00_00_000, 1_50_00_000, 2_00_00_000, 3_00_00_000, 5_00_00_000],
  rent: [10_000, 20_000, 30_000, 50_000, 75_000, 1_00_000, 2_00_000],
};

export const AREAS = [500, 1000, 1500, 2000, 3000, 5000, 10000];
export const BEDS = [1, 2, 3, 4];

export function budgetLabel(amount: number, mode?: ListingType) {
  return `${formatAmount(amount)}${mode === "rent" ? " / mo" : ""}`;
}

type Params = { get(name: string): string | null };

const num = (v: string | null) => {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

export function parseFilters(params: Params): SearchFilters {
  const mode = params.get("mode");
  const type = params.get("type");
  const sort = params.get("sort");
  return {
    q: (params.get("q") ?? "").slice(0, 80),
    mode: mode === "sale" || mode === "rent" ? mode : undefined,
    loc: params.get("loc") || undefined,
    type: (PROPERTY_TYPES as readonly string[]).includes(type ?? "") ? (type as PropertyType) : undefined,
    min: num(params.get("min")),
    max: num(params.get("max")),
    amin: num(params.get("amin")),
    amax: num(params.get("amax")),
    beds: num(params.get("beds")),
    sort: sort && sort in SORTS ? (sort as SortKey) : "newest",
    page: Math.max(1, Math.floor(num(params.get("page")) ?? 1)),
  };
}

const priceOf = (p: Property) => (p.price.kind === "on-request" ? undefined : p.price.amount);

export function applyFilters(list: Property[], f: SearchFilters): Property[] {
  const q = f.q.trim().toLowerCase();
  const result = list.filter((p) => {
    if (f.mode && p.listingType !== f.mode) return false;
    if (f.loc && p.location.locality !== f.loc) return false;
    if (f.type && p.type !== f.type) return false;
    if (f.min !== undefined || f.max !== undefined) {
      const price = priceOf(p);
      // Listings without a published price cannot satisfy a budget filter.
      if (price === undefined) return false;
      if (f.min !== undefined && price < f.min) return false;
      if (f.max !== undefined && price > f.max) return false;
    }
    if (f.amin !== undefined || f.amax !== undefined) {
      if (!p.area) return false;
      const sqft = areaInSqft(p.area);
      if (f.amin !== undefined && sqft < f.amin) return false;
      if (f.amax !== undefined && sqft > f.amax) return false;
    }
    if (f.beds !== undefined && (p.bedrooms ?? 0) < f.beds) return false;
    if (q) {
      const haystack = [p.title, p.summary, p.location.locality, p.location.city, p.type, ...p.features]
        .join(" ")
        .toLowerCase();
      if (!q.split(/\s+/).every((word) => haystack.includes(word))) return false;
    }
    return true;
  });

  const missingLast = (v: number | undefined, dir: 1 | -1) => (v === undefined ? Infinity : v * dir);
  switch (f.sort) {
    case "price-asc":
      return result.sort((a, b) => missingLast(priceOf(a), 1) - missingLast(priceOf(b), 1));
    case "price-desc":
      return result.sort((a, b) => missingLast(priceOf(a), -1) - missingLast(priceOf(b), -1));
    case "area-desc":
      return result.sort((a, b) => (b.area ? areaInSqft(b.area) : 0) - (a.area ? areaInSqft(a.area) : 0));
    default:
      return result.sort((a, b) => b.listedOn.localeCompare(a.listedOn));
  }
}

/** Options derived from actual inventory — no filter appears without matching data. */
export interface FilterOptions {
  modes: ListingType[];
  localities: string[];
  types: PropertyType[];
  hasBedrooms: boolean;
  hasArea: boolean;
}

export function deriveOptions(list: Property[]): FilterOptions {
  return {
    modes: (["sale", "rent"] as const).filter((m) => list.some((p) => p.listingType === m)),
    localities: [...new Set(list.map((p) => p.location.locality))].sort(),
    types: PROPERTY_TYPES.filter((t) => list.some((p) => p.type === t)),
    hasBedrooms: list.some((p) => p.bedrooms !== undefined),
    hasArea: list.some((p) => p.area !== undefined),
  };
}
