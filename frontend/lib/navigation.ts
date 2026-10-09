import type { Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { pathFor, type RouteKey } from "@/lib/routes";

export const NAV_KEYS = ["stores", "categories", "coupons", "deals", "blog", "contact"] as const;

export interface NavItem {
  key: RouteKey;
  label: string;
  href: string;
}

/** Primary navigation — shared by desktop nav and the mobile menu. */
export function getNavItems(locale: Locale, dict: Dictionary): NavItem[] {
  const labels: Record<string, string> = dict.header.nav;
  return NAV_KEYS.map((key) => ({
    key,
    label: labels[key] ?? key,
    href: pathFor(locale, key),
  }));
}
