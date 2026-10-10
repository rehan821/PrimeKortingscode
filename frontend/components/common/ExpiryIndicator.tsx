import type { Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { getExpiryInfo } from "@/lib/expiry";
import { ExpiryStatus } from "./ExpiryStatus";

interface ExpiryIndicatorProps {
  expiresAt?: string;
  locale: Locale;
  dict: Dictionary;
  className?: string;
}

/** Server-only time calculation; the presentation itself is a sync component. */
export async function ExpiryIndicator({ expiresAt, locale, dict, className }: ExpiryIndicatorProps) {
  const info = await getExpiryInfo(expiresAt);
  return <ExpiryStatus info={info} locale={locale} dict={dict} className={className} />;
}
