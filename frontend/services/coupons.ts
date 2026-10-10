import type {
  Coupon,
  CouponWithRelations,
  ListQuery,
  Locale,
  Paginated,
} from "@/types";
import { DEFAULT_LOCALE } from "@/types";
import { mockCoupons } from "@/data/mock/coupons";
import { mockStores } from "@/data/mock/stores";
import { mockCategories } from "@/data/mock/categories";
import {
  byNewestDesc,
  isActive,
  localizeValue,
  matchesQuery,
  normalizePage,
  normalizePerPage,
  paginate,
} from "./shared";
import { siteConfig } from "@/config/site";

/** Coupon service — the only place coupon data is read or shaped. */

export interface CouponListQuery extends ListQuery {
  locale?: Locale;
  storeId?: string;
  categorySlug?: string;
}

function storeSummaryFor(storeId: string, locale: Locale) {
  const store = mockStores.find((item) => item.id === storeId);
  if (!store) return undefined;
  return {
    id: store.id,
    slug: store.slug,
    name: localizeValue(locale, store.name, store.nameEn),
    brandColor: store.brandColor,
    initials: store.initials,
  };
}

function toView(coupon: Coupon, locale: Locale): CouponWithRelations {
  const store = storeSummaryFor(coupon.storeId, locale);
  const categories = mockCategories
    .filter((category) => coupon.categoryIds.includes(category.id))
    .map((category) => ({
      id: category.id,
      slug: category.slug,
      name: localizeValue(locale, category.name, category.nameEn),
      icon: category.icon,
    }));

  return {
    ...coupon,
    title: localizeValue(locale, coupon.title, coupon.titleEn),
    description: coupon.description
      ? localizeValue(locale, coupon.description, coupon.descriptionEn)
      : coupon.description,
    categories,
    // Relations are always present in practice; unknown ids degrade gracefully.
    store: store ?? { id: coupon.storeId, slug: "", name: coupon.storeId },
  };
}

function activeViews(locale: Locale): CouponWithRelations[] {
  return mockCoupons
    .filter((coupon) => isActive(coupon.expiresAt))
    .map((coupon) => toView(coupon, locale));
}

function sortCoupons(list: CouponWithRelations[], sort: string | undefined, locale: Locale): void {
  switch (sort) {
    case "newest":
      list.sort(byNewestDesc);
      break;
    case "expiring":
      list.sort((a, b) => (a.expiresAt ?? "9999").localeCompare(b.expiresAt ?? "9999"));
      break;
    case "title":
      list.sort((a, b) => a.title.localeCompare(b.title, locale));
      break;
    default:
      list.sort((a, b) => (b.usageCount ?? 0) - (a.usageCount ?? 0));
  }
}

export async function getCoupons(
  query: CouponListQuery = {},
): Promise<Paginated<CouponWithRelations>> {
  // Cached: active-coupon filtering reads the current date.
  "use cache";
  const locale = query.locale ?? DEFAULT_LOCALE;
  const page = normalizePage(query.page);
  const perPage = normalizePerPage(query.perPage, siteConfig.pagination.coupons);

  let list = activeViews(locale);

  if (query.storeId) list = list.filter((coupon) => coupon.storeId === query.storeId);
  if (query.categorySlug) list = list.filter((coupon) => coupon.categoryIds.includes(query.categorySlug!));
  if (query.featured) list = list.filter((coupon) => coupon.isFeatured);
  if (query.q) {
    list = list.filter((coupon) =>
      matchesQuery(`${coupon.title} ${coupon.description ?? ""} ${coupon.store.name}`, query.q),
    );
  }

  sortCoupons(list, query.sort, locale);
  return paginate(list, page, perPage);
}

export async function getCouponBySlug(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): Promise<CouponWithRelations | undefined> {
  const coupon = mockCoupons.find((item) => item.slug === slug);
  if (!coupon) return undefined;
  // Detail pages may still render an expired coupon with a clear "expired" state.
  return toView(coupon, locale);
}

/** All coupon slugs — used by `generateStaticParams`, never by the UI. */
export async function getCouponSlugs(): Promise<string[]> {
  return mockCoupons.map((coupon) => coupon.slug);
}

export async function getFeaturedCoupons(
  limit = 6,
  locale: Locale = DEFAULT_LOCALE,
): Promise<CouponWithRelations[]> {
  const result = await getCoupons({ locale, perPage: 100, featured: true, sort: "popular" });
  return result.items.slice(0, limit);
}

export async function getLatestCoupons(
  limit = 6,
  locale: Locale = DEFAULT_LOCALE,
): Promise<CouponWithRelations[]> {
  const result = await getCoupons({ locale, perPage: 100, sort: "newest" });
  return result.items.slice(0, limit);
}

export async function getCouponsByStore(
  storeId: string,
  locale: Locale = DEFAULT_LOCALE,
  limit?: number,
): Promise<CouponWithRelations[]> {
  const result = await getCoupons({ locale, storeId, perPage: limit ?? 100, sort: "popular" });
  return result.items.slice(0, limit ?? result.items.length);
}

export async function getCouponsByCategory(
  categorySlug: string,
  locale: Locale = DEFAULT_LOCALE,
  limit?: number,
): Promise<CouponWithRelations[]> {
  const result = await getCoupons({ locale, categorySlug, perPage: limit ?? 100, sort: "popular" });
  return result.items.slice(0, limit ?? result.items.length);
}
