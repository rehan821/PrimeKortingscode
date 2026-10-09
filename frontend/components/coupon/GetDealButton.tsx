import type { Dictionary } from "@/i18n/dictionary";
import { interpolate } from "@/lib/date";
import { safeRedirect } from "@/lib/url";
import { buttonClass, type ButtonSize, type ButtonVariant } from "@/components/ui/button";
import { ExternalLinkIcon, SparkIcon } from "@/components/ui/icons";

interface GetDealButtonProps {
  /** Raw destination from the deal model — validated before rendering. */
  redirectUrl: string;
  /** Fallback store page when the destination is invalid. */
  fallbackHref: string;
  storeName: string;
  dict: Dictionary;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

/**
 * "Deal bekijken" — a server-rendered anchor straight to the offer.
 * The URL is validated at render time; nothing is hardcoded in the UI.
 */
export function GetDealButton({
  redirectUrl,
  fallbackHref,
  storeName,
  dict,
  variant = "accent",
  size = "md",
  className,
}: GetDealButtonProps) {
  const destination = safeRedirect(redirectUrl) ?? fallbackHref;
  const isExternal = destination !== fallbackHref;

  return (
    <a
      href={destination}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer sponsored" : undefined}
      className={buttonClass(variant, size, className)}
    >
      {isExternal ? <ExternalLinkIcon size={16} /> : <SparkIcon size={16} />}
      {isExternal
        ? interpolate(dict.buttons.goToStore, { store: storeName })
        : dict.buttons.getDeal}
    </a>
  );
}
