import { business } from "@/config/business";
import type { Area, AreaUnit, ListingType, Price } from "./types";

const fullFormatter = new Intl.NumberFormat(business.locale, {
  style: "currency",
  currency: business.currency,
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat(business.locale, { maximumFractionDigits: 2 });

function trim(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

/** ₹3.85 Cr, ₹68 L, ₹22,000 — the way Indian buyers read prices. */
export function formatAmount(amount: number): string {
  if (business.currency !== "INR") return fullFormatter.format(amount);
  if (amount >= 1_00_00_000) return `₹${trim(amount / 1_00_00_000)} Cr`;
  if (amount >= 1_00_000) return `₹${trim(amount / 1_00_000)} L`;
  return fullFormatter.format(amount);
}

/** Exact amount with Indian digit grouping, e.g. ₹3,85,00,000. */
export function formatAmountFull(amount: number): string {
  return fullFormatter.format(amount);
}

export function formatPrice(price: Price, listingType?: ListingType): string {
  if (price.kind === "on-request") return "Price on request";
  const base = formatAmount(price.amount);
  const prefix = price.kind === "starting-from" ? "From " : "";
  const suffix = listingType === "rent" ? " / month" : "";
  return `${prefix}${base}${suffix}`;
}

const unitLabel: Record<AreaUnit, string> = {
  sqft: "sq ft",
  sqm: "sq m",
  sqyd: "sq yd",
  acre: "acres",
};

export function formatArea(area: Area): string {
  return `${numberFormatter.format(area.value)} ${unitLabel[area.unit]}`;
}

const toSqft: Record<AreaUnit, number> = { sqft: 1, sqm: 10.7639, sqyd: 9, acre: 43560 };

export function areaInSqft(area: Area): number {
  return area.value * toSqft[area.unit];
}

export function formatNumber(n: number): string {
  return numberFormatter.format(n);
}

/** "2023-11" or "2023-11-04" → "November 2023" / "4 November 2023". */
export function formatDate(iso: string): string {
  const parts = iso.split("-").map(Number);
  const date = new Date(Date.UTC(parts[0], (parts[1] ?? 1) - 1, parts[2] ?? 1));
  return new Intl.DateTimeFormat(business.locale, {
    day: parts[2] ? "numeric" : undefined,
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
