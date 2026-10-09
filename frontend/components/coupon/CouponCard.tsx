import Link from "next/link";
import type { CouponWithRelations, Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { pathFor } from "@/lib/routes";
import { StoreLogo } from "@/components/store/StoreLogo";
import { ExpiryIndicator, VerifiedBadge } from "@/components/common/Status";
import { GetCodeButton } from "./GetCodeButton";

interface CouponCardProps {
  coupon: CouponWithRelations;
  locale: Locale;
  dict: Dictionary;
}

/**
 * Coupon tile. The card itself is a Server Component — only the
 * "Code bekijken" button (which opens the modal) hydrates.
 */
export function CouponCard({ coupon, locale, dict }: CouponCardProps) {
  const storeHref = pathFor(locale, "store", coupon.store.slug);
  const couponHref = pathFor(locale, "coupon", coupon.slug);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-ink-200 bg-white p-4 shadow-card transition hover:border-brand-300 hover:shadow-pop">
      <div className="flex items-center gap-3">
        <Link href={storeHref} className="group/store flex min-w-0 items-center gap-2.5">
          <StoreLogo
            name={coupon.store.name}
            initials={coupon.store.initials}
            brandColor={coupon.store.brandColor}
            size="sm"
          />
          <span className="truncate text-sm font-semibold text-ink-700 group-hover/store:text-brand-700">
            {coupon.store.name}
          </span>
        </Link>
        {coupon.isVerified ? (
          <VerifiedBadge text={dict.common.verified} className="ml-auto shrink-0" />
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {coupon.discountLabel ? (
          <span className="rounded-md bg-accent-50 px-2 py-1 text-xs font-bold text-accent-700">
            {coupon.discountLabel}
          </span>
        ) : null}
        <ExpiryIndicator
          expiresAt={coupon.expiresAt}
          locale={locale}
          dict={dict}
          className="ml-auto"
        />
      </div>

      <h3 className="mt-2.5 text-[0.95rem] font-bold leading-snug text-ink-900">
        <Link href={couponHref} className="hover:text-brand-700">
          {coupon.title}
        </Link>
      </h3>
      {coupon.description ? (
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink-500">
          {coupon.description}
        </p>
      ) : null}

      <div className="mt-auto pt-4">
        <GetCodeButton coupon={coupon} locale={locale} dict={dict} className="w-full" />
      </div>
    </article>
  );
}
