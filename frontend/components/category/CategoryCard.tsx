import Link from "next/link";
import type { Category, Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { pathFor } from "@/lib/routes";
import { CategoryIcon } from "@/components/category/CategoryIcon";

interface CategoryCardProps {
  category: Category;
  locale: Locale;
  dict: Dictionary;
}

/** Category tile — icon, name and offer counts. */
export function CategoryCard({ category, locale, dict }: CategoryCardProps) {
  return (
    <Link
      href={pathFor(locale, "category", category.slug)}
      className="group flex flex-col rounded-xl border border-ink-200 bg-white p-4 shadow-card transition hover:border-brand-300 hover:shadow-pop"
    >
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white">
        <CategoryIcon name={category.icon} size={22} />
      </span>
      <span className="mt-3 text-sm font-bold text-ink-900 group-hover:text-brand-700">
        {category.name}
      </span>
      <span className="mt-1 text-xs text-ink-500">
        {category.storeCount ?? 0} {dict.categories.storesCount} · {category.couponCount ?? 0}{" "}
        {dict.categories.codesCount}
      </span>
    </Link>
  );
}
