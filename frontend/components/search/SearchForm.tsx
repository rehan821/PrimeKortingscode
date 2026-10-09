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
  /** Visual treatment: default = header/page, hero = homepage immersive */
  variant?: "default" | "hero";
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
  variant = "default",
}: SearchFormProps) {
  const isHero = variant === "hero";

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
        <SearchIcon size={isHero ? 20 : 18} />
      </span>
      <input
        id={id}
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder ?? dict.common.searchPlaceholder}
        autoComplete="off"
        className={cn(
          "w-full rounded-xl pl-10 pr-3 text-ink-900 transition-all placeholder:text-ink-400 hover:border-ink-300 focus:outline-none",
          isHero
            ? "h-[54px] border border-ink-200 bg-white text-base shadow-card focus:border-brand-400 focus:shadow-pop focus-visible:ring-2 focus-visible:ring-brand-200"
            : "h-11 border border-ink-200 bg-ink-50 text-sm focus:border-brand-500 focus:bg-white focus-visible:ring-2 focus-visible:ring-brand-200"
        )}
      />
      <button type="submit" aria-label={dict.header.searchAria} className={cn("absolute inset-y-1 right-1 inline-flex items-center justify-center rounded-md bg-brand-700 text-white transition hover:bg-brand-800", isHero ? "w-11" : "w-9")}>
        <SearchIcon size={isHero ? 19 : 17} />
      </button>
    </form>
  );
}
