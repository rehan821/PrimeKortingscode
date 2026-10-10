"use cache";

/**
 * Server-only, time-dependent helpers.
 *
 * The whole module is cached ("use cache") so `Date.now()` is evaluated once
 * per cache entry instead of during static prerender — Cache Components treats
 * raw clock reads as unstable values. Revalidation refreshes the day counter.
 */
export interface ExpiryInfo {
  /** `null` when there is no expiry date. */
  expiresAt: string | null;
  /** Whole days left from today (UTC); `0` = today, negative = expired. */
  daysLeft: number | null;
  isExpired: boolean;
  isToday: boolean;
  /** No expiry date configured. */
  isUnknown: boolean;
}

function dayMs(value: string | number): number {
  const d = new Date(value);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

export async function getExpiryInfo(iso: string | undefined | null): Promise<ExpiryInfo> {
  if (!iso) {
    return { expiresAt: null, daysLeft: null, isExpired: false, isToday: false, isUnknown: true };
  }
  const expires = new Date(iso);
  const daysLeft = Math.round((dayMs(expires.getTime()) - dayMs(Date.now())) / 86_400_000);
  return {
    expiresAt: expires.toISOString(),
    daysLeft,
    isExpired: daysLeft < 0,
    isToday: daysLeft === 0,
    isUnknown: false,
  };
}
