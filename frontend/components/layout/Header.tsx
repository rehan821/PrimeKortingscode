import Link from "next/link";
import type { Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { getPopularCategories } from "@/services/categories";
import { getPosts } from "@/services/blog";
import { getPopularStores, getStoresByCategory } from "@/services/stores";
import { otherLocale } from "@/i18n/config";
import { getNavItems } from "@/lib/navigation";
import { siteConfig } from "@/config/site";
import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNav } from "./MobileNav";
import { SearchForm } from "@/components/search/SearchForm";
import { pathFor } from "@/lib/routes";
import type { NavigationMenus } from "./NavLinks";

interface HeaderProps {
  locale: Locale;
  dict: Dictionary;
}

/** Purple shopping navigation framed by the demo notice and offer ticker. */
export async function Header({ locale, dict }: HeaderProps) {
  const items = getNavItems(locale, dict);
  const target = otherLocale(locale);
  const [categories, stores, postsResult] = await Promise.all([
    getPopularCategories(14, locale),
    getPopularStores(14, locale),
    getPosts({ locale, perPage: 40 }),
  ]);
  const storeCategories = await Promise.all(categories.map(async (category) => ({
    key: category.slug,
    label: category.name,
    href: pathFor(locale, "category", category.slug),
    links: (await getStoresByCategory(category.id, locale, 14)).map((store) => ({
      label: store.name,
      href: pathFor(locale, "store", store.slug),
    })),
  })));
  const blogTaxonomy = locale === "nl"
    ? [
        { key: "sales", label: "Aanbiedingen", terms: ["aanbieding", "deal", "korting", "black friday"] },
        { key: "freebies", label: "Gratis", terms: ["gratis", "free", "cadeau"] },
        { key: "saving-tips", label: "Bespaartips", terms: ["bespaartips", "besparen", "saving", "prijs"] },
        { key: "returns", label: "Retourbeleid", terms: ["retour", "terugsturen"] },
        { key: "how-to-save", label: "Zo bespaar je", terms: ["besparen", "bespaart", "kortingscode"] },
      ]
    : [
        { key: "sales", label: "Sales", terms: ["sale", "offer", "deal", "discount", "black friday"] },
        { key: "freebies", label: "Freebies", terms: ["free", "freebie", "gift"] },
        { key: "saving-tips", label: "Savings Tips", terms: ["saving", "save", "budget", "price"] },
        { key: "returns", label: "Return Policies", terms: ["return", "refund"] },
        { key: "how-to-save", label: "How To Save", terms: ["save", "saving", "coupon", "discount"] },
      ];
  const blogCategories = blogTaxonomy.map((category) => {
    const categoryPosts = postsResult.items.filter((post) => {
      const searchable = [post.category, post.title, post.excerpt, ...(post.tags ?? [])].join(" ").toLowerCase();
      return category.terms.some((term) => searchable.includes(term));
    });
    const firstTag = categoryPosts.find((post) => post.tags?.length)?.tags?.[0];
    return {
      key: category.key,
      label: category.label,
      href: firstTag ? `${pathFor(locale, "blog")}?tag=${encodeURIComponent(firstTag)}` : pathFor(locale, "blog"),
      links: categoryPosts.slice(0, 5).map((post) => ({
        label: post.title,
        href: pathFor(locale, "post", post.slug),
      })),
    };
  });
  const blogHref = pathFor(locale, "blog");
  const categoriesHref = pathFor(locale, "categories");
  const menus: NavigationMenus = {
    homeHref: pathFor(locale, "home"),
    storeCategories,
    stores: stores.map((store) => ({ label: store.name, href: pathFor(locale, "store", store.slug) })),
    allCategories: { label: locale === "nl" ? "Alle categorieën" : "All Categories", href: categoriesHref },
    allStores: { label: locale === "nl" ? "Alle winkels" : "All Stores", href: pathFor(locale, "stores") },
    blogCategories,
    posts: postsResult.items.slice(0, 5).map((post) => ({ label: post.title, href: pathFor(locale, "post", post.slug) })),
    allArticles: { label: locale === "nl" ? "Alle artikelen" : "All Articles", href: blogHref },
  };

  return (
    <header className="sticky top-0 z-40 w-full">
      {siteConfig.showDemoNotice ? (
        <div className="bg-brand-900 px-4 py-2 text-center text-[11px] font-semibold tracking-wide text-white/90 sm:text-xs">
          {dict.common.demoNotice}
        </div>
      ) : null}

      <div className="border-b border-brand-900/30 bg-brand-700 text-white">
        <div className="shell flex min-h-[72px] items-center gap-4 py-2 lg:gap-6">
          <Logo locale={locale} tone="dark" className="home-header-logo shrink-0" />

          <div className="home-header-navigation hidden min-w-0 flex-1 items-center justify-center gap-5 lg:flex xl:gap-7">
            <NavLinks items={items} label={dict.header.navLabel} menus={menus} />
            <div className="home-header-search min-w-[220px] max-w-[390px] flex-1">
              <SearchForm locale={locale} dict={dict} id="header-search" variant="header" />
            </div>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
            <LanguageSwitcher
              locale={locale}
              label={dict.header.switchTo[target]}
              className="hidden h-9 items-center rounded-full border border-white/30 px-3 text-xs font-bold text-white transition hover:bg-white/10 lg:inline-flex"
            />
            <MobileNav locale={locale} dict={dict} items={items} menus={menus} />
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
