import { Suspense } from "react";
import type { Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { getCoupons } from "@/services/coupons";
import { pathFor } from "@/lib/routes";
import { firstValue, parsePage, parseSort } from "@/lib/query";
import { siteConfig } from "@/config/site";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchForm } from "@/components/search/SearchForm";
import { CouponCard } from "@/components/coupon/CouponCard";
import { Pagination } from "@/components/common/Pagination";
import { ResultsSkeleton, SortTabs } from "@/components/common/ListControls";
import { EmptyState } from "@/components/ui/SectionHeading";

export type CouponSearchParams = Promise<Record<string, string | string[] | undefined>>;

interface CouponsPageProps {
  locale: Locale;
  dict: Dictionary;
  searchParams: CouponSearchParams;
}

async function CouponResults({ locale, dict, searchParams }: CouponsPageProps) {
  const sp = await searchParams;
  const q = firstValue(sp.q);
  const sort = parseSort(firstValue(sp.sort));
  const page = parsePage(firstValue(sp.page));
  const basePath = pathFor(locale, "coupons");

  const result = await getCoupons({ locale, q, sort, page, perPage: siteConfig.pagination.coupons });

  return (
    <div className="space-y-6">
      <SearchForm
        locale={locale}
        dict={dict}
        actionKey="coupons"
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
        <EmptyState title={dict.common.noResults} description={dict.coupons.empty} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {result.items.map((coupon) => (
              <CouponCard key={coupon.id} coupon={coupon} locale={locale} dict={dict} />
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

/** Coupons index shared by `/kortingscodes` (nl) and `/en/coupons` (en). */
export function CouponsPage({ locale, dict, searchParams }: CouponsPageProps) {
  return (
    <>
      <PageHeader title={dict.coupons.title} description={dict.coupons.description}>
        <div className="rounded-2xl border border-brand-200 bg-white p-4">
          <p className="text-sm font-bold text-ink-900">{dict.coupons.howToTitle}</p>
          <ol className="mt-2 grid gap-2 text-sm text-ink-600 sm:grid-cols-3">
            <li className="flex gap-2">
              <span className="font-bold text-brand-700">1.</span>
              {dict.coupons.howToSteps.step1}
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-brand-700">2.</span>
              {dict.coupons.howToSteps.step2}
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-brand-700">3.</span>
              {dict.coupons.howToSteps.step3}
            </li>
          </ol>
        </div>
      </PageHeader>
      <div className="shell py-8">
        <Suspense fallback={<ResultsSkeleton rows={6} />}>
          <CouponResults locale={locale} dict={dict} searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}
