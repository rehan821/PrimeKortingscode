import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { getPostBySlug, getRelatedPosts } from "@/services/blog";
import { pathFor } from "@/lib/routes";
import { formatDate, interpolate } from "@/lib/date";
import { siteUrl } from "@/config/site";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { BlogCard } from "@/components/blog/BlogCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowRightIcon, ClockIcon } from "@/components/ui/icons";
import { JsonLd } from "@/components/seo/JsonLd";

interface PostDetailPageProps {
  locale: Locale;
  dict: Dictionary;
  slug: string;
}

/** Blog article — server-rendered body with structured data. */
export async function PostDetailPage({ locale, dict, slug }: PostDetailPageProps) {
  const post = await getPostBySlug(slug, locale);
  if (!post) notFound();

  const related = await getRelatedPosts(post, 2, locale);
  const postPath = pathFor(locale, "post", post.slug);
  const homePath = pathFor(locale, "home");
  const blogPath = pathFor(locale, "blog");

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": "Person", name: post.author },
    inLanguage: locale,
    mainEntityOfPage: siteUrl(postPath),
    ...(post.coverImage ? { image: siteUrl(post.coverImage) } : {}),
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: dict.common.home, path: homePath },
          { name: dict.blog.title, path: blogPath },
          { name: post.title, path: postPath },
        ])}
      />
      <div className="shell py-6 sm:py-8">
        <Breadcrumbs
          label={dict.breadcrumb.label}
          items={[
            { label: dict.common.home, path: homePath },
            { label: dict.blog.title, path: blogPath },
            { label: post.title },
          ]}
        />

        <article className="mx-auto max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-xs text-ink-500">
            {post.category ? (
              <span className="rounded-md bg-brand-50 px-2 py-0.5 font-bold text-brand-700">
                {post.category}
              </span>
            ) : null}
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
            {post.readingTimeMinutes ? (
              <span className="inline-flex items-center gap-1">
                <ClockIcon size={13} />
                {interpolate(dict.blog.minRead, { n: post.readingTimeMinutes })}
              </span>
            ) : null}
          </div>

          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-ink-900 sm:text-4xl sm:leading-tight">
            {post.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-ink-600">{post.excerpt}</p>
          <p className="mt-2 text-sm text-ink-500">
            {interpolate(dict.blog.by, { author: post.author })}
          </p>

          {post.coverImage ? (
            <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl bg-ink-100">
              <Image
                src={post.coverImage}
                alt=""
                fill
                priority
                sizes="(min-width: 768px) 768px, 100vw"
                className="object-cover"
              />
            </div>
          ) : null}

          <div
            className="article-body mt-8"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />

          {post.tags && post.tags.length > 0 ? (
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-ink-500">{dict.blog.tags}:</span>
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`${blogPath}?tag=${encodeURIComponent(tag)}`}
                  className="rounded-full border border-ink-200 bg-white px-3 py-1 text-sm font-semibold text-ink-700 hover:border-brand-300 hover:text-brand-700"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          ) : null}

          <div className="mt-8 border-t border-ink-100 pt-6">
            <Link
              href={blogPath}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              <ArrowRightIcon size={15} className="rotate-180" />
              {dict.blog.backToList}
            </Link>
          </div>
        </article>

        {related.length > 0 ? (
          <section className="mt-12" aria-labelledby="post-related">
            <SectionHeading id="post-related" title={dict.blog.related} />
            <div className="grid gap-5 sm:grid-cols-2">
              {related.map((item) => (
                <BlogCard key={item.id} post={item} locale={locale} dict={dict} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}
