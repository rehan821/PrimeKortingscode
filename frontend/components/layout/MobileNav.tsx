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
import type { NavigationMenus } from "./NavLinks";

interface MobileNavProps {
  locale: Locale;
  dict: Dictionary;
  items: NavItem[];
  menus: NavigationMenus;
}

/** Compact mobile navigation — the only nav-related client component. */
export function MobileNav({ locale, dict, items, menus }: MobileNavProps) {
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
        className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/60 bg-white/10 text-white shadow-sm transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-700"
      >
        {open ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
      </button>

      <div
        id="mobile-menu"
        hidden={!open}
        className="absolute inset-x-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto border-b border-ink-200 bg-white px-4 pb-5 pt-3 shadow-lg"
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
        <div className="space-y-2 border-t border-ink-100 pt-3">
          <details className="group rounded-lg border border-ink-100">
            <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-3 text-sm font-bold text-ink-900 marker:hidden">
              {locale === "nl" ? "Winkels & categorieën" : "Stores & Categories"}
              <span aria-hidden="true" className="text-lg leading-none group-open:rotate-45">+</span>
            </summary>
            <div className="grid grid-cols-2 gap-x-3 border-t border-ink-100 px-3 py-2">
              {menus.storeCategories.map((category) => (
                <Link key={category.key} href={category.href} onClick={() => setOpen(false)} className="rounded-md py-2 text-sm text-ink-700 hover:text-brand-700">
                  {category.label}
                </Link>
              ))}
              <Link href={menus.allCategories.href} onClick={() => setOpen(false)} className="py-2 text-sm font-bold text-brand-700">
                {menus.allCategories.label}
              </Link>
              <Link href={menus.allStores.href} onClick={() => setOpen(false)} className="py-2 text-sm font-bold text-brand-700">
                {menus.allStores.label}
              </Link>
              {menus.stores.map((store) => (
                <Link key={store.href} href={store.href} onClick={() => setOpen(false)} className="rounded-md py-2 text-sm text-ink-700 hover:text-brand-700">
                  {store.label}
                </Link>
              ))}
            </div>
          </details>
          <details className="group rounded-lg border border-ink-100">
            <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-3 text-sm font-bold text-ink-900 marker:hidden">
              {locale === "nl" ? "Blog" : "Blog & Articles"}
              <span aria-hidden="true" className="text-lg leading-none group-open:rotate-45">+</span>
            </summary>
            <div className="grid grid-cols-2 gap-x-3 border-t border-ink-100 px-3 py-2">
              {menus.blogCategories.map((category) => (
                <Link key={category.key} href={category.href} onClick={() => setOpen(false)} className="rounded-md py-2 text-sm text-ink-700 hover:text-brand-700">
                  {category.label}
                </Link>
              ))}
              <Link href={menus.allArticles.href} onClick={() => setOpen(false)} className="py-2 text-sm font-bold text-brand-700">
                {menus.allArticles.label}
              </Link>
              {menus.posts.map((post) => (
                <Link key={post.href} href={post.href} onClick={() => setOpen(false)} className="rounded-md py-2 text-sm text-ink-700 hover:text-brand-700">
                  {post.label}
                </Link>
              ))}
            </div>
          </details>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-ink-100 pt-3">
          <span className="text-xs font-medium text-ink-400">{dict.header.language}</span>
          <LanguageSwitcher locale={locale} label={dict.header.switchTo[target]} />
        </div>
      </div>
    </div>
  );
}
