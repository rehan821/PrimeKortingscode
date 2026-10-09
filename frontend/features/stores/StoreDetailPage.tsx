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
import { MerchantOfferRow } from "@/components/coupon/MerchantOfferRow";
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

        <header className="border-b border-ink-200 pb-5">
          <h1 className="text-3xl font-black tracking-tight text-ink-950 sm:text-4xl lg:text-[2.75rem]">
            {locale === "nl" ? `${store.name} kortingscodes & aanbiedingen` : `${store.name} Coupons & Promo Codes`}
          </h1>
          <p className="mt-2 text-sm text-ink-600">
            {interpolate(dict.stores.offersMany, { n: offers })} · {locale === "nl" ? "Actuele aanbiedingen" : "Current offers"}
          </p>
        </header>

        <div className="mt-6 grid gap-8 lg:grid-cols-[270px_minmax(0,1fr)] lg:gap-10">
          <aside className="space-y-7">
            <section aria-label={store.name} className="flex items-center gap-4 border-b border-ink-200 pb-6">
              <div aria-hidden="true" className="flex size-20 shrink-0 items-center justify-center rounded-full border border-ink-200 bg-white text-2xl font-black text-brand-700 shadow-card sm:size-24">
                {store.initials ?? store.name.slice(0, 1)}
              </div>
              <div>
                <p className="font-extrabold text-ink-900">{store.name}</p>
                <p className="mt-1 text-sm text-ink-600">{offers} {locale === "nl" ? "aanbiedingen" : "offers"}</p>
              </div>
            </section>

            <section aria-labelledby="store-about">
              <h2 id="store-about" className="text-sm font-extrabold uppercase tracking-wide text-ink-900">{locale === "nl" ? `Over ${store.name}` : `About ${store.name}`}</h2>
              <p className="mt-3 text-sm leading-6 text-ink-700">{store.description}</p>
              <p className="mt-3 text-xs leading-5 text-ink-500">{locale === "nl" ? "Sommige links zijn affiliate links. Aanbiedingsvoorwaarden worden bepaald door de winkel." : "Some links are affiliate links. Offer terms are set by the merchant."}</p>
            </section>

            {(coupons.length > 0 || deals.length > 0) ? <section aria-labelledby="store-top-offers">
              <h2 id="store-top-offers" className="text-sm font-extrabold uppercase tracking-wide text-ink-900">{locale === "nl" ? `Populaire ${store.name} aanbiedingen` : `Top ${store.name} offers`}</h2>
              <ul className="mt-3 space-y-3">
                {[...coupons, ...deals].slice(0, 4).map((offer) => <li key={offer.id}><Link href={pathFor(locale, offer.type === "deal" ? "deal" : "coupon", offer.slug)} className="text-sm leading-5 text-brand-700 hover:underline">{offer.title}</Link></li>)}
              </ul>
            </section> : null}

            <section aria-label={locale === "nl" ? "Aanbiedingen per type" : "Offers by type"} className="border-y border-ink-200 py-4">
              <div className="flex justify-between py-1 text-sm"><span className="text-ink-600">{dict.store.couponsTitle}</span><strong>{coupons.length}</strong></div>
              <div className="flex justify-between py-1 text-sm"><span className="text-ink-600">{dict.store.dealsTitle}</span><strong>{deals.length}</strong></div>
            </section>

            {related.length > 0 ? <nav aria-label={dict.store.relatedTitle}>
              <h2 className="text-sm font-extrabold uppercase tracking-wide text-ink-900">{locale === "nl" ? "Populaire winkels" : "Popular stores"}</h2>
              <ul className="mt-3 space-y-2">
                {related.map((item) => <li key={item.id}><Link href={pathFor(locale, "store", item.slug)} className="text-sm text-brand-700 hover:underline">{item.name}</Link></li>)}
              </ul>
            </nav> : null}
          </aside>

          <div className="min-w-0">
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

        <section className="mt-7" aria-labelledby="store-offers">
          <SectionHeading
            id="store-offers"
            title={locale === "nl" ? `${store.name} aanbiedingen & kortingscodes` : `${store.name} coupons & deals`}
            subtitle={locale === "nl" ? "Bekijk de voorwaarden en kies een aanbieding." : "Review the terms and choose an offer."}
          />
          {coupons.length + deals.length === 0 ? (
            <EmptyState title={dict.stores.empty} description={dict.store.noCoupons} />
          ) : (
            <div className="overflow-hidden rounded-xl border border-ink-200 bg-white shadow-card">
              {[...coupons, ...deals].map((offer) => (
                <MerchantOfferRow key={offer.id} offer={offer} locale={locale} dict={dict} />
              ))}
            </div>
          )}
        </section>
          </div>
        </div>

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
