import { notFound } from "next/navigation";
import type { Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { getCouponBySlug, getCouponsByStore } from "@/services/coupons";
import { pathFor } from "@/lib/routes";
import { interpolate } from "@/lib/date";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { StoreLogo } from "@/components/store/StoreLogo";
import { CouponCard } from "@/components/coupon/CouponCard";
import { GetCodeButton } from "@/components/coupon/GetCodeButton";
import { ExpiryIndicator, VerifiedBadge } from "@/components/common/Status";
import { SectionHeading, EmptyState } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";

interface CouponDetailPageProps {
  locale: Locale;
  dict: Dictionary;
  slug: string;
}

/** Coupon detail — full offer, reveal action, terms and related codes. */
export async function CouponDetailPage({ locale, dict, slug }: CouponDetailPageProps) {
  const coupon = await getCouponBySlug(slug, locale);
  if (!coupon) notFound();

  const related = (await getCouponsByStore(coupon.store.id, locale, 7)).filter(
    (item) => item.id !== coupon.id,
  );

  const couponPath = pathFor(locale, "coupon", coupon.slug);
  const homePath = pathFor(locale, "home");
  const couponsPath = pathFor(locale, "coupons");

  const crumbs = [
    { name: dict.common.home, path: homePath },
    { name: dict.coupons.title, path: couponsPath },
    { name: coupon.title, path: couponPath },
  ];

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
      <div className="shell py-6 sm:py-8">
        <Breadcrumbs
          label={dict.breadcrumb.label}
          items={[
            { label: dict.common.home, path: homePath },
            { label: dict.coupons.title, path: couponsPath },
            { label: coupon.title },
          ]}
        />

        <article className="mx-auto max-w-3xl">
          <div className="flex items-center gap-3">
            <StoreLogo
              name={coupon.store.name}
              initials={coupon.store.initials}
              brandColor={coupon.store.brandColor}
              size="md"
            />
            <div>
              <p className="font-bold text-ink-900">{coupon.store.name}</p>
              <div className="mt-0.5 flex flex-wrap items-center gap-2">
                {coupon.isVerified ? <VerifiedBadge text={dict.common.verified} /> : null}
                <ExpiryIndicator expiresAt={coupon.expiresAt} locale={locale} dict={dict} />
              </div>
            </div>
          </div>

          <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
            {coupon.title}
          </h1>
          {coupon.discountLabel ? (
            <p className="mt-2 inline-flex rounded-md bg-accent-50 px-2.5 py-1 text-sm font-bold text-accent-700">
              {coupon.discountLabel}
            </p>
          ) : null}

          {coupon.description ? (
            <p className="mt-4 text-base leading-relaxed text-ink-600">{coupon.description}</p>
          ) : null}

          {coupon.usageCount ? (
            <p className="mt-2 text-sm text-ink-500">
              {interpolate(dict.coupons.usedTimes, { n: coupon.usageCount })}
            </p>
          ) : null}

          <div className="mt-6 rounded-2xl border border-brand-200 bg-brand-50/60 p-5">
            <p className="text-sm font-bold text-ink-900">{dict.coupons.aboutTitle}</p>
            <p className="mt-1 text-sm text-ink-600">{dict.coupon.modalSubtitle}</p>
            <div className="mt-4">
              <GetCodeButton coupon={coupon} locale={locale} dict={dict} className="w-full sm:w-auto" />
            </div>
          </div>

          {coupon.termsAndConditions ? (
            <section className="mt-8" aria-labelledby="coupon-terms">
              <h2 id="coupon-terms" className="text-lg font-bold text-ink-900">
                {dict.coupons.termsTitle}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                {coupon.termsAndConditions}
              </p>
            </section>
          ) : null}

          <p className="mt-6 text-xs text-ink-400">{dict.common.demoNotice}</p>
        </article>

        <section className="mt-10" aria-labelledby="coupon-related">
          <SectionHeading id="coupon-related" title={dict.blog.related} />
          {related.length === 0 ? (
            <EmptyState title={dict.common.noResults} description={dict.coupons.empty} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <CouponCard key={item.id} coupon={item} locale={locale} dict={dict} />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  );
}
