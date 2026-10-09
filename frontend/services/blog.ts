import type { BlogPost, ListQuery, Locale, Paginated } from "@/types";
import { DEFAULT_LOCALE } from "@/types";
import { mockBlogPosts } from "@/data/mock/blog";
import { matchesQuery, normalizePage, normalizePerPage, paginate } from "./shared";
import { siteConfig } from "@/config/site";

/** Blog service — editorial content access for the UI. */

export interface PostListQuery extends ListQuery {
  locale?: Locale;
  tag?: string;
}

/**
 * Localised content with fallback: if no posts exist for a locale yet,
 * Dutch content is served so `/en/blog` never renders an empty shell.
 * When real EN content is published the fallback simply stops being used.
 */
function postsForLocale(locale: Locale): BlogPost[] {
  const localized = mockBlogPosts.filter((post) => post.locale === locale);
  if (localized.length > 0) return localized;
  return mockBlogPosts.filter((post) => post.locale === DEFAULT_LOCALE);
}

export async function getPosts(query: PostListQuery = {}): Promise<Paginated<BlogPost>> {
  const locale = query.locale ?? DEFAULT_LOCALE;
  const page = normalizePage(query.page);
  const perPage = normalizePerPage(query.perPage, siteConfig.pagination.posts);

  let list = postsForLocale(locale);

  if (query.tag) list = list.filter((post) => post.tags?.includes(query.tag!));
  if (query.featured) list = list.filter((post) => post.isFeatured);
  if (query.q) list = list.filter((post) => matchesQuery(`${post.title} ${post.excerpt}`, query.q));

  list = [...list].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return paginate(list, page, perPage);
}

export async function getPostBySlug(
  slug: string,
  locale: Locale = DEFAULT_LOCALE,
): Promise<BlogPost | undefined> {
  const exact = mockBlogPosts.find((post) => post.slug === slug && post.locale === locale);
  if (exact) return exact;
  return mockBlogPosts.find((post) => post.slug === slug);
}

/** Post slugs for a locale — used by `generateStaticParams`, never by the UI. */
export async function getPostSlugs(locale: Locale = DEFAULT_LOCALE): Promise<string[]> {
  return postsForLocale(locale).map((post) => post.slug);
}

export async function getFeaturedPosts(
  limit = 3,
  locale: Locale = DEFAULT_LOCALE,
): Promise<BlogPost[]> {
  const result = await getPosts({ locale, perPage: 100, sort: "newest" });
  const featured = result.items.filter((post) => post.isFeatured);
  return (featured.length >= limit ? featured : result.items).slice(0, limit);
}

export async function getRelatedPosts(
  post: BlogPost,
  limit = 2,
  locale: Locale = DEFAULT_LOCALE,
): Promise<BlogPost[]> {
  const result = await getPosts({ locale, perPage: 100 });
  return result.items.filter((item) => item.slug !== post.slug).slice(0, limit);
}
