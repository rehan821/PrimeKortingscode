import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { buildMetadata } from "@/lib/seo";
import { getCouponBySlug, getCouponSlugs } from "@/services/coupons";
import { CouponDetailPage } from "@/features/coupons/CouponDetailPage";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams(): Promise<{ locale: string; slug: string }[]> {
  const slugs = await getCouponSlugs();
  return slugs.map((slug) => ({ locale: "en", slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const coupon = await getCouponBySlug(slug, locale);
  if (!coupon) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({
    locale,
    key: "coupon",
    slug,
    title: coupon.title,
    description: coupon.description ?? dict.coupons.description,
  });
}

export default async function CouponDetailRoute({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  return <CouponDetailPage locale={locale} dict={dict} slug={slug} />;
}
