import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { buildMetadata } from "@/lib/seo";
import { CategoriesPage, type CategorySearchParams } from "@/features/categories/CategoriesPage";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: CategorySearchParams;
}

export function generateStaticParams(): { locale: string }[] {
  return [{ locale: "nl" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({
    locale,
    key: "categories",
    title: dict.categories.metaTitle,
    description: dict.categories.description,
  });
}

export default async function CategoriesRoute({ params, searchParams }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  return <CategoriesPage locale={locale} dict={dict} searchParams={searchParams} />;
}
