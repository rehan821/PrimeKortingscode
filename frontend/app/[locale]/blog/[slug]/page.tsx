import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { buildMetadata } from "@/lib/seo";
import { getPostBySlug, getPostSlugs } from "@/services/blog";
import { PostDetailPage } from "@/features/blog/PostDetailPage";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams(): Promise<{ locale: string; slug: string }[]> {
  const [nl, en] = await Promise.all([getPostSlugs("nl"), getPostSlugs("en")]);
  return [
    ...nl.map((slug) => ({ locale: "nl", slug })),
    ...en.map((slug) => ({ locale: "en", slug })),
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const post = await getPostBySlug(slug, locale);
  if (!post) return {};
  return buildMetadata({
    locale,
    key: "post",
    slug,
    title: post.title,
    description: post.excerpt,
    ogType: "article",
    image: post.coverImage,
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    authors: [post.author],
  });
}

export default async function PostDetailRoute({ params }: PageProps) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  return <PostDetailPage locale={locale} dict={dict} slug={slug} />;
}
