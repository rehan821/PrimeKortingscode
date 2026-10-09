import Link from "next/link";
import { cn } from "@/lib/cn";
import { withQuery } from "@/lib/query";

interface SortTabsProps {
  basePath: string;
  label: string;
  current: string;
  options: Array<{ value: string; label: string }>;
  query: Record<string, string | number | undefined>;
}

/** Server-rendered sort selector — each option is a real, crawlable link. */
export function SortTabs({ basePath, label, current, options, query }: SortTabsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="font-medium text-ink-500">{label}:</span>
      {options.map((option) => {
        const active = option.value === current;
        return (
          <Link
            key={option.value}
            href={withQuery(basePath, { ...query, sort: option.value, page: undefined })}
            aria-current={active ? "true" : undefined}
            className={cn(
              "rounded-full border px-3 py-1 font-semibold transition",
              active
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-ink-200 bg-white text-ink-700 hover:border-ink-300 hover:bg-ink-50",
            )}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
  );
}

const DEFAULT_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

interface AlphabetFilterProps {
  basePath: string;
  label: string;
  /** Currently active letter (upper case), if any. */
  current?: string;
  allLabel: string;
  query: Record<string, string | number | undefined>;
}

/** A–Z store filter. The active letter toggles off to reset the filter. */
export function AlphabetFilter({ basePath, label, current, allLabel, query }: AlphabetFilterProps) {
  const active = current?.toUpperCase();
  return (
    <nav aria-label={label} className="flex flex-wrap gap-1">
      <Link
        href={withQuery(basePath, { ...query, letter: undefined, page: undefined })}
        aria-current={!active ? "true" : undefined}
        className={cn(
          "inline-flex h-8 items-center justify-center rounded-lg px-2.5 text-sm font-semibold",
          !active
            ? "bg-brand-600 text-white"
            : "border border-ink-200 bg-white text-ink-700 hover:bg-ink-50",
        )}
      >
        {allLabel}
      </Link>
      {DEFAULT_LETTERS.map((letter) => {
        const isActive = active === letter;
        return (
          <Link
            key={letter}
            href={withQuery(basePath, {
              ...query,
              letter: isActive ? undefined : letter,
              page: undefined,
            })}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold",
              isActive
                ? "bg-brand-600 text-white"
                : "border border-ink-200 bg-white text-ink-700 hover:bg-ink-50",
            )}
          >
            {letter}
          </Link>
        );
      })}
    </nav>
  );
}

/** Lightweight placeholder shown while a filtered result set streams in. */
export function ResultsSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="h-40 animate-pulse rounded-2xl border border-ink-100 bg-ink-50" />
      ))}
    </div>
  );
}
