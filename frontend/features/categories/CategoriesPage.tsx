import { Suspense } from "react";
import type { Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { getCategories } from "@/services/categories";
import { pathFor } from "@/lib/routes";
import { firstValue, parsePage, parseSort } from "@/lib/query";
import { siteConfig } from "@/config/site";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchForm } from "@/components/search/SearchForm";
import { CategoryCard } from "@/components/category/CategoryCard";
import { Pagination } from "@/components/common/Pagination";
import { ResultsSkeleton, SortTabs } from "@/components/common/ListControls";
import { EmptyState } from "@/components/ui/SectionHeading";

export type CategorySearchParams = Promise<Record<string, string | string[] | undefined>>;

interface CategoriesPageProps {
  locale: Locale;
  dict: Dictionary;
  searchParams: CategorySearchParams;
}

async function CategoryResults({ locale, dict, searchParams }: CategoriesPageProps) {
  const sp = await searchParams;
  const q = firstValue(sp.q);
  const sort = parseSort(firstValue(sp.sort));
  const page = parsePage(firstValue(sp.page));
  const basePath = pathFor(locale, "categories");

  const result = await getCategories({ locale, q, sort, page, perPage: siteConfig.pagination.categories });

  return (
    <div className="space-y-6">
      <SearchForm
        locale={locale}
        dict={dict}
        actionKey="categories"
        defaultValue={q}
        placeholder={dict.categories.searchPlaceholder}
        className="max-w-xl"
      />

      <SortTabs
        basePath={basePath}
        label={dict.filters.sortLabel}
        current={sort ?? "popular"}
        options={[
          { value: "popular", label: dict.filters.popular },
          { value: "newest", label: dict.filters.newest },
          { value: "title", label: dict.filters.title },
        ]}
        query={{ q }}
      />

      {result.items.length === 0 ? (
        <EmptyState title={dict.common.noResults} description={dict.categories.empty} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {result.items.map((category) => (
              <CategoryCard key={category.id} category={category} locale={locale} dict={dict} />
            ))}
          </div>
          <Pagination
            basePath={basePath}
            page={result.page}
            totalPages={result.totalPages}
            query={{ q, sort }}
            labels={{
              label: dict.pagination.label,
              previous: dict.pagination.previous,
              next: dict.pagination.next,
              page: dict.pagination.page,
              of: dict.pagination.of,
              current: dict.pagination.current,
            }}
          />
        </>
      )}
    </div>
  );
}

/** Categories index shared by `/categorieen` (nl) and `/en/categories` (en). */
export function CategoriesPage({ locale, dict, searchParams }: CategoriesPageProps) {
  return (
    <>
      <PageHeader title={dict.categories.title} description={dict.categories.description} />
      <div className="shell py-8">
        <Suspense fallback={<ResultsSkeleton rows={8} />}>
          <CategoryResults locale={locale} dict={dict} searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}
