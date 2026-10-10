"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import type { NavItem } from "@/lib/navigation";
import { ChevronDownIcon } from "@/components/ui/icons";
import { toPublicPathname } from "@/lib/routes";

export interface NavMenuLink {
  label: string;
  href: string;
}

export interface NavMenuCategory extends NavMenuLink {
  key: string;
  links: NavMenuLink[];
}

export interface NavigationMenus {
  homeHref: string;
  storeCategories: NavMenuCategory[];
  stores: NavMenuLink[];
  allCategories: NavMenuLink;
  allStores: NavMenuLink;
  blogCategories: NavMenuCategory[];
  posts: NavMenuLink[];
  allArticles: NavMenuLink;
}

/** Desktop primary navigation with category-aware Stores and Blog menus. */
export function NavLinks({
  items,
  label,
  menus,
  className,
}: {
  items: NavItem[];
  label: string;
  menus: NavigationMenus;
  className?: string;
}) {
  const pathname = toPublicPathname(usePathname());
  const categories = items.find((item) => item.key === "categories");
  const primary = ["deals", "stores", "coupons", "blog"]
    .map((key) => items.find((item) => item.key === key))
    .filter((item): item is NavItem => Boolean(item));
  const isDutch = menus.homeHref === "/";
  const [activeStoreCategory, setActiveStoreCategory] = useState<string | null>(null);
  const [activeBlogCategory, setActiveBlogCategory] = useState<string | null>(null);
  const selectedStoreCategory = menus.storeCategories.find((category) => category.key === activeStoreCategory);
  const selectedBlogCategory = menus.blogCategories.find((category) => category.key === activeBlogCategory);
  const categoryPanelClass = "flex min-h-0 flex-col";
  const panelScrollClass = "min-h-0 flex-1 overflow-y-auto p-2.5";
  const footerLinkClass = "shrink-0 border-t border-ink-100 bg-white px-4 py-3 text-base font-extrabold text-brand-700 hover:bg-brand-50";

  return (
    <nav aria-label={label} className={className}>
      <ul className="flex items-center gap-1">
        {primary.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          if (item.key === "stores" || item.key === "blog") {
            const isStores = item.key === "stores";
            const subItem = isStores ? categories : undefined;
            const selectedPath = subItem && (pathname === subItem.href || pathname.startsWith(`${subItem.href}/`));
            return (
              <li key={item.key} className="relative">
                <details
                  className="group relative"
                  onMouseEnter={(event) => { event.currentTarget.open = true; }}
                  onMouseLeave={(event) => { event.currentTarget.open = false; }}
                >
                  <summary
                    onMouseEnter={() => isStores ? setActiveStoreCategory(null) : setActiveBlogCategory(null)}
                    className={cn(
                      "inline-flex h-11 cursor-pointer list-none items-center gap-1.5 rounded-full px-4 text-[13px] font-bold text-white/95 transition hover:bg-white/10 hover:text-white marker:hidden",
                      active || selectedPath ? "border border-white/15 bg-white/10" : "border border-transparent",
                    )}
                  >
                    {isStores ? (isDutch ? "Winkels" : "Stores") : item.label}
                    <ChevronDownIcon size={14} className="transition group-open:rotate-180" />
                  </summary>
                  <span aria-hidden="true" className="absolute left-0 right-0 top-full z-[69] h-6" />
                  <div
                    className={cn(
                      "absolute left-[-1rem] top-[calc(100%_+_1.5rem)] z-[70] overflow-hidden rounded-xl border border-ink-200 bg-white text-ink-900 shadow-[0_12px_34px_rgba(27,23,34,.2)]",
                      isStores ? "w-[min(24rem,calc(100vw-2rem))]" : "w-[min(30rem,calc(100vw-2rem))]",
                    )}
                  >
                    {isStores ? (
                      <div className="grid h-[72vh] min-h-[24rem] max-h-[44rem] grid-cols-[.72fr_1fr]">
                        <div className={cn(categoryPanelClass, "border-r border-ink-200")}>
                          <div className={panelScrollClass}>
                            <button
                              type="button"
                              onMouseEnter={() => setActiveStoreCategory(null)}
                              onFocus={() => setActiveStoreCategory(null)}
                              aria-pressed={activeStoreCategory === null}
                              className={cn(
                                "block w-full border-r-4 px-2 py-2.5 text-left text-base",
                                activeStoreCategory === null ? "border-brand-600 font-extrabold text-brand-700" : "border-transparent text-ink-800 hover:text-brand-700",
                              )}
                            >
                              {isDutch ? "Populair" : "Popular"}
                            </button>
                            <ul className="mt-1 space-y-0.5">
                              {menus.storeCategories.map((category) => (
                                <li key={category.key}>
                                  <Link
                                    href={category.href}
                                    onMouseEnter={() => setActiveStoreCategory(category.key)}
                                    onFocus={() => setActiveStoreCategory(category.key)}
                                    className={cn(
                                      "block border-r-4 px-2 py-2.5 text-base transition hover:bg-brand-50 hover:text-brand-700",
                                      activeStoreCategory === category.key ? "border-brand-600 bg-brand-50 font-extrabold text-brand-700" : "border-transparent text-ink-800",
                                    )}
                                  >
                                    {category.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <Link href={menus.allCategories.href} className={footerLinkClass}>
                            {menus.allCategories.label}
                          </Link>
                        </div>
                        <div className={categoryPanelClass}>
                          <div className={panelScrollClass}>
                            <ul className="space-y-0.5">
                              {(selectedStoreCategory?.links ?? menus.stores).map((store) => (
                                <li key={store.href}>
                                  <Link href={store.href} className="block rounded-md px-2 py-2.5 text-base text-ink-900 transition hover:bg-brand-50 hover:text-brand-700">
                                    {store.label}
                                  </Link>
                                </li>
                              ))}
                              {selectedStoreCategory?.links.length === 0 ? (
                                <li className="px-2 py-2.5 text-sm text-ink-500">{isDutch ? "Nog geen winkels in deze categorie" : "No stores in this category yet"}</li>
                              ) : null}
                            </ul>
                          </div>
                          <Link href={menus.allStores.href} className={footerLinkClass}>{menus.allStores.label}</Link>
                        </div>
                      </div>
                    ) : (
                      <div className="grid h-[24rem] min-h-[16rem] max-h-[70vh] grid-cols-[.6fr_1.4fr]">
                        <div className={cn(categoryPanelClass, "border-r border-ink-200")}>
                          <div className={panelScrollClass}>
                            <button
                              type="button"
                              onMouseEnter={() => setActiveBlogCategory(null)}
                              onFocus={() => setActiveBlogCategory(null)}
                              aria-pressed={activeBlogCategory === null}
                              className={cn(
                                "block w-full border-r-4 px-2 py-2.5 text-left text-base",
                                activeBlogCategory === null ? "border-brand-600 font-extrabold text-brand-700" : "border-transparent text-ink-800 hover:text-brand-700",
                              )}
                            >
                              {isDutch ? "Populair" : "Popular"}
                            </button>
                            <ul className="mt-1 space-y-0.5">
                              {menus.blogCategories.map((category) => (
                                <li key={category.key}>
                                  <Link
                                    href={category.href}
                                    onMouseEnter={() => setActiveBlogCategory(category.key)}
                                    onFocus={() => setActiveBlogCategory(category.key)}
                                    className={cn(
                                      "block border-r-4 px-2 py-2.5 text-base transition hover:bg-brand-50 hover:text-brand-700",
                                      activeBlogCategory === category.key ? "border-brand-600 bg-brand-50 font-extrabold text-brand-700" : "border-transparent text-ink-800",
                                    )}
                                  >
                                    {category.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className={categoryPanelClass}>
                          <div className={panelScrollClass}>
                            <ul className="space-y-0.5">
                              {(selectedBlogCategory?.links ?? menus.posts).map((post) => (
                                <li key={post.href}>
                                  <Link href={post.href} className="block rounded-md px-2 py-2.5 text-base font-semibold leading-snug text-ink-900 transition hover:bg-brand-50 hover:text-brand-700">
                                    {post.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                            {selectedBlogCategory?.links.length === 0 ? (
                              <p className="px-2 py-2.5 text-sm text-ink-500">{isDutch ? "Binnenkort meer artikelen" : "More articles coming soon"}</p>
                            ) : null}
                          </div>
                          <Link href={menus.allArticles.href} className={footerLinkClass}>{menus.allArticles.label}</Link>
                        </div>
                      </div>
                    )}
                  </div>
                </details>
              </li>
            );
          }

          return (
            <li key={item.key}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-11 items-center border-b-2 px-3 text-[13px] font-bold transition-colors",
                  active ? "border-white text-white" : "border-transparent text-white/90 hover:border-white/55 hover:text-white",
                )}
              >
                {item.key === "deals"
                  ? (item.label === "Aanbiedingen" ? "Najaarsdeals" : "Fall Deals")
                  : item.key === "coupons"
                    ? (item.label === "Kortingscodes" ? "Cashback" : "Cash Back")
                    : item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
