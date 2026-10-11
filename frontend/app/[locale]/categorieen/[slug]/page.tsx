import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { buildMetadata } from "@/lib/seo";
import { getCategoryBySlug, getCategorySlugs } from "@/services/categories";
import { CategoryDetailPage, type CategoryDetailSearchParams } from "@/features/categories/CategoryDetailPage";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<CategoryDetailSearchParams>;
}

export async function generateStaticParams(): Promise<{ locale: string; slug: string }[]> {
  const slugs = await getCategorySlugs();
  return slugs.map((slug) => ({ locale: "nl", slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const category = await getCategoryBySlug(slug, locale);
  if (!category) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({
    locale,
    key: "category",
    slug,
    title: category.name,
    description: category.description ?? dict.categories.description,
  });
}

export default function CategoryDetailRoute({ params, searchParams }: PageProps) {
  return (
    <Suspense fallback={<div className="shell py-8"><div className="h-10 w-1/3 animate-pulse rounded-lg bg-ink-100" /></div>}>
      <CategoryDetailRouteContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function CategoryDetailRouteContent({ params, searchParams }: PageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  return <CategoryDetailPage locale={locale} dict={dict} slug={slug} searchParams={searchParams} />;
}
