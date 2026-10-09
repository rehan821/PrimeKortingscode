import type { Category, CategorySummary, ListQuery, Locale, Paginated } from "@/types";
import { DEFAULT_LOCALE } from "@/types";
import { mockCategories } from "@/data/mock/categories";
import { mockCoupons } from "@/data/mock/coupons";
import { mockDeals } from "@/data/mock/deals";
import {
  byNewestDesc,
  byPopularityDesc,
  localizeValue,
  matchesQuery,
  normalizePage,
  normalizePerPage,
  paginate,
} from "./shared";
import { siteConfig } from "@/config/site";

/** Category service — single source of taxonomy data for the UI. */

export interface CategoryListQuery extends ListQuery {
  locale?: Locale;
}

function localize(locale: Locale, category: Category): Category {
  return {
    ...category,
    name: localizeValue(locale, category.name, category.nameEn),
    description: category.description
      ? localizeValue(locale, category.description, category.descriptionEn)
      : category.description,
  };
}

function withCounts(category: Category): Category {
  const all = [...mockCoupons, ...mockDeals];
  return {
    ...category,
    couponCount: mockCoupons.filter((coupon) => coupon.categoryIds.includes(category.id)).length,
    dealCount: mockDeals.filter((deal) => deal.categoryIds.includes(category.id)).length,
    storeCount: new Set(
      all.filter((item) => item.categoryIds.includes(category.id)).map((item) => item.storeId),
    ).size,
  };
}

function toSummary(category: Category): CategorySummary {
  return { id: category.id, slug: category.slug, name: category.name, icon: category.icon };
}

export async function getCategories(
  query: CategoryListQuery = {},
): Promise<Paginated<Category>> {
  const locale = query.locale ?? DEFAULT_LOCALE;
  const page = normalizePage(query.page);
  const perPage = normalizePerPage(query.perPage, siteConfig.pagination.categories);

  let list = mockCategories.map((category) => withCounts(localize(locale, category)));

  if (query.q) list = list.filter((category) => matchesQuery(`${category.name} ${category.description ?? ""}`, query.q));
  if (query.featured) list = list.filter((category) => category.isFeatured);

  switch (query.sort) {
    case "title":
      list.sort((a, b) => a.name.localeCompare(b.name, locale));
      break;
    case "newest":
      list.sort(byNewestDesc);
      break;
    default:
      list.sort((a, b) => byPopularityDesc(a, b) || a.name.localeCompare(b.name, locale));
  }

  return paginate(list, page, perPage);
}

export async function getCategoryBySlug(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): Promise<Category | undefined> {
  const category = mockCategories.find((item) => item.slug === slug);
  return category ? withCounts(localize(locale, category)) : undefined;
}

/** All category slugs — used by `generateStaticParams`, never by the UI. */
export async function getCategorySlugs(): Promise<string[]> {
  return mockCategories.map((category) => category.slug);
}

export async function getPopularCategories(
  limit = 8,
  locale: Locale = DEFAULT_LOCALE,
): Promise<Category[]> {
  const result = await getCategories({ locale, perPage: limit, sort: "popular" });
  return result.items;
}

export async function getCategorySummaries(
  ids: readonly string[],
  locale: Locale = DEFAULT_LOCALE,
): Promise<CategorySummary[]> {
  return mockCategories
    .filter((category) => ids.includes(category.id))
    .map((category) => toSummary(localize(locale, category)));
}

export async function getRelatedCategories(
  categoryId: string,
  locale: Locale = DEFAULT_LOCALE,
  limit = 4,
): Promise<CategorySummary[]> {
  const storeIds = new Set(
    [...mockCoupons, ...mockDeals]
      .filter((item) => item.categoryIds.includes(categoryId))
      .map((item) => item.storeId),
  );

  return mockCategories
    .filter((category) => category.id !== categoryId)
    .map((category) => ({
      category,
      overlap: [...mockCoupons, ...mockDeals].filter(
        (item) => item.categoryIds.includes(category.id) && storeIds.has(item.storeId),
      ).length,
    }))
    .filter((entry) => entry.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap || byPopularityDesc(a.category, b.category))
    .slice(0, limit)
    .map((entry) => toSummary(localize(locale, entry.category)));
}
