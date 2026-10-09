import Link from "next/link";

export interface Crumb {
  label: string;
  /** Public path; omit for the current (last) page. */
  path?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
  label: string;
}

/** Semantic breadcrumb trail (server-rendered, links are plain anchors). */
export function Breadcrumbs({ items, label }: BreadcrumbsProps) {
  return (
    <nav aria-label={label} className="mb-5 overflow-x-auto">
      <ol className="flex min-w-max items-center gap-2 text-sm text-ink-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 ? (
                <span aria-hidden="true" className="text-ink-300">
                  /
                </span>
              ) : null}
              {item.path && !isLast ? (
                <Link href={item.path} className="hover:text-brand-700">
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className="font-medium text-ink-800">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
