"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import type { NavItem } from "@/lib/navigation";
import { CloseIcon, MenuIcon } from "@/components/ui/icons";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SearchForm } from "@/components/search/SearchForm";
import { cn } from "@/lib/cn";
import { toPublicPathname } from "@/lib/routes";

interface MobileNavProps {
  locale: Locale;
  dict: Dictionary;
  items: NavItem[];
}

/** Compact mobile navigation — the only nav-related client component. */
export function MobileNav({ locale, dict, items }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = toPublicPathname(usePathname());

  // Close the menu on navigation — adjusted during render instead of in an effect.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const target = locale === "nl" ? "en" : "nl";

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? dict.header.menuClose : dict.header.menuOpen}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-ink-200 text-ink-700 hover:bg-ink-50"
      >
        {open ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
      </button>

      <div
        id="mobile-menu"
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-ink-200 bg-white px-4 pb-5 pt-3 shadow-lg"
      >
        <SearchForm
          locale={locale}
          dict={dict}
          id="mobile-search"
          className="mb-3"
        />
        <nav aria-label={dict.header.navLabel} className="mb-4">
          <ul className="grid grid-cols-2 gap-1">
            {items.map((item) => (
              <li key={item.key}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-lg px-3 py-2.5 text-sm font-semibold text-ink-700 hover:bg-ink-50",
                    pathname === item.href && "bg-brand-50 text-brand-700",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center justify-between gap-3 border-t border-ink-100 pt-3">
          <span className="text-xs font-medium text-ink-400">{dict.header.language}</span>
          <LanguageSwitcher locale={locale} label={dict.header.switchTo[target]} />
        </div>
      </div>
    </div>
  );
}
