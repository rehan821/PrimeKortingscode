import type { Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { pathFor, type RouteKey } from "@/lib/routes";
import { SearchIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

interface SearchFormProps {
  locale: Locale;
  dict: Dictionary;
  /** Route the form submits to (defaults to the stores index). */
  actionKey?: RouteKey;
  /** Pre-filled query (list pages). */
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  id?: string;
}

/**
 * Plain HTML GET form — the browser submits it without any client-side JS
 * and the results page is a server-rendered, crawlable URL.
 */
export function SearchForm({
  locale,
  dict,
  actionKey = "stores",
  defaultValue,
  placeholder,
  className,
  id,
}: SearchFormProps) {
  return (
    <form
      action={pathFor(locale, actionKey)}
      method="get"
      role="search"
      className={cn("relative", className)}
    >
      <label htmlFor={id} className="sr-only">
        {dict.header.searchAria}
      </label>
      <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-ink-400">
        <SearchIcon size={18} />
      </span>
      <input
        id={id}
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder ?? dict.common.searchPlaceholder}
        autoComplete="off"
        className="h-11 w-full rounded-xl border border-ink-200 bg-ink-50 pl-10 pr-3 text-sm text-ink-900 placeholder:text-ink-400 hover:border-ink-300 focus:border-brand-500 focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-200"
      />
    </form>
  );
}
