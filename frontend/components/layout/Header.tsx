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

/** Site header: utility bar, logo, search, language switcher and navigation. */
export function Header({ locale, dict }: HeaderProps) {
  const items = getNavItems(locale, dict);
  const target = otherLocale(locale);

  return (
    <header className="relative z-40 bg-white">
      {siteConfig.showDemoNotice ? (
        <div className="bg-ink-900 px-4 py-1.5 text-center text-[11px] font-medium text-ink-300 sm:text-xs">
          {dict.common.demoNotice}
        </div>
      ) : null}

      <div className="border-b border-ink-200">
        <div className="shell flex h-16 items-center gap-3">
          <Logo locale={locale} className="shrink-0" />

          <SearchForm
            locale={locale}
            dict={dict}
            id="header-search"
            className="mx-auto hidden max-w-xl flex-1 md:block"
          />

          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <LanguageSwitcher
              locale={locale}
              label={dict.header.switchTo[target]}
              className="hidden h-10 items-center gap-1.5 rounded-lg border border-ink-200 px-3 text-xs font-bold text-ink-700 hover:border-ink-300 hover:bg-ink-50 md:inline-flex"
            />
            <MobileNav locale={locale} dict={dict} items={items} />
          </div>
        </div>
      </div>

      <div className="hidden border-b border-ink-100 md:block">
        <div className="shell">
          <NavLinks items={items} label={dict.header.navLabel} />
        </div>
      </div>
    </header>
  );
}
