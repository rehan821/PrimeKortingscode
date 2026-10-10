import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { isLocale, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { pathFor } from "@/lib/routes";
import { Logo } from "@/components/layout/Logo";
import { buttonClass } from "@/components/ui/button";
import { SearchIcon } from "@/components/ui/icons";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "404",
  robots: { index: false, follow: false },
};

// The 404 view is inherently request-dependent (reads the `x-locale` header),
// so it may block rather than being limited to prerendered content.
export const instant = false;

/**
 * Global 404 — used for every URL that matches no route at all, at the
 * routing level (no layout involved). This one IS server-rendered with real
 * HTML; the `[locale]` not-found only covers `notFound()` thrown inside a
 * matched route, where Next assembles the UI on the client (issue #62228).
 */
export default async function GlobalNotFound() {
  const requestHeaders = await headers();
  const raw = requestHeaders.get("x-locale") ?? "";
  const locale: Locale = isLocale(raw) ? raw : "nl";
  const dict = await getDictionary(locale);

  return (
    <html lang={locale} className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-ink-900">
        <header className="border-b border-ink-100">
          <div className="shell flex h-16 items-center">
            <Logo locale={locale} />
          </div>
        </header>
        <main className="shell flex flex-1 flex-col items-center justify-center py-16 text-center">
          <p className="font-mono text-6xl font-extrabold text-brand-600">404</p>
          <h1 className="mt-4 text-2xl font-bold text-ink-900">{dict.notFound.title}</h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-600">
            {dict.notFound.description}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href={pathFor(locale, "home")} className={buttonClass("primary", "md")}>
              {dict.buttons.backHome}
            </Link>
            <Link href={pathFor(locale, "stores")} className={buttonClass("outline", "md")}>
              <SearchIcon size={16} />
              {dict.buttons.browseStores}
            </Link>
          </div>
          <p className="mt-10 text-xs text-ink-400">{dict.common.demoNotice}</p>
        </main>
      </body>
    </html>
  );
}
