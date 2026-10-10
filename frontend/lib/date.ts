import type { Locale } from "@/types";

const DATE_LOCALES: Record<Locale, string> = { nl: "nl-NL", en: "en-GB" };

export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(DATE_LOCALES[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatDateShort(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(DATE_LOCALES[locale], {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

/** `interpolate(t, { n: 3 })` turns `"{n} dagen"` into `"3 dagen"`. */
export function interpolate(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}
