import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { buildMetadata } from "@/lib/seo";
import { HomePage } from "@/features/home/HomePage";

interface PageParams {
  params: Promise<{ locale: string }>;
}

/** Both locales are prerendered; other values fall back to request-time rendering. */
export function generateStaticParams(): { locale: string }[] {
  return [{ locale: "nl" }, { locale: "en" }];
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({
    locale,
    key: "home",
    titleAbsolute: true,
    title: `${dict.meta.siteName} — ${dict.meta.tagline}`,
    description: dict.meta.defaultDescription,
  });
}

export default async function HomeRoute({ params }: PageParams) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);

  return <HomePage locale={locale} dict={dict} />;
}
