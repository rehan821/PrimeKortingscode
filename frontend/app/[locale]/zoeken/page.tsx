import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { buildMetadata } from "@/lib/seo";
import { SearchResultsPage, type SearchResultsSearchParams } from "@/features/search/SearchResultsPage";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchResultsSearchParams>;
}

export function generateStaticParams(): { locale: string }[] {
  return [{ locale: "nl" }];
}

export async function generateMetadata({ params }: Pick<PageProps, "params">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({
    locale,
    key: "search",
    title: dict.searchResults.title,
    description: dict.searchResults.emptyQuery,
    noIndex: true,
  });
}

export default async function DutchSearchRoute({ params, searchParams }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale) || locale !== "nl") notFound();
  const dict = await getDictionary(locale);
  return <SearchResultsPage locale={locale} dict={dict} searchParams={searchParams} />;
}
