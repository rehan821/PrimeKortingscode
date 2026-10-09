import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { buildMetadata } from "@/lib/seo";
import { getCategoryBySlug, getCategorySlugs } from "@/services/categories";
import { CategoryDetailPage } from "@/features/categories/CategoryDetailPage";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams(): Promise<{ locale: string; slug: string }[]> {
  const slugs = await getCategorySlugs();
  return slugs.map((slug) => ({ locale: "en", slug }));
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

export default async function CategoryDetailRoute({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || locale !== "en") notFound();
  const dict = await getDictionary(locale);
  return <CategoryDetailPage locale={locale} dict={dict} slug={slug} />;
}
