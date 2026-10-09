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
  const totalOffers = (category.couponCount ?? 0) + (category.storeCount ?? 0);

  return (
    <Link
      href={pathFor(locale, "category", category.slug)}
      className="group flex min-h-[142px] flex-col items-start rounded-lg border border-ink-200 bg-white p-4 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-card sm:p-5"
    >
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-700 transition group-hover:bg-brand-700 group-hover:text-white">
        <CategoryIcon name={category.icon} size={21} />
      </div>
      <h3 className="mt-3 text-sm font-extrabold text-ink-900 group-hover:text-brand-700">
        {category.name}
      </h3>
      <p className="mt-1 text-xs font-medium text-ink-500">
        {totalOffers} {totalOffers === 1 ? dict.categories.offerOne || "offer" : dict.categories.offersMany || "offers"}
      </p>
    </Link>
  );
}
