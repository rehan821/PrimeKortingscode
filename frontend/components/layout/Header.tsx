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

interface HeaderProps {
  locale: Locale;
  dict: Dictionary;
}

/**
 * Site header — sticky, two-row layout.
 * Row 1: Logo + Search + Language + Mobile trigger.
 * Row 2 (desktop): Primary navigation links.
 */
export function Header({ locale, dict }: HeaderProps) {
  const items = getNavItems(locale, dict);
  const target = otherLocale(locale);

  return (
    <header className="sticky top-0 z-40 w-full">
      {siteConfig.showDemoNotice ? (
        <div className="bg-brand-900 px-4 py-1.5 text-center text-[11px] font-medium text-brand-200 sm:text-xs">
          {dict.common.demoNotice}
        </div>
      ) : null}

      {/* Primary bar */}
      <div className="border-b border-ink-200 bg-white">
        <div className="shell flex h-[60px] items-center gap-4">
          <Logo locale={locale} className="shrink-0" />

          <div className="mx-auto hidden max-w-lg flex-1 md:block">
            <SearchForm
              locale={locale}
              dict={dict}
              id="header-search"
            />
          </div>

          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <LanguageSwitcher
              locale={locale}
              label={dict.header.switchTo[target]}
              className="hidden h-9 items-center gap-1.5 rounded-lg border border-ink-200 px-3 text-xs font-bold text-ink-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 md:inline-flex transition-colors"
            />
            <MobileNav locale={locale} dict={dict} items={items} />
          </div>
        </div>
      </div>

      {/* Navigation bar — desktop only */}
      <div className="hidden border-b border-brand-800 bg-brand-800 md:block">
        <div className="shell">
          <NavLinks items={items} label={dict.header.navLabel} />
        </div>
      </div>
    </header>
  );
}
