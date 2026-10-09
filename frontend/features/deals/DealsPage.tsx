import { Suspense } from "react";
import type { Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { getDeals } from "@/services/deals";
import { pathFor } from "@/lib/routes";
import { firstValue, parsePage, parseSort } from "@/lib/query";
import { siteConfig } from "@/config/site";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchForm } from "@/components/search/SearchForm";
import { DealCard } from "@/components/coupon/DealCard";
import { Pagination } from "@/components/common/Pagination";
import { ResultsSkeleton, SortTabs } from "@/components/common/ListControls";
import { EmptyState } from "@/components/ui/SectionHeading";

export type DealSearchParams = Promise<Record<string, string | string[] | undefined>>;

interface DealsPageProps {
  locale: Locale;
  dict: Dictionary;
  searchParams: DealSearchParams;
}

async function DealResults({ locale, dict, searchParams }: DealsPageProps) {
  const sp = await searchParams;
  const q = firstValue(sp.q);
  const sort = parseSort(firstValue(sp.sort));
  const page = parsePage(firstValue(sp.page));
  const basePath = pathFor(locale, "deals");

  const result = await getDeals({ locale, q, sort, page, perPage: siteConfig.pagination.deals });

  return (
    <div className="space-y-6">
      <SearchForm
        locale={locale}
        dict={dict}
        actionKey="deals"
        defaultValue={q}
        className="max-w-xl"
      />

      <SortTabs
        basePath={basePath}
        label={dict.filters.sortLabel}
        current={sort ?? "popular"}
        options={[
          { value: "popular", label: dict.filters.popular },
          { value: "newest", label: dict.filters.newest },
          { value: "expiring", label: dict.filters.expiring },
          { value: "title", label: dict.filters.title },
        ]}
        query={{ q }}
      />

      {result.items.length === 0 ? (
        <EmptyState title={dict.common.noResults} description={dict.deals.empty} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.items.map((deal) => (
              <DealCard key={deal.id} deal={deal} locale={locale} dict={dict} />
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

/** Deals index shared by `/deals` (nl) and `/en/deals` (en). */
export function DealsPage({ locale, dict, searchParams }: DealsPageProps) {
  return (
    <>
      <PageHeader title={dict.deals.title} description={dict.deals.description} />
      <div className="shell py-8">
        <Suspense fallback={<ResultsSkeleton rows={6} />}>
          <DealResults locale={locale} dict={dict} searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}
