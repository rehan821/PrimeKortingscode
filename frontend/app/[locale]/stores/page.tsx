import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { buildMetadata } from "@/lib/seo";
import { StoresPage, type StoreSearchParams } from "@/features/stores/StoresPage";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: StoreSearchParams;
}

export function generateStaticParams(): { locale: string }[] {
  return [{ locale: "en" }];
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
    key: "stores",
    title: dict.stores.metaTitle,
    description: dict.stores.description,
  });
}

export default async function StoresRoute({ params, searchParams }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  return <StoresPage locale={locale} dict={dict} searchParams={searchParams} />;
}
