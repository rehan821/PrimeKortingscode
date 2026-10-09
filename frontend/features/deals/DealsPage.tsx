import { Suspense } from "react";
import Link from "next/link";
import type { Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { getDeals } from "@/services/deals";
import { getPopularCategories } from "@/services/categories";
import { pathFor } from "@/lib/routes";
import { firstValue, parsePage, parseSort } from "@/lib/query";
import { siteConfig } from "@/config/site";
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
  const categories = await getPopularCategories(7, locale);

  return (
    <div className="space-y-6">
      <nav aria-label={locale === "nl" ? "Populaire categorieën" : "Popular categories"} className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {categories.map((category) => (
          <Link key={category.id} href={pathFor(locale, "category", category.slug)} className="shrink-0 rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-bold text-ink-700 transition hover:border-brand-400 hover:text-brand-700">
            {category.name}
          </Link>
        ))}
      </nav>

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
      <header className="border-b border-[#ead6df] bg-[#f8e6ed]">
        <div className="shell flex min-h-[220px] flex-col justify-center py-8 sm:min-h-[265px] sm:py-10">
          <p className="text-xs font-extrabold uppercase tracking-[.18em] text-brand-800">{locale === "nl" ? "Shop & bespaar" : "Shop and save"}</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-black leading-[1.04] tracking-tight text-ink-950 sm:text-5xl lg:text-6xl">{dict.deals.title}</h1>
          <p className="mt-3 max-w-2xl text-base leading-6 text-ink-700 sm:text-lg">{dict.deals.description}</p>
        </div>
      </header>
      <div className="shell py-6 sm:py-8">
        <Suspense fallback={<ResultsSkeleton rows={6} />}>
          <DealResults locale={locale} dict={dict} searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}
