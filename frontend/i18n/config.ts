import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/types";

export { DEFAULT_LOCALE, LOCALES };
export type { Locale };

export const localeNames: Record<Locale, string> = {
  nl: "Nederlands",
  en: "English",
};

export const localeShort: Record<Locale, string> = {
  nl: "NL",
  en: "EN",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function otherLocale(locale: Locale): Locale {
  return locale === "nl" ? "en" : "nl";
}
