import Link from "next/link";
import type { Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { otherLocale } from "@/i18n/config";
import { getNavItems } from "@/lib/navigation";
import { siteConfig } from "@/config/site";
import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNav } from "./MobileNav";
import { SearchForm } from "@/components/search/SearchForm";
import { pathFor } from "@/lib/routes";

interface HeaderProps {
  locale: Locale;
  dict: Dictionary;
}

/** Purple shopping navigation framed by the demo notice and offer ticker. */
export function Header({ locale, dict }: HeaderProps) {
  const items = getNavItems(locale, dict);
  const target = otherLocale(locale);

  return (
    <header className="sticky top-0 z-40 w-full">
      {siteConfig.showDemoNotice ? (
        <div className="bg-brand-900 px-4 py-2 text-center text-[11px] font-semibold tracking-wide text-white/90 sm:text-xs">
          {dict.common.demoNotice}
        </div>
      ) : null}

      <div className="border-b border-brand-900/30 bg-brand-700 text-white">
        <div className="shell flex min-h-[72px] items-center gap-4 py-2 lg:gap-6">
          <Logo locale={locale} tone="dark" className="shrink-0" />

          <div className="hidden min-w-0 flex-1 items-center justify-center gap-5 lg:flex xl:gap-7">
            <NavLinks items={items} label={dict.header.navLabel} />
            <div className="min-w-[220px] max-w-[390px] flex-1">
              <SearchForm locale={locale} dict={dict} id="header-search" variant="header" />
            </div>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
            <LanguageSwitcher
              locale={locale}
              label={dict.header.switchTo[target]}
              className="hidden h-9 items-center rounded-full border border-white/30 px-3 text-xs font-bold text-white transition hover:bg-white/10 lg:inline-flex"
            />
            <MobileNav locale={locale} dict={dict} items={items} />
          </div>
        </div>
      </div>

      <div className="border-b border-ink-200 bg-ink-50">
        <div className="shell flex min-h-10 items-center justify-center gap-3 px-4 text-center text-xs font-semibold text-ink-800 sm:text-sm">
          <span aria-hidden="true" className="hidden text-brand-700 sm:inline">‹</span>
          <span>{locale === "nl" ? "Vind automatisch de beste kortingscodes en aanbiedingen" : "Automatically find the best codes and deals for your cart"}</span>
          <Link href={pathFor(locale, "coupons")} className="hidden text-ink-950 underline underline-offset-2 sm:inline">{locale === "nl" ? "Bekijk kortingscodes" : "Browse offers"}</Link>
          <span aria-hidden="true" className="hidden text-brand-700 sm:inline">›</span>
        </div>
      </div>
    </header>
  );
}
