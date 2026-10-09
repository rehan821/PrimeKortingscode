"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Locale } from "@/types";
import type { Dictionary } from "@/i18n/dictionary";
import { pathFor, type RouteKey } from "@/lib/routes";
import { withQuery } from "@/lib/query";
import { SearchIcon, StoreIcon, TagIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

interface SearchFormProps {
  locale: Locale;
  dict: Dictionary;
  actionKey?: RouteKey;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  id?: string;
  variant?: "default" | "hero" | "header";
}

interface Suggestion {
  id: string;
  kind: "store" | "coupon" | "deal";
  title: string;
  storeName?: string;
  href: string;
  discountLabel?: string;
}

interface SuggestionResponse { items: Suggestion[]; }

/** GET search with live store and offer suggestions while the user types. */
export function SearchForm({
  locale,
  dict,
  actionKey = "search",
  defaultValue,
  placeholder,
  className,
  id = "site-search",
  variant = "default",
}: SearchFormProps) {
  const router = useRouter();
  const root = useRef<HTMLFormElement>(null);
  const [query, setQuery] = useState(defaultValue ?? "");
  const [items, setItems] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showEmptyPrompt, setShowEmptyPrompt] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const isHeader = variant === "header";
  const isHero = variant === "hero";
  const suggestionId = `${id}-suggestions`;

  useEffect(() => {
    const cleaned = query.trim();
    if (cleaned.length < 2) return;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({ q: cleaned, locale });
        const response = await fetch(`/api/search?${params.toString()}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Search suggestions request failed");
        const data = (await response.json()) as SuggestionResponse;
        setItems(data.items);
        setHasSearched(true);
        setActiveIndex(-1);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setItems([]);
        setHasSearched(true);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }, 100);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [locale, query]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (root.current && !root.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const chooseActive = () => {
    const active = items[activeIndex];
    if (!active) return false;
    router.push(active.href);
    setIsOpen(false);
    return true;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }
    if (event.key === "ArrowDown" && items.length > 0) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => (current + 1) % items.length);
      return;
    }
    if (event.key === "ArrowUp" && items.length > 0) {
      event.preventDefault();
      setIsOpen(true);
      setActiveIndex((current) => current <= 0 ? items.length - 1 : current - 1);
      return;
    }
    if (event.key === "Enter" && isOpen && activeIndex >= 0) {
      event.preventDefault();
      chooseActive();
    }
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleaned = query.trim().slice(0, 80);
    if (!cleaned) {
      setShowEmptyPrompt(true);
      setIsOpen(true);
      root.current?.querySelector<HTMLInputElement>("input[name='q']")?.focus();
      return;
    }
    if (isOpen && activeIndex >= 0 && chooseActive()) {
      setIsOpen(false);
      return;
    }
    router.push(withQuery(pathFor(locale, actionKey), { q: cleaned }));
    setIsOpen(false);
  };

  const inputClass = cn(
    "w-full transition-all placeholder:text-ink-400 focus:outline-none",
    isHeader
      ? "h-12 rounded-full border border-white/10 bg-[#4b0c68] pl-12 pr-12 text-sm text-white placeholder:text-white/65 focus:border-white/45 focus:bg-[#390852] focus-visible:ring-2 focus-visible:ring-brand-300"
      : isHero
        ? "h-[58px] rounded-full border border-ink-200 bg-white pl-12 pr-14 text-base text-ink-900 shadow-card focus:border-brand-400 focus:shadow-pop focus-visible:ring-2 focus-visible:ring-brand-200"
        : "h-12 rounded-full border border-ink-200 bg-white pl-11 pr-12 text-sm text-ink-900 focus:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-200",
  );

  return (
    <form
      ref={root}
      action={pathFor(locale, actionKey)}
      method="get"
      role="search"
      onSubmit={onSubmit}
      className={cn("relative", className)}
    >
      <label htmlFor={id} className="sr-only">{dict.header.searchAria}</label>
      <span className={cn("pointer-events-none absolute inset-y-0 left-4 z-[1] flex items-center", isHeader ? "text-white/75" : "text-ink-500")}>
        <SearchIcon size={isHero ? 20 : 18} />
      </span>
      <input
        id={id}
        type="search"
        name="q"
        maxLength={80}
        value={query}
        onChange={(event) => {
          const value = event.target.value;
          setQuery(value);
          setShowEmptyPrompt(false);
          setIsOpen(true);
          if (value.trim().length < 2) {
            setItems([]);
            setIsLoading(false);
            setHasSearched(false);
            setActiveIndex(-1);
          }
        }}
        onFocus={() => { if (query.trim().length >= 2) setIsOpen(true); }}
        onKeyDown={onKeyDown}
        placeholder={placeholder ?? dict.common.searchPlaceholder}
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={isOpen && query.trim().length >= 2}
        aria-controls={suggestionId}
        aria-activedescendant={activeIndex >= 0 ? `${suggestionId}-${activeIndex}` : undefined}
        className={inputClass}
      />
      <button type="submit" aria-label={dict.header.searchAria} className={cn("absolute inset-y-1 right-1 z-[1] inline-flex items-center justify-center rounded-full text-white transition", isHeader ? "size-10 bg-white/15 hover:bg-white/25" : "size-10 bg-brand-700 hover:bg-brand-800")}>
        <SearchIcon size={17} />
      </button>

      {isOpen && (query.trim().length >= 2 || showEmptyPrompt) ? (
        <div className="absolute inset-x-0 top-[calc(100%+0.55rem)] z-[70] overflow-hidden rounded-2xl border border-ink-200 bg-white text-ink-900 shadow-[0_16px_50px_rgba(27,23,34,.2)]">
          <p className="border-b border-ink-100 px-4 py-2.5 text-[0.68rem] font-extrabold uppercase tracking-[.13em] text-ink-500">
            {isLoading ? (locale === "nl" ? "Zoeken…" : "Searching…") : (locale === "nl" ? "Beste overeenkomsten" : "Best matches")}
          </p>
          {showEmptyPrompt && !query.trim() ? (
            <p id={suggestionId} role="status" className="px-4 py-5 text-sm text-ink-600">
              {locale === "nl" ? "Vul een zoekterm in." : "Enter a search term."}
            </p>
          ) : items.length > 0 ? (
            <ul id={suggestionId} role="listbox" className="max-h-[min(65vh,420px)] overflow-y-auto p-2">
              {items.map((item, index) => (
                <li key={`${item.kind}-${item.id}`}>
                  <Link
                    id={`${suggestionId}-${index}`}
                    href={item.href}
                    role="option"
                    aria-selected={activeIndex === index}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => setIsOpen(false)}
                    className={cn("flex items-center gap-3 rounded-xl px-3 py-3 transition", activeIndex === index ? "bg-brand-50" : "hover:bg-ink-50")}
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink-100 text-brand-700">
                      {item.kind === "store" ? <StoreIcon size={18} /> : <TagIcon size={18} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-extrabold text-ink-900">{item.title}</span>
                      <span className="mt-0.5 block truncate text-xs text-ink-500">
                        {item.kind === "store" ? (locale === "nl" ? "Winkel" : "Store") : `${item.storeName ?? ""} · ${item.kind === "coupon" ? (locale === "nl" ? "Kortingscode" : "Coupon") : (locale === "nl" ? "Deal" : "Deal")}`}
                      </span>
                    </span>
                    {item.discountLabel ? <span className="hidden max-w-[35%] rounded-full bg-save-50 px-3 py-1 text-xs font-black text-save-700 sm:block">{item.discountLabel}</span> : null}
                  </Link>
                </li>
              ))}
            </ul>
          ) : hasSearched && !isLoading ? (
            <p id={suggestionId} role="status" className="px-4 py-5 text-sm text-ink-600">{locale === "nl" ? `Geen winkels of aanbiedingen gevonden voor “${query.trim()}”.` : `No stores or offers found for “${query.trim()}”.`}</p>
          ) : (
            <p id={suggestionId} role="status" className="px-4 py-5 text-sm text-ink-500">{locale === "nl" ? "Typ om te zoeken…" : "Keep typing to search…"}</p>
          )}
        </div>
      ) : null}
    </form>
  );
}
