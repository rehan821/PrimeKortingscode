import Link from "next/link";
import type { Locale, StoreSummary } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { pathFor } from "@/lib/routes";
import { StoreLogo } from "@/components/store/StoreLogo";
import { interpolate } from "@/lib/date";

/** StoreCard accepts the shared summary shape; counts are optional. */
interface StoreCardData extends StoreSummary {
  activeCouponCount?: number;
  activeDealCount?: number;
}

interface StoreCardProps {
  store: StoreCardData;
  locale: Locale;
  dict: Dictionary;
}

/** Store tile — logo, name and active-offer count. */
export function StoreCard({ store, locale, dict }: StoreCardProps) {
  const offers = (store.activeCouponCount ?? 0) + (store.activeDealCount ?? 0);

  return (
    <Link
      href={pathFor(locale, "store", store.slug)}
      className="group flex items-center gap-3 rounded-xl border border-ink-200 bg-white p-3.5 shadow-card transition hover:border-brand-300 hover:shadow-pop"
    >
      <StoreLogo
        name={store.name}
        initials={store.initials}
        brandColor={store.brandColor}
        size="md"
      />
      <span className="min-w-0">
        <span className="block truncate text-sm font-bold text-ink-900 group-hover:text-brand-700">
          {store.name}
        </span>
        <span className="mt-0.5 block text-xs text-ink-500">
          {offers === 1
            ? dict.stores.offersOne
            : interpolate(dict.stores.offersMany, { n: offers })}
        </span>
      </span>
    </Link>
  );
}
