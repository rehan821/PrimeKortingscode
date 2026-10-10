import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { buildMetadata } from "@/lib/seo";
import { BlogPage, type PostSearchParams } from "@/features/blog/BlogPage";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: PostSearchParams;
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
    key: "blog",
    title: dict.blog.title,
    description: dict.blog.description,
  });
}

export default async function BlogRoute({ params, searchParams }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  return <BlogPage locale={locale} dict={dict} searchParams={searchParams} />;
}
