import type { Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { formatDateShort, interpolate } from "@/lib/date";
import { getExpiryInfo } from "@/lib/expiry";
import { Badge } from "@/components/ui/Badge";
import { CheckBadgeIcon, ClockIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export function VerifiedBadge({ text, className }: { text: string; className?: string }) {
  return (
    <Badge variant="verified" className={className}>
      <CheckBadgeIcon size={12} strokeWidth={2.2} />
      {text}
    </Badge>
  );
}

interface ExpiryIndicatorProps {
  expiresAt?: string;
  locale: Locale;
  dict: Dictionary;
  className?: string;
}

/**
 * Shows how long an offer still has left.
 * Pure server-side computation — no client JS.
 */
export async function ExpiryIndicator({ expiresAt, locale, dict, className }: ExpiryIndicatorProps) {
  const info = await getExpiryInfo(expiresAt);

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
      {dict.common.expires} {formatDateShort(expiresAt!, locale)}
    </span>
  );
}
