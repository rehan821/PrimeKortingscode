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
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-ink-200 bg-white shadow-card transition hover:border-brand-300 hover:shadow-pop">
      <Link href={href} className="relative block aspect-[16/9] overflow-hidden bg-ink-100">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-300 group-hover:scale-[1.025]"
          />
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {post.category ? (
            <span className="rounded-sm bg-brand-50 px-2.5 py-1 font-bold text-brand-700">
              {post.category}
            </span>
          ) : null}
          <time dateTime={post.publishedAt} className="font-medium text-ink-500">
            {formatDate(post.publishedAt, locale)}
          </time>
          {post.readingTimeMinutes ? (
            <span className="inline-flex items-center gap-1 font-medium text-ink-500">
              <ClockIcon size={14} />
              {interpolate(dict.blog.minRead, { n: post.readingTimeMinutes })}
            </span>
          ) : null}
        </div>

        <h3 className="mt-3 text-lg font-black leading-tight text-ink-900">
          <Link href={href} className="group-hover:text-brand-700">
            {post.title}
          </Link>
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-600">{post.excerpt}</p>

        <div className="mt-auto pt-5">
          <Link
            href={href}
            className="inline-flex items-center gap-2 font-bold text-brand-700 transition group-hover:gap-3 group-hover:text-brand-800"
          >
            {dict.buttons.readMore}
            <ArrowRightIcon size={16} className="transition" />
          </Link>
        </div>
      </div>
    </article>
  );
}
