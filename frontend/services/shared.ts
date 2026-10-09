import type { Locale, Paginated } from "@/types";

/** Shared service-layer helpers — validation/clamping happens at this boundary. */

export function normalizePage(page?: number): number {
  const parsed = Number(page);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.floor(parsed);
}

export function normalizePerPage(perPage: number | undefined, fallback: number, max = 100): number {
  const parsed = Number(perPage);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.min(Math.floor(parsed), max);
}

export function paginate<T>(items: T[], page: number, perPage: number): Paginated<T> {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * perPage;
  return {
    items: items.slice(start, start + perPage),
    page: safePage,
    perPage,
    total,
    totalPages,
  };
}

export function matchesQuery(haystack: string, q?: string): boolean {
  if (!q) return true;
  return haystack.toLowerCase().includes(q.trim().toLowerCase());
}

/** An entity is active when it has no expiry date or the date is still in the future. */
export function isActive(expiresAt?: string): boolean {
  if (!expiresAt) return true;
  return new Date(expiresAt).getTime() >= Date.now();
}

/**
 * Current year for the footer — cached so the clock is read once per cache
 * entry instead of during static prerender.
 */
export async function getCurrentYear(): Promise<number> {
  "use cache";
  return new Date().getFullYear();
}

export function byPopularityDesc(a: { popularity?: number }, b: { popularity?: number }): number {
  return (b.popularity ?? 0) - (a.popularity ?? 0);
}

export function byNewestDesc(a: { createdAt: string }, b: { createdAt: string }): number {
  return b.createdAt.localeCompare(a.createdAt);
}

/**
 * Localisation with fallback: English field when present, otherwise the
 * (Dutch) primary value. Keeps content localisable without forcing every
 * record to be translated before launch.
 */
export function localizeValue(locale: Locale, primary: string, translated?: string): string {
  if (locale === "en" && translated) return translated;
  return primary;
}
