"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useId, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from "lucide-react";
import { formatNumber } from "@/lib/format";
import { propertyTypeLabel } from "@/lib/labels";
import {
  AREAS,
  BEDS,
  BUDGETS,
  SORTS,
  applyFilters,
  budgetLabel,
  parseFilters,
  type FilterOptions,
  type SearchFilters,
} from "@/lib/search";
import type { ListingType, Property } from "@/lib/types";
import { PropertyCard } from "./property-card";

type Patch = Partial<Record<keyof SearchFilters, string | number | undefined>>;

const FILTER_KEYS = ["mode", "loc", "type", "min", "max", "amin", "amax", "beds"] as const;

export function PropertyExplorer({
  properties,
  options,
  perPage,
}: {
  properties: Property[];
  options: FilterOptions;
  perPage: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = parseFilters(searchParams);
  const drawerRef = useRef<HTMLDialogElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // When only one listing type exists, budget filters use it implicitly.
  const effectiveMode: ListingType | undefined = filters.mode ?? (options.modes.length === 1 ? options.modes[0] : undefined);

  const results = applyFilters(properties, filters);
  const pageCount = Math.max(1, Math.ceil(results.length / perPage));
  const page = Math.min(filters.page, pageCount);
  const visible = results.slice((page - 1) * perPage, page * perPage);

  // Keep the search box in sync with the URL (e.g. browser back) without an effect.
  const [q, setQ] = useState(filters.q);
  const [urlQ, setUrlQ] = useState(filters.q);
  if (filters.q !== urlQ) {
    setUrlQ(filters.q);
    setQ(filters.q);
  }

  function hrefWith(patch: Patch, keepPage = false) {
    const next = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (value === undefined || value === "" || (key === "sort" && value === "newest")) next.delete(key);
      else next.set(key, String(value));
    }
    if (!keepPage) next.delete("page");
    const qs = next.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  function update(patch: Patch, { replace = false } = {}) {
    const href = hrefWith(patch);
    if (replace) router.replace(href, { scroll: false });
    else router.push(href, { scroll: false });
  }

  function onSearchInput(value: string) {
    setQ(value);
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => update({ q: value.trim() || undefined }, { replace: true }), 300);
  }

  const activeChips: { key: keyof SearchFilters; label: string; clear: Patch }[] = [];
  if (filters.mode) activeChips.push({ key: "mode", label: filters.mode === "sale" ? "Buy" : "Rent", clear: { mode: undefined, min: undefined, max: undefined } });
  if (filters.loc) activeChips.push({ key: "loc", label: filters.loc, clear: { loc: undefined } });
  if (filters.type) activeChips.push({ key: "type", label: propertyTypeLabel[filters.type], clear: { type: undefined } });
  if (filters.min !== undefined) activeChips.push({ key: "min", label: `Min ${budgetLabel(filters.min, effectiveMode)}`, clear: { min: undefined } });
  if (filters.max !== undefined) activeChips.push({ key: "max", label: `Max ${budgetLabel(filters.max, effectiveMode)}`, clear: { max: undefined } });
  if (filters.amin !== undefined) activeChips.push({ key: "amin", label: `From ${formatNumber(filters.amin)} sq ft`, clear: { amin: undefined } });
  if (filters.amax !== undefined) activeChips.push({ key: "amax", label: `Up to ${formatNumber(filters.amax)} sq ft`, clear: { amax: undefined } });
  if (filters.beds !== undefined) activeChips.push({ key: "beds", label: `${filters.beds}+ bedrooms`, clear: { beds: undefined } });
  if (filters.q) activeChips.push({ key: "q", label: `“${filters.q}”`, clear: { q: undefined } });

  const clearAll = Object.fromEntries([...FILTER_KEYS, "q"].map((k) => [k, undefined])) as Patch;

  const panel = (
    <FilterFields filters={filters} options={options} effectiveMode={effectiveMode} onChange={update} />
  );

  return (
    <div className="container-x grid gap-10 pb-24 lg:grid-cols-[17rem_1fr] xl:grid-cols-[19rem_1fr] xl:gap-14">
      {/* Desktop sidebar */}
      <aside aria-labelledby="filters-heading" className="hidden lg:block">
        <div className="sticky top-24">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <h2 id="filters-heading" className="text-sm font-semibold uppercase tracking-[0.14em]">
              Filters
            </h2>
            {activeChips.length > 0 && (
              <button type="button" onClick={() => update(clearAll)} className="min-h-10 text-sm text-muted underline underline-offset-4 hover:text-ink">
                Clear all
              </button>
            )}
          </div>
          <div className="pt-6">{panel}</div>
        </div>
      </aside>

      <div ref={resultsRef} className="min-w-0 scroll-mt-28">
        {/* Search + toolbar */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search properties</span>
            <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              value={q}
              onChange={(e) => onSearchInput(e.target.value)}
              placeholder="Search by name, locality or feature"
              className="field pl-11"
              maxLength={80}
            />
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => drawerRef.current?.showModal()}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-[2px] border border-line-strong bg-card px-4 font-medium lg:hidden"
              aria-haspopup="dialog"
            >
              <SlidersHorizontal aria-hidden className="size-4" />
              Filters
              {activeChips.filter((c) => c.key !== "q").length > 0 && (
                <span className="inline-flex size-6 items-center justify-center rounded-full bg-forest text-xs text-paper">
                  {activeChips.filter((c) => c.key !== "q").length}
                </span>
              )}
            </button>
            <label className="flex-1 sm:w-56 sm:flex-none">
              <span className="sr-only">Sort by</span>
              <select value={filters.sort} onChange={(e) => update({ sort: e.target.value })} className="field cursor-pointer">
                {Object.entries(SORTS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2 border-b border-line pb-5">
          <p aria-live="polite" className="mr-3 text-sm text-ink-2">
            <strong className="font-semibold">{results.length}</strong> {results.length === 1 ? "property" : "properties"}
            {pageCount > 1 && (
              <span className="text-muted">
                {" "}
                · page {page} of {pageCount}
              </span>
            )}
          </p>
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => update(chip.clear)}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line-strong bg-card py-1 pr-2.5 pl-3.5 text-sm hover:border-ink"
            >
              {chip.label}
              <X aria-hidden className="size-3.5" />
              <span className="sr-only">— remove filter</span>
            </button>
          ))}
        </div>

        {visible.length > 0 ? (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3 lg:gap-7">
            {visible.map((p, i) => (
              <li key={p.id}>
                <PropertyCard property={p} priority={i < 2} headingLevel="h2" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-8 border border-dashed border-line-strong px-6 py-16 text-center">
            <h2 className="font-display text-3xl">No properties match these filters</h2>
            <p className="mx-auto mt-3 max-w-md text-muted">
              Try removing a filter or widening your budget. If you cannot find what you need, tell us — we can let you know
              when something suitable comes up.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => update(clearAll)}
                className="inline-flex min-h-12 items-center justify-center rounded-[2px] border border-ink/80 px-6 font-medium hover:bg-ink hover:text-paper"
              >
                Clear all filters
              </button>
              <Link
                href="/contact?type=buy"
                className="inline-flex min-h-12 items-center justify-center rounded-[2px] bg-forest px-6 font-medium text-paper hover:bg-forest-deep"
              >
                Share your requirement
              </Link>
            </div>
          </div>
        )}

        {pageCount > 1 && (
          <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-1">
            <PageLink href={hrefWith({ page: page - 1 }, true)} disabled={page <= 1} label="Previous page">
              <ChevronLeft aria-hidden className="size-4" />
            </PageLink>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={hrefWith({ page: n === 1 ? undefined : n }, true)}
                aria-current={n === page ? "page" : undefined}
                onClick={() => resultsRef.current?.scrollIntoView({ behavior: "smooth" })}
                scroll={false}
                className={`inline-flex size-11 items-center justify-center rounded-[2px] text-sm tabular-nums ${
                  n === page ? "bg-ink text-paper" : "hover:bg-paper-2"
                }`}
              >
                <span className="sr-only">Page </span>
                {n}
              </Link>
            ))}
            <PageLink href={hrefWith({ page: page + 1 }, true)} disabled={page >= pageCount} label="Next page">
              <ChevronRight aria-hidden className="size-4" />
            </PageLink>
          </nav>
        )}
      </div>

      {/* Mobile filter drawer */}
      <dialog
        ref={drawerRef}
        aria-labelledby="drawer-title"
        className="m-0 mt-auto max-h-[88dvh] w-full max-w-none rounded-t-lg bg-paper p-0 text-ink open:flex open:flex-col sm:mx-auto sm:max-w-lg lg:hidden"
        onClick={(e) => {
          if (e.target === drawerRef.current) drawerRef.current?.close();
        }}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <h2 id="drawer-title" className="text-sm font-semibold uppercase tracking-[0.14em]">
            Filters
          </h2>
          <button
            type="button"
            onClick={() => drawerRef.current?.close()}
            className="inline-flex size-11 items-center justify-center rounded-[2px] hover:bg-paper-2"
          >
            <X aria-hidden className="size-5" />
            <span className="sr-only">Close filters</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-6">{panel}</div>
        <div className="grid grid-cols-2 gap-3 border-t border-line p-4">
          <button
            type="button"
            onClick={() => update(clearAll)}
            className="inline-flex min-h-12 items-center justify-center rounded-[2px] border border-ink/80 font-medium"
          >
            Clear all
          </button>
          <button
            type="button"
            onClick={() => drawerRef.current?.close()}
            className="inline-flex min-h-12 items-center justify-center rounded-[2px] bg-forest font-medium text-paper"
          >
            Show {results.length} {results.length === 1 ? "result" : "results"}
          </button>
        </div>
      </dialog>
    </div>
  );
}

function PageLink({ href, disabled, label, children }: { href: string; disabled: boolean; label: string; children: React.ReactNode }) {
  if (disabled) {
    return (
      <span aria-hidden className="inline-flex size-11 items-center justify-center text-line-strong">
        {children}
      </span>
    );
  }
  return (
    <Link href={href} scroll={false} aria-label={label} className="inline-flex size-11 items-center justify-center rounded-[2px] hover:bg-paper-2">
      {children}
    </Link>
  );
}

function Group({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-b border-line pb-6">
      <legend className="mb-3 text-sm font-semibold">{legend}</legend>
      {children}
    </fieldset>
  );
}

function Segmented<T extends string | number>({
  name,
  value,
  items,
  onChange,
}: {
  name: string;
  value: T | undefined;
  items: { value: T | undefined; label: string }[];
  onChange: (v: T | undefined) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <label
          key={item.label}
          className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-[2px] border border-line-strong bg-card px-3.5 text-sm has-[:checked]:border-ink has-[:checked]:bg-ink has-[:checked]:text-paper has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-forest"
        >
          <input
            type="radio"
            name={name}
            checked={value === item.value}
            onChange={() => onChange(item.value)}
            className="sr-only"
          />
          {item.label}
        </label>
      ))}
    </div>
  );
}

function FilterFields({
  filters,
  options,
  effectiveMode,
  onChange,
}: {
  filters: SearchFilters;
  options: FilterOptions;
  effectiveMode: ListingType | undefined;
  onChange: (patch: Patch) => void;
}) {
  // Unique per instance: the panel renders in both the sidebar and the drawer.
  const uid = useId();
  const budgets = effectiveMode ? BUDGETS[effectiveMode] : [];

  return (
    <div className="grid gap-6">
      {options.modes.length > 1 && (
        <Group legend="Looking to">
          <Segmented<ListingType>
            name={`${uid}-mode`}
            value={filters.mode}
            items={[
              { value: undefined, label: "Any" },
              { value: "sale", label: "Buy" },
              { value: "rent", label: "Rent" },
            ]}
            onChange={(v) => onChange({ mode: v, min: undefined, max: undefined })}
          />
        </Group>
      )}

      {options.localities.length > 1 && (
        <label className="grid gap-2 border-b border-line pb-6">
          <span className="text-sm font-semibold">Location</span>
          <select value={filters.loc ?? ""} onChange={(e) => onChange({ loc: e.target.value })} className="field cursor-pointer">
            <option value="">Any location</option>
            {options.localities.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </label>
      )}

      {options.types.length > 1 && (
        <label className="grid gap-2 border-b border-line pb-6">
          <span className="text-sm font-semibold">Property type</span>
          <select value={filters.type ?? ""} onChange={(e) => onChange({ type: e.target.value })} className="field cursor-pointer">
            <option value="">Any type</option>
            {options.types.map((t) => (
              <option key={t} value={t}>
                {propertyTypeLabel[t]}
              </option>
            ))}
          </select>
        </label>
      )}

      <Group legend={effectiveMode === "rent" ? "Monthly rent" : "Budget"}>
        {effectiveMode ? (
          <div className="grid grid-cols-2 gap-2">
            <label>
              <span className="sr-only">Minimum</span>
              <select value={filters.min ?? ""} onChange={(e) => onChange({ min: e.target.value })} className="field cursor-pointer text-sm">
                <option value="">No min</option>
                {budgets.map((b) => (
                  <option key={b} value={b}>
                    {budgetLabel(b, effectiveMode)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="sr-only">Maximum</span>
              <select value={filters.max ?? ""} onChange={(e) => onChange({ max: e.target.value })} className="field cursor-pointer text-sm">
                <option value="">No max</option>
                {budgets.map((b) => (
                  <option key={b} value={b}>
                    {budgetLabel(b, effectiveMode)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ) : (
          <p className="text-sm text-muted">Choose Buy or Rent to set a budget.</p>
        )}
      </Group>

      {options.hasBedrooms && (
        <Group legend="Bedrooms">
          <Segmented<number>
            name={`${uid}-beds`}
            value={filters.beds}
            items={[{ value: undefined, label: "Any" }, ...BEDS.map((b) => ({ value: b, label: `${b}+` }))]}
            onChange={(v) => onChange({ beds: v })}
          />
        </Group>
      )}

      {options.hasArea && (
        <Group legend="Area (sq ft)">
          <div className="grid grid-cols-2 gap-2">
            <label>
              <span className="sr-only">Minimum area</span>
              <select value={filters.amin ?? ""} onChange={(e) => onChange({ amin: e.target.value })} className="field cursor-pointer text-sm">
                <option value="">No min</option>
                {AREAS.map((a) => (
                  <option key={a} value={a}>
                    {formatNumber(a)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className="sr-only">Maximum area</span>
              <select value={filters.amax ?? ""} onChange={(e) => onChange({ amax: e.target.value })} className="field cursor-pointer text-sm">
                <option value="">No max</option>
                {AREAS.map((a) => (
                  <option key={a} value={a}>
                    {formatNumber(a)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </Group>
      )}
    </div>
  );
}
