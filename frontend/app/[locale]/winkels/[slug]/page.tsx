import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { buildMetadata } from "@/lib/seo";
import { getStoreBySlug, getStoreSlugs } from "@/services/stores";
import { StoreDetailPage } from "@/features/stores/StoreDetailPage";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams(): Promise<{ locale: string; slug: string }[]> {
  const slugs = await getStoreSlugs();
  return slugs.map((slug) => ({ locale: "nl", slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const store = await getStoreBySlug(slug, locale);
  if (!store) return {};
  return buildMetadata({
    locale,
    key: "store",
    slug,
    title: store.name,
    description: store.description,
  });
}

export default async function StoreDetailRoute({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  return <StoreDetailPage locale={locale} dict={dict} slug={slug} />;
}
