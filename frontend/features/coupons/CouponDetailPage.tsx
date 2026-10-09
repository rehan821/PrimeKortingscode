import { notFound } from "next/navigation";
import type { Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { getCouponBySlug, getCouponsByStore } from "@/services/coupons";
import { pathFor } from "@/lib/routes";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { CouponCard } from "@/components/coupon/CouponCard";
import { GetCodeButton } from "@/components/coupon/GetCodeButton";
import { ExpiryIndicator } from "@/components/common/ExpiryIndicator";
import { VerifiedBadge } from "@/components/common/VerifiedBadge";
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
          {/* Store header with brand styling */}
          <div className="overflow-hidden rounded-xl border border-ink-200 bg-white shadow-card">
            <div className="flex items-center gap-4 border-b border-ink-100 bg-ink-50 px-6 py-5">
              <div className="min-w-0 flex-1">
                <p className="text-lg font-black text-ink-900">{coupon.store.name}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2.5">
                  {coupon.isVerified ? <VerifiedBadge text={dict.common.verified} /> : null}
                  <ExpiryIndicator expiresAt={coupon.expiresAt} locale={locale} dict={dict} />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6 sm:px-8">
              <h1 className="text-3xl font-black tracking-tight text-ink-900 sm:text-4xl">
                {coupon.title}
              </h1>
              {coupon.discountLabel ? (
                <p className="discount-pill mt-4 inline-flex text-base font-black">
                  {coupon.discountLabel}
                </p>
              ) : null}

              {coupon.description ? (
                <p className="mt-5 text-base leading-relaxed text-ink-700">{coupon.description}</p>
              ) : null}

              <div className="mt-8 rounded-lg border border-brand-200 bg-brand-50 p-5">
                <p className="text-base font-black text-ink-900">{dict.coupons.aboutTitle}</p>
                <p className="mt-1.5 text-sm text-ink-600">{dict.coupon.modalSubtitle}</p>
                <div className="mt-5">
                  <GetCodeButton coupon={coupon} locale={locale} dict={dict} className="w-full sm:w-auto" />
                </div>
              </div>
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
