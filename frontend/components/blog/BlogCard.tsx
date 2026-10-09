import Link from "next/link";
import Image from "next/image";
import type { BlogPost, Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { pathFor } from "@/lib/routes";
import { formatDate } from "@/lib/date";
import { ArrowRightIcon, ClockIcon } from "@/components/ui/icons";
import { interpolate } from "@/lib/date";

interface BlogCardProps {
  post: BlogPost;
  locale: Locale;
  dict: Dictionary;
}

/** Editorial article tile — server-rendered with an optimised cover image. */
export function BlogCard({ post, locale, dict }: BlogCardProps) {
  const href = pathFor(locale, "post", post.slug);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-card transition hover:border-brand-300 hover:shadow-pop">
      <Link href={href} className="relative block aspect-[16/9] bg-ink-100">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition group-hover:scale-[1.02]"
          />
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
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

        <h3 className="mt-2.5 text-base font-bold leading-snug text-ink-900">
          <Link href={href} className="group-hover:text-brand-700">
            {post.title}
          </Link>
        </h3>

        <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-ink-500">{post.excerpt}</p>

        <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-brand-700">
          {dict.buttons.readMore}
          <ArrowRightIcon size={15} />
        </span>
      </div>
    </article>
  );
}
