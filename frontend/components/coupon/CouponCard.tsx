import Link from "next/link";
import type { CouponWithRelations, Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { pathFor } from "@/lib/routes";
import { ExpiryIndicator } from "@/components/common/ExpiryIndicator";
import { VerifiedBadge } from "@/components/common/VerifiedBadge";
import { GetCodeButton } from "./GetCodeButton";

interface CouponCardProps {
  coupon: CouponWithRelations;
  locale: Locale;
  dict: Dictionary;
}

/**
 * Coupon tile — emphasizes the discount, merchant identity, and code reveal CTA.
 * Server Component (only the button hydrates).
 */
export function CouponCard({ coupon, locale, dict }: CouponCardProps) {
  const storeHref = pathFor(locale, "store", coupon.store.slug);
  const couponHref = pathFor(locale, "coupon", coupon.slug);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-ink-200 bg-white shadow-card transition-all hover:border-brand-300 hover:shadow-pop">
      {/* Top band: store branding + verified badge */}
      <div className="flex items-center gap-3 border-b border-ink-100 bg-white px-4 py-3">
        <Link href={storeHref} className="flex min-w-0 items-center gap-2.5 transition-opacity hover:opacity-75">
          <span className="truncate text-sm font-extrabold text-ink-900">
            {coupon.store.name}
          </span>
        </Link>
        {coupon.isVerified ? (
          <VerifiedBadge text={dict.common.verified} className="ml-auto shrink-0" />
        ) : null}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Discount label + expiry */}
        <div className="flex min-h-7 flex-wrap items-center gap-2">
          {coupon.discountLabel ? (
            <span className="discount-pill text-sm">
              {coupon.discountLabel}
            </span>
          ) : null}
          <ExpiryIndicator
            expiresAt={coupon.expiresAt}
            locale={locale}
            dict={dict}
            className="ml-auto text-xs"
          />
        </div>

        {/* Title */}
        <h3 className="mt-3 text-[1.05rem] font-extrabold leading-snug text-ink-900">
          <Link href={couponHref} className="group-hover:text-brand-600">
            {coupon.title}
          </Link>
        </h3>

        {/* Description */}
        {coupon.description ? (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-600">
            {coupon.description}
          </p>
        ) : null}

        {/* CTA */}
        <div className="mt-auto pt-4">
          <GetCodeButton coupon={coupon} locale={locale} dict={dict} className="w-full" />
        </div>
      </div>
    </article>
  );
}
