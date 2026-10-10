import Link from "next/link";
import type { Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { CategoryIcon } from "@/components/category/CategoryIcon";
import { pathFor } from "@/lib/routes";
import { categorySlugs } from "@/lib/known-slugs";
import {
  CATEGORY_GROUPS,
  FEATURED_CATEGORIES,
  splitIntoColumns,
  type CategoryGroup,
  type CategoryNode,
  type FeaturedCategory,
} from "@/data/category-taxonomy";

export type CategorySearchParams = Promise<Record<string, string | string[] | undefined>>;

/* ============================================================================
 *  LINK RESOLUTION — every click always lands on a real page
 * ============================================================================
 *
 *  A link is built from a category slug only when that slug really exists
 *  (the same allow-list `proxy.ts` uses to return 404s). Anything else —
 *  a typo, a category an admin removed later, a node without a slug — falls
 *  back to the categories index, so this page can never produce a 404 or an
 *  error screen.
 * ======================================================================== */

function hrefFor(locale: Locale, slug?: string): string {
  return slug && categorySlugs.has(slug) ? pathFor(locale, "category", slug) : pathFor(locale, "categories");
}

/* ============================================================================
 *  SUBCOMPONENTS
 * ======================================================================== */

/** One circular tile in the "Top Coupons & Deals Categories" row. */
function FeaturedTile({ category, locale }: { category: FeaturedCategory; locale: Locale }) {
  return (
    <Link
      href={hrefFor(locale, category.slug)}
      className="group flex w-full max-w-[170px] flex-col items-center text-center"
    >
      <span className="flex aspect-square w-full items-center justify-center rounded-full bg-[#f3f4f6] transition-transform duration-300 group-hover:scale-105">
        <CategoryIcon
          name={category.icon}
          size={68}
          className="text-ink-700 transition-colors group-hover:text-brand-700"
        />
      </span>
      <span className="mx-auto mt-3 block w-full max-w-[150px] text-[13px] font-bold uppercase leading-snug text-ink-950 transition-colors group-hover:text-brand-700 sm:text-sm">
        {category.name}
      </span>
    </Link>
  );
}

/** One bulleted item — renders its children recursively. */
function TaxonomyItem({
  node,
  locale,
  inheritedSlug,
}: {
  node: CategoryNode;
  locale: Locale;
  inheritedSlug?: string;
}) {
  const slug = node.slug ?? inheritedSlug;

  return (
    <li>
      <Link href={hrefFor(locale, slug)} className="transition-colors hover:text-brand-700 hover:underline">
        {node.name}
      </Link>
      {node.children && node.children.length > 0 ? (
        <ul className="category-taxonomy mt-2">
          {node.children.map((child, index) => (
            <TaxonomyItem
              key={`${child.name}-${index}`}
              node={child}
              locale={locale}
              inheritedSlug={slug}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

/** One category group: bold uppercase heading + its bullet list. */
function CategoryGroupBlock({ group, locale }: { group: CategoryGroup; locale: Locale }) {
  return (
    <div className="mb-9 last:mb-0">
      <Link
        href={hrefFor(locale, group.slug)}
        className="block text-[15px] font-bold uppercase leading-snug text-ink-950 transition-colors hover:text-brand-700 hover:underline sm:text-base"
      >
        {group.name}
      </Link>
      {group.children && group.children.length > 0 ? (
        <ul className="category-taxonomy mt-3 text-[15px] leading-relaxed text-ink-950 sm:text-base">
          {group.children.map((child, index) => (
            <TaxonomyItem
              key={`${child.name}-${index}`}
              node={child}
              locale={locale}
              inheritedSlug={group.slug}
            />
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/* ============================================================================
 *  MAIN COMPONENT
 * ======================================================================== */

interface CategoriesPageProps {
  locale: Locale;
  dict: Dictionary;
  searchParams?: CategorySearchParams;
}

/**
 * Categories directory — "Top Coupons & Deals Categories" tiles followed by
 * the three-column "All Coupons & Deals Categories" list.
 *
 * Layout data lives in `data/category-taxonomy.ts` so new categories and
 * items can be added there without touching this component.
 */
export function CategoriesPage({ locale }: CategoriesPageProps) {
  const columns = splitIntoColumns(CATEGORY_GROUPS);

  return (
    <div className="categories-page">
      <div className="categories-shell pb-12 pt-8 sm:pt-10">
        {/* ============================================================
         *  SECTION 1 — Top Coupons & Deals Categories
         * ========================================================== */}
        <section aria-labelledby="top-categories-heading">
          <h2 id="top-categories-heading" className="text-2xl font-black tracking-tight text-ink-950 sm:text-3xl">
            Top Coupons &amp; Deals Categories
          </h2>

          <div className="mt-8 grid grid-cols-2 justify-items-center gap-x-6 gap-y-8 sm:grid-cols-3 sm:gap-x-8 md:grid-cols-4 lg:grid-cols-5">
            {FEATURED_CATEGORIES.map((category) => (
              <FeaturedTile key={`${category.name}-${category.slug}`} category={category} locale={locale} />
            ))}
          </div>
        </section>

        {/* Divider */}
        <hr className="my-10 border-[#e5e7eb]" />

        {/* ============================================================
         *  SECTION 2 — All Coupons & Deals Categories
         * ========================================================== */}
        <section aria-labelledby="all-categories-heading">
          <h2 id="all-categories-heading" className="text-2xl font-black tracking-tight text-ink-950 sm:text-3xl">
            All Coupons &amp; Deals Categories
          </h2>

          <div className="mt-6 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
            {columns.map((column, columnIndex) => (
              <div key={columnIndex}>
                {column.map((group) => (
                  <CategoryGroupBlock key={group.name} group={group as CategoryGroup} locale={locale} />
                ))}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
