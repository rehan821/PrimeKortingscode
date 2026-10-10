import { Suspense } from "react";
import type { Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { getPosts } from "@/services/blog";
import { pathFor } from "@/lib/routes";
import { firstValue, parsePage } from "@/lib/query";
import { siteConfig } from "@/config/site";
import { PageHeader } from "@/components/layout/PageHeader";
import { BlogCard } from "@/components/blog/BlogCard";
import { Pagination } from "@/components/common/Pagination";
import { ResultsSkeleton } from "@/components/common/ListControls";
import { EmptyState } from "@/components/ui/SectionHeading";

export type PostSearchParams = Promise<Record<string, string | string[] | undefined>>;

interface BlogPageProps {
  locale: Locale;
  dict: Dictionary;
  searchParams: PostSearchParams;
}

async function PostResults({ locale, dict, searchParams }: BlogPageProps) {
  const sp = await searchParams;
  const tag = firstValue(sp.tag);
  const page = parsePage(firstValue(sp.page));
  const basePath = pathFor(locale, "blog");

  const result = await getPosts({ locale, tag, page, perPage: siteConfig.pagination.posts });

  if (result.items.length === 0) {
    return <EmptyState title={dict.common.noResults} description={dict.blog.empty} />;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {result.items.map((post) => (
          <BlogCard key={post.id} post={post} locale={locale} dict={dict} />
        ))}
      </div>
      <Pagination
        basePath={basePath}
        page={result.page}
        totalPages={result.totalPages}
        query={{ tag }}
        labels={{
          label: dict.pagination.label,
          previous: dict.pagination.previous,
          next: dict.pagination.next,
          page: dict.pagination.page,
          of: dict.pagination.of,
          current: dict.pagination.current,
        }}
      />
    </div>
  );
}

/** Blog index shared by `/blog` (nl) and `/en/blog` (en). */
export function BlogPage({ locale, dict, searchParams }: BlogPageProps) {
  return (
    <>
      <PageHeader title={dict.blog.title} description={dict.blog.description} />
      <div className="shell py-8">
        <Suspense fallback={<ResultsSkeleton rows={6} />}>
          <PostResults locale={locale} dict={dict} searchParams={searchParams} />
        </Suspense>
      </div>
    </>
  );
}
