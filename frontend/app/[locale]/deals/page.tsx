import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { buildMetadata } from "@/lib/seo";
import { DealsPage, type DealSearchParams } from "@/features/deals/DealsPage";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: DealSearchParams;
}

export function generateStaticParams(): { locale: string }[] {
  return [{ locale: "nl" }, { locale: "en" }];
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
    key: "deals",
    title: dict.deals.metaTitle,
    description: dict.deals.description,
  });
}

export default async function DealsRoute({ params, searchParams }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  return <DealsPage locale={locale} dict={dict} searchParams={searchParams} />;
}
