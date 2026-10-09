import Link from "next/link";
import { notFound } from "next/navigation";
import type { CategorySummary, Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { getRelatedStores, getStoreBySlug } from "@/services/stores";
import { getCouponsByStore } from "@/services/coupons";
import { getDealsByStore } from "@/services/deals";
import { pathFor } from "@/lib/routes";
import { interpolate } from "@/lib/date";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { StoreLogo } from "@/components/store/StoreLogo";
import { StoreCard } from "@/components/store/StoreCard";
import { CouponCard } from "@/components/coupon/CouponCard";
import { DealCard } from "@/components/coupon/DealCard";
import { GetDealButton } from "@/components/coupon/GetDealButton";
import { SectionHeading, EmptyState } from "@/components/ui/SectionHeading";
import { CategoryIcon } from "@/components/category/CategoryIcon";
import { JsonLd } from "@/components/seo/JsonLd";

interface StoreDetailPageProps {
  locale: Locale;
  dict: Dictionary;
  slug: string;
}

function uniqueCategories(
  items: Array<{ categories: CategorySummary[] }>,
): CategorySummary[] {
  const map = new Map<string, CategorySummary>();
  for (const item of items) {
    for (const category of item.categories) map.set(category.id, category);
  }
  return [...map.values()];
}

/** Store detail — offers, deals, categories, related stores and FAQ. */
export async function StoreDetailPage({ locale, dict, slug }: StoreDetailPageProps) {
  const store = await getStoreBySlug(slug, locale);
  if (!store) notFound();

  const [coupons, deals, related] = await Promise.all([
    getCouponsByStore(store.id, locale),
    getDealsByStore(store.id, locale),
    getRelatedStores(store.id, locale, 4),
  ]);

  const categories = uniqueCategories([...coupons, ...deals]);
  const offers = (store.activeCouponCount ?? 0) + (store.activeDealCount ?? 0);
  const storePath = pathFor(locale, "store", store.slug);
  const homePath = pathFor(locale, "home");
  const storesPath = pathFor(locale, "stores");

  const crumbs = [
    { name: dict.common.home, path: homePath },
    { name: dict.stores.title, path: storesPath },
    { name: store.name, path: storePath },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <div className="shell py-6 sm:py-8">
        <Breadcrumbs
          label={dict.breadcrumb.label}
          items={[
            { label: dict.common.home, path: homePath },
            { label: dict.stores.title, path: storesPath },
            { label: store.name },
          ]}
        />

        <header className="flex flex-col gap-5 rounded-2xl border border-ink-200 bg-white p-5 shadow-card sm:flex-row sm:items-center sm:p-6">
          <StoreLogo
            name={store.name}
            initials={store.initials}
            brandColor={store.brandColor}
            size="lg"
          />
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">{store.name}</h1>
            <p className="mt-1 text-sm text-ink-500">
              {interpolate(dict.stores.offersMany, { n: offers })}
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-600">
              {store.description}
            </p>
          </div>
          <div className="sm:w-48">
            <GetDealButton
              redirectUrl={store.websiteUrl}
              fallbackHref={storePath}
              storeName={store.name}
              dict={dict}
              className="w-full"
            />
          </div>
        </header>

        {categories.length > 0 ? (
          <ul className="mt-5 flex flex-wrap gap-2">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={pathFor(locale, "category", category.slug)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3 py-1 text-sm font-semibold text-ink-700 hover:border-brand-300 hover:text-brand-700"
                >
                  <CategoryIcon name={category.icon} size={15} />
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        <section className="mt-10" aria-labelledby="store-coupons">
          <SectionHeading
            id="store-coupons"
            title={dict.store.couponsTitle}
            subtitle={dict.store.couponsIntro}
          />
          {coupons.length === 0 ? (
            <EmptyState title={dict.stores.empty} description={dict.store.noCoupons} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {coupons.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} locale={locale} dict={dict} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-10" aria-labelledby="store-deals">
          <SectionHeading
            id="store-deals"
            title={dict.store.dealsTitle}
            subtitle={dict.store.dealsIntro}
          />
          {deals.length === 0 ? (
            <EmptyState title={dict.stores.empty} description={dict.store.noDeals} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} locale={locale} dict={dict} />
              ))}
            </div>
          )}
        </section>

        {related.length > 0 ? (
          <section className="mt-10" aria-labelledby="store-related">
            <SectionHeading id="store-related" title={dict.store.relatedTitle} />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
              {related.map((item) => (
                <StoreCard key={item.id} store={item} locale={locale} dict={dict} />
              ))}
            </div>
          </section>
        ) : null}

        {store.faq && store.faq.length > 0 ? (
          <section className="mt-10" aria-labelledby="store-faq">
            <SectionHeading
              id="store-faq"
              title={interpolate(dict.store.faqTitle, { store: store.name })}
            />
            <div className="divide-y divide-ink-100 rounded-2xl border border-ink-200 bg-white">
              {store.faq.map((item, index) => (
                <details key={index} className="group px-5 py-4">
                  <summary className="cursor-pointer list-none font-semibold text-ink-800 marker:hidden">
                    {item.question}
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{item.answer}</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}
