import Link from "next/link";
import { notFound } from "next/navigation";
import type { Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import {
  getCategoryBySlug,
  getRelatedCategories,
} from "@/services/categories";
import { getStoresByCategory } from "@/services/stores";
import { getCouponsByCategory } from "@/services/coupons";
import { getDealsByCategory } from "@/services/deals";
import { pathFor } from "@/lib/routes";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { CategoryIcon } from "@/components/category/CategoryIcon";
import { StoreCard } from "@/components/store/StoreCard";
import { CouponCard } from "@/components/coupon/CouponCard";
import { DealCard } from "@/components/coupon/DealCard";
import { SectionHeading, EmptyState } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { JsonLd } from "@/components/seo/JsonLd";

interface CategoryDetailPageProps {
  locale: Locale;
  dict: Dictionary;
  slug: string;
}

/** Category detail — stores, coupons, deals and related categories. */
export async function CategoryDetailPage({ locale, dict, slug }: CategoryDetailPageProps) {
  const category = await getCategoryBySlug(slug, locale);
  if (!category) notFound();

  const [stores, coupons, deals, related] = await Promise.all([
    getStoresByCategory(category.slug, locale, 12),
    getCouponsByCategory(category.slug, locale, 6),
    getDealsByCategory(category.slug, locale, 6),
    getRelatedCategories(category.id, locale, 6),
  ]);

  const categoryPath = pathFor(locale, "category", category.slug);
  const homePath = pathFor(locale, "home");
  const categoriesPath = pathFor(locale, "categories");

  const crumbs = [
    { name: dict.common.home, path: homePath },
    { name: dict.categories.title, path: categoriesPath },
    { name: category.name, path: categoryPath },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <div className="shell py-6 sm:py-8">
        <Breadcrumbs
          label={dict.breadcrumb.label}
          items={[
            { label: dict.common.home, path: homePath },
            { label: dict.categories.title, path: categoriesPath },
            { label: category.name },
          ]}
        />

        <header className="flex flex-col gap-4 rounded-xl border border-ink-200 bg-white p-5 shadow-card sm:flex-row sm:items-center sm:p-6">
          <span className="inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-700">
            <CategoryIcon name={category.icon} size={30} />
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{category.name}</h1>
            {category.description ? (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-600">
                {category.description}
              </p>
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge variant="brand">
                {category.storeCount ?? 0} {dict.categories.storesCount}
              </Badge>
              <Badge variant="accent">
                {category.couponCount ?? 0} {dict.categories.codesCount}
              </Badge>
            </div>
          </div>
        </header>

        <section className="mt-10" aria-labelledby="category-stores">
          <SectionHeading id="category-stores" title={dict.category.storesTitle} />
          {stores.length === 0 ? (
            <EmptyState title={dict.common.noResults} description={dict.category.noStores} />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {stores.map((store) => (
                <StoreCard key={store.id} store={store} locale={locale} dict={dict} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-10" aria-labelledby="category-coupons">
          <SectionHeading id="category-coupons" title={dict.category.couponsTitle} />
          {coupons.length === 0 ? (
            <EmptyState title={dict.common.noResults} description={dict.category.noCoupons} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {coupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} locale={locale} dict={dict} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-10" aria-labelledby="category-deals">
          <SectionHeading id="category-deals" title={dict.category.dealsTitle} />
          {deals.length === 0 ? (
            <EmptyState title={dict.common.noResults} description={dict.category.noDeals} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} locale={locale} dict={dict} />
              ))}
            </div>
          )}
        </section>

        {related.length > 0 ? (
          <section className="mt-10" aria-labelledby="category-related">
            <SectionHeading id="category-related" title={dict.category.relatedTitle} />
            <ul className="flex flex-wrap gap-2">
              {related.map((item) => (
                <li key={item.id}>
                  <Link
                    href={pathFor(locale, "category", item.slug)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3.5 py-1.5 text-sm font-semibold text-ink-700 hover:border-brand-300 hover:text-brand-700"
                  >
                    <CategoryIcon name={item.icon} size={16} />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </>
  );
}
