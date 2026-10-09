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
import { MerchantOfferRow } from "@/components/coupon/MerchantOfferRow";
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

        <header className="border-b border-ink-100 pb-5 pt-2">
          <h1 className="text-3xl font-black tracking-tight text-ink-950 sm:text-4xl lg:text-[2.75rem]">{category.name}</h1>
          <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-ink-600">{locale === "nl" ? `Bekijk aanbiedingen in ${category.name}` : `Browse offers in ${category.name}`}</p>
        </header>

        <div className="mt-7 grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-10">
          <aside className="space-y-7">
            <section aria-labelledby="category-about">
              <h2 id="category-about" className="text-sm font-extrabold uppercase tracking-wide text-ink-900">{locale === "nl" ? `Over ${category.name}` : `About ${category.name}`}</h2>
              <p className="mt-3 text-sm leading-6 text-ink-700">{category.description}</p>
              <p className="mt-3 text-xs leading-5 text-ink-500">{locale === "nl" ? "Aanbiedingen en kortingscodes kunnen per winkel verschillen. Bekijk altijd de voorwaarden bij de aanbieder." : "Offers and coupon terms can vary by store. Check the merchant’s terms before purchasing."}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="brand">{category.storeCount ?? 0} {dict.categories.storesCount}</Badge>
                <Badge variant="accent">{category.couponCount ?? 0} {dict.categories.codesCount}</Badge>
              </div>
            </section>
            {related.length > 0 ? <nav aria-label={dict.category.relatedTitle}>
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-ink-900">{dict.category.relatedTitle}</h2>
              <ul className="mt-3 space-y-2">
                {related.map((item) => <li key={item.id}><Link href={pathFor(locale, "category", item.slug)} className="inline-flex items-center gap-2 text-sm text-ink-700 hover:text-brand-700"><CategoryIcon name={item.icon} size={16} />{item.name}</Link></li>)}
              </ul>
            </nav> : null}
          </aside>

          <div className="min-w-0 space-y-10">
            {deals.length > 0 || coupons.length > 0 ? <section aria-labelledby="category-top-deals">
              <SectionHeading id="category-top-deals" title={locale === "nl" ? "Vandaag populaire deals" : "Today’s top deals"} />
              <div className="overflow-hidden rounded-xl border border-ink-200 bg-white shadow-card">
                {[...deals.slice(0, 2), ...coupons.slice(0, 2)].map((offer) => <MerchantOfferRow key={offer.id} offer={offer} locale={locale} dict={dict} />)}
              </div>
            </section> : null}

            <section aria-labelledby="category-stores">
              <SectionHeading id="category-stores" title={dict.category.storesTitle} />
              {stores.length === 0 ? <EmptyState title={dict.common.noResults} description={dict.category.noStores} /> : <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">{stores.map((store) => <StoreCard key={store.id} store={store} locale={locale} dict={dict} />)}</div>}
            </section>

            <section aria-labelledby="category-coupons">
              <SectionHeading id="category-coupons" title={dict.category.couponsTitle} />
              {coupons.length === 0 ? <EmptyState title={dict.common.noResults} description={dict.category.noCoupons} /> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{coupons.map((coupon) => <CouponCard key={coupon.id} coupon={coupon} locale={locale} dict={dict} />)}</div>}
            </section>

            <section aria-labelledby="category-deals">
              <SectionHeading id="category-deals" title={dict.category.dealsTitle} />
              {deals.length === 0 ? <EmptyState title={dict.common.noResults} description={dict.category.noDeals} /> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{deals.map((deal) => <DealCard key={deal.id} deal={deal} locale={locale} dict={dict} />)}</div>}
            </section>
          </div>
        </div>

      </div>
    </>
  );
}
