import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { buildMetadata } from "@/lib/seo";
import { ContactPage } from "@/features/pages/ContactPage";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams(): { locale: string }[] {
  return [{ locale: "nl" }, { locale: "en" }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return buildMetadata({
    locale,
    key: "contact",
    title: dict.contact.title,
    description: dict.contact.description,
  });
}

export default async function ContactRoute({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  return <ContactPage locale={locale} dict={dict} />;
}
