"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import nlJson from "@/i18n/nl.json";
import enJson from "@/i18n/en.json";
import { isLocale, type Locale } from "@/i18n/config";
import { pathFor } from "@/lib/routes";
import { buttonClass } from "@/components/ui/button";
import { SearchIcon } from "@/components/ui/icons";

/**
 * 404 boundary for `notFound()` thrown inside the locale tree (locale guards,
 * unknown slugs). Next assembles this boundary on the client, so it is a
 * client component by design: the locale is read from the route params, the
 * dictionaries are bundled statically, and the route stays fully static.
 */
export default function NotFound() {
  const params = useParams<{ locale?: string }>();
  const raw = params?.locale ?? "";
  const locale: Locale = isLocale(raw) ? raw : "nl";
  const dict = locale === "en" ? enJson : nlJson;

  return (
    <div className="shell flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <p className="font-mono text-6xl font-extrabold text-brand-600">404</p>
      <h1 className="mt-4 text-2xl font-bold text-ink-900">{dict.notFound.title}</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-600">
        {dict.notFound.description}
      </p>
      <p className="mt-6 text-xs font-bold uppercase tracking-wide text-ink-400">
        {dict.notFound.hint}
      </p>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
        <Link href={pathFor(locale, "home")} className={buttonClass("primary", "md")}>
          {dict.buttons.backHome}
        </Link>
        <Link href={pathFor(locale, "stores")} className={buttonClass("outline", "md")}>
          <SearchIcon size={16} />
          {dict.buttons.browseStores}
        </Link>
      </div>
      <p className="mt-8 text-xs text-ink-400">{dict.common.demoNotice}</p>
    </div>
  );
}
