import Link from "next/link";
import type { Locale, StoreSummary } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { pathFor } from "@/lib/routes";
import { interpolate } from "@/lib/date";
import { formatDateShort } from "@/lib/date";

/** StoreCard accepts the shared summary shape; counts are optional. */
interface StoreCardData extends StoreSummary {
  activeCouponCount?: number;
  activeDealCount?: number;
  updatedAt?: string;
}

interface StoreCardProps {
  store: StoreCardData;
  locale: Locale;
  dict: Dictionary;
  showUpdatedAt?: boolean;
}

/** Store tile — logo, name and active-offer count. */
export function StoreCard({ store, locale, dict, showUpdatedAt = false }: StoreCardProps) {
  const offers = (store.activeCouponCount ?? 0) + (store.activeDealCount ?? 0);

  return (
    <Link
      href={pathFor(locale, "store", store.slug)}
      className="group flex min-h-[96px] flex-col items-center justify-center gap-2 rounded-lg border border-ink-200 border-t-2 bg-white px-3 py-3 text-center transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card"
      style={store.brandColor ? { borderTopColor: store.brandColor } : undefined}
    >
      <div className="min-w-0 flex-1">
        <h3 className="max-w-full truncate text-sm font-extrabold text-ink-900 group-hover:text-brand-700">
          {store.name}
        </h3>
        <p className="text-[11px] font-medium text-ink-500">
          {showUpdatedAt && store.updatedAt
            ? `${locale === "nl" ? "Bijgewerkt" : "Updated"} ${formatDateShort(store.updatedAt, locale)}`
            : offers === 1
            ? dict.stores.offersOne
            : interpolate(dict.stores.offersMany, { n: offers })}
        </p>
      </div>
    </Link>
  );
}
