import { mockStores } from "@/data/mock/stores";
import { mockCategories } from "@/data/mock/categories";
import { mockCoupons } from "@/data/mock/coupons";
import { mockDeals } from "@/data/mock/deals";
import { mockBlogPosts } from "@/data/mock/blog";

/**
 * Slug allow-lists for parameterised routes.
 *
 * Detail pages are statically generated; unknown slugs would otherwise hit the
 * partial-prefetch fallback and stream a 200 soft-404. `proxy.ts` compares the
 * requested slug against these sets and rewrites unknown ones onto the
 * server-rendered `global-not-found` so they return a real 404.
 *
 * Derived from the same mock source as the services, so the two can never
 * drift. When data moves behind the API, this becomes a build-time manifest.
 */
export const storeSlugs: ReadonlySet<string> = new Set(mockStores.map((item) => item.slug));
export const categorySlugs: ReadonlySet<string> = new Set(
  mockCategories.map((item) => item.slug),
);
export const couponSlugs: ReadonlySet<string> = new Set(mockCoupons.map((item) => item.slug));
export const dealSlugs: ReadonlySet<string> = new Set(mockDeals.map((item) => item.slug));
export const postSlugs: ReadonlySet<string> = new Set(mockBlogPosts.map((item) => item.slug));

export interface DetailSection {
  /** Public + internal first path segments that map to this section. */
  segments: readonly string[];
  slugs: ReadonlySet<string>;
}

export const DETAIL_SECTIONS: readonly DetailSection[] = [
  { segments: ["winkels", "stores"], slugs: storeSlugs },
  { segments: ["categorieen", "categories"], slugs: categorySlugs },
  { segments: ["kortingscodes", "coupons"], slugs: couponSlugs },
  { segments: ["deals"], slugs: dealSlugs },
  { segments: ["blog"], slugs: postSlugs },
];

/** True when `pathname` targets a detail page whose slug does not exist. */
export function isUnknownDetailSlug(pathname: string): boolean {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "nl" || parts[0] === "en") parts.shift();
  if (parts.length !== 2) return false;
  const [section, slug] = parts;
  const entry = DETAIL_SECTIONS.find((item) => item.segments.includes(section));
  if (!entry) return false;
  return !entry.slugs.has(slug);
}
