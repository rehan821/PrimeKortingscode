"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/types";
import { otherLocale } from "@/i18n/config";
import { localeShort } from "@/i18n/config";
import { pathFor, toPublicPathname, translatePath } from "@/lib/routes";
import { GlobeIcon } from "@/components/ui/icons";

interface LanguageSwitcherProps {
  locale: Locale;
  /** Accessible label, e.g. "Switch to English" — provided by the dictionary. */
  label: string;
  className?: string;
}

/**
 * Links to the equivalent page in the other locale (server-side hreflang
 * alternates exist too; this is the interactive control).
 */
export function LanguageSwitcher({ locale, label, className }: LanguageSwitcherProps) {
  const pathname = toPublicPathname(usePathname());
  const target = otherLocale(locale);
  const href = translatePath(pathname, target) ?? pathFor(target, "home");

  return (
    <Link
      href={href}
      hrefLang={target}
      lang={target}
      aria-label={label}
      title={label}
      className={
        className ??
        "inline-flex h-10 items-center gap-1.5 rounded-lg border border-ink-200 px-3 text-xs font-bold text-ink-700 hover:border-ink-300 hover:bg-ink-50"
      }
    >
      <GlobeIcon size={15} />
      {localeShort[target]}
    </Link>
  );
}
