import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { buildMetadata } from "@/lib/seo";
import { PrivacyPage } from "@/features/pages/PrivacyPage";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams(): { locale: string }[] {
  return [{ locale: "nl" }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({
    locale,
    key: "privacy",
    title: dict.privacy.title,
    description: dict.privacy.description,
  });
}

export default async function PrivacyRoute({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale) || locale !== "nl") notFound();
  const dict = await getDictionary(locale);
  return <PrivacyPage locale={locale} dict={dict} />;
}
