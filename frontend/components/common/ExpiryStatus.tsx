import type { Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import type { ExpiryInfo } from "@/lib/expiry";
import { formatDateShort, interpolate } from "@/lib/date";
import { ClockIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

interface ExpiryStatusProps {
  info: ExpiryInfo;
  locale: Locale;
  dict: Dictionary;
  className?: string;
}

/** Pure presentation shared by the server indicator and the client reveal dialog. */
export function ExpiryStatus({ info, locale, dict, className }: ExpiryStatusProps) {
  if (info.isUnknown) {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-xs text-ink-500", className)}>
        <ClockIcon size={14} />
        {dict.common.expiresUnknown}
      </span>
    );
  }

  if (info.isExpired) {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold text-danger-600", className)}>
        <ClockIcon size={14} />
        {dict.common.expired}
      </span>
    );
  }

  if (info.isToday) {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold text-accent-600", className)}>
        <ClockIcon size={14} />
        {dict.common.expiresToday}
      </span>
    );
  }

  if ((info.daysLeft ?? 99) <= 7) {
    return (
      <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold text-accent-600", className)}>
        <ClockIcon size={14} />
        {interpolate(dict.common.daysLeft, { n: info.daysLeft ?? 0 })}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs text-ink-500", className)}>
      <ClockIcon size={14} />
      {dict.common.expires} {formatDateShort(info.expiresAt!, locale)}
    </span>
  );
}
