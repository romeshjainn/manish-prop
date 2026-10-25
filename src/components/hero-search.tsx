"use client";

import Form from "next/form";
import { useState } from "react";
import { Search } from "lucide-react";
import { propertyTypeLabel } from "@/lib/labels";
import { BUDGETS, budgetLabel, type FilterOptions } from "@/lib/search";
import type { ListingType } from "@/lib/types";

/**
 * A plain GET form to /properties: it works without JavaScript, and the
 * results page reads the same URL parameters.
 */
export function HeroSearch({ options }: { options: FilterOptions }) {
  const [mode, setMode] = useState<ListingType>(options.modes[0] ?? "sale");
  const showModes = options.modes.length > 1;

  return (
    <Form
      action="/properties"
      role="search"
      aria-label="Search properties"
      className="grid gap-px bg-line ring-1 ring-line md:grid-cols-[auto_1fr_1fr_1fr_auto]"
    >
      {showModes ? (
        <fieldset className="flex items-center bg-card px-3 py-3 md:px-4">
          <legend className="sr-only">Looking to</legend>
          <div className="grid w-full grid-cols-2 gap-1 rounded-[2px] bg-paper-2 p-1">
            {options.modes.map((m) => (
              <label
                key={m}
                className="relative flex min-h-10 cursor-pointer items-center justify-center rounded-[2px] px-4 text-sm font-medium text-ink-2 has-[:checked]:bg-ink has-[:checked]:text-paper has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-forest"
              >
                <input
                  type="radio"
                  name="mode"
                  value={m}
                  checked={mode === m}
                  onChange={() => setMode(m)}
                  className="sr-only"
                />
                {m === "sale" ? "Buy" : "Rent"}
              </label>
            ))}
          </div>
        </fieldset>
      ) : (
        options.modes[0] && <input type="hidden" name="mode" value={options.modes[0]} />
      )}

      <label className="flex flex-col bg-card px-4 pt-3 pb-2">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Location</span>
        <select name="loc" defaultValue="" className="min-h-10 w-full cursor-pointer bg-transparent text-[0.9375rem] outline-none">
          <option value="">Any location</option>
          {options.localities.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col bg-card px-4 pt-3 pb-2">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Property type</span>
        <select name="type" defaultValue="" className="min-h-10 w-full cursor-pointer bg-transparent text-[0.9375rem] outline-none">
          <option value="">Any type</option>
          {options.types.map((t) => (
            <option key={t} value={t}>
              {propertyTypeLabel[t]}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col bg-card px-4 pt-3 pb-2">
        <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          {mode === "rent" ? "Max rent" : "Max budget"}
        </span>
        <select key={mode} name="max" defaultValue="" className="min-h-10 w-full cursor-pointer bg-transparent text-[0.9375rem] outline-none">
          <option value="">No limit</option>
          {BUDGETS[mode].map((b) => (
            <option key={b} value={b}>
              Up to {budgetLabel(b, mode)}
            </option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        className="inline-flex min-h-14 items-center justify-center gap-2 bg-forest px-8 font-medium text-paper transition-colors hover:bg-forest-deep"
      >
        <Search aria-hidden className="size-4" />
        Search
      </button>
    </Form>
  );
}
