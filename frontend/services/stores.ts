import type { Locale, ListQuery, Paginated, Store, StoreSummary } from "@/types";
import { DEFAULT_LOCALE } from "@/types";
import { mockStores } from "@/data/mock/stores";
import { mockCoupons } from "@/data/mock/coupons";
import { mockDeals } from "@/data/mock/deals";
import {
  byNewestDesc,
  byPopularityDesc,
  isActive,
  localizeValue,
  matchesQuery,
  normalizePage,
  normalizePerPage,
  paginate,
} from "./shared";
import { siteConfig } from "@/config/site";

/**
 * Store service — the ONLY module that reads store data.
 * Today: local mock data. Tomorrow: HTTP against the API in `backend/docs`.
 * The signatures above are the contract; the UI never changes.
 */

export interface StoreListQuery extends ListQuery {
  locale?: Locale;
  /** First letter filter for the stores index (A–Z). */
  letter?: string;
}

function localize(locale: Locale, store: Store): Store {
  return {
    ...store,
    name: localizeValue(locale, store.name, store.nameEn),
    description: localizeValue(locale, store.description, store.descriptionEn),
  };
}

function countActive(list: Array<{ storeId: string; expiresAt?: string }>, storeId: string): number {
  return list.filter((item) => item.storeId === storeId && isActive(item.expiresAt)).length;
}

function withCounts(store: Store): Store {
  return {
    ...store,
    activeCouponCount: countActive(mockCoupons, store.id),
    activeDealCount: countActive(mockDeals, store.id),
  };
}

function toSummary(store: Store): StoreSummary {
  return {
    id: store.id,
    slug: store.slug,
    name: store.name,
    brandColor: store.brandColor,
    initials: store.initials,
  };
}

function sortStores(list: Store[], sort: StoreListQuery["sort"], locale: Locale): void {
  switch (sort) {
    case "title":
      list.sort((a, b) => a.name.localeCompare(b.name, locale));
      break;
    case "newest":
      list.sort(byNewestDesc);
      break;
    default:
      list.sort((a, b) => byPopularityDesc(a, b) || a.name.localeCompare(b.name, locale));
  }
}

export async function getStores(query: StoreListQuery = {}): Promise<Paginated<Store>> {
  // Cached: `countActive` filters on the current date, which must not run
  // during static prerender (Cache Components — unstable `Date.now()`).
  "use cache";
  const locale = query.locale ?? DEFAULT_LOCALE;
  const page = normalizePage(query.page);
  const perPage = normalizePerPage(query.perPage, siteConfig.pagination.stores);

  let list = mockStores.map((store) => withCounts(localize(locale, store)));

  if (query.q) list = list.filter((store) => matchesQuery(`${store.name} ${store.description}`, query.q));
  if (query.letter) {
    const letter = query.letter.toUpperCase();
    list = list.filter((store) => store.name.toUpperCase().startsWith(letter));
  }
  if (query.featured) list = list.filter((store) => store.isFeatured);

  sortStores(list, query.sort, locale);

  return paginate(list, page, perPage);
}

export async function getStoreBySlug(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): Promise<Store | undefined> {
  "use cache";
  const store = mockStores.find((item) => item.slug === slug);
  return store ? withCounts(localize(locale, store)) : undefined;
}

/** All store slugs — used by `generateStaticParams`, never by the UI. */
export async function getStoreSlugs(): Promise<string[]> {
  return mockStores.map((store) => store.slug);
}

export async function getPopularStores(
  limit = 8,
  locale: Locale = DEFAULT_LOCALE,
): Promise<Store[]> {
  const result = await getStores({ locale, perPage: limit, sort: "popular" });
  return result.items;
}

export async function searchStoreNames(q: string, locale: Locale = DEFAULT_LOCALE): Promise<StoreSummary[]> {
  const result = await getStores({ locale, q, perPage: 10, sort: "title" });
  return result.items.map(toSummary);
}

export async function getStoreSummaries(
  ids: readonly string[],
  locale: Locale = DEFAULT_LOCALE,
): Promise<StoreSummary[]> {
  return mockStores
    .filter((store) => ids.includes(store.id))
    .map((store) => localize(locale, store))
    .map(toSummary);
}

export async function getStoresByCategory(
  categorySlug: string,
  locale: Locale = DEFAULT_LOCALE,
  limit?: number,
): Promise<Store[]> {
  const result = await getPaginatedStoresByCategory(categorySlug, {
    locale,
    perPage: limit ?? 100,
    sort: "popular",
  });
  return result.items;
}

/** Category membership is applied to the complete collection before pagination. */
export async function getPaginatedStoresByCategory(
  categorySlug: string,
  query: StoreListQuery = {},
): Promise<Paginated<Store>> {
  // Active offer counts read the current date; keep this data work behind the
  // same cache boundary as the general store list during static prerender.
  "use cache";
  const locale = query.locale ?? DEFAULT_LOCALE;
  const page = normalizePage(query.page);
  const perPage = normalizePerPage(query.perPage, siteConfig.pagination.stores);
  const withCategory = new Set(
    [...mockCoupons, ...mockDeals]
      .filter((item) => item.categoryIds.includes(categorySlug))
      .map((item) => item.storeId),
  );

  let list = mockStores
    .filter((store) => withCategory.has(store.id))
    .map((store) => withCounts(localize(locale, store)));

  if (query.q) list = list.filter((store) => matchesQuery(`${store.name} ${store.description}`, query.q));
  if (query.letter) {
    const letter = query.letter.toUpperCase();
    list = list.filter((store) => store.name.toUpperCase().startsWith(letter));
  }
  if (query.featured) list = list.filter((store) => store.isFeatured);

  sortStores(list, query.sort, locale);
  return paginate(list, page, perPage);
}

export async function getRelatedStores(
  storeId: string,
  locale: Locale = DEFAULT_LOCALE,
  limit = 4,
): Promise<StoreSummary[]> {
  const storeCategories = new Set(
    [...mockCoupons, ...mockDeals]
      .filter((item) => item.storeId === storeId)
      .flatMap((item) => item.categoryIds),
  );

  return mockStores
    .filter((store) => store.id !== storeId)
    .filter((store) =>
      [...mockCoupons, ...mockDeals].some(
        (item) =>
          item.storeId === store.id && item.categoryIds.some((id) => storeCategories.has(id)),
      ),
    )
    .sort(byPopularityDesc)
    .slice(0, limit)
    .map((store) => toSummary(localize(locale, store)));
}
