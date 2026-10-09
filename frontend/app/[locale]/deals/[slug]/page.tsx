import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { buildMetadata } from "@/lib/seo";
import { getDealBySlug, getDealSlugs } from "@/services/deals";
import { DealDetailPage } from "@/features/deals/DealDetailPage";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams(): Promise<{ locale: string; slug: string }[]> {
  const slugs = await getDealSlugs();
  return ["nl", "en"].flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const deal = await getDealBySlug(slug, locale);
  if (!deal) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({
    locale,
    key: "deal",
    slug,
    title: deal.title,
    description: deal.description ?? dict.deals.description,
  });
}

export default async function DealDetailRoute({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  return <DealDetailPage locale={locale} dict={dict} slug={slug} />;
}
