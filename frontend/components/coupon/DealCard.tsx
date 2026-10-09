import Link from "next/link";
import type { DealWithRelations, Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { pathFor } from "@/lib/routes";
import { ExpiryIndicator } from "@/components/common/ExpiryIndicator";
import { VerifiedBadge } from "@/components/common/VerifiedBadge";
import { GetDealButton } from "./GetDealButton";

interface DealCardProps {
  deal: DealWithRelations;
  locale: Locale;
  dict: Dictionary;
  /** Large hero variant for homepage featured deal */
  featured?: boolean;
}

/** Deal tile — one click straight to the offer, no code required. */
export function DealCard({ deal, locale, dict, featured = false }: DealCardProps) {
  const storeHref = pathFor(locale, "store", deal.store.slug);
  const dealHref = pathFor(locale, "deal", deal.slug);

  if (featured) {
    return (
      <article className="flex h-full flex-col rounded-lg border border-ink-200 bg-white shadow-card transition hover:border-brand-300 hover:shadow-pop">
        {/* Brand bar */}
        <div className="flex items-center justify-between border-b border-ink-100 bg-white px-5 py-3">
          <Link href={storeHref} className="group/store flex items-center gap-3.5">
            <span className="text-lg font-bold text-ink-900 group-hover/store:text-brand-700">
              {deal.store.name}
            </span>
          </Link>
          {deal.isVerified ? (
            <VerifiedBadge text={dict.common.verified} className="shrink-0" />
          ) : null}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5">
          <div className="flex flex-wrap items-center gap-3">
            {deal.discountLabel ? (
              <span className="discount-pill text-base font-black">
                {deal.discountLabel}
              </span>
            ) : null}
            {deal.priceFrom ? (
              <span className="text-base font-bold text-ink-700">
                {deal.priceFrom}
                {deal.oldPrice ? (
                  <span className="ml-2 text-sm font-normal text-ink-400 line-through">{deal.oldPrice}</span>
                ) : null}
              </span>
            ) : null}
          </div>

          <h3 className="mt-4 text-2xl font-black leading-tight text-ink-900 sm:text-3xl">
            <Link href={dealHref} className="hover:text-brand-700">
              {deal.title}
            </Link>
          </h3>
          {deal.description ? (
            <p className="mt-3 line-clamp-3 text-base leading-relaxed text-ink-600">
              {deal.description}
            </p>
          ) : null}

          <div className="mt-auto flex items-center justify-between gap-4 pt-6">
            <ExpiryIndicator
              expiresAt={deal.expiresAt}
              locale={locale}
              dict={dict}
            />
            <GetDealButton
              redirectUrl={deal.redirectUrl}
              fallbackHref={storeHref}
              storeName={deal.store.name}
              dict={dict}
              className="min-w-[200px]"
            />
          </div>
        </div>
      </article>
    );
  }

  // Default variant
  return (
    <article className="flex h-full flex-col rounded-lg border border-ink-200 bg-white shadow-card transition hover:border-brand-300 hover:shadow-pop">
      {/* Brand bar */}
      <div className="flex items-center justify-between border-b border-ink-100 bg-white px-4 py-3">
        <Link href={storeHref} className="group/store flex min-w-0 items-center gap-2.5">
          <span className="truncate text-sm font-bold text-ink-900 group-hover/store:text-brand-700">
            {deal.store.name}
          </span>
        </Link>
        {deal.isVerified ? (
          <VerifiedBadge text={dict.common.verified} className="shrink-0" />
        ) : null}
      </div>

      {/* Content */}
        <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center gap-2">
          {deal.discountLabel ? (
            <span className="discount-pill text-xs font-black">
              {deal.discountLabel}
            </span>
          ) : null}
          {deal.priceFrom ? (
            <span className="text-sm font-bold text-ink-700">
              {deal.priceFrom}
              {deal.oldPrice ? (
                <span className="ml-1.5 text-xs font-normal text-ink-400 line-through">{deal.oldPrice}</span>
              ) : null}
            </span>
          ) : null}
        </div>

        <h3 className="mt-2.5 text-base font-bold leading-snug text-ink-900">
          <Link href={dealHref} className="hover:text-brand-700">
            {deal.title}
          </Link>
        </h3>
        {deal.description ? (
          <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink-600">
            {deal.description}
          </p>
        ) : null}

        <div className="mt-auto flex items-center justify-between gap-3 pt-4">
          <ExpiryIndicator
            expiresAt={deal.expiresAt}
            locale={locale}
            dict={dict}
            className="text-xs"
          />
          <GetDealButton
            redirectUrl={deal.redirectUrl}
            fallbackHref={storeHref}
            storeName={deal.store.name}
            dict={dict}
            className="ml-auto"
          />
        </div>
      </div>
    </article>
  );
}
