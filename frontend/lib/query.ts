import type { SortOption } from "@/types";

const SORT_OPTIONS: readonly SortOption[] = ["popular", "newest", "expiring", "title"];

/** Narrows an untrusted query value to a supported sort option. */
export function parseSort(value: string | undefined): SortOption | undefined {
  return SORT_OPTIONS.includes(value as SortOption) ? (value as SortOption) : undefined;
}

/** Reads the first value of a possibly-repeated search param. */
export function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/** Parses a 1-based page number from an untrusted query value. */
export function parsePage(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

/** Builds a path with a query string, dropping empty/undefined values. */
export function withQuery(
  path: string,
  params: Record<string, string | number | undefined | null>,
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `${path}?${query}` : path;
}
