import Link from "next/link";
import { cn } from "@/lib/cn";
import { withQuery } from "@/lib/query";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/ui/icons";

interface PaginationLabels {
  label: string;
  previous: string;
  next: string;
  page: string;
  of: string;
  current: string;
}

interface PaginationProps {
  basePath: string;
  page: number;
  totalPages: number;
  query?: Record<string, string | number | undefined>;
  labels: PaginationLabels;
  className?: string;
}

function pageWindow(page: number, totalPages: number): Array<number | "gap"> {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages = new Set<number>([1, totalPages, page, page - 1, page + 1]);
  if (page <= 3) [2, 3, 4].forEach((p) => pages.add(p));
  if (page >= totalPages - 2) [totalPages - 3, totalPages - 2, totalPages - 1].forEach((p) => pages.add(p));
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

  const result: Array<number | "gap"> = [];
  let previous = 0;
  for (const value of sorted) {
    if (previous && value - previous > 1) result.push("gap");
    result.push(value);
    previous = value;
  }
  return result;
}

/** Server-rendered pagination — every page is a crawlable link. */
export function Pagination({ basePath, page, totalPages, query = {}, labels, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const hrefFor = (target: number) => withQuery(basePath, { ...query, page: target > 1 ? target : undefined });
  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  return (
    <nav aria-label={labels.label} className={cn("mt-8 flex items-center justify-center gap-1", className)}>
      <Link
        href={hrefFor(page - 1)}
        aria-disabled={isFirst}
        tabIndex={isFirst ? -1 : undefined}
        aria-label={labels.previous}
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-ink-200 text-ink-600 hover:border-ink-300 hover:bg-ink-50",
          isFirst && "pointer-events-none opacity-40",
        )}
      >
        <ChevronLeftIcon size={18} />
      </Link>

      {pageWindow(page, totalPages).map((entry, index) =>
        entry === "gap" ? (
          <span key={`gap-${index}`} aria-hidden="true" className="px-2 text-sm text-ink-400">
            …
          </span>
        ) : (
          <Link
            key={entry}
            href={hrefFor(entry)}
            aria-current={entry === page ? "page" : undefined}
            aria-label={
              entry === page
                ? `${labels.page} ${entry}, ${labels.current}`
                : `${labels.page} ${entry}`
            }
            className={cn(
              "inline-flex h-10 min-w-10 items-center justify-center rounded-lg px-3 text-sm font-semibold",
              entry === page
                ? "bg-brand-600 text-white"
                : "border border-ink-200 text-ink-700 hover:border-ink-300 hover:bg-ink-50",
            )}
          >
            {entry}
          </Link>
        ),
      )}

      <Link
        href={hrefFor(page + 1)}
        aria-disabled={isLast}
        tabIndex={isLast ? -1 : undefined}
        aria-label={labels.next}
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-lg border border-ink-200 text-ink-600 hover:border-ink-300 hover:bg-ink-50",
          isLast && "pointer-events-none opacity-40",
        )}
      >
        <ChevronRightIcon size={18} />
      </Link>
    </nav>
  );
}
