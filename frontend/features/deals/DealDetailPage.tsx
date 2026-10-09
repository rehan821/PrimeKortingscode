import { notFound } from "next/navigation";
import type { Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { getDealBySlug, getDealsByStore } from "@/services/deals";
import { pathFor } from "@/lib/routes";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { DealCard } from "@/components/coupon/DealCard";
import { GetDealButton } from "@/components/coupon/GetDealButton";
import { ExpiryIndicator } from "@/components/common/ExpiryIndicator";
import { VerifiedBadge } from "@/components/common/VerifiedBadge";
import { SectionHeading, EmptyState } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";

interface DealDetailPageProps {
  locale: Locale;
  dict: Dictionary;
  slug: string;
}

/** Deal detail — full offer, direct link, terms and related deals. */
export async function DealDetailPage({ locale, dict, slug }: DealDetailPageProps) {
  const deal = await getDealBySlug(slug, locale);
  if (!deal) notFound();

  const related = (await getDealsByStore(deal.store.id, locale, 7)).filter(
    (item) => item.id !== deal.id,
  );

  const dealPath = pathFor(locale, "deal", deal.slug);
  const homePath = pathFor(locale, "home");
  const dealsPath = pathFor(locale, "deals");

  const crumbs = [
    { name: dict.common.home, path: homePath },
    { name: dict.deals.title, path: dealsPath },
    { name: deal.title, path: dealPath },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <div className="shell py-6 sm:py-8">
        <Breadcrumbs
          label={dict.breadcrumb.label}
          items={[
            { label: dict.common.home, path: homePath },
            { label: dict.deals.title, path: dealsPath },
            { label: deal.title },
          ]}
        />

        <article className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3">
            <div>
              <p className="font-bold text-ink-900">{deal.store.name}</p>
              <div className="mt-0.5 flex flex-wrap items-center gap-2">
                {deal.isVerified ? <VerifiedBadge text={dict.common.verified} /> : null}
                <ExpiryIndicator expiresAt={deal.expiresAt} locale={locale} dict={dict} />
              </div>
            </div>
          </div>

          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
            {deal.title}
          </h1>
          {deal.discountLabel || deal.priceFrom ? (
            <p className="mt-2 flex flex-wrap items-center gap-2 text-sm font-bold text-accent-700">
              {deal.discountLabel ? (
                <span className="inline-flex rounded-md bg-accent-50 px-2.5 py-1">
                  {deal.discountLabel}
                </span>
              ) : null}
              {deal.priceFrom ? (
                <span>
                  {deal.priceFrom}
                  {deal.oldPrice ? (
                    <span className="ml-1.5 font-normal text-ink-400 line-through">
                      {deal.oldPrice}
                    </span>
                  ) : null}
                </span>
              ) : null}
            </p>
          ) : null}

          {deal.description ? (
            <p className="mt-4 text-base leading-relaxed text-ink-600">{deal.description}</p>
          ) : null}

          <div className="mt-6 rounded-2xl border border-brand-200 bg-brand-50/60 p-5">
            <p className="text-sm font-bold text-ink-900">{dict.deal.aboutTitle}</p>
            <div className="mt-4">
              <GetDealButton
                redirectUrl={deal.redirectUrl}
                fallbackHref={pathFor(locale, "store", deal.store.slug)}
                storeName={deal.store.name}
                dict={dict}
                className="w-full sm:w-auto"
              />
            </div>
          </div>

          {deal.termsAndConditions ? (
            <section className="mt-8" aria-labelledby="deal-terms">
              <h2 id="deal-terms" className="text-lg font-bold text-ink-900">
                {dict.deal.termsTitle}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                {deal.termsAndConditions}
              </p>
            </section>
          ) : null}

          <p className="mt-6 text-xs text-ink-400">{dict.common.demoNotice}</p>
        </article>

        <section className="mt-10" aria-labelledby="deal-related">
          <SectionHeading id="deal-related" title={dict.blog.related} />
          {related.length === 0 ? (
            <EmptyState title={dict.common.noResults} description={dict.deals.empty} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <DealCard key={item.id} deal={item} locale={locale} dict={dict} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
