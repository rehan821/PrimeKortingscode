import Link from "next/link";
import type { CouponWithRelations, DealWithRelations, Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { pathFor } from "@/lib/routes";
import { ExpiryIndicator } from "@/components/common/ExpiryIndicator";
import { GetCodeButton } from "./GetCodeButton";
import { GetDealButton } from "./GetDealButton";

type Offer = CouponWithRelations | DealWithRelations;

interface MerchantOfferRowProps {
  offer: Offer;
  locale: Locale;
  dict: Dictionary;
}

/** Horizontal offer row used on merchant pages, matching the reference layout. */
export function MerchantOfferRow({ offer, locale, dict }: MerchantOfferRowProps) {
  const isDeal = offer.type === "deal";
  const priceFrom = "priceFrom" in offer ? offer.priceFrom : undefined;
  const oldPrice = "oldPrice" in offer ? offer.oldPrice : undefined;
  const storeHref = pathFor(locale, "store", offer.store.slug);
  const detailHref = isDeal
    ? pathFor(locale, "deal", offer.slug)
    : pathFor(locale, "coupon", offer.slug);

  return (
    <article className="grid gap-x-5 gap-y-3 border-b border-ink-200 bg-white px-4 py-5 sm:grid-cols-[132px_minmax(0,1fr)_170px] sm:items-center sm:px-5">
      <div className="flex items-center gap-3 sm:block sm:text-center">
        <span className="min-w-[100px] text-2xl font-black leading-none text-brand-700 sm:block sm:text-[1.7rem]">
          {offer.discountLabel ?? (isDeal ? (locale === "nl" ? "Aanbieding" : "Offer") : (locale === "nl" ? "Code" : "Code"))}
        </span>
        <span className="mt-2 inline-flex rounded-sm bg-ink-100 px-2 py-1 text-[0.65rem] font-extrabold uppercase tracking-wider text-ink-700 sm:mt-3">
          {isDeal ? (locale === "nl" ? "Sale" : "Sale") : (locale === "nl" ? "Code" : "Code")}
        </span>
      </div>

      <div className="min-w-0">
        <h2 className="text-lg font-extrabold leading-snug text-ink-950 sm:text-xl">
          <Link href={detailHref} className="hover:text-brand-700">{offer.title}</Link>
        </h2>
        {offer.description ? <p className="mt-1 line-clamp-2 text-sm leading-5 text-ink-600">{offer.description}</p> : null}
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-500">
          <ExpiryIndicator expiresAt={offer.expiresAt} locale={locale} dict={dict} className="text-xs" />
          {priceFrom ? <span>{priceFrom}{oldPrice ? <span className="ml-2 line-through">{oldPrice}</span> : null}</span> : null}
        </div>
        {offer.termsAndConditions ? (
          <details className="mt-2 text-xs text-ink-500">
            <summary className="w-fit cursor-pointer font-semibold text-ink-600 underline decoration-ink-300 underline-offset-2">
              {locale === "nl" ? "Voorwaarden" : "Terms and conditions"}
            </summary>
            <p className="mt-2 max-w-2xl leading-5">{offer.termsAndConditions}</p>
          </details>
        ) : null}
      </div>

      {isDeal ? (
        <GetDealButton redirectUrl={offer.redirectUrl} fallbackHref={storeHref} storeName={offer.store.name} dict={dict} variant="primary" className="w-full sm:justify-center" />
      ) : (
        <GetCodeButton coupon={offer as CouponWithRelations} locale={locale} dict={dict} variant="primary" className="w-full sm:justify-center" />
      )}
    </article>
  );
}
