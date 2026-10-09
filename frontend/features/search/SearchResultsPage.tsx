import { Suspense } from "react";
import Link from "next/link";
import type { Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { getStores } from "@/services/stores";
import { getCoupons } from "@/services/coupons";
import { getDeals } from "@/services/deals";
import { firstValue, parsePage, withQuery } from "@/lib/query";
import { pathFor } from "@/lib/routes";
import { StoreCard } from "@/components/store/StoreCard";
import { CouponCard } from "@/components/coupon/CouponCard";
import { DealCard } from "@/components/coupon/DealCard";
import { Pagination } from "@/components/common/Pagination";
import { EmptyState } from "@/components/ui/SectionHeading";
import { SearchForm } from "@/components/search/SearchForm";
import { interpolate } from "@/lib/date";

export interface SearchResultsSearchParams {
  q?: string | string[];
  type?: string | string[];
  page?: string | string[];
}

type SearchType = "all" | "stores" | "coupons" | "deals";

function parseSearchType(value: string | undefined): SearchType {
  return value === "stores" || value === "coupons" || value === "deals" ? value : "all";
}

const PREVIEW_SIZE = 4;
const RESULTS_PAGE_SIZE = 12;

/** Mixed-type search results backed only by the existing local services. */
export function SearchResultsPage(props: {
  locale: Locale;
  dict: Dictionary;
  searchParams: Promise<SearchResultsSearchParams>;
}) {
  return (
    <Suspense fallback={<div className="shell py-8"><div className="h-10 w-1/3 animate-pulse rounded-lg bg-ink-100" /></div>}>
      <SearchResultsContent {...props} />
    </Suspense>
  );
}

async function SearchResultsContent({
  locale,
  dict,
  searchParams,
}: {
  locale: Locale;
  dict: Dictionary;
  searchParams: Promise<SearchResultsSearchParams>;
}) {
  const params = await searchParams;
  const query = (firstValue(params.q) ?? "").trim().slice(0, 80);
  const type = parseSearchType(firstValue(params.type));
  const page = parsePage(firstValue(params.page));
  const searchPath = pathFor(locale, "search");
  const preview = type === "all";
  const pageSize = preview ? PREVIEW_SIZE : RESULTS_PAGE_SIZE;

  const [stores, coupons, deals] = query
    ? await Promise.all([
        type === "all" || type === "stores"
          ? getStores({ locale, q: query, page: preview ? 1 : page, perPage: pageSize, sort: "popular" })
          : Promise.resolve(null),
        type === "all" || type === "coupons"
          ? getCoupons({ locale, q: query, page: preview ? 1 : page, perPage: pageSize, sort: "popular" })
          : Promise.resolve(null),
        type === "all" || type === "deals"
          ? getDeals({ locale, q: query, page: preview ? 1 : page, perPage: pageSize, sort: "popular" })
          : Promise.resolve(null),
      ])
    : [null, null, null];

  const total = (stores?.total ?? 0) + (coupons?.total ?? 0) + (deals?.total ?? 0);
  const labels = {
    label: dict.pagination.label,
    previous: dict.pagination.previous,
    next: dict.pagination.next,
    page: dict.pagination.page,
    of: dict.pagination.of,
    current: dict.pagination.current,
  };

  const viewAllLink = (target: Exclude<SearchType, "all">) => withQuery(searchPath, { q: query, type: target });

  return (
    <div className="shell py-6 sm:py-8">
      <header className="mb-8 space-y-4">
        <h1 className="text-3xl font-black tracking-tight text-ink-950 sm:text-4xl">{dict.searchResults.title}</h1>
        <SearchForm locale={locale} dict={dict} defaultValue={query} className="max-w-2xl" />
        {query ? (
          <p className="text-sm text-ink-600">
            {dict.searchResults.showingFor}: <span className="font-bold text-ink-900">“{query}”</span>
          </p>
        ) : null}
      </header>

      {!query ? (
        <EmptyState title={dict.common.search} description={dict.searchResults.emptyQuery} />
      ) : total === 0 ? (
        <EmptyState title={dict.common.noResults} description={dict.searchResults.empty} />
      ) : (
        <div className="space-y-10">
          {(type === "all" || type === "stores") && stores ? (
            <section aria-labelledby="search-stores">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 id="search-stores" className="text-xl font-extrabold text-ink-950">{dict.searchResults.stores}</h2>
                  <p className="mt-1 text-sm text-ink-500">{interpolate(dict.searchResults.resultsCount, { count: stores.total })}</p>
                </div>
                {preview && stores.total > stores.items.length ? <Link href={viewAllLink("stores")} className="text-sm font-bold text-brand-700 underline underline-offset-4">{dict.searchResults.viewAllStores}</Link> : null}
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                {stores.items.map((store) => <StoreCard key={store.id} store={store} locale={locale} dict={dict} />)}
              </div>
              {!preview ? <Pagination basePath={searchPath} page={stores.page} totalPages={stores.totalPages} query={{ q: query, type }} labels={labels} /> : null}
            </section>
          ) : null}

          {(type === "all" || type === "coupons") && coupons ? (
            <section aria-labelledby="search-coupons">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 id="search-coupons" className="text-xl font-extrabold text-ink-950">{dict.searchResults.coupons}</h2>
                  <p className="mt-1 text-sm text-ink-500">{interpolate(dict.searchResults.resultsCount, { count: coupons.total })}</p>
                </div>
                {preview && coupons.total > coupons.items.length ? <Link href={viewAllLink("coupons")} className="text-sm font-bold text-brand-700 underline underline-offset-4">{dict.searchResults.viewAllCoupons}</Link> : null}
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {coupons.items.map((coupon) => <CouponCard key={coupon.id} coupon={coupon} locale={locale} dict={dict} />)}
              </div>
              {!preview ? <Pagination basePath={searchPath} page={coupons.page} totalPages={coupons.totalPages} query={{ q: query, type }} labels={labels} /> : null}
            </section>
          ) : null}

          {(type === "all" || type === "deals") && deals ? (
            <section aria-labelledby="search-deals">
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 id="search-deals" className="text-xl font-extrabold text-ink-950">{dict.searchResults.deals}</h2>
                  <p className="mt-1 text-sm text-ink-500">{interpolate(dict.searchResults.resultsCount, { count: deals.total })}</p>
                </div>
                {preview && deals.total > deals.items.length ? <Link href={viewAllLink("deals")} className="text-sm font-bold text-brand-700 underline underline-offset-4">{dict.searchResults.viewAllDeals}</Link> : null}
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {deals.items.map((deal) => <DealCard key={deal.id} deal={deal} locale={locale} dict={dict} />)}
              </div>
              {!preview ? <Pagination basePath={searchPath} page={deals.page} totalPages={deals.totalPages} query={{ q: query, type }} labels={labels} /> : null}
            </section>
          ) : null}
        </div>
      )}
    </div>
  );
}
