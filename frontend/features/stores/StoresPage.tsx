import { Suspense } from "react";
import type { Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { getStores } from "@/services/stores";
import { pathFor } from "@/lib/routes";
import { firstValue, parsePage, parseSort } from "@/lib/query";
import { siteConfig } from "@/config/site";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchForm } from "@/components/search/SearchForm";
import { StoreCard } from "@/components/store/StoreCard";
import { Pagination } from "@/components/common/Pagination";
import { AlphabetFilter, ResultsSkeleton, SortTabs } from "@/components/common/ListControls";
import { EmptyState } from "@/components/ui/SectionHeading";

export type StoreSearchParams = Promise<Record<string, string | string[] | undefined>>;

interface StoresPageProps {
  locale: Locale;
  dict: Dictionary;
  searchParams: StoreSearchParams;
}

/**
 * Streamed results: reads `searchParams` inside its own boundary so the page
 * shell (header + hero copy) stays static and only the filtered grid renders
 * per request.
 */
async function StoreResults({ locale, dict, searchParams }: StoresPageProps) {
  const sp = await searchParams;
  const q = firstValue(sp.q);
  const letter = firstValue(sp.letter);
  const sort = parseSort(firstValue(sp.sort));
  const page = parsePage(firstValue(sp.page));
  const basePath = pathFor(locale, "stores");

  const result = await getStores({
    locale,
    q,
    letter,
    sort,
    page,
    perPage: siteConfig.pagination.stores,
  });

  return (
    <div className="space-y-6">
      <SearchForm
        locale={locale}
        dict={dict}
        actionKey="stores"
        defaultValue={q}
        placeholder={dict.stores.searchPlaceholder}
        className="max-w-xl"
      />

      <div className="flex flex-col gap-4">
        <SortTabs
          basePath={basePath}
          label={dict.filters.sortLabel}
          current={sort ?? "popular"}
          options={[
            { value: "popular", label: dict.filters.popular },
            { value: "newest", label: dict.filters.newest },
            { value: "title", label: dict.filters.title },
          ]}
          query={{ q, letter }}
        />
        <AlphabetFilter
          basePath={basePath}
          label={dict.alphabet.label}
          current={letter}
          allLabel={dict.filters.all}
          query={{ q, sort }}
        />
      </div>

      {result.items.length === 0 ? (
        <EmptyState title={dict.common.noResults} description={dict.stores.empty} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {result.items.map((store) => (
              <StoreCard key={store.id} store={store} locale={locale} dict={dict} />
            ))}
          </div>
          <Pagination
            basePath={basePath}
            page={result.page}
            totalPages={result.totalPages}
            query={{ q, letter, sort }}
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

/** Stores index shared by `/winkels` (nl) and `/en/stores` (en). */
export function StoresPage({ locale, dict, searchParams }: StoresPageProps) {
  return (
    <>
      <PageHeader title={dict.stores.title} description={dict.stores.description} />
      <div className="shell py-8">
        <Suspense fallback={<ResultsSkeleton rows={8} />}>
          <StoreResults locale={locale} dict={dict} searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}
