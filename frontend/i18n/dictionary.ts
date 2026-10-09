import type { Locale } from "@/types";
import nlJson from "./nl.json";
import enJson from "./en.json";

/**
 * Translation architecture
 * ------------------------
 * - `nl.json` is the source of truth: its shape defines the `Dictionary` type,
 *   so a missing/misspelled key in ANY locale is a TypeScript error.
 * - Components never contain user-facing text; they receive/read dictionary keys.
 * - Adding German/French later = add `de.json` + a locale in `i18n/config.ts`.
 */

type DeepPartialStrings<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends readonly (infer U)[]
      ? DeepPartialStrings<U>[]
      : T[K] extends object
        ? DeepPartialStrings<T[K]>
        : T[K];
};

export type Dictionary = DeepPartialStrings<typeof nlJson>;

const dictionaries: Record<Locale, Dictionary> = {
  nl: nlJson,
  en: enJson,
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale] ?? dictionaries.nl;
}

export { interpolate } from "@/lib/date";
