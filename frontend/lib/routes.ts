import type { Locale } from "@/types";

/**
 * Central route registry.
 *
 * Every public URL in the application is derived from here — pages, internal
 * links, canonical URLs, hreflang alternates and the sitemap all share one
 * source of truth. Adding a locale = adding one column below + one route tree.
 *
 * Dutch (default locale) lives at the root, English under `/en`.
 * `next.config.ts` rewrites the public Dutch paths onto the internal
 * `/nl/...` route tree so `<html lang>` can be set server-side per locale.
 */
export type RouteKey =
  | "home"
  | "stores"
  | "store"
  | "categories"
  | "category"
  | "coupons"
  | "coupon"
  | "deals"
  | "deal"
  | "search"
  | "blog"
  | "post"
  | "contact"
  | "privacy";

type PathTemplate = Record<RouteKey, string>;

/**
 * Internal path templates (relative, no leading slash).
 * `{slug}` is replaced with the entity slug.
 */
const templates: Record<Locale, PathTemplate> = {
  nl: {
    home: "",
    stores: "winkels",
    store: "winkels/{slug}",
    categories: "categorieen",
    category: "categorieen/{slug}",
    coupons: "kortingscodes",
    coupon: "kortingscodes/{slug}",
    deals: "deals",
    deal: "deals/{slug}",
    search: "zoeken",
    blog: "blog",
    post: "blog/{slug}",
    contact: "contact",
    privacy: "privacybeleid",
  },
  en: {
    home: "en",
    stores: "en/stores",
    store: "en/stores/{slug}",
    categories: "en/categories",
    category: "en/categories/{slug}",
    coupons: "en/coupons",
    coupon: "en/coupons/{slug}",
    deals: "en/deals",
    deal: "en/deals/{slug}",
    search: "en/search",
    blog: "en/blog",
    post: "en/blog/{slug}",
    contact: "en/contact",
    privacy: "en/privacy",
  },
};

/**
 * First path segments that legitimately exist at the site root: every Dutch
 * route plus the English locale prefix (`/en`) and the internal `/nl` tree
 * (which the config redirects back to the public URLs). Used by `proxy.ts`
 * to recognise — and reject — unknown single-segment paths.
 */
export const ROOT_SEGMENTS: ReadonlySet<string> = new Set<string>([
  "nl",
  "en",
  ...(Object.keys(templates.nl) as RouteKey[])
    .map((key) => templates.nl[key].split("/")[0])
    .filter(Boolean),
]);

/**
 * Normalises a pathname from `usePathname()` to its public form.
 *
 * Config rewrites may surface the internal `/nl/…` tree client-side; the
 * public Dutch URL never starts with `/nl`, so the prefix is simply removed.
 */
export function toPublicPathname(pathname: string): string {
  return pathname.replace(/^\/nl(?=\/|$)/, "") || "/";
}

/** Public path (leading slash, no trailing slash) for a route in a locale. */
export function pathFor(locale: Locale, key: RouteKey, slug?: string): string {
  const template = templates[locale][key];
  const filled = slug ? template.replace("{slug}", encodeURIComponent(slug)) : template;
  return filled ? `/${filled}` : "/";
}

/** Public path for the same route in another locale — used for hreflang. */
export function alternatePathFor(
  locale: Locale,
  key: RouteKey,
  slug?: string,
  target?: Locale,
): string {
  const other = target ?? (locale === "nl" ? "en" : "nl");
  return pathFor(other, key, slug);
}

/**
 * Resolves a public path (any locale) to its route key + slug.
 * Used by the language switcher to point at the equivalent page.
 */
export function matchRoute(pathname: string): { key: RouteKey; slug?: string } | null {
  const clean = pathname.replace(/\/+$/, "") || "/";
  for (const locale of Object.keys(templates) as Locale[]) {
    for (const key of Object.keys(templates[locale]) as RouteKey[]) {
      const template = templates[locale][key];
      const pattern = template
        ? `^/${template.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace("\\{slug\\}", "[^/]+")}$`
        : "^/$";
      if (new RegExp(pattern).test(clean)) {
        const slug = template.includes("{slug}")
          ? decodeURIComponent(clean.split("/").filter(Boolean).pop() ?? "")
          : undefined;
        return { key, slug };
      }
    }
  }
  return null;
}

/** Equivalent public path in the target locale, or `null` when unmatched. */
export function translatePath(pathname: string, target: Locale): string | null {
  const match = matchRoute(pathname);
  if (!match) return null;
  return pathFor(target, match.key, match.slug);
}
