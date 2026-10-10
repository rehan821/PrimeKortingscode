import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import type { Locale } from "@/types";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionary";
import { siteConfig, siteUrl } from "@/config/site";
import { pathFor } from "@/lib/routes";
import { JsonLd } from "@/components/seo/JsonLd";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "@/app/globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

interface LayoutParams {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

/**
 * Root layout. Because it lives at `app/[locale]`, `<html lang>` is set
 * server-side per locale (nl at `/`, en at `/en`) — no client-side language
 * switching or hydration hacks.
 */
export async function generateMetadata({ params }: LayoutParams): Promise<Metadata> {
  const { locale } = await params;
  return {
    metadataBase: new URL(siteConfig.url),
    applicationName: siteConfig.name,
    ...(isLocale(locale) ? { alternates: { canonical: siteUrl(pathFor(locale as Locale, "home")) } } : {}),
  };
}

export default async function RootLayout({ children, params }: LayoutParams) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale);

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl("/")}#organization`,
        name: siteConfig.name,
        url: siteUrl("/"),
        description: dict.meta.defaultDescription,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl("/")}#website`,
        name: siteConfig.name,
        url: siteUrl("/"),
        inLanguage: locale,
        publisher: { "@id": `${siteUrl("/")}#organization` },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl(pathFor(locale, "stores"))}?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <html lang={locale} className={`${inter.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <JsonLd data={organizationJsonLd} />
        <a href="#main" className="skip-link">
          {dict.common.skipToContent}
        </a>
        <Header locale={locale} dict={dict} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer locale={locale} dict={dict} />
      </body>
    </html>
  );
}
