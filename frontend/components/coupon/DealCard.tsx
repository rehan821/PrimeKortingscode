import Link from "next/link";
import type { DealWithRelations, Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { pathFor } from "@/lib/routes";
import { StoreLogo } from "@/components/store/StoreLogo";
import { ExpiryIndicator, VerifiedBadge } from "@/components/common/Status";
import { GetDealButton } from "./GetDealButton";

interface DealCardProps {
  deal: DealWithRelations;
  locale: Locale;
  dict: Dictionary;
}

/** Deal tile — one click straight to the offer, no code required. */
export function DealCard({ deal, locale, dict }: DealCardProps) {
  const storeHref = pathFor(locale, "store", deal.store.slug);
  const dealHref = pathFor(locale, "deal", deal.slug);

  return (
    <article className="flex h-full flex-col rounded-2xl border border-ink-200 bg-white p-4 shadow-card transition hover:border-brand-300 hover:shadow-pop">
      <div className="flex items-center gap-3">
        <Link href={storeHref} className="group/store flex min-w-0 items-center gap-2.5">
          <StoreLogo
            name={deal.store.name}
            initials={deal.store.initials}
            brandColor={deal.store.brandColor}
            size="sm"
          />
          <span className="truncate text-sm font-semibold text-ink-700 group-hover/store:text-brand-700">
            {deal.store.name}
          </span>
        </Link>
        {deal.isVerified ? (
          <VerifiedBadge text={dict.common.verified} className="ml-auto shrink-0" />
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {deal.discountLabel ? (
          <span className="rounded-md bg-brand-50 px-2 py-1 text-xs font-bold text-brand-700">
            {deal.discountLabel}
          </span>
        ) : null}
        {deal.priceFrom ? (
          <span className="text-xs font-semibold text-ink-600">
            {deal.priceFrom}
            {deal.oldPrice ? (
              <span className="ml-1.5 font-normal text-ink-400 line-through">{deal.oldPrice}</span>
            ) : null}
          </span>
        ) : null}
        <ExpiryIndicator
          expiresAt={deal.expiresAt}
          locale={locale}
          dict={dict}
          className="ml-auto"
        />
      </div>

      <h3 className="mt-2.5 text-[0.95rem] font-bold leading-snug text-ink-900">
        <Link href={dealHref} className="hover:text-brand-700">
          {deal.title}
        </Link>
      </h3>
      {deal.description ? (
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink-500">{deal.description}</p>
      ) : null}

      <div className="mt-auto pt-4">
        <GetDealButton
          redirectUrl={deal.redirectUrl}
          fallbackHref={storeHref}
          storeName={deal.store.name}
          dict={dict}
          className="w-full"
        />
      </div>
    </article>
  );
}
