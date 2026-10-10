import type { Deal, DealWithRelations, ListQuery, Locale, Paginated } from "@/types";
import { DEFAULT_LOCALE } from "@/types";
import { mockDeals } from "@/data/mock/deals";
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

/** Deal service — the only place deal data is read or shaped. */

export interface DealListQuery extends ListQuery {
  locale?: Locale;
  storeId?: string;
  categorySlug?: string;
}

function toView(deal: Deal, locale: Locale): DealWithRelations {
  const store = mockStores.find((item) => item.id === deal.storeId);
  const categories = mockCategories
    .filter((category) => deal.categoryIds.includes(category.id))
    .map((category) => ({
      id: category.id,
      slug: category.slug,
      name: localizeValue(locale, category.name, category.nameEn),
      icon: category.icon,
    }));

  return {
    ...deal,
    title: localizeValue(locale, deal.title, deal.titleEn),
    description: deal.description
      ? localizeValue(locale, deal.description, deal.descriptionEn)
      : deal.description,
    categories,
    store: store
      ? {
          id: store.id,
          slug: store.slug,
          name: localizeValue(locale, store.name, store.nameEn),
          brandColor: store.brandColor,
          initials: store.initials,
        }
      : { id: deal.storeId, slug: "", name: deal.storeId },
  };
}

function activeViews(locale: Locale): DealWithRelations[] {
  return mockDeals.filter((deal) => isActive(deal.expiresAt)).map((deal) => toView(deal, locale));
}

function sortDeals(list: DealWithRelations[], sort: string | undefined, locale: Locale): void {
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

export async function getDeals(query: DealListQuery = {}): Promise<Paginated<DealWithRelations>> {
  // Cached: active-deal filtering reads the current date.
  "use cache";
  const locale = query.locale ?? DEFAULT_LOCALE;
  const page = normalizePage(query.page);
  const perPage = normalizePerPage(query.perPage, siteConfig.pagination.deals);

  let list = activeViews(locale);

  if (query.storeId) list = list.filter((deal) => deal.storeId === query.storeId);
  if (query.categorySlug) list = list.filter((deal) => deal.categoryIds.includes(query.categorySlug!));
  if (query.featured) list = list.filter((deal) => deal.isFeatured);
  if (query.q) {
    list = list.filter((deal) =>
      matchesQuery(`${deal.title} ${deal.description ?? ""} ${deal.store.name}`, query.q),
    );
  }

  sortDeals(list, query.sort, locale);
  return paginate(list, page, perPage);
}

export async function getDealBySlug(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): Promise<DealWithRelations | undefined> {
  const deal = mockDeals.find((item) => item.slug === slug);
  return deal ? toView(deal, locale) : undefined;
}

/** All deal slugs — used by `generateStaticParams`, never by the UI. */
export async function getDealSlugs(): Promise<string[]> {
  return mockDeals.map((deal) => deal.slug);
}

export async function getFeaturedDeals(
  limit = 6,
  locale: Locale = DEFAULT_LOCALE,
): Promise<DealWithRelations[]> {
  const result = await getDeals({ locale, perPage: 100, featured: true, sort: "popular" });
  return result.items.slice(0, limit);
}

export async function getLatestDeals(
  limit = 6,
  locale: Locale = DEFAULT_LOCALE,
): Promise<DealWithRelations[]> {
  const result = await getDeals({ locale, perPage: 100, sort: "newest" });
  return result.items.slice(0, limit);
}

export async function getDealsByStore(
  storeId: string,
  locale: Locale = DEFAULT_LOCALE,
  limit?: number,
): Promise<DealWithRelations[]> {
  const result = await getDeals({ locale, storeId, perPage: limit ?? 100, sort: "popular" });
  return result.items.slice(0, limit ?? result.items.length);
}

export async function getDealsByCategory(
  categorySlug: string,
  locale: Locale = DEFAULT_LOCALE,
  limit?: number,
): Promise<DealWithRelations[]> {
  const result = await getDeals({ locale, categorySlug, perPage: limit ?? 100, sort: "popular" });
  return result.items.slice(0, limit ?? result.items.length);
}
