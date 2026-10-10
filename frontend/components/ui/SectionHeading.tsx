import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRightIcon } from "./icons";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  /** Renders a "view all" link when provided. */
  href?: string;
  viewAllLabel?: string;
  id?: string;
}

/** Consistent section header used across all landing sections. */
export function SectionHeading({ title, subtitle, href, viewAllLabel, id }: SectionHeadingProps) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
      <div>
        <h2 id={id} className="text-xl font-bold text-ink-900 sm:text-2xl">
          {title}
        </h2>
        {subtitle ? <p className="mt-1 text-sm text-ink-500">{subtitle}</p> : null}
      </div>
      {href && viewAllLabel ? (
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800"
        >
          {viewAllLabel}
          <span aria-hidden="true">→</span>
        </Link>
      ) : null}
    </div>
  );
}

/** Homepage section heading — stronger visual treatment */
export function HomeSectionHeading({
  title,
  subtitle,
  href,
  viewAllLabel,
  id,
  accent = false,
}: SectionHeadingProps & { accent?: boolean }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div>
        <h2
          id={id}
          className={`text-xl font-black tracking-tight sm:text-2xl ${
            accent ? "text-accent-600" : "text-ink-900"
          }`}
        >
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-600 sm:text-base">
            {subtitle}
          </p>
        ) : null}
      </div>
      {href && viewAllLabel ? (
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 border-b border-ink-900 pb-1 text-xs font-extrabold uppercase tracking-[.08em] text-ink-900 transition-colors hover:border-brand-700 hover:text-brand-700"
        >
          {viewAllLabel}
          <ArrowRightIcon size={14} />
        </Link>
      ) : null}
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-ink-200 bg-ink-50 px-6 py-12 text-center">
      <p className="text-base font-semibold text-ink-800">{title}</p>
      {description ? <p className="mx-auto mt-1 max-w-md text-sm text-ink-500">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
