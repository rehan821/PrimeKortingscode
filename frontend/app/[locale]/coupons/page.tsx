import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { buildMetadata } from "@/lib/seo";
import { CouponsPage, type CouponSearchParams } from "@/features/coupons/CouponsPage";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: CouponSearchParams;
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
    key: "coupons",
    title: dict.coupons.metaTitle,
    description: dict.coupons.description,
  });
}

export default async function CouponsRoute({ params, searchParams }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  return <CouponsPage locale={locale} dict={dict} searchParams={searchParams} />;
}
