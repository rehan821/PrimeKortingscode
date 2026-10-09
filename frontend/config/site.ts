import type { Locale } from "@/types";

/**
 * Central site configuration.
 * No URL, origin or brand value is ever hardcoded anywhere else in the app.
 */
export const siteConfig = {
  name: "PrimeKortingscode",
  /** Canonical origin — used for canonical URLs, hreflang, OG, sitemap, robots. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  defaultLocale: "nl" as Locale,
  /** Public routes served per locale (no prefix for the default locale). */
  localePaths: {
    nl: "",
    en: "en",
  } satisfies Record<Locale, string>,
  /** Public contact address shown on the contact page. */
  contactEmail: "hallo@primekortingscode.nl",
  /** Unbounded datasets are never fetched — page sizes live here. */
  pagination: {
    stores: 24,
    categories: 24,
    coupons: 12,
    deals: 12,
    posts: 9,
  },
  /** Demo banner: mock data is never presented as live offers. */
  showDemoNotice: true,
  social: {
    twitter: "",
  },
} as const;

export function siteUrl(path = ""): string {
  const base = siteConfig.url.replace(/\/$/, "");
  if (!path) return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
